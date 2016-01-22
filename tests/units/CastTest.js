require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Cast = require('./../../src/Cast').default;
var Toolkit = require('./../../src/Toolkit').default;

module.exports = {
  'static boolean': function(assert) {
    assert.equal(true, Cast.boolean instanceof Function);

    assert.equal(false, Cast.boolean('false'));
    assert.equal(true, Cast.boolean('true'));

    assert.done();
  },
  'static date': function(assert) {
    assert.equal(true, Cast.date instanceof Function);

    val = Cast.date('2012-11-10');
    assert.equal('Date', Toolkit.typeOf(val));
    assert.equal(10, val.getDate());
    assert.equal(11, val.getMonth());
    assert.equal(2012, val.getFullYear());

    assert.done();
  },
  'static datetime': function(assert) {
    assert.equal(true, Cast.datetime instanceof Function);

    val = Cast.datetime('2012-11-10 12:34:56.789');
    assert.equal('Date', Toolkit.typeOf(val));
    assert.equal(10, val.getDate());
    assert.equal(11, val.getMonth());
    assert.equal(2012, val.getFullYear());
    assert.equal(12, val.getHours());
    assert.equal(34, val.getMinutes());
    assert.equal(56, val.getSeconds());
    assert.equal(789, val.getMilliseconds());

    assert.done();
  },
  'static decimal': function(assert) {
    assert.equal(true, Cast.decimal instanceof Function);

    val = Cast.decimal('123');
    assert.equal('Number', Toolkit.typeOf(val));
    assert.equal(123, val);
    val = Cast.decimal('123.456');
    assert.equal('Number', Toolkit.typeOf(val));
    assert.equal(123.456, val);

    assert.done();
  },
  'static integer': function(assert) {
    assert.equal(true, Cast.integer instanceof Function);

    val = Cast.integer('123');
    assert.equal('Number', Toolkit.typeOf(val));
    assert.equal(123, val);
    val = Cast.integer('123.456');
    assert.equal('Number', Toolkit.typeOf(val));
    assert.equal(123, val);

    assert.done();
  },
  'static string': function(assert) {
    var val;

    assert.equal(true, Cast.string instanceof Function);

    val = Cast.string('2012-11-13');
    assert.equal('String', Toolkit.typeOf(val));
    assert.equal('2012-11-13', val);
    val = Cast.string('123.456');
    assert.equal('String', Toolkit.typeOf(val));
    assert.equal('123.456', val);

    assert.done();
  }
};
