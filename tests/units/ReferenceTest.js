var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Reference = require('./../../src/Reference').default;

module.exports = {
  class: function(assert) {
    var ref = new Reference();

    assert.equal(true, ref instanceof Reference);
    assert.equal(true, ref instanceof Object);

    assert.done();
  },
  'static fromXMLObject': function(assert) {
    var obj;
    var ref;

    assert.equal(true, Reference.fromXMLObject instanceof Function);

    obj = {
      '$': {
        entity: 'Label',
        attribute: 'id',
        as: 'label'
      }
    };
    ref = Reference.fromXMLObject(obj);

    assert.equal('label', ref.alias);
    assert.equal('id', ref.attribute);
    assert.equal('Label', ref.entity);

    assert.done();
  }
};
