import AbstractGenerator from './AbstractGenerator';

export default class SQLiteGenerator extends AbstractGenerator {

  constructor(options) {
    super(options);
    this.name = 'sqlite';
    this.results = {};
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
    if (!(this.options.create || this.options.drop || this.options.insert))
      throw 'SQLiteGenerator: you must specify an operation as CLI argument, one of --create / --drop / --insert';

    if (this.options.create)
      this.generateCreate();
    if (this.options.drop)
      this.generateDrop();
    else if (this.options.insert)
      throw 'Operation "insert" not yet supported'
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
      else {
        str += ' NOT NULL';

        if (ref.defaultValue !== undefined)
          str += ' DEFAULT ' + SQLiteGenerator.toSQLiteValue(ref.defaultValue);
      }

      if (i < (e.references.length - 1))
        str += ',\n';
    });
    this.indentation--;

    return str;
  }

  generateCreate() {
    this.sortEntities();
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      str += 'CREATE TABLE ' + e.plural + ' (\n';
      str += self.generateAttributes(e);

      if (e.references.length > 0) {
        str += ',\n';
        str += '\n';
        str += self.generateForeignKeys(e);
      }

      str += '\n';
      str += ');\n';

      self.results['create-table-' + e.plural.toLowerCase()] = str;
    });
  }

  generateDrop() {
    this.sortEntities();
    this.entities.reverse();
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      str += 'DROP TABLE IF EXISTS ' + e.plural + ';\n';

      self.results['drop-table-' + e.plural.toLowerCase()] = str;
    });
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

  getContent(fileName) {
    var content = '';
    var keys = Object.keys(this.results);
    // Always return the same result as all SQL generated code will be placed in the same output file
    // whatever the number of entities processed (only the output file name will change, see getOutputFilesNames()).
    if (fileName in this.results)
      return this.results[fileName];
    else {
      if (fileName === 'create-database') {
        for (let key of keys) {
          if (key.startsWith('create')) {
            content += this.results[key] + '\n';
          }
        }
      }
      else if (fileName === 'drop-database') {
        for (let key of keys) {
          if (key.startsWith('drop')) {
            content += this.results[key] + '\n';
          }
        }
      }

      return content;
    }
  }

  getOutputFilesExtension() {
    return 'sql';
  }

  getOutputFilesNames() {
    var names = [];
    var operation;
    var context;

    for (var opt in this.options) {
      if (this.entities.length === 1)
        names.push(opt + '-table-' + this.entities[0].plural.toLowerCase());
      else {
        names.push(opt + '-database');
      }
    }

    return names;
  }
}
