import AbstractGenerator from './AbstractGenerator';

export default class SQLiteGenerator extends AbstractGenerator {

  static toSQLiteType(type) {
    var res = null;

    switch (type) {
      case 'String': {
        res = 'VARCHAR'
      }
      break;
      default: {
        res = type; // sql type == js type
      }
      break;
    }

    return res;
  }

  static toSQLiteValue(value) {
    var res = null;

    switch (value) {
      case true:
      case false:
        res = Number(value);
      break;
      default: {
        res = value; // sql value == js value
      }
      break;
    }

    return res;
  }

  generate() {
    var e = this.entity;
    var str = '';

    str += 'CREATE TABLE ' + e.plural.toLowerCase() + ' (\n';
    str += this.generateAttributes();

    if (this.entity.references.length > 0) {
      str += ',\n';
      str += '\n';
      str += this.generateForeignKeys();
    }

    str += '\n';
    str += ');\n';

    return str;
  }

  generateAttributes() {
    var e = this.entity;
    var self = this;
    var str = '';

    this.indentation++;
    e.attributes.forEach(function(attr, i) {
      str += self.indent() + attr.name + ' ' + SQLiteGenerator.toSQLiteType(attr.type).toUpperCase();

      if (attr.primaryKey)
        str += ' PRIMARY KEY AUTOINCREMENT'
      else if (attr.required)
        str += ' NOT NULL';
      else {
        str += ' DEFAULT ';

        if (attr.type !== 'String')
          str += SQLiteGenerator.toSQLiteValue(attr.defaultValue);
        else
          str += '"' + attr.defaultValue + '"';
      }

      if (i != (e.attributes.length - 1))
        str += ',\n';
    });

    if ((e.attributes.length > 0) && (e.references.length > 0))
      str += ',\n';

    e.references.forEach(function(ref, i) {
      str += self.indent() + ref.alias + ' INTEGER';

      if (ref.nullable)
        str += ' DEFAULT NULL';
      else
        str += ' NOT NULL';

      if (i < (e.references.length - 1))
        str += ',\n';
    });
    this.indentation--;

    return str;
  }

  generateForeignKeys() {
    var e = this.entity;
    var self = this;
    var str = '';

    this.indentation++;
    e.references.forEach(function(ref, i) {
      str += self.indent() + 'FOREIGN KEY (' + ref.alias + ') REFERENCES ' + ref.entity.plural + ' (' + ref.attribute + ')';

      if (i < (e.references.length - 1)) {
        str += ',\n';
      }
    });
    this.indentation--;

    return str;
  }

  getOutputFileName() {
    return 'create-table-' + this.entity.plural + '.sql';
  }
}
