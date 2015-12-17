/*
 * Imports
 * =======
 */

var fs = require('fs');
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
  fs.readFile(dir + yargs.source, function(err, data) {
    parser.parseString(data, function (err, str) {
      var res = null;

      switch (yargs.type) {
        case 'js': {
          res = js(str);
        }
        break;
        case 'sql': {
          res = sql(str);
        }
        break;
        default:
          help();
        break;
      }

      if (res !== null)
        console.log(res);
      else
        console.log('Error. Something went wrong.');
    });
  });
}

function js(xml) {
  var ent = xml.entity;
  var str = '';

  str += 'class ' + ent['$'].name + ' {';
  str += printConstructor(ent);
  str += '}';
  str += '\n';

  return str;
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

function printConstructor(ent) {
  var str = '';

  str += '\n';
  str += '  ';
  str += 'constructor(' + printConstructorParameters(ent.attributes) + ') {';
  str += printConstructorBody(ent.attributes);
  str += '\n';
  str += '  }';
  str += '\n';

  return str;
}

function printConstructorAttributeInitialization(attr) {
  var str = '';

  str += '\n';
  str += '    this.' + attr.name + ' = ' + attr.name + ';';

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

function printConstructorParameter(attr) {
  var str = '';

  str += attr.name;

  if (attr.optional === 'true' || attr.default !== undefined) {
    if (attr.default === undefined)
      throw new Error("[jane] printConstructorParameter(): attribute '" + attr.name + "' is optional but no default value given");
    
    if (attr.type === 'String')
      str += ' = \'' + attr.default + '\'';
    else
      str += ' = ' + attr.default;
  }

  return str;
}

function printConstructorParameters(attrs) {
  var str = '';

  attrs.forEach(function(e1, i1) {
    e1.attribute.forEach(function(e2, i2) {
      str += printConstructorParameter(e2['$']);

      if (i2 < e1.attribute.length - 1)
        str += ', ';
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
