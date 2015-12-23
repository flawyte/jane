/*
 * Functionalities ✓✗
 * ===============
 *
 * ✗ Add 'length' attribute support
 * ✗ Add 'matches' regex attribute support
 * ✗ JS: add support for references
 * ✗ JS: add partial set(object) and all setters
 * ✗ SQLite: add random inserts generation
 * ✗ CLI: pass additional arguments as options to the generator e.g. --create, --drop --inserts
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
var gen;
var outputDir;

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

  Jane.init(fs, new Generator(), glob, xml2js);
}
