/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./src/Entity').default;
var fs = require('fs');
var JSGenerator = require('./src/generators/JS').default;
var SQLiteGenerator = require('./src/generators/SQLite').default;
var xml2js = require('xml2js');
var yargs = require('yargs').argv;

/*
 * Global variables
 * ================
 */

var dir = __dirname + '/';
var parser = new xml2js.Parser();

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

/*
 * Command line parsing
 * ====================
 */

if (!yargs.src || !yargs.gen)
  help();
else {
  fs.readFile(dir + yargs.src, function(err, buffer) {
    parser.parseString(buffer, function (err, obj) {
      var ent = Entity.fromXMLObject(obj.entity);
      var out = null;
      var res = null;

      switch (yargs.gen) {
        case 'js': {
          out = new JSGenerator(ent);
        }
        break;
        case 'sqlite': {
          out = new SQLiteGenerator(ent);
        }
        break;
        default:
          console.log('Error. Unknown generator "' + yargs.gen + '"\n');
          help();
        break;
      }

      if (out !== null)
        res = out.generate();

      if (res !== null)
        console.log(res);
    });
  });
}
