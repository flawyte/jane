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
  'static date': function(assert) {
    var val;

    assert.equal(true, Random.date instanceof Function);
    val = Random.date();
    assert.equal(true, (val instanceof Date));
    val = Random.date();
    assert.equal(true, (val instanceof Date));
    val = Random.date();
    assert.equal(true, (val instanceof Date));

    assert.done();
  },
  'static decimal': function(assert) {
    var val;

    assert.equal(true, Random.decimal instanceof Function);
    assert.throws(function() {
        Random.decimal(2, 2);
    });
    assert.throws(function() {
        Random.decimal(2, 3);
    });
    val = Random.decimal();
    assert.equal(true, (val >= 0) && (val < 100000));
    assert.equal(true, (typeof val === 'number'));
    val = Random.decimal(3, 2);
    assert.equal(true, (val >= 0) && (val < 10));
    assert.equal(true, (typeof val === 'number'));
    val = Random.decimal(5, 2);
    assert.equal(true, (val >= 0) && (val < 1000));
    assert.equal(true, (typeof val === 'number'));

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
    val = Random.value({
      type: 'Boolean',
      isValueValid: function() {
          return true;
      }
    });
    assert.equal("boolean", typeof val);
    val = Random.value({
      type: 'Integer',
      isValueValid: function() {
          return true;
      }
    });
    assert.equal("number", typeof val);
    val = Random.value({
      type: 'String',
      isValueValid: function() {
          return true;
      }
    });
    assert.equal("string", typeof val);

    assert.done();
  }
};
