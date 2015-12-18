/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./src/Entity').default;
var fs = require('fs');
var JSGenerator = require('./src/generators/JS').default;
var xml2js = require('xml2js');
var yargs = require('yargs').argv;

/*
 * Global variables
 * ================
 */

var dir = __dirname + '/';
var parser = new xml2js.Parser();

/*
 * Command line parsing
 * ====================
 */

if (!yargs.source || !yargs.type)
  help();
else {
  fs.readFile(dir + yargs.source, function(err, buffer) {
    parser.parseString(buffer, function (err, obj) {
      var ent = Entity.fromXMLObject(obj.entity);
      var out = null;
      var res = null;

      switch (yargs.type) {
        case 'js': {
          out = new JSGenerator(ent);
          res = out.generate();
        }
        break;
        case 'sql': {
          res = sql(obj);
        }
        break;
        default:
          help();
        break;
      }

      if (res !== null)
        console.log(res);
      else
        console.log('\nError. Something went wrong.');
    });
  });
}

function help() {
  console.log('Jane version 0.0.0');
  console.log('Usage: nodejs index.js SOURCE DESTINATION TYPE');
  console.log('');
  console.log('Parameters');
  console.log('==========');
  console.log('');
  console.log('* source       : Path to the XML source file (should be Jane compliant');
  console.log('* destination  : Path to the file to write the output in');
  console.log('* type         : Output type (e.g. js, sql)');
}

function sql(xml) {
  var ent = xml.entity;
  var str = '';

  str += 'CREATE TABLE ' + ent['$'].name + ' (';
  str += printSQLColumns(ent.attributes);
  str += '\n';
  str += ');';
  str += '\n';

  return str;
}

function printConstructorBody(attrs) {
  var str = '';

  attrs.forEach(function(e, i) {
    e.attribute.forEach(function(e) {
      str += printConstructorAttributeInitialization(e['$']);
    })
  });

  return str;
}

function printSQLColumns(attrs) {
  var str = '';

  str += '\n';

  attrs.forEach(function(e1, i1) {
    e1.attribute.forEach(function(e2, i2) {
      str += '  ' + printSQLColumn(e2['$']);

      if (i2 < e1.attribute.length - 1)
        str += ',\n';
    })
  });

  return str;
}

function printSQLColumn(attr) {
  var str = '';

  str += attr.name;
  str += ' ';

  switch (attr.type) {
    case 'String': {
      str += 'VARCHAR';

      if (attr.length !== undefined)
        str += '(' + attr.length + ')';
    }
    break;
    default: {
      str += attr.type.toUpperCase();
    }
    break;
  }

  if (attr.required === 'true' || (attr.required === undefined && attr.default === undefined))
    str += ' NOT NULL';
  else {
    if (attr.default === undefined)
      throw new Error("[jane] printConstructorParameter(): attribute '" + attr.name + "' is optional but no default value given");

    switch (attr.default) {
      case 'false':
      case 'null':
      case 'true':
        str += ' DEFAULT ' + attr.default.toUpperCase();
        break;
      default:
        if (attr.type === 'Integer' || attr.type === 'Double')
          str += ' DEFAULT ' + attr.default;
        else {
          if (attr.default === '')
            str += ' DEFAULT NULL'
          else
            str += ' DEFAULT \'' + attr.default + '\'';
        }
        break;
    }
  }

  return str;
}
