import Entity from './Entity';

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
      Boolean(obj.$.nullable === 'true'));

    return attr;
  }

  constructor(source, entity, attribute, alias, nullable = false) {
    this.alias = alias;
    this.attribute = attribute;
    this.entity = entity;
    this.nullable = nullable;
    this.source = source;

    Reference.add(this);
  }
}
