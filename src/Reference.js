import Toolkit from './Toolkit';

export default class Reference {

  static fromXMLObject(obj) {
    var attr = new Reference(null, obj.$.entity, obj.$.attribute, obj.$.as);

    return attr;
  }

  constructor(source, entity, attribute, alias) {
    this.alias = alias;
    this.attribute = attribute;
    this.entity = entity;
    this.source = source;
  }
}
