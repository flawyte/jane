/*
 * Attributes ✓✗
 * ==========
 *
 * ✓ name         : Attribute's name (e.g. Game Object, Home Screen)
 * ✗ [optional]   :
 * ✗ [primaryKey] :
 * ✓ type         : Attribute's type (one of Boolean, Date, Double, Integer, String)
 */
export default class Attribute {

  constructor(name, type, primaryKey = false, optional = true) {
    this.name = name;
    this.optional = optional;
    this.primaryKey = primaryKey;
    this.type = type;
  }
}
