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
        type: 'Integer',
        'primary-key': 'true'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal(undefined, attr.defaultValue);
    assert.equal(false, attr.defaultValueIsFunction);
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
        'max-length': '3'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal(null, attr.defaultValue);
    assert.equal(false, attr.defaultValueIsFunction);
    assert.equal(3, attr.maxLength);
    assert.equal('name', attr.name);
    assert.equal(true, attr.nullable);
    assert.equal(true, attr.optional);
    assert.equal(false, attr.primaryKey);
    assert.equal(null, attr.regex);
    assert.equal(false, attr.required);
    assert.equal('String', attr.type);

    obj = {
      '$': {
        name: 'name',
        type: 'String',
        default: '2012-11-13'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal('2012-11-13', attr.defaultValue);
    assert.equal(false, attr.defaultValueIsFunction);
    assert.equal('name', attr.name);
    assert.equal(true, attr.nullable);
    assert.equal(true, attr.optional);
    assert.equal(false, attr.primaryKey);
    assert.equal(null, attr.regex);
    assert.equal(false, attr.required);
    assert.equal('String', attr.type);

    obj = {
      '$': {
        name: 'name',
        type: 'String',
        default: 'DATE()'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal('DATE()', attr.defaultValue);
    assert.equal(true, attr.defaultValueIsFunction);
    assert.equal('name', attr.name);
    assert.equal(true, attr.nullable);
    assert.equal(true, attr.optional);
    assert.equal(false, attr.primaryKey);
    assert.equal(null, attr.regex);
    assert.equal(false, attr.required);
    assert.equal('String', attr.type);

    obj = {
      '$': {
        name: 'name',
        type: 'String',
        'min-length': '8'
      }
    };
    attr = Attribute.fromXMLObject(obj);

    assert.equal(8, attr.minLength);
    assert.equal(undefined, attr.maxLength);
    assert.equal(8, attr.minLength);
    assert.equal('name', attr.name);
    assert.equal(false, attr.nullable);
    assert.equal(false, attr.optional);
    assert.equal(false, attr.primaryKey);
    assert.equal(null, attr.regex);
    assert.equal(true, attr.required);
    assert.equal('String', attr.type);

    assert.done();
  },
  'isValueValid': function(assert) {
    var attr = null;
    var obj = null;

    assert.equal(true, new Attribute().isValueValid instanceof Function);

    attr = new Attribute('completed', 'Boolean');
    assert.equal(true, attr.isValueValid(false));
    assert.equal(true, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(false, attr.isValueValid(123));
    assert.equal(false, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(false, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('signup_date', 'Date');
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(false, attr.isValueValid(123));
    assert.equal(false, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(true, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('signup_datetime', 'DateTime');
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(false, attr.isValueValid(123));
    assert.equal(false, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(true, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('number', 'Decimal');
    attr.precision = 6;
    attr.scale = 3;
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(true, attr.isValueValid(123));
    assert.equal(true, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(false, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('number', 'Float');
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(true, attr.isValueValid(123));
    assert.equal(true, attr.isValueValid(123.456));
    assert.equal(true, attr.isValueValid(123.456789));
    assert.equal(false, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('number', 'Integer');
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(true, attr.isValueValid(123));
    assert.equal(false, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(false, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('name', 'String');
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(true, attr.isValueValid('true'));
    assert.equal(false, attr.isValueValid(123));
    assert.equal(false, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(false, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    attr = new Attribute('updated_at', 'Time');
    assert.equal(false, attr.isValueValid(false));
    assert.equal(false, attr.isValueValid(true));
    assert.equal(false, attr.isValueValid('true'));
    assert.equal(false, attr.isValueValid(123));
    assert.equal(false, attr.isValueValid(123.456));
    assert.equal(false, attr.isValueValid(123.456789));
    assert.equal(true, attr.isValueValid(new Date()));
    assert.equal(false, attr.isValueValid(null));
    attr.nullable = true;
    assert.equal(true, attr.isValueValid(null));

    assert.done();
  }
};
