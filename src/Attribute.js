import Toolkit from './Toolkit';

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
    var defaultValue;
    if (obj.$['default'] !== undefined) {
      if (obj.$['default'].length > 0)
        defaultValue = Toolkit.cast(obj.$['default']);
      else
        defaultValue = '';
    }
    var optional;
    if (obj.$.optional !== undefined) {
      optional = Toolkit.cast(obj.$.optional);
    }
    else if (obj.$.required !== undefined) {
      optional = !Toolkit.cast(obj.$.required);
    }
    var primaryKey = Toolkit.cast(obj.$['primary-key']) || false;

    var attr = new Attribute(obj.$.name,
      obj.$.type,
      primaryKey,
      optional,
      defaultValue
    );

    return attr;
  }

  constructor(name, type, primaryKey = false, optional = false, defaultValue = undefined) {
    this.defaultValue = defaultValue;
    this.name = name;
    this.optional = primaryKey ? false : ((defaultValue !== undefined) || optional);
    this.primaryKey = primaryKey;
    this.required = !this.optional;
    this.type = type;

    if (this.optional && this.defaultValue === undefined)
      throw new Error("[jane] Attribute '" + this.name + "' is optional but no default value given");
  }
}
