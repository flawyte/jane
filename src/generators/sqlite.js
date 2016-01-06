import AbstractGenerator from './AbstractGenerator';
import InsertIntoStatement from './sqlite/InsertIntoStatement';
import Random from './../Random';

export default class SQLiteGenerator extends AbstractGenerator {

  constructor(options) {
    super(options);
    this.name = 'sqlite';
    this.results = {
      'create': {},
      'drop': {},
      'insert-into': {}
    };
  }

  static toSQLiteType(type) {
    var res = null;

    switch (type) {
      case 'String': {
        res = 'VARCHAR';
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

  addEntity(entity) {
    super.addEntity(entity);

    if (this.options['insert-into'])
      this.results['insert-into'][entity.plural.toLowerCase()] = [];
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

      self.results['create'][e.plural.toLowerCase()] = str;
    });
  }

  generateDrop() {
    this.sortEntities();
    this.entities.reverse();
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      str += 'DROP TABLE IF EXISTS ' + e.plural + ';';

      self.results['drop'][e.plural.toLowerCase()] = str;
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
      for (var i = 0; i < n; i++) {
        var values = {};

        e.attributes.forEach(function(attr) {
          if (attr.primaryKey)
            values[attr.name] = null;
          else
            values[attr.name] = SQLiteGenerator.toSQLiteValue(Random.value(attr));
        });
        e.references.forEach(function(ref) {
          values[ref.alias] = Random.integer(1, n);
        });

        self.results['insert-into'][e.plural.toLowerCase()].push(new InsertIntoStatement(e.plural, values));
      }
    });
  }

  getContent(fileName) {
    var content = '';

    if (fileName.indexOf('-database') !== -1) {
      var ope = fileName.substring(0, fileName.lastIndexOf('-database'));

      if (ope === 'insert-into') {
        for (let key of Object.keys(this.results[ope])) {
          content += this.results[ope][key].join('\n') + '\n\n';
        }
      }
      else {
        for (let key of Object.keys(this.results[ope])) {
          content += this.results[ope][key] + '\n\n';
        }
      }
    }
    else {
      var ope = fileName.substring(0, fileName.lastIndexOf('-table'));
      var ent = fileName.substring(fileName.lastIndexOf('-') + 1);

      content = this.results[ope][ent] + '\n';
    }

    return content;
  }

  getOutputFilesExtension() {
    return 'sql';
  }

  getOutputFilesNames() {
    var allowedOptions = [ 'create', 'drop', 'insert-into' ];
    var names = [];
    var operation;
    var context;

    for (var opt in this.options) {
      if (allowedOptions.indexOf(opt) === -1) {
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
