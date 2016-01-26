var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./../../src/Entity').default;

new Entity('Product', 'Products');
new Entity('User', 'Users');

module.exports = {
  'class': function(assert) {
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
  },
  'static add': function(assert) {
    var ent = null;

    assert.equal(true, Entity.add instanceof Function);

    assert.throws(function() {
      Entity.add(null);
    });
    assert.throws(function() {
      Entity.add();
    });
    assert.doesNotThrow(function() {
      Entity.add(new Entity('Foo', 'Bar'));
    });

    assert.done();
  },
  'static fromXMLObject': function(assert) {
    var ent = null;
    var obj = null;

    assert.equal(true, Entity.fromXMLObject instanceof Function);

    obj = {
      '$': {
        name: 'Task',
        plural: 'Tasks'
      },
      attributes: [{
        attribute: [{
          '$': {
            name: 'id',
            type: 'Integer',
            required: 'true',
            'primary-key': 'true'
          }
        }, {
          '$': {
            name: 'number',
            type: 'Integer',
            default: '800'
          }
        }, {
          '$': {
            name: 'label',
            type: 'String',
            length: '255'
          }
        }, {
          '$': {
            name: 'description',
            type: 'String',
            default: ''
          }
        }, {
          '$': {
            name: 'completed',
            type: 'Boolean',
            optional: 'true',
            default: 'false'
          }
        }]
      }]
    };
    ent = Entity.fromXMLObject(obj);

    assert.equal('Task', ent.name);
    assert.equal('Tasks', ent.plural);
    assert.equal(5, ent.attributes.length);

    assert.done();
  },
  'static get': function(assert) {
    var ent = null;

    assert.equal(true, Entity.get instanceof Function);

    ent = Entity.get('User');
    assert.equal(true, ent instanceof Entity);
    assert.equal('User', ent.name);
    assert.equal('Users', ent.plural);
    assert.equal(0, ent.attributes.length);

    ent = Entity.get('Users');
    assert.equal(false, ent instanceof Entity);
    assert.equal(undefined, ent);

    assert.done();
  },
  'static getByPlural': function(assert) {
    var ent = null;

    assert.equal(true, Entity.getByPlural instanceof Function);

    ent = Entity.getByPlural('Users');
    assert.equal(true, ent instanceof Entity);
    assert.equal('User', ent.name);
    assert.equal('Users', ent.plural);
    assert.equal(0, ent.attributes.length);

    ent = Entity.getByPlural('User');
    assert.equal(false, ent instanceof Entity);
    assert.equal(undefined, ent);

    assert.done();
  },
  'addAttribute': function(assert) {
    var ent = new Entity('Account', 'Accounts');

    assert.equal(true, ent.addAttribute instanceof Function);

    assert.throws(function() {
      ent.addAttribute(null);
    });
    assert.throws(function() {
      ent.addAttribute();
    });
    assert.equal(0, ent.attributes.length);
    assert.doesNotThrow(function() {
      ent.addAttribute({});
    });
    assert.equal(1, ent.attributes.length);

    assert.done();
  },
  'addReference': function(assert) {
    var ent = new Entity('Account', 'Accounts');

    assert.equal(true, ent.addReference instanceof Function);

    assert.throws(function() {
      ent.addReference(null);
    });
    assert.throws(function() {
      ent.addReference();
    });
    assert.equal(0, ent.references.length);
    assert.doesNotThrow(function() {
      ent.addReference({});
    });
    assert.equal(1, ent.references.length);

    assert.done();
  }
};
