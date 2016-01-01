import AbstractGenerator from './AbstractGenerator';

export default class SQLiteGenerator extends AbstractGenerator {

  constructor(options) {
    super(options);
    this.name = 'sqlite';
    this.result = '';
  }

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
    this.sortEntities();
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      str += 'CREATE TABLE ' + e.plural.toLowerCase() + ' (\n';
      str += self.generateAttributes(e);

      if (e.references.length > 0) {
        str += ',\n';
        str += '\n';
        str += self.generateForeignKeys(e);
      }

      str += '\n';
      str += ');\n';

      if (i < (self.entities.length - 1))
        str += '\n';

      self.result += str;
    });
  }

  generateAttributes(e) {
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

  generateForeignKeys(e) {
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

  getContent(file) {
    // Always return the same result as all SQL generated code will be placed in the same output file
    // whatever the number of entities processed (only the output file name will change, see getOutputFilesNames()).
    return this.result;
  }

  getOutputFilesExtension() {
    return 'sql';
  }

  getOutputFilesNames() {
    if (this.entities.length === 0)
      return [];
    else if (this.entities.length === 1)
      return [ 'create-table-' + this.entities[0].plural.toLowerCase() ];
    else
      return [ 'create-database' ];
  }
}
