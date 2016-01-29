import Cast from './Cast';
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
      Cast.value(obj.$.default, 'Integer') || undefined,
      (obj.$.nullable === 'true'));

    if (obj.$['doc'] !== undefined)
      attr.doc = obj.$['doc'];

    return attr;
  }

  constructor(source, entity, attribute, alias, defaultValue, nullable = false) {
    this.alias = alias;
    this.attribute = attribute;
    this.defaultValue = ((defaultValue === undefined) && (nullable === true)) ? null : defaultValue;
    this.doc = null;
    this.entity = entity;
    this.nullable = nullable || (defaultValue === null);
    this.source = source;

    Reference.add(this);
  }
}
