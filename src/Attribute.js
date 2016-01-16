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
    attr.maxLength = Toolkit.cast(obj.$.maxLength, attr.type);

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
}
