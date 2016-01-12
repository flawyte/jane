import AbstractGenerator from './../AbstractGenerator';
import InsertIntoStatement from './InsertIntoStatement';
import Random from './../../Random';

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

  static toSQLiteType(attr) {
    var res = null;

    switch (attr.type) {
      case 'Decimal': {
        res = 'DECIMAL(' + attr.precision + ',' + attr.scale + ')';
      }
      break;
      case 'String': {
        res = 'VARCHAR';
      }
      break;
      default: {
        res = attr.type; // sql type == js type
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
    if (this.options['insert-into']) {
      var n = 10;

      if (typeof this.options['insert-into'] === 'number')
        n = this.options['insert-into'];

      this.generateInserts(n);
    }
  }

  generateAttributes(e) {
    var self = this;
    var str = '';

    this.indentation++;
    e.attributes.forEach(function(attr, i) {
      str += self.indent() + attr.name + ' ' + SQLiteGenerator.toSQLiteType(attr).toUpperCase();

      if (attr.primaryKey)
        str += ' PRIMARY KEY AUTOINCREMENT'
      else if (attr.required)
        str += ' NOT NULL';
      else {
        str += ' DEFAULT ';

        if (attr.type !== 'String')
          if (attr.defaultValueIsRaw)
            str += '(' + attr.defaultValue + ')';
          else if (attr.type !== 'Date')
            str += SQLiteGenerator.toSQLiteValue(attr.defaultValue);
          else
            str += '"' + attr.defaultValue + '"';
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

  generateInserts(n) {
    this.sortEntities();
    var self = this;

    this.entities.forEach(function(e, i) {
      for (var i = 0; i < n; i++) {
        var values = {};

        e.attributes.forEach(function(attr) {
          if (attr.primaryKey)
            values[attr.name] = null;
          else if (attr.defaultValueIsRaw)
            values[attr.name] = attr.defaultValue;
          else
            values[attr.name] = SQLiteGenerator.toSQLiteValue(Random.value(attr));
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

              if (self.results['insert-into'][referencedEntityName] === undefined)
                return; // No inserts for this entity

              var ref2 = e.references.filter(function(r) {
                return (r.source === ref.source) && (r.entity === ref3.source);
              })[0];
              // Look for an insert statement which has a foreign key to the same table & field and which value is the same as the randomly generated current foreign key id
              var inserts = self.results['insert-into'][referencedEntityName]
                .filter(function(val, i) {
                  return (val.values[ref3.alias] === values[ref.alias]);
                }
              );

              if (inserts.length === 0) // No inserts on the second table with the same value for the same foreign key
                values[ref2.alias] = null;
              else {
                // Choose randomly between the matching inserts
                values[ref2.alias] = self.results['insert-into'][referencedEntityName]
                  .indexOf(inserts[Random.integer(1, inserts.length) - 1]) + 1;
              }
            });
          }
        });

        var stmt = new InsertIntoStatement(e, values);
        self.results['insert-into'][e.plural.toLowerCase()].push(stmt);
      }
    });
  }

  getAllowedOptions() {
    return {
      'create': 'For each entity, will generate the SQL query to create the related database table.',
      'drop': 'For each entity, will generate the SQL query to drop the related database table.',
      'insert-into <rows-count>': 'For each entity, will generate <rows-count> SQL queries to insert randomly generated data in the related database table.'
    };
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

      if (ope === 'insert-into')
        content = this.results[ope][ent].join('\n') + '\n';
      else
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
