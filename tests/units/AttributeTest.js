var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Attribute = require('./../../src/Attribute').default;

module.exports = {
  class: function(assert) {
    var attr = new Attribute();

    assert.equal(true, attr instanceof Attribute);
    assert.equal(true, attr instanceof Object);

    assert.done();
  },
  'attrs default values': function(assert) {
    var attr = new Attribute('email', 'String');

    assert.equal(attr.name, 'email');
    assert.equal(attr.optional, true);
    assert.equal(attr.plural, null);
    assert.equal(attr.primaryKey, false);
    assert.equal(attr.type, 'String');

    assert.done();
  },
  'static fromXMLObject': function(assert) {
    var attr = null;
    var obj = null;

    assert.equal(true, Attribute.fromXMLObject instanceof Function);

    obj = {
      '$': {
        name: 'id',
        type: 'Integer',
        required: 'true',
        'primary-key': 'true'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal('id', attr.name);
    assert.equal('Integer', attr.type);
    assert.equal(false, attr.optional);
    assert.equal(true, attr.primaryKey);

    obj = {
      '$': {
        name: 'name',
        type: 'String',
        optional: 'true',
        'primary-key': 'false'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal('name', attr.name);
    assert.equal('String', attr.type);
    assert.equal(true, attr.optional);
    assert.equal(false, attr.primaryKey);

    assert.done();
  }
};
