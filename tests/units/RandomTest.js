require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Random = require('./../../src/Random').default;

module.exports = {
  'static boolean': function(assert) {
    var val;

    assert.equal(true, Random.boolean instanceof Function);
    val = Random.boolean();
    assert.equal(true, (val === true) || (val === false));
    val = Random.boolean();
    assert.equal(true, (val === true) || (val === false));
    val = Random.boolean();
    assert.equal(true, (val === true) || (val === false));

    assert.done();
  },
  'static integer': function(assert) {
    var val;

    assert.equal(true, Random.integer instanceof Function);
    val = Random.integer();
    assert.equal(true, (val >= 1) && (val <= 10));
    val = Random.integer(11, 12);
    assert.equal(true, (val >= 11) && (val <= 12));
    val = Random.integer(100, 150);
    assert.equal(true, (val >= 100) && (val <= 150));

    assert.done();
  },
  'static string': function(assert) {
    var val;

    assert.equal(true, Random.string instanceof Function);
    val = Random.string();
    assert.equal("string", typeof val);
    val = Random.string();
    assert.equal("string", typeof val);
    val = Random.string();
    assert.equal("string", typeof val);

    assert.done();
  },
  'static value': function(assert) {
    var val;

    assert.equal(true, Random.value instanceof Function);
    val = Random.value({ type: 'Boolean' });
    assert.equal("boolean", typeof val);
    val = Random.value({ type: 'Integer' });
    assert.equal("number", typeof val);
    val = Random.value({ type: 'String' });
    assert.equal("string", typeof val);

    assert.done();
  }
};
