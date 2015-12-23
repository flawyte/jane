/*
 * Functionalities ✓✗
 * ===============
 *
 * ✗ Add 'length' attribute support
 * ✗ Add 'matches' regex attribute support
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
var Entity = require('./src/Entity').default;
var fs = require('fs');
var glob = require('glob');
var Reference = require('./src/Reference').default;
var Toolkit = require('./src/Toolkit').default;
var util = require('util');
var xml2js = require('xml2js');

/*
 * Global variables
 * ================
 */

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

  if (Toolkit.directoryExists(args.src)) { // Arg is a directory
    if (args.src.slice(-1) !== '/') // Check if path contains a trailing '/' and if not adds one
      args.src += '/';

    Toolkit.basePath = args.src;
    outputDir = Toolkit.basePath + 'output/' + args.gen.toLowerCase() + '/';

    glob(args.src + '*.xml', function(err, files) {
      files.forEach(function(file, i) {
        gen.addEntity(process(file));
      });

      gen.generate();
      gen.getOutputFilesNames().forEach(function(fileName) {
        saveCode(gen.getContent(fileName), fileName + '.' + gen.getOutputFilesExtension(), outputDir);
      });
      console.log('✓ Done !');
    });
  }
  else { // Arg is an XML file
    Toolkit.basePath = Toolkit.getDirectoryPath(args.src);
    outputDir = Toolkit.basePath + 'output/' + args.gen.toLowerCase() + '/';

    gen.addEntity(process(args.src));
    gen.generate();
    gen.getOutputFilesNames().forEach(function(fileName) {
      saveCode(gen.getContent(fileName), fileName + '.' + gen.getOutputFilesExtension(), outputDir);
    });
    console.log('✓ Done !');
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
  gen = new Generator();
  Entity.instances = {};
  Reference.instances = [];
  Toolkit.fs = fs;
  Toolkit.xml2js = xml2js;
}

function process(file) {
  return Entity.fromXMLObject(
    Toolkit.readXMLFile(
      Toolkit.getFileName(file)
    ).entity
  );
}

function saveCode(code, file, dir) {
  if (!Toolkit.directoryExists(Toolkit.basePath + 'output/'))
    Toolkit.createDirectory(Toolkit.basePath + 'output/');
  if (!Toolkit.directoryExists(dir))
    Toolkit.createDirectory(dir);

  fs.writeFileSync(dir + file, code, 'utf8');
}
