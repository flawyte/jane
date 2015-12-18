/*
 * Attributes ✓✗
 * ==========
 *
 * ✓ name         : Attribute's name (e.g. Game Object, Home Screen)
 * ✗ [optional]   :
 * ✗ [primaryKey] :
 * ✗ [required]   :
 * ✓ type         : Attribute's type (one of Boolean, Date, Double, Integer, String)
 */
export default class Attribute {

  static fromXMLObject(obj) {
    var attr = new Attribute(obj.$.name,
      obj.$.type,
      JSON.parse(obj.$['primary-key'] || 'false'),
      JSON.parse(obj.$.optional
        || (obj.$.required === 'false' ? 'true' : 'false') // <== !required
        || 'true'
        )
    );

    return attr;
  }

  constructor(name, type, primaryKey = false, optional = true) {
    this.name = name;
    this.optional = optional;
    this.primaryKey = primaryKey;
    this.required = !optional;
    this.type = type;
  }
}
