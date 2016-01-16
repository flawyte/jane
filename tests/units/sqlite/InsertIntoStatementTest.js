require('traceur').require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

var Entity = require('./../../../src/Entity').default;
var InsertIntoStatement = require('./../../../src/generators/sqlite/InsertIntoStatement').default;

module.exports = {
  'toString': function(assert) {
    var stmt = new InsertIntoStatement(new Entity('Foobar', 'Foobars'), {
      count: 1234,
      body: "Lorem lipsum pirouette.",
      done: false,
      title: "Awesome Thing"
    });
    var res = 'INSERT INTO Foobars VALUES (\n  1234, /* count */\n  "Lorem lipsum pirouette.", /* body */\n  false, /* done */\n  "Awesome Thing" /* title */\n);';

    assert.equal(res, stmt.toString());
    assert.done();
  }
};
