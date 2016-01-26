var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var AbstractSQLGenerator = require('./../../../src/generators/AbstractSQLGenerator').default;
var Attribute = require('./../../../src/Attribute').default;
var DataRecord = require('./../../../src/DataRecord').default;
var Entity = require('./../../../src/Entity').default;
var Toolkit = require('./../../../src/Toolkit').default;

var entities = [
  new Entity('Product', 'Products'),
  new Entity('User', 'Users')
];
var gen = new AbstractSQLGenerator();
var res;

entities[0].addAttribute(new Attribute('id', 'Integer', true));
entities[0].addAttribute(new Attribute('name', 'String'));
entities[1].addAttribute(new Attribute('id', 'Integer', true));
entities[1].addAttribute(new Attribute('first_name', 'String'));
entities[1].addAttribute(new Attribute('last_name', 'String'));

for (var key in entities) {
  gen.addEntity(entities[key]);
}

gen.data = [
  new DataRecord(entities[0], {
    'name': JSON.stringify('Product n°1')
  }),
  new DataRecord(entities[0], {
    'name': JSON.stringify('Product n°2')
  }),
  new DataRecord(entities[1], {
    'first_name': JSON.stringify('John'),
    'last_name': JSON.stringify('Doe')
  }),
  new DataRecord(entities[1], {
    'first_name': JSON.stringify('Foo'),
    'last_name': JSON.stringify('Bar')
  })
];

module.exports = {
  'buildOutputFilesContent': function(assert) {
    assert.equal(true, gen.buildOutputFilesContent instanceof Function);

    gen.setOptions({
      create: true,
      drop: true,
      'insert-into': 3
    });
    gen.generate(); // buildOutputFilesContent() automatically called

    assert.equal(4, Object.keys(gen.filesContent).length);
    assert.equal(true, Toolkit.typeOf(gen.filesContent['create-database.sql']) === 'String');
    assert.equal(true, Toolkit.typeOf(gen.filesContent['drop-database.sql']) === 'String');
    assert.equal(true, Toolkit.typeOf(gen.filesContent['insert-into-database.sql']) === 'String');
    assert.equal(false, Toolkit.typeOf(gen.filesContent['insert-into-database-default-data.sql']) === 'String');
    assert.equal('CREATE TABLE Products (\n  null,\n  name STRING NOT NULL\n);\n\nCREATE TABLE Users (\n  null,\n  first_name STRING NOT NULL,\n  last_name STRING NOT NULL\n);\n', gen.filesContent['create-database.sql']);
    assert.equal('DROP TABLE IF EXISTS Users;\n\nDROP TABLE IF EXISTS Products;\n', gen.filesContent['drop-database.sql']);
    assert.equal(3, gen.filesContent['insert-into-database.sql'].match(/.*INSERT INTO Products.*/gi).length);
    assert.equal(3, gen.filesContent['insert-into-database.sql'].match(/.*INSERT INTO Users.*/gi).length);

    gen.setOptions({
      data: true
    });
    gen.generate(); // buildOutputFilesContent() automatically called

    assert.equal(2, Object.keys(gen.filesContent).length);
    assert.equal(false, Toolkit.typeOf(gen.filesContent['create-database.sql']) === 'String');
    assert.equal(false, Toolkit.typeOf(gen.filesContent['drop-database.sql']) === 'String');
    assert.equal(false, Toolkit.typeOf(gen.filesContent['insert-into-database.sql']) === 'String');
    assert.equal(true, Toolkit.typeOf(gen.filesContent['insert-into-database-default-data.sql']) === 'String');
    assert.equal(2, gen.filesContent['insert-into-database-default-data.sql'].match(/.*INSERT INTO Products.*/gi).length);
    assert.equal(2, gen.filesContent['insert-into-database-default-data.sql'].match(/.*INSERT INTO Users.*/gi).length);

    assert.done();
  }
};

// assert.equal(2, Object.keys(gen.schemas['create']).length);
// assert.equal(2, Object.keys(gen.schemas['drop']).length);
// assert.equal(2, Object.keys(gen.schemas['insert-into']).length);
// assert.equal(2, gen.schemas['create'].length);
// assert.equal(2, gen.schemas['drop'].length);
// assert.equal(2, gen.schemas['insert-into'].length);