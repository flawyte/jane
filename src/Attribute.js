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

  static cast(val) {
    if (Attribute.type(val) === 'String')
      return JSON.parse(val);
    else
      return val;
  }

  static fromXMLObject(obj) {
    var defaultValue;
    if (obj.$['default'] !== undefined) {
      if (obj.$['default'].length > 0)
        defaultValue = Attribute.cast(obj.$['default']);
      else
        defaultValue = '';
    }
    var optional;
    if (obj.$.optional !== undefined) {
      optional = Attribute.cast(obj.$.optional);
    }
    else if (obj.$.required !== undefined) {
      optional = !Attribute.cast(obj.$.required);
    }
    var primaryKey = Attribute.cast(obj.$['primary-key']) || false;

    var attr = new Attribute(obj.$.name,
      obj.$.type,
      primaryKey,
      optional,
      defaultValue
    );

    return attr;
  }

  static type(val) {
    return Object.prototype.toString.call(val).match(/\[object (.*)\]/)[1];
  }

  constructor(name, type, primaryKey = false, optional = false, defaultValue = undefined) {
    this.defaultValue = defaultValue;
    this.name = name;
    this.optional = primaryKey ? false : ((defaultValue !== undefined) || optional);
    this.primaryKey = primaryKey;
    this.required = !optional;
    this.type = type;

    if (this.optional && this.defaultValue === undefined)
      throw new Error("[jane] Attribute '" + this.name + "' is optional but no default value given");
  }
}
