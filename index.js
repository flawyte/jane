/*
 * Functionalities ✓✗
 * ===============
 *
 * ✗ Add foreign keys (references) support
 * ✗ Add 'matches' attribute support
 * ✗ JS: add partial set(object) and all setters
 * ✗ SQLite: cast true/false values to 1/0
 * ✗ SQLite: add support for foreign keys
 */

/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./src/Entity').default;
var args = require('yargs').argv;
var fs = require('fs');
var xml2js = require('xml2js');

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

if (!args.src || !args.gen)
  help();
else {
  fs.readFile(dir + args.src, function(err, buffer) {
    parser.parseString(buffer, function (err, obj) {
      try {
        var ent = Entity.fromXMLObject(obj.entity);
        var Gen = require('./src/generators/' + args.gen.toLowerCase()).default; // e.g. js, sqlite
        var out = new Gen(ent);

        console.log(out.generate());
      } catch(e) {
        throw e;
      }
    });
  });
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
