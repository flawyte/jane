import Attribute from './Attribute';

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

    for (var attrs of obj.attributes) {
      for (var attr of attrs.attribute) {
        ent.addAttribute(Attribute.fromXMLObject(attr))
      }
    }

    return ent;
  }

  constructor(name, plural = null) {
    this.attributes = [];
    this.name = name;
    this.plural = plural;
  }

  addAttribute(attr) {
    this.attributes.push(attr);
  }
}
