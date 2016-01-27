import AbstractGenerator from './AbstractGenerator';
import InsertIntoStatement from './InsertIntoStatement';
import Jane from './../Jane';
import Random from './../Random';

/*
 * Abstract output class. Can be inherited by all classes whose goal is to generate SQL code from one or multiple Entity objects.
 */
export default class AbstractSQLGenerator extends AbstractGenerator {

  constructor(options = {}) {
    super(options);
    this.data = []; // Will contain default data to insert into the database if any
    this.filesContent = {}; // Will contain the final content for all output files (key = fileName, value = content)
    // Will contain pre-final generated strings (whose concatenation gives the final output)
    this.schemas = {
      'create': {},
      'drop': {}
    };
    this.inserts = {};
  }

  addEntity(entity) {
    super.addEntity(entity);

    if (this.options['insert-into']) {
      this.inserts[entity.plural.toLowerCase()] = [];
    }
  }

  buildOutputFilesContent() {
    var allowedOptions = ['create', 'drop', 'insert-into', 'data'];
    var fileName;
    var self = this;

    this.filesContent['execute.sh'] = this.getExecuteScriptContent();

    if (this.options.data) {
      if (this.entities.length === 1) {
        fileName = 'insert-into-table-' + this.entities[0].plural.toLowerCase() + '-default-data.sql';
      }
      else {
        this.sortData();

        fileName = 'insert-into-database-default-data.sql';
      }

      this.filesContent[fileName] = this.data.map(function(item) {
        return item.toSQLStatement(self);
      }).join('\n\n') + '\n';
    }
    else {
      if (this.options.create) {
        var content = '';

        if (this.entities.length === 1) {
          var key = this.entities[0].plural.toLowerCase();

          fileName = 'create-table-' + key + '.sql';
          content = this.schemas.create[key] + '\n';
        }
        else {
          var keys = Object.keys(this.schemas.create);
          var l = keys.length;

          fileName = 'create-database.sql';

          for (let i = 0; i < l; i++) {
            content += this.schemas.create[keys[i]];

            if (i < (l - 1))
              content += '\n\n';
            else
              content += '\n';
          }
        }

        this.filesContent[fileName] = content;
      }
      if (this.options.drop) {
        var content = '';

        if (this.entities.length === 1) {
          var key = this.entities[0].plural.toLowerCase();

          fileName = 'drop-table-' + key + '.sql';
          content = this.schemas.drop[key] + '\n';
        }
        else {
          var keys = Object.keys(this.schemas.drop);
          var l = keys.length;

          fileName = 'drop-database.sql';

          for (let i = 0; i < l; i++) {
            content += this.schemas.drop[keys[i]];

            if (i < (l - 1))
              content += '\n\n';
            else
              content += '\n';
          }
        }

        this.filesContent[fileName] = content;
      }
      if (this.options['insert-into']) {
        var content = '';

        if (this.entities.length === 1) {
          var key = this.entities[0].plural.toLowerCase();

          fileName = 'insert-into-table-' + key + '.sql';
          content = this.inserts[key].join('\n\n') + '\n';
        }
        else {
          var l = this.entities.length;

          fileName = 'insert-into-database.sql';

          for (let i = 0; i < this.entities.length; i++) {
            content += this.inserts[this.entities[i].plural.toLowerCase()].join('\n\n');

            if (i < (l - 1))
              content += '\n\n';
            else
              content += '\n';
          }
        }

        this.filesContent[fileName] = content;
      }
    }
  }

  /*
   * Must be overrided by sub-classes.
   */
  connectDatabase(name) {
    return null;
  }

  createColumn(attr) {
    if (attr.primaryKey)
      return this.createColumnPrimaryKey(attr.name);

    var str = this.escapeColumnName(attr.name) + ' ' + this.toSQLType(attr);

    if (!attr.nullable)
      str += ' NOT NULL';

    if (attr.defaultValue !== undefined)
      str += ' DEFAULT ' + this.toSQLValue(attr, true);
    else if (attr.nullable)
      str += ' DEFAULT NULL';

    if (attr.unique)
      str += ' UNIQUE';

    return str;
  }

  createColumnForeignKey(ref) {
    var str = '';

    str += this.escapeColumnName(ref.alias) + ' ' + this.toSQLType({ type: 'Integer' });

    if (!ref.nullable)
      str += ' NOT NULL';
    if (ref.defaultValue !== undefined)
      str += ' DEFAULT ' + this.toSQLValue({
        defaultValue: ref.defaultValue,
        type: 'Integer'
      }, true);
    else if (ref.nullable)
      str += ' DEFAULT NULL';

    return str;
  }

  /*
   * Must be overrided by sub-classes.
   */
  createColumnPrimaryKey(name) {
    return null;
  }

  /*
   * Must be overrided by sub-classes.
   */
  createDatabase(name) {
    return null;
  }

  createForeignKey(name, tableName, columnName) {
    return 'FOREIGN KEY (' + this.escapeColumnName(name) + ') REFERENCES ' + tableName + ' (' + columnName + ')';
  }

  createTable(name) {
    return 'CREATE TABLE ' + name;
  }

  /*
   * Must be overrided by sub-classes.
   */
  dropDatabase(name) {
    return null;
  }

  dropTable(name) {
    return 'DROP TABLE IF EXISTS ' + name + ';';
  }

  /**
   * Used in rare cases, for example when `name === 'user'` which is not allowed in PostgreSQL unless quoted (e.g. "user"). It's the responsibility of this method to do so.
   */
  escapeColumnName(name) {
    return name;
  }

  /*
   * Should generate code based on the 'entities' array.
   */
  generate() {
    if (!(this.options.create || this.options.drop || this.options['insert-into'] || this.options.data))
      throw 'You must specify an operation as CLI argument, one of --create / --drop / --insert-into <count> / --data <path>';


    if (this.options.data) {
      if (this.options.create || this.options.drop || this.options['insert-into'])
        console.log('Warning: You can not use arguments --create, --drop and --insert-into when using the --data arg. Using one of them along with --data has no effect.\n');

      this.generateData();
    }
    else {
      if (this.options.create)
        this.generateCreate();
      if (this.options.drop)
        this.generateDrop();
      if (this.options['insert-into']) {
        var n = 10;

        if (typeof this.options['insert-into'] === 'number')
          n = this.options['insert-into'];

        this.generateInserts(n);
      }
    }

    this.buildOutputFilesContent();
  }

  generateAttributes(e) {
    var self = this;
    var str = '';

    this.indentation++;
    e.attributes.forEach(function(attr, i) {
      str += self.indent() + self.createColumn(attr);

      if (i != (e.attributes.length - 1))
        str += ',\n';
    });

    if ((e.attributes.length > 0) && (e.references.length > 0))
      str += ',\n';

    e.references.forEach(function(ref, i) {
      str += self.indent() + self.createColumnForeignKey(ref);

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

      str += self.createTable(e.plural) + ' (\n';
      str += self.generateAttributes(e);

      if (e.references.length > 0) {
        str += ',\n';
        str += '\n';
        str += self.generateForeignKeys(e);
      }

      str += '\n';
      str += ');';

      self.schemas['create'][e.plural.toLowerCase()] = str;
    });
  }

  generateData() {
    // Does nothing, output file's content is generated in buildOutputFileContent()
  }

  generateDrop() {
    this.sortEntities();
    this.entities.reverse();
    var self = this;

    this.entities.forEach(function(e, i) {
      var str = '';

      str += self.dropTable(e.plural);

      self.schemas['drop'][e.plural.toLowerCase()] = str;
    });
  }

  generateForeignKeys(entity) {
    var e = entity;
    var self = this;
    var str = '';

    this.indentation++;
    e.references.forEach(function(ref, i) {
      str += self.indent() + self.createForeignKey(ref.alias, ref.entity.plural, ref.attribute);

      if (i < (e.references.length - 1)) {
        str += ',\n';
      }
    });
    this.indentation--;

    return str;
  }

  generateInserts(n) {
    this.sortEntities();
    var self = this;

    this.entities.forEach(function(e, i) {
      for (var i = 0; i < n; i++) {
        var values = {};

        e.attributes.forEach(function(attr) {
          if (attr.primaryKey)
            return;

          if (attr.defaultValueIsFunction)
            values[attr.name] = self.toSQLValue(attr);
          else {
            values[attr.name] = self.toSQLValue({
              defaultValue: Random.value(attr),
              type: attr.type
            });
          }
        });
        e.references.forEach(function(ref) {
          var otherRefs = [];

          if (values[ref.alias] === undefined) // If no foreign key id set for this reference yet
            values[ref.alias] = Random.integer(1, n); // Choose a random foreign key id from the number of insert statements generated

          e.references.forEach(function(ref2) {
            if (ref2 == ref)
              return;

            otherRefs = otherRefs.concat(
              ref2.entity.references.filter(function(ref3) {
                return (ref3.entity === ref.entity)
                  && (ref3.attribute === ref.attribute);
              })
            );
          });

          // If another reference from this entity points to an entity having a reference to the same Entity-Attribute pair as the current reference
          if (otherRefs.length > 0) {
            // Ensure that the value for this foreign key is the same as the other entity's foreign key's value as they should both point to the same table record (for data integrity)

            otherRefs.forEach(function(ref3) {
              var referencedEntityName = ref3.source.plural.toLowerCase();
              var referencedEntityInserts = self.inserts[referencedEntityName];

              if (referencedEntityInserts === undefined)
                return; // No inserts for this entity

              var ref2 = e.references.filter(function(r) {
                return (r.source === ref.source) && (r.entity === ref3.source);
              })[0];
              // Look for an insert statement which has a foreign key to the same table & field and which value is the same as the randomly generated current foreign key id
              var inserts = referencedEntityInserts.filter(function(val, i) {
                return (val.values[ref3.alias] === values[ref.alias]);
              });

              if (inserts.length === 0) // No inserts on the second table with the same value for the same foreign key
                values[ref2.alias] = null;
              else {
                // Choose randomly between the matching inserts
                values[ref2.alias] = referencedEntityInserts.indexOf(
                  inserts[Random.integer(1, inserts.length) - 1]
                ) + 1;
              }
            });
          }
        });

        self.inserts[e.plural.toLowerCase()].push(self.insertInto(e, values));
      }
    });
  }

  getAllowedOptions() {
    return {
      'create': 'For each entity, will generate the SQL query to create the related database table.',
      'data': 'If used, Jane will look for a "data/" sub-directory for default data to generate INSERT INTO statements for.',
      'drop': 'For each entity, will generate the SQL query to drop the related database table.',
      'insert-into <rows-count>': 'For each entity, will generate <rows-count> SQL queries to insert randomly generated data in the related database table.'
    };
  }

  getAutoIncrementString() {
    return '';
  }

  getContent(fileName) {
    return this.filesContent[fileName];
  }

  /*
   * Should return the content of the 'execute.sh' file placed in every output directory after generation to execute generated SQL files.
   *
   * Must be overrided by sub-classes.
   */
  getExecuteScriptContent() {
    return null;
  }

  getOutputFilesNames() {
    var names = [];

    if (this.options.data) {
      if (this.entities.length === 1)
        names.push('insert-into-table-' + this.entities[0].plural.toLowerCase() + '-default-data.sql');
      else
        names.push('insert-into-database-default-data.sql');
    }
    else {
      for (var opt of [ 'create', 'drop', 'insert-into' ]) {
        if (!this.options[opt])
          continue;

        if (this.entities.length === 1)
          names.push(opt + '-table-' + this.entities[0].plural.toLowerCase() + '.sql');
        else {
          names.push(opt + '-database.sql');
        }
      }
    }

    names.push('execute.sh');

    return names;
  }

  /*
   * Returns `this.indentation * 2` whitespaces (e.g. 2, 4...).
   */
  indent() {
    var str = '';

    for (var i = 0; i < this.indentation * 2; i++)
      str += ' ';

    return str;
  }

  insertInto(entity, values) {
    return new InsertIntoStatement(this, entity, values);
  }

  setOptions(val) {
    this.filesContent = {};
    this.options = val;

    for (let e of this.entities) {
      this.inserts[e.plural.toLowerCase()] = [];
    }
  }

  sortData() {
    this.data.sort(function(a, b) {
      return a.entity.references.length - b.entity.references.length;
    });
  }

  sortEntities() {
    this.entities.sort(function(a, b) {
      return a.references.length - b.references.length;
    });
  }

  /**
   * Returns the SQL type corresponding to the given Jane attribute's type (e.g. VARCHAR(<...>) for String etc.) with desired length if appropriated (e.g. VARCHAR(255) etc.)
   *
   * Should be overrided by sub-classes only if needed.
   */
  toSQLType(attr) {
    var res = null;

    switch (attr.type) {
      case 'Decimal': {
        res = 'DECIMAL(' + attr.precision + ',' + attr.scale + ')';
      }
      break;
      default: { // sql type == js type
        res = new String(attr.type).toUpperCase();
      }
      break;
    }

    return res;
  }

  /**
   * Returns the SQL value corresponding to the given JS value (e.g. for 'false' should return 0 for SQLite, and FALSE for MySQL etc.)
   *
   * Should be overrided by sub-classes only if needed.
   */
  toSQLValue(attr, createStatement = false) {
    var res = null;

    if (attr.defaultValueIsFunction && (this.name !== 'sqlite')) {
      switch (attr.defaultValue) {
        case 'DATE()': {
          res = 'CURRENT_DATE'; // sql value == js value
        }
        break;
        case 'DATETIME()': {
          res = 'CURRENT_TIMESTAMP'; // sql value == js value
        }
        break;
        case 'TIME()': {
          res = 'CURRENT_TIME'; // sql value == js value
        }
        break;
        default: {
          console.log('Unknown function ' + attr.defaultValue);
        }
      }
    }
    else if (this.name === 'sqlite') {
      if (createStatement)
        res = '(' + attr.defaultValue + ')';
      else
        res = attr.defaultValue;
    }

    return res;
  }
}
