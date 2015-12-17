var traceur = require('traceur');
 
traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./../../src/Entity').default;

module.exports = {
  class: function(assert) {
    var ent = new Entity();

    assert.equal(true, ent instanceof Entity);
    assert.equal(true, ent instanceof Object);

    assert.done();
  },
  'attrs default values': function(assert) {
    var ent = new Entity('Task');

    assert.equal('Task', ent.name);
    assert.equal(null, ent.plural);

    assert.done();
  },
  'attrs values': function(assert) {
    var ent = new Entity('Task', 'Tasks');

    assert.equal('Task', ent.name);
    assert.equal('Tasks', ent.plural);

    ent.name = 'Screen';
    ent.plural = 'Screens';

    assert.equal('Screen', ent.name);
    assert.equal('Screens', ent.plural);

    assert.done();
  }
};
