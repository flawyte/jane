import Entity from './Entity';
import Toolkit from './Toolkit';

export default class Reference {

  static add(ref) {
    if (!Reference.instances)
      Reference.instances = [];

    Reference.instances.push(ref);
  }

  static fromXMLObject(obj) {
    var attr = new Reference(null,
      Entity.default.get(obj.$.entity),
      obj.$.attribute,
      obj.$.as,
      Toolkit.cast(obj.$.default),
      Boolean(obj.$.nullable === 'true'));

    return attr;
  }

  constructor(source, entity, attribute, alias, defaultValue, nullable = false) {
    this.alias = alias;
    this.attribute = attribute;
    this.defaultValue = ((defaultValue === undefined) && (nullable === true)) ? null : defaultValue;
    this.entity = entity;
    this.nullable = nullable || (defaultValue === null);
    this.source = source;

    Reference.add(this);
  }
}
