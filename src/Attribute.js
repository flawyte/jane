import Cast from './Cast';
import Valid from './Valid';

export default class Attribute {

  static fromXMLObject(obj) {
    var defaultValue = undefined;

    if (obj.$['default'] !== undefined) {
      defaultValue = Cast.value(obj.$['default'], obj.$.type);
    }

    var attr = new Attribute(obj.$.name,
      obj.$.type,
      (obj.$['primary-key'] === 'true'),
      (obj.$['unique'] === 'true'),
      (obj.$['nullable'] === 'true'),
      defaultValue
    );

    attr.defaultValueIsFunction = ((obj.$['default'] !== undefined) && obj.$['default'].match(/^.*\(\)$/) !== null);
    attr.defaultValueIsRaw = ((obj.$['default'] !== undefined) && obj.$['default'].startsWith('raw:'));
    if (obj.$['max-length'] !== undefined)
      attr.maxLength = Cast.integer(obj.$['max-length']);
    if (obj.$['min-length'] !== undefined)
      attr.minLength = Cast.integer(obj.$['min-length']);
    attr.regex = obj.$.regex;

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
    this.entity = null;
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
      case 'Time':
        valid = valid && Valid.time(val);
        break;
    }

    valid = valid && checkMinLength(val);
    valid = valid && checkMaxLength(val);
    valid = valid && checkRegex(val);

    return valid;
  }
}
