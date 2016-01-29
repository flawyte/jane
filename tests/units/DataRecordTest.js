var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var DataRecord = require('./../../src/DataRecord').default;
var InsertIntoStatement = require('./../../src/generators/InsertIntoStatement').default;

module.exports = {
  'class': function(assert) {
    var rec = new DataRecord();

    assert.equal(true, rec instanceof DataRecord);
    assert.equal(true, rec instanceof Object);

    assert.done();
  },
  'static fromXMLObject': function(assert) {
    assert.equal(true, DataRecord.fromXMLObject instanceof Function);

    var rec = null;

    rec = DataRecord.fromXMLObject(null, {
      '$': {
        name: 'Headphones'
      }
    });
    assert.equal(null, rec.entity);
    assert.equal(1, Object.keys(rec.values).length);

    rec = DataRecord.fromXMLObject({}, {
      '$': {
        name: 'TV Ultra HD 4K',
        category: 'name:TVs'
      }
    });
    assert.deepEqual({}, rec.entity);
    assert.equal(2, Object.keys(rec.values).length);

    assert.done();
  },
  'toSQLStatement': function(assert) {
    assert.equal(true, DataRecord.fromXMLObject instanceof Function);

    var stmt = null;

    stmt = DataRecord.fromXMLObject({
      plural: 'Tasks'
    }, {
      '$': {
        name: 'Headphones'
      }
    }).toSQLStatement(null);
    assert.equal(true, stmt instanceof InsertIntoStatement);
    assert.equal(null, stmt.generator);
    assert.equal('Tasks', stmt.entity.plural);
    assert.equal(1, Object.keys(stmt.values).length);

    stmt = DataRecord.fromXMLObject({
      plural: 'Tasks'
    }, {
      '$': {
        name: 'Headphones'
      }
    }).toSQLStatement({});
    assert.equal(true, stmt instanceof InsertIntoStatement);
    assert.deepEqual({}, stmt.generator);
    assert.equal('Tasks', stmt.entity.plural);
    assert.equal(1, Object.keys(stmt.values).length);

    assert.done();
  }
};
