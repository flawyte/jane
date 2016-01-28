import Attribute from './Attribute';
import Jane from './Jane';
import Reference from './Reference';
import Toolkit from './Toolkit';

export default class Entity {

  static add(entity) {
    if (!entity)
      throw 'Given entity can not be null or undefined';

    if (!Entity.instances)
      Entity.instances = [];

    Entity.instances.push(entity);
  }

  static fromXMLFile(file) {
    return Entity.fromXMLObject(Toolkit.readXMLFile(file).entity);
  }

  static fromXMLObject(obj) {
    var ent = new Entity(obj.$.name, obj.$.plural);

    if (obj.attributes instanceof Array) {
      for (var attrs of obj.attributes) {
        for (var attr of attrs.attribute) {
          ent.addAttribute(Attribute.fromXMLObject(attr));
        }
      }
    }
    if (obj.doc instanceof Array && obj.doc.length > 0) {
      ent.doc = obj.doc[0];
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

  static get(name) {
    var entity = Entity.instances.find(function(item) {
      return (item.name === name);
    });

    if (!entity && Toolkit.ready) {
      // Entity.fromXMLFile() instanciates a new Entity object
      // which automatically adds it to the 'instances' field
      // so no need to do it again here
      entity = Entity.fromXMLFile(Jane.default.baseDir + name + '.xml');
    }

    return entity;
  }

  static getByPlural(val) {
    return Entity.instances.find(function(item) {
      return (item.plural === val);
    });
  }

  constructor(name, plural, version = null) {
    this.attributes = [];
    this.doc = null;
    this.name = name;
    this.plural = plural;
    this.references = [];
    this.version = version;

    Entity.add(this);
  }

  addAttribute(attr) {
    if (!attr)
      throw 'Given attr can not be null or undefined';

    attr.entity = this;
    this.attributes.push(attr);
  }

  addReference(ref) {
    if (!ref)
      throw 'Given ref can not be null or undefined';

    ref.source = this;
    this.references.push(ref);
  }

  getAttributeByName(name) {
    if (!name)
      throw 'Given name can not be null or undefined';

    return this.attributes.find(function(attr) {
      return (attr.name === name);
    });
  }

  getReferenceByAlias(alias) {
    if (!alias)
      throw 'Given alias can not be null or undefined';

    return this.references.find(function(ref) {
      return (ref.alias === alias);
    });
  }
}
