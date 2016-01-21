require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./../../src/Entity').default;
var InsertIntoStatement = require('./../../src/generators/InsertIntoStatement').default;

module.exports = {
  'toString': function(assert) {
    var stmt = new InsertIntoStatement({
      escapeColumnName: function(val) {
        return val;
      }
    }, new Entity('Foobar', 'Foobars'), {
      count: 1234,
      body: JSON.stringify("Lorem lipsum pirouette."),
      done: false,
      title: JSON.stringify("Awesome Thing")
    });
    var res = 'INSERT INTO Foobars (count, body, done, title) VALUES (\n  1234, /* count */\n  "Lorem lipsum pirouette.", /* body */\n  false, /* done */\n  "Awesome Thing" /* title */\n);';

    assert.equal(res, stmt.toString());
    assert.done();
  }
};
