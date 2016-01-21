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

    assert.equal(undefined, attr.defaultValue);
    assert.equal(undefined, attr.maxLength);
    assert.equal('email', attr.name);
    assert.equal(false, attr.nullable);
    assert.equal(false, attr.optional);
    assert.equal(false, attr.primaryKey);
    assert.equal(true, attr.required);
    assert.equal('String', attr.type);

    assert.done();
  },
  'static fromXMLObject': function(assert) {
    var attr = null;
    var obj = null;

    assert.equal(true, Attribute.fromXMLObject instanceof Function);

    obj = {
      '$': {
        name: 'id',
        nullable: 'true',
        type: 'Integer',
        'primary-key': 'true'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal(undefined, attr.defaultValue);
    assert.equal(undefined, attr.maxLength);
    assert.equal('id', attr.name);
    assert.equal(false, attr.nullable);
    assert.equal(false, attr.optional);
    assert.equal(true, attr.primaryKey);
    assert.equal(true, attr.required);
    assert.equal('Integer', attr.type);

    obj = {
      '$': {
        name: 'name',
        type: 'String',
        default: 'null',
        'max-length': '255'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal(null, attr.defaultValue);
    assert.equal(255, attr.maxLength);
    assert.equal('name', attr.name);
    assert.equal(true, attr.nullable);
    assert.equal(true, attr.optional);
    assert.equal(false, attr.primaryKey);
    assert.equal(false, attr.required);
    assert.equal('String', attr.type);

    assert.done();
  }
};
