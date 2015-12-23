/*
 * Functionalities ✓✗
 * ===============
 *
 * ✗ Add 'length' attribute support
 * ✗ Add 'matches' regex attribute support
 * ✗ JS: add partial set(object) and all setters
 * ✗ SQLite: add random inserts generation
 * ✗ CLI: pass additional arguments as options to the generator e.g. --create, --drop --inserts
 * ✗ Generators: add support to generate multiple entities at once (with multiple output files if appropriated)
 */

/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var args = require('yargs').argv;
var Entity = require('./src/Entity').default;
var fs = require('fs');
var Reference = require('./src/Reference').default;
var Toolkit = require('./src/Toolkit').default;
var util = require('util');
var xml2js = require('xml2js');

/*
 * Global variables
 * ================
 */

var dir = __dirname + '/';

/*
 * Command line parsing
 * ====================
 */

if (!args.src || !args.gen)
  help();
else {
  init();

  var entity;
  var Generator = require('./src/generators/' + args.gen.toLowerCase()).default;
  var gen = new Generator();
  var obj = Toolkit.readXMLFile(Toolkit.getFileName(args.src));
  var outputDir = Toolkit.basePath + 'output/' + args.gen.toLowerCase() + '/';
  var outputFile;
  var outputString;

  entity = Entity.fromXMLObject(obj.entity);
  gen.entity = entity;
  outputFile = outputDir + gen.getOutputFileName();
  outputString = gen.generate();

  console.log('*** Output code ***');
  console.log(outputString);
  console.log('*** /Output code ***');
  saveCode(outputString, outputFile, outputDir);
  console.log('Code saved in file "' + outputFile + '".');
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
  console.log('* src : Path to the XML source file (should be Jane compliant, see tests/Example1.xml)');
  console.log('* gen : Generator to use to produce the output string, typically the target file type\'s file extension letters (e.g. js, sql)');
}

function init() {
  Entity.instances = {};
  Reference.instances = [];
  Toolkit.basePath = dir + Toolkit.getDirectoryPath(args.src);
  Toolkit.fs = fs;
  Toolkit.xml2js = xml2js;
}

function saveCode(code, file, dir) {
  if (!Toolkit.directoryExists(Toolkit.basePath + 'output/'))
    Toolkit.createDirectory(Toolkit.basePath + 'output/');
  if (!Toolkit.directoryExists(dir))
    Toolkit.createDirectory(dir);

  fs.writeFileSync(file, code, 'utf8');
}
