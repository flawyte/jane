import Toolkit from './Toolkit';
import Valid from './Valid';

export default class Attribute {

  static fromXMLObject(obj) {
    var defaultValue;
    var primaryKey = Toolkit.cast(obj.$['primary-key']) || false;

    if (obj.$['default'] !== undefined) {
      if (obj.$['default'].startsWith('raw:')) {
        defaultValue = obj.$['default'].split(':')[1];
      }
      else if (obj.$['default'].match(/.*\(\)/)) {
        defaultValue = obj.$['default'];
      }
      else {
        if (obj.$['default'].length > 0)
          defaultValue = Toolkit.cast(obj.$['default']);
        else
          defaultValue = '';
      }
    }

    var attr = new Attribute(obj.$.name,
      obj.$.type,
      primaryKey,
      (obj.$.unique === 'true'),
      (obj.$.nullable === 'true'),
      defaultValue
    );

    attr.defaultValueIsFunction = ((obj.$['default'] !== undefined) && obj.$['default'].match(/^.*\(\)$/) !== null);
    attr.defaultValueIsRaw = ((obj.$['default'] !== undefined) && obj.$['default'].startsWith('raw:'));
    attr.regex = obj.$.regex;
    attr.maxLength = Toolkit.cast(obj.$['max-length'], 'Integer');
    attr.minLength = Toolkit.cast(obj.$['min-length'], 'Integer');

    var matches;
    if ((matches = attr.type.match(/Decimal\(([0-9]+),([0-9]+)\)/))) {
      attr.precision = Number(matches[1]);
      attr.scale = Number(matches[2]);
      attr.type = 'Decimal';
    }

    return attr;
  }

  constructor(name, type, primaryKey = false, unique = false, nullable = false, defaultValue = undefined) {
    this.defaultValue = defaultValue;
    this.name = name;
    this.nullable = primaryKey ? false : ((defaultValue !== undefined) || nullable);
    this.primaryKey = primaryKey;
    this.type = type;
    this.unique = primaryKey || unique;

    if (this.optional && (this.defaultValue === undefined))
      this.defaultValue = null;
  }

  get optional() {
    return this.nullable;
  }

  get required() {
    return !this.nullable;
  }

  isValueValid(val) {
    if (val === undefined)
      return false;
    if (val === null)
      return this.nullable;

    var self = this;
    var valid = true;

    var checkMaxLength = function(val) {
      return (self.maxLength === undefined) || (new String(val).length <= self.maxLength);
    };
    var checkMinLength = function(val) {
      return (self.minLength === undefined) || (new String(val).length >= self.minLength);
    };
    var checkRegex = function(val) {
      return (self.regex === undefined) || (new String(val).match(self.regex) !== null);
    };

    switch (this.type) {
      case 'Boolean':
        valid = valid && Valid.boolean(val);
        break;
      case 'Date':
        valid = valid && Valid.date(val);
        break;
      case 'DateTime':
        valid = valid && Valid.datetime(val);
        break;
      case 'Decimal':
        valid = valid && Valid.decimal(val, this.precision, this.scale);
        break;
      case 'Integer':
        valid = valid && Valid.integer(val);
        break;
      case 'String':
        valid = valid && Valid.string(val);
        break;
    }

    valid = valid && checkMinLength(val);
    valid = valid && checkMaxLength(val);
    valid = valid && checkRegex(val);

    return valid;
  }
}
