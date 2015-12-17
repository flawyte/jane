import Attribute from './Attribute';

/*
 * Attributes ✓✗
 * ==========
 *
 * ✓ attributes   : Entity's attributes list (e.g. id, name, age, gender, size)
 * ✓ name         : Entity's name (e.g. Game Object, Home Screen)
 * ✓ [plural]     : Entity's name's plural if appropriated (e.g. Game Objects, Screens)
 */
export default class Entity {

  constructor(name, plural = null) {
    this.attributes = [];
    this.name = name;
    this.plural = plural;
  }

  addAttribute(attr) {
    this.attributes.push(attr);
  }
}
