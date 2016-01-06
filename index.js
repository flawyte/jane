/*
 * TODO ✓✗
 * ====
 *
 * ✗ SQLite insert-into generation: check for circular references when generating random foreign keys (for example for a given table T1 having two foreign keys F11 and F12, with F11 pointing at table T2 and F12 pointing at table T3 and table T3 having a foreign key F22 pointing at table T2 too, F11 and F22 should have the same value for each T1-T3 records pair to ensure data integrity)
 * ✗ SQLite insert-into generation: use randexp.js and 'matches' (?) XML attribute to generate valid random values
 * ✗ CLI / SQLite insert-into generation: add an argument to specify how many inserts to generate for each table (--insert-into=<VALUE> ?)
 * ✗ XML: Add 'length' attribute support for attributes
 * ✗ XML: Add 'nullable' attribute support for attributes
 * ✗ XML: Add 'matches' regex attribute support
 * ✗ JS: add support for references
 * ✗ JS: add partial set(object) and all setters
 * ✗ CLI: add destination output dir (via --dst arg ?)
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
 * Global variables
 * ================
 */

var src;

/*
 * Command line parsing
 * ====================
 */

if (!args.src || !args.gen)
  help();
else {
  init();

  if (Toolkit.directoryExists(src)) { // Arg is a directory
    Jane.processDirectory(src, function(success) {
      if (success)
        console.log('✓ Done !');
      else
        console.log('Error while processing directory' + src + '.');
    });
  }
  else { // Arg is an XML file
    Jane.processFile(src, function(success) {
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
  src = __dirname + '/' + args.src;
  var Generator = require('./src/generators/' + args.gen.toLowerCase()).default;
  var options = Toolkit.getOptions(args);

  Jane.init(fs, new Generator(options), glob, xml2js);
}
