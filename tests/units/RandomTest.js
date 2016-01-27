require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Random = require('./../../src/Random').default;
var Jane = require('./../../src/Jane').default;

Jane.init(require);

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
    assert.equal(false, isNaN(val.getTime()));
    val = Random.date();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));
    val = Random.date();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));

    assert.done();
  },
  'static datetime': function(assert) {
    var val;

    assert.equal(true, Random.datetime instanceof Function);
    val = Random.datetime();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));
    val = Random.datetime();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));
    val = Random.datetime();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));

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
  'static float': function(assert) {
    var val;

    assert.equal(true, Random.float instanceof Function);

    val = Random.float();
    assert.equal(true, (val >= 0) && (val < 1000000));
    assert.equal(true, (typeof val === 'number'));
    val = Random.float();
    assert.equal(true, (val >= 0) && (val < 1000000));
    assert.equal(true, (typeof val === 'number'));
    val = Random.float();
    assert.equal(true, (val >= 0) && (val < 1000000));
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
  'static string (min/max length)': function(assert) {
    var val;

    assert.equal(true, Random.string instanceof Function);

    // undefined
    val = Random.string();
    assert.equal("string", typeof val);

    // exactLength
    val = Random.string({ exactLength: 3 });
    assert.equal("string", typeof val);
    assert.equal(3, val.length);
    val = Random.string({ exactLength: 16 });
    assert.equal("string", typeof val);
    assert.equal(16, val.length);

    // maxLength && minLength
    val = Random.string({ maxLength: 16, minLength: 14 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length > 13) && (val.length < 17));
    val = Random.string({ maxLength: 16, minLength: 14 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length > 13) && (val.length < 17));
    val = Random.string({ maxLength: 16, minLength: 14 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length > 13) && (val.length < 17));

    // maxLength
    val = Random.string({ maxLength: 2 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length < 3));
    val = Random.string({ maxLength: 499 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length < 500));

    // minLength
    val = Random.string({ minLength: 5 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length > 5));
    val = Random.string({ minLength: 500 });
    assert.equal("string", typeof val);
    assert.equal(true, (val.length > 499));

    assert.done();
  },
  'static string (genres)': function(assert) {
    var val;

    assert.equal(true, Random.string instanceof Function);

    val = Random.string({ genre: 'foobar' });
    assert.equal(null, val);

    // address
    val = Random.string({ genre: 'address' });
    assert.equal("string", typeof val);

    // city
    val = Random.string({ genre: 'city' });
    assert.equal("string", typeof val);

    // country_code
    val = Random.string({ genre: 'country_code' });
    assert.equal("string", typeof val);

    // country
    val = Random.string({ genre: 'country' });
    assert.equal("string", typeof val);

    // email
    val = Random.string({ genre: 'email' });
    assert.equal("string", typeof val);

    // first_name
    val = Random.string({ genre: 'first_name' });
    assert.equal("string", typeof val);

    // last_name
    val = Random.string({ genre: 'last_name' });
    assert.equal("string", typeof val);

    // md5
    val = Random.string({ genre: 'md5' });
    assert.equal("string", typeof val);

    // paragraph
    val = Random.string({ genre: 'paragraph' });
    assert.equal("string", typeof val);

    // postal_code
    val = Random.string({ genre: 'postal_code' });
    assert.equal("string", typeof val);

    // phone
    val = Random.string({ genre: 'phone' });
    assert.equal("string", typeof val);

    // sha1
    val = Random.string({ genre: 'sha1' });
    assert.equal("string", typeof val);

    assert.done();
  },
  'static time': function(assert) {
    var val;

    assert.equal(true, Random.time instanceof Function);
    val = Random.time();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));
    val = Random.time();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));
    val = Random.time();
    assert.equal(true, (val instanceof Date));
    assert.equal(false, isNaN(val.getTime()));

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
