/*
 * TODO ✓✗
 * ====
 *
 * ✗ AbstractSQLGenerator: fix inserts order (for foreign keys constraints)
 * ✗ XML: Add Jane-specific functions support for default values (validation regex would be 'default="(func:)?DATE()"') and add support for DATE(), DATETIME() and TIME() functions
 * ✗ SQLite: Add bash script generation that could be executed to execute generated SQL queries (via its own --create/--drop/--insert-into args ; would execute all three operations if executed without args)
 * ✗ XML: Consider adding 'Time' attribute types support (with default value support [ISO-8601])
 * ✗ XML: Consider adding 'Float|Real' attribute types support (with default value support)
 * ✗ XML: Add 'length' attribute support for attributes
 * ✗ XML: Add 'min-length' attribute support for attributes
 * ✗ JS: add support for references
 * ✗ JS: add partial set(object) and all setters
 * ✗ Update Wiki at next release (see commits history for changes)
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

  Jane.init(fs, new Generator(args), glob, path, randexp, xml2js);
}
