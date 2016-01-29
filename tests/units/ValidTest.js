require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Valid = require('./../../src/Valid').default;

module.exports = {
  'static boolean': function(assert) {
    assert.equal(true, Valid.boolean instanceof Function);

    assert.equal(true, Valid.boolean(false));
    assert.equal(true, Valid.boolean(true));
    assert.equal(false, Valid.boolean(new Date()));
    assert.equal(false, Valid.boolean(1.6));
    assert.equal(false, Valid.boolean(1));
    assert.equal(false, Valid.boolean('abcdef'));

    assert.done();
  },
  'static date': function(assert) {
    assert.equal(true, Valid.date instanceof Function);

    assert.equal(false, Valid.date(false));
    assert.equal(false, Valid.date(true));
    assert.equal(true, Valid.date(new Date()));
    assert.equal(true, Valid.date(new Date(132456789)));
    assert.equal(true, Valid.date(new Date('2012-11-13')));
    assert.equal(false, Valid.date(new Date('abcdef')));
    assert.equal(false, Valid.date(1.6));
    assert.equal(false, Valid.date(1));
    assert.equal(false, Valid.date('abcdef'));

    assert.done();
  },
  'static datetime': function(assert) {
    assert.equal(true, Valid.datetime instanceof Function);

    assert.equal(false, Valid.datetime(false));
    assert.equal(false, Valid.datetime(true));
    assert.equal(true, Valid.datetime(new Date()));
    assert.equal(true, Valid.datetime(new Date(132456789)));
    assert.equal(true, Valid.datetime(new Date('2012-11-13')));
    assert.equal(false, Valid.datetime(new Date('abcdef')));
    assert.equal(false, Valid.datetime(1.6));
    assert.equal(false, Valid.datetime(1));
    assert.equal(false, Valid.datetime('abcdef'));

    assert.done();
  },
  'static decimal': function(assert) {
    assert.equal(true, Valid.decimal instanceof Function);

    assert.equal(false, Valid.decimal(false));
    assert.equal(false, Valid.decimal(true));
    assert.equal(false, Valid.decimal(new Date()));
    assert.equal(true, Valid.decimal(1.6));
    assert.equal(true, Valid.decimal(1.23456, 9));
    assert.equal(true, Valid.decimal(1.23456, 6));
    assert.equal(false, Valid.decimal(1.23456, 3));
    assert.equal(true, Valid.decimal(1.23456, 9, 6));
    assert.equal(true, Valid.decimal(1.2345, 9, 8));
    assert.equal(true, Valid.decimal(1.2345678, 9, 7));
    assert.equal(false, Valid.decimal(1.23456789, 9, 7));
    assert.equal(false, Valid.decimal(123.456, 9, 7));
    assert.equal(false, Valid.decimal(1.23456, 9, 3));
    assert.equal(true, Valid.decimal(123.45, 9, 3));
    assert.equal(true, Valid.decimal(123.45, 9, 6));
    assert.equal(false, Valid.decimal(123.45, 9, 8));
    assert.equal(false, Valid.decimal('abcdef'));

    assert.throws(function() {
      Valid.decimal(123, 3, 3);
    });

    assert.done();
  },
  'static float': function(assert) {
    assert.equal(true, Valid.float instanceof Function);

    assert.equal(false, Valid.float(false));
    assert.equal(false, Valid.float(true));
    assert.equal(false, Valid.float(new Date()));
    assert.equal(true, Valid.float(1.6));
    assert.equal(true, Valid.float(1));
    assert.equal(false, Valid.float('abcdef'));

    assert.done();
  },
  'static genre': function(assert) {
    assert.equal(true, Valid.genre instanceof Function);

    assert.equal(false, Valid.genre());
    assert.equal(false, Valid.genre(null));
    assert.equal(false, Valid.genre('foobar'));

    assert.equal(true, Valid.genre('address'));
    assert.equal(true, Valid.genre('city'));
    assert.equal(true, Valid.genre('country_code'));
    assert.equal(true, Valid.genre('country'));
    assert.equal(true, Valid.genre('email'));
    assert.equal(true, Valid.genre('first_name'));
    assert.equal(true, Valid.genre('last_name'));
    assert.equal(true, Valid.genre('md5'));
    assert.equal(true, Valid.genre('paragraph'));
    assert.equal(true, Valid.genre('postal_code'));
    assert.equal(true, Valid.genre('phone'));
    assert.equal(true, Valid.genre('sha1'));
    assert.equal(true, Valid.genre('word'));

    assert.done();
  },
  'static integer': function(assert) {
    assert.equal(true, Valid.integer instanceof Function);

    assert.equal(false, Valid.integer(false));
    assert.equal(false, Valid.integer(true));
    assert.equal(false, Valid.integer(new Date()));
    assert.equal(false, Valid.integer(1.6));
    assert.equal(true, Valid.integer(1));
    assert.equal(false, Valid.integer('abcdef'));

    assert.done();
  },
  'static string': function(assert) {
    assert.equal(true, Valid.string instanceof Function);

    assert.equal(false, Valid.string(false));
    assert.equal(false, Valid.string(true));
    assert.equal(false, Valid.string(new Date()));
    assert.equal(false, Valid.string(1.6));
    assert.equal(false, Valid.string(1));
    assert.equal(true, Valid.string('abcdef'));

    assert.done();
  },
  'static time': function(assert) {
    assert.equal(true, Valid.time instanceof Function);

    assert.equal(false, Valid.time(false));
    assert.equal(false, Valid.time(true));
    assert.equal(true, Valid.time(new Date()));
    assert.equal(true, Valid.time(new Date(132456789)));
    assert.equal(true, Valid.time(new Date('2012-11-13')));
    assert.equal(false, Valid.time(new Date('abcdef')));
    assert.equal(false, Valid.time(1.6));
    assert.equal(false, Valid.time(1));
    assert.equal(false, Valid.time('abcdef'));

    assert.done();
  }
};
