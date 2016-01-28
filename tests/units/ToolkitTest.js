require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Jane = require('./../../src/Jane').default;
var Toolkit = require('./../../src/Toolkit').default;

Jane.init(require);

module.exports = {
  'static createDirectory()': function(assert) {
    assert.equal(true, Toolkit.createDirectory instanceof Function);

    assert.done();
  },
  'static directoryExists()': function(assert) {
    assert.equal(true, Toolkit.directoryExists instanceof Function);

    assert.equal(true, Toolkit.directoryExists(__dirname));
    assert.equal(false, Toolkit.directoryExists('__dirname'));

    assert.done();
  },
  'static fileExists()': function(assert) {
    assert.equal(true, Toolkit.fileExists instanceof Function);

    assert.equal(true, Toolkit.fileExists(__filename));
    assert.equal(false, Toolkit.fileExists('__filename'));

    assert.done();
  },
  'static getDirectoryPath()': function(assert) {
    assert.equal(true, Toolkit.getDirectoryPath instanceof Function);

    assert.equal(true, Toolkit.getDirectoryPath(__filename).indexOf('units') !== -1);

    assert.done();
  },
  'static getEntityName()': function(assert) {
    assert.equal(true, Toolkit.getEntityName instanceof Function);

    assert.equal('Label', Toolkit.getEntityName('foo/bar/Label.xml'));

    assert.done();
  },
  'static getFileName()': function(assert) {
    assert.equal(true, Toolkit.getFileName instanceof Function);

    assert.equal('Label.xml', Toolkit.getFileName('foo/bar/Label.xml'));

    assert.done();
  },
  'static getLocale()': function(assert) {
    assert.equal(true, Toolkit.getLocale instanceof Function);

    assert.equal(process.env.LANG.split('.')[0].replace('_', '-'), Toolkit.getLocale());

    assert.done();
  },
  'static loadEntities()': function(assert) {
    assert.equal(true, Toolkit.loadEntities instanceof Function);

    var entities = Toolkit.loadEntities(__dirname + '/../example1');

    assert.equal(2, entities.length);
    assert.equal('Label', entities[0].name);
    assert.equal('Labels', entities[0].plural);
    assert.equal(3, entities[0].attributes.length);
    assert.equal(0, entities[0].references.length);
    assert.equal('Task', entities[1].name);
    assert.equal('Tasks', entities[1].plural);
    assert.equal(4, entities[1].attributes.length);
    assert.equal(2, entities[1].references.length);

    var entities = Toolkit.loadEntities(__dirname + '/../example1/');

    assert.equal(2, entities.length);
    assert.equal('Label', entities[0].name);
    assert.equal('Labels', entities[0].plural);
    assert.equal(3, entities[0].attributes.length);
    assert.equal(0, entities[0].references.length);
    assert.equal('Task', entities[1].name);
    assert.equal('Tasks', entities[1].plural);
    assert.equal(4, entities[1].attributes.length);
    assert.equal(2, entities[1].references.length);

    assert.done();
  },
  'static readXMLDirectory()': function(assert) {
    assert.equal(true, Toolkit.readXMLDirectory instanceof Function);

    var files = Toolkit.readXMLDirectory(__dirname + '/../example1/');

    assert.equal(2, files.length);
    assert.equal(true, files[0].indexOf('Label.xml') !== -1);
    assert.equal(true, files[1].indexOf('Task.xml') !== -1);

    assert.done();
  },
  'static readXMLFile()': function(assert) {
    assert.equal(true, Toolkit.readXMLFile instanceof Function);

    var xml = Toolkit.readXMLFile(__dirname + '/../example1/Label.xml');

    assert.equal(true, xml instanceof Object);
    assert.equal(true, xml.entity !== undefined);
    assert.equal(true, xml.entity.$ !== undefined);

    assert.done();
  },
  'static typeOf()': function(assert) {
    assert.equal(true, Toolkit.typeOf instanceof Function);

    assert.equal('Object', Toolkit.typeOf({}));
    assert.equal('String', Toolkit.typeOf('foobar'));
    assert.equal('String', Toolkit.typeOf(String('foobar')));
    assert.equal('String', Toolkit.typeOf(new String('foobar')));

    assert.done();
  },
  'static values': function(assert) {
    assert.equal(true, Toolkit.values instanceof Function);

    var object = {
      foo: 'bar',
      john: 'doe'
    };
    var values = Toolkit.values(object);

    assert.equal('bar', values[0]);
    assert.equal('doe', values[1]);

    assert.done();
  }
};
