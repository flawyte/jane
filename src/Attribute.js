import Toolkit from './Toolkit';

export default class Attribute {

  static fromXMLObject(obj) {
    var defaultValue;
    var nullable;
    var primaryKey = Toolkit.cast(obj.$['primary-key']) || false;

    if (obj.$['default'] !== undefined) {
      if (obj.$['default'].startsWith('raw:')) {
        defaultValue = obj.$['default'].split(':')[1];
      }
      else {
        if (obj.$['default'].length > 0)
          defaultValue = Toolkit.cast(obj.$['default']);
        else
          defaultValue = '';
      }
    }

    if (obj.$.nullable !== undefined) {
      nullable = Toolkit.cast(obj.$.nullable);
    }

    var attr = new Attribute(obj.$.name,
      obj.$.type,
      primaryKey,
      Boolean(obj.$.unique === 'true'),
      nullable,
      defaultValue
    );

    attr.defaultValueIsRaw = (obj.$['default'] && obj.$['default'].startsWith('raw:'));
    attr.regex = obj.$.regex;
    attr.maxLength = Toolkit.cast(obj.$['max-length'], attr.type);

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

    var checkDecimal = function(val) {
      return ((new String(val).length - 1) <= self.precision);
    };
    var checkInteger = function(val) {
      return (new String(val).indexOf('.') === -1);
    };
    var checkMaxLength = function(val) {
      return (self.maxLength === undefined) || (new String(val).length <= self.maxLength);
    };
    var checkRegex = function(val) {
      return (self.regex === undefined) || (new String(val).match(self.regex));
    };

    switch (this.type) {
      case 'Boolean':
        valid = valid && (Toolkit.typeOf(val) === 'Boolean');
        break;
      case 'Date':
        valid = valid && (Toolkit.typeOf(val) === 'Date');
        break;
      case 'DateTime':
        valid = valid && (Toolkit.typeOf(val) === 'Date');
        break;
      case 'Decimal':
        valid = valid && (Toolkit.typeOf(val) === 'Number');
        valid = valid && checkDecimal(val);
        break;
      case 'Integer':
        valid = valid && (Toolkit.typeOf(val) === 'Number');
        valid = valid && checkInteger(val);
        break;
      case 'String':
        valid = valid && (Toolkit.typeOf(val) === 'String');
        break;
    }

    valid = valid && checkMaxLength(val);
    valid = valid && checkRegex(val);

    return valid;
  }
}
