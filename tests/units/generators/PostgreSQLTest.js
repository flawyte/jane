var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Attribute = require('./../../../src/Attribute').default;
var Entity = require('./../../../src/Entity').default;
var Reference = require('./../../../src/Reference').default;
var PostgreSQLGenerator = require('./../../../src/generators/postgresql').default;

var gen = new PostgreSQLGenerator();

module.exports = {
  'connectDatabase': function(assert) {
    assert.equal(true, gen.connectDatabase instanceof Function);

    assert.equal('\\connect jane;', gen.connectDatabase('jane'));

    assert.done();
  },
  'createColumn': function(assert) {
    assert.equal(true, gen.createColumn instanceof Function);

    var attr = new Attribute('first_name', 'String');
    assert.equal('first_name TEXT NOT NULL', gen.createColumn(attr));
    attr.nullable = true;
    assert.equal('first_name TEXT DEFAULT NULL', gen.createColumn(attr));
    attr.defaultValue = 'foobar';
    assert.equal('first_name TEXT DEFAULT \'foobar\'', gen.createColumn(attr));

    attr = new Attribute('user', 'Integer');
    assert.equal('"user" INTEGER NOT NULL', gen.createColumn(attr));
    attr.nullable = true;
    assert.equal('"user" INTEGER DEFAULT NULL', gen.createColumn(attr));
    attr.defaultValue = 1;
    assert.equal('"user" INTEGER DEFAULT 1', gen.createColumn(attr));

    assert.done();
  },
  'createColumnForeignKey': function(assert) {
    assert.equal(true, gen.createColumnForeignKey instanceof Function);

    var ref = new Reference(null, new Entity('User', 'Users'), 'id', 'user');
    assert.equal('"user" INTEGER NOT NULL', gen.createColumnForeignKey(ref));
    ref.nullable = true;
    assert.equal('"user" INTEGER DEFAULT NULL', gen.createColumnForeignKey(ref));
    ref.defaultValue = 1;
    assert.equal('"user" INTEGER DEFAULT 1', gen.createColumnForeignKey(ref));

    assert.done();
  },
  'createColumnPrimaryKey': function(assert) {
    assert.equal(true, gen.createColumnPrimaryKey instanceof Function);

    assert.equal('id SERIAL PRIMARY KEY', gen.createColumnPrimaryKey('id'));

    assert.done();
  },
  'createDatabase': function(assert) {
    assert.equal(true, gen.createDatabase instanceof Function);

    assert.equal('CREATE DATABASE jane;', gen.createDatabase('jane'));

    assert.done();
  },
  'createForeignKey': function(assert) {
    assert.equal(true, gen.createForeignKey instanceof Function);

    assert.equal('FOREIGN KEY ("user") REFERENCES Users (id)', gen.createForeignKey('user', 'Users', 'id'));

    assert.done();
  },
  'createTable': function(assert) {
    assert.equal(true, gen.createTable instanceof Function);

    assert.equal('CREATE TABLE foobar', gen.createTable('foobar'));

    assert.done();
  },
  'dropDatabase': function(assert) {
    assert.equal(true, gen.dropDatabase instanceof Function);

    assert.equal('\\connect postgres;\nDROP DATABASE jane;', gen.dropDatabase('jane'));

    assert.done();
  },
  'dropTable': function(assert) {
    assert.equal(true, gen.dropTable instanceof Function);

    assert.equal('DROP TABLE IF EXISTS foobar;', gen.dropTable('foobar'));

    assert.done();
  },
  'insertInto': function(assert) {
    assert.equal(true, gen.insertInto instanceof Function);

    assert.done();
  }
};
