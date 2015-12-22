import Attribute from './Attribute';
import Reference from './Reference';

/*
 * Entity ✓✗
 * ======
 *
 * ✓ attributes   : Entity's attributes list (e.g. id, name, age, gender, size)
 * ✓ name         : Entity's name (e.g. Game Object, Home Screen)
 * ✓ [plural]     : Entity's name's plural if appropriated (e.g. Game Objects, Screens)
 */
export default class Entity {

  static fromXMLObject(obj) {
    var ent = new Entity(obj.$.name, obj.$.plural);

    if (obj.attributes instanceof Array) {
      for (var attrs of obj.attributes) {
        for (var attr of attrs.attribute) {
          ent.addAttribute(Attribute.fromXMLObject(attr));
        }
      }
    }
    if (obj.references instanceof Array) {
      for (var refs of obj.references) {
        for (var ref of refs.reference) {
          ent.addReference(Reference.fromXMLObject(ref));
        }
      }
    }

    return ent;
  }

  constructor(name, plural = null) {
    this.attributes = [];
    this.name = name;
    this.plural = plural;
    this.references = [];
  }

  addAttribute(attr) {
    this.attributes.push(attr);
  }

  addReference(ref) {
    ref.source = this;
    this.references.push(ref);
  }
}
