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
    if (!(this.options.create || this.options.drop || this.options['insert-into']))
      throw 'SQLiteGenerator: you must specify an operation as CLI argument, one of --create / --drop / --insert-into';

    if (this.options.create)
      this.generateCreate();
    if (this.options.drop)
      this.generateDrop();
    if (this.options['insert-into'])
      this.generateInserts();
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

      if (!attr.primaryKey && attr.unique)
        str += ' UNIQUE';

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
      str += ');';

      self.results['create-table-' + e.plural.toLowerCase()] = str;
    });
  }

  generateDrop() {
    this.sortEntities();
    this.entities.reverse();
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      str += 'DROP TABLE IF EXISTS ' + e.plural + ';';

      self.results['drop-table-' + e.plural.toLowerCase()] = str;
    });
  }

  generateForeignKeys(entity) {
    var e = entity;
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

  generateInserts() {
    this.sortEntities();
    var n = 10; // Generate `n` INSERT INTO statements for each table
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      for (var i = 0; i < n; i++) {
        if (i > 0)
          str += '\n';

        str += self.generateInsert(e);
      }

      self.results['insert-into-' + e.plural.toLowerCase()] = str;
    });
  }

  generateInsert(entity) {
    var e = entity;
    var self = this;
    var str = '';

    str += 'INSERT INTO ' + e.plural + ' VALUES (\n';
    self.indentation++;

    e.attributes.forEach(function(attr, i) {
      if (attr.primaryKey)
        str += self.indent() + 'null';
      else {
        str += self.indent() + self.generateRandomValue(attr);
      }

      if ((i < (e.attributes.length - 1)) || (e.references.length > 0))
        str += ',';
      str += ' /* ' + attr.name + ' */';
      if (i <= (e.attributes.length - 1))
        str += '\n';
    });
    e.references.forEach(function(ref, i) {
      str += self.indent() + (Math.floor(Math.random() * (10 - 1 + 1)) + 1); // Integer >= 1 && <= 10

      if (i < (e.references.length - 1))
        str += ',';
      str += ' /* ' + ref.alias + ' */';
      if (i <= (e.references.length - 1))
        str += '\n';
    });

    self.indentation--;
    str += ');';

    return str;
  }

  generateRandomValue(attr) {
    var res = null;

    switch (attr.type) {
      case 'Boolean': {
        res = Math.random() >= 0.5;
      }
      break;
      case 'String': {
        res = (Math.random() + 1).toString(36).slice(2);
      }
      break;
    }

    return res;
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
            content += this.results[key] + '\n\n';
          }
        }
      }
      else if (fileName === 'drop-database') {
        for (let key of keys) {
          if (key.startsWith('drop')) {
            content += this.results[key] + '\n\n';
          }
        }
      }
      else if (fileName === 'insert-into-database') {
        for (let key of keys) {
          if (key.startsWith('insert-into')) {
            content += this.results[key] + '\n\n';
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
    var allowed = [ 'create', 'drop', 'insert-into' ];
    var names = [];
    var operation;
    var context;

    for (var opt in this.options) {
      if (allowed.indexOf(opt) === -1) {
        console.log('Unsupported argument "' + opt + '"');
        continue;
      }

      if (this.entities.length === 1)
        names.push(opt + '-table-' + this.entities[0].plural.toLowerCase());
      else {
        names.push(opt + '-database');
      }
    }

    return names;
  }
}
