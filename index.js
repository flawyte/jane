/*
 * TODO ✓✗
 * ====
 *
 * ✗ SQLite insert-into generation: use randexp.js and 'matches' (?) XML attribute to generate valid random values
 * ✗ XML: Add 'length' attribute support for attributes
 * ✗ XML: Add 'nullable' attribute support for attributes
 * ✗ XML: Add 'matches' regex attribute support
 * ✗ Update CLI-help() + README.md: update usage, example & add TODO section (refer reader to this file)
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
    help();
  else
    Jane.logHelpGenerator();
}
else if (generatorName)
  Jane.process(args);
else
  help();

/*
 * Functions
 * =========
 */

function help() {
  console.log('Jane version 0.0.0');
  console.log('Usage: node index.js <generator-name> --from <XML file/directory> [--to <output directory>] [<generator-specific arguments>]');
  console.log('');
  console.log('Arguments');
  console.log('=========');
  console.log('');
  console.log('* generator-name : Supported values by default => sqlite');
  console.log('* from : A Jane-compliant XML source file or a whole directory (each XML file it contains will be processed). See the XML files in one of the tests/example*/ directories for an example');
  console.log('* to : Relative path (to the "from" argument) to a directory to write the output file(s) in. Default is "output/<generator-name>/"');
  console.log('* generator-specific arguments : Type "node index.js <generator-name> --help" for a list of additional arguments supported by a generator if any');
}

function init() {
  args.src = __dirname + '/' + args.from;
  var Generator = require('./src/generators/' + generatorName).default;
  var options = Toolkit.getGeneratorOptions(args);

  Jane.init(fs, new Generator(options), glob, path, xml2js);
}
