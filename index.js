var fs = require('fs'),
  xml2js = require('xml2js');

var parser = new xml2js.Parser();

function printClass(obj) {
  var ent = obj.entity;
  var str = '';

  str += 'class ' + ent['$'].name + ' {';
  str += printConstructor(ent);
  str += '}';
  str += '\n';

  return str;
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
    if (attr.default === undefined || attr.default === '')
      throw new Error("[jane] printConstructorParameter(): attribute '" + attr.name + "' is optional but no default value given");
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

fs.readFile(__dirname + '/tests/Example1.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
    // console.log(err);
    // console.dir(result);
    console.log(printClass(result));
  });
});
