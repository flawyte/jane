/*
 * TODO ✓✗
 * ====
 *
 * ✗ Default data: for foreign keys columns, allow prefixes like 'name:foobar' that would be converted into (SELECT `primary key column` FROM `referenced table` WHERE name = 'foobar')
 * ✗ SQL generators: add REGEX support
 * ✗ SQL generators: add MIN/MAX LENGTH support
 * ✗ Add regex guessing based on the attribute's name
 * ✗ XML: Add 'length' attribute support for attributes
 * ✗ XML: Consider adding 'Float' attribute type support (with default value support)
 * ✗ Add genres: a genre would be a kind of sub-type, e.g. of type "String" and genre "email" or "paragraph", if specified generated data would thus be different, based on each attribute's genre (fallback on regex, validation checks)
      - 'Boolean' genres: /
      - 'Date/DateTime' genres: birthdate, create_at, updated_at
      - 'Decimal' genres: price
      - 'Integer' genres: age
      - 'String' genres: paragraph (Lorem ipsum), email, sha1, md5, first_name, last_name, phone, address, postal code, city, country, country code
      - 'Time' genres: /
 * ✗ Add genre guessing based on the attribute's name (if name is a genre, set the attribute to this genre)
 * ✗ Attribute: build regex based on constraints attributes and use it alone for checks instead of using other attributes (max-length etc.) too
 * ✗ Add doc support: allow to specify entity's doc
 */

/*
 * Imports
 * =======
 */

require('traceur').require.makeDefault(function(filename) {
  return (filename.indexOf('node_modules') === -1);
});

var args = require('yargs').argv;
var Jane = require('./src/Jane').default;
var Toolkit = require('./src/Toolkit').default;

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
  var Generator = require('./src/generators/' + generatorName).default;

  Jane.init(require, new Generator(args), process.cwd() + '/');
}
