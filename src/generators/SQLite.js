import AbstractGenerator from './AbstractGenerator';

export default class SQLiteGenerator extends AbstractGenerator {

  static toSQLiteType(type) {
    var res = null;

    switch (type) {
      // case '': {}
      // break;
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

  generate() {
    var e = this.entity;
    var str = '';

    str += 'CREATE TABLE ' + e.plural.toLowerCase() + ' (\n';
    str += this.generateAttributes();
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
          str += attr.defaultValue;
        else
          str += '"' + attr.defaultValue + '"';
      }

      if (i != (e.attributes.length - 1))
        str += ',';

      str += '\n';
    });
    this.indentation--;

    return str;
  }
}
