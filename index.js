/*
 * TODO ✓✗
 * ====
 *
 * ✗ Misc: Add XML syntax help sheet + SQLite help
 * ✗ SQLite: Add bash script generation that could be executed to execute generated SQL queries (via its own --create/--drop/--insert-into args)
 * ✗ SQLite: Add 'auto' (or similar) attribute support for attributes (means that value is automatically set by the RDBMS and doesn't need to be manually set when executing INSERT INTO statements, typically for rows metadata columns like "created_at", "updated_at"...)
 * ✗ XML: Consider adding 'Time' attribute types support (with default value support [ISO-8601])
 * ✗ XML: Consider adding 'Float|Real' attribute types support (with default value support)
 * ✗ XML: Add 'length' attribute support for attributes
 * ✗ JS: add support for references
 * ✗ JS: add partial set(object) and all setters
 */

/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return (filename.indexOf('node_modules') === -1);
});

var args = require('yargs').argv;
var fs = require('fs');
var glob = require('glob');
var Jane = require('./src/Jane').default;
var path = require('path');
var randexp = require('randexp');
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

  Jane.init(fs, new Generator(options), glob, path, randexp, xml2js);
}
