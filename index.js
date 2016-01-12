/*
 * TODO ✓✗
 * ====
 *
 * ✗ SQLite insert-into generation: use randexp.js and 'matches' (?) XML attribute to generate valid random values
 * ✗ XML: Consider adding 'Datetime/Time' attribute types support (with default value support [ISO])
 * ✗ XML: Consider adding 'Float|Real' attribute types support (with default value support)
 * ✗ XML: Add 'Date' attribute type support (with default value support)
 * ✗ XML: Add 'length' attribute support for attributes
 * ✗ XML: Add 'matches' regex attribute support
 * ✗ JS: add support for references
 * ✗ JS: add partial set(object) and all setters
 */

/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var args = require('yargs').argv;
var fs = require('fs');
var glob = require('glob');
var Jane = require('./src/Jane').default;
var path = require('path');
var Toolkit = require('./src/Toolkit').default;
var util = require('util');
var xml2js = require('xml2js');

/*
 * Command line parsing
 * ====================
 */

var generatorName = args['_'][0];

if (generatorName)
  init();

if (args.help) {
  if (!generatorName)
    Jane.logHelp();
  else
    Jane.logHelpGenerator();
}
else if (generatorName)
  Jane.process(args);
else
  Jane.logHelp();

/*
 * Functions
 * =========
 */

function init() {
  args.src = __dirname + '/' + args.from;
  var Generator = require('./src/generators/' + generatorName).default;
  var options = Toolkit.getGeneratorOptions(args);

  Jane.init(fs, new Generator(options), glob, path, xml2js);
}
