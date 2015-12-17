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
  }
};
