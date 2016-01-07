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
 * ✗ CLI: add destination output dir (via --dst arg ?)
 * ✗ Generators: switch from files to directories for each generator (load <gen-name>/index.js automatically) to allow adding additional classes if needed without polluting the base 'generators/' directory
 * ✗ Jane: add process() function (which automatically falls back on processFile() or processDirectory())
 * ✗ CLI: change usage syntax to 'node index.js <generator-name> --from=<XML source(s) file/directory> --to=<desination directory>'
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
var Toolkit = require('./src/Toolkit').default;
var util = require('util');
var xml2js = require('xml2js');

/*
 * Command line parsing
 * ====================
 */

if (!args.src || !args.gen)
  help();
else {
  init();
  var src = args.src;

  if (Toolkit.directoryExists(src)) { // Arg is a directory
    Jane.processDirectory(args, function(success) {
      if (success)
        console.log('✓ Done !');
      else
        console.log('Error while processing directory' + src + '.');
    });
  }
  else { // Arg is an XML file
    Jane.processFile(args, function(success) {
      if (success)
        console.log('✓ Done !');
      else
        console.log('Error while processing file' + src + '.');
    });
  }
}

/*
 * Functions
 * =========
 */

function help() {
  console.log('Jane version 0.0.0');
  console.log('Usage: node index.js --src SOURCE --gen GENERATOR');
  console.log('');
  console.log('Parameters');
  console.log('==========');
  console.log('');
  console.log('* src : Path to the XML source file (should be Jane compliant, see tests/Example1.xml) or directory');
  console.log('* gen : Generator to use to produce the output string, typically the target file type\'s file extension letters (e.g. js, sql)');
}

function init() {
  args.src = __dirname + '/' + args.src;
  var Generator = require('./src/generators/' + args.gen.toLowerCase()).default;
  var options = Toolkit.getGeneratorOptions(args);

  Jane.init(fs, new Generator(options), glob, xml2js);
}
