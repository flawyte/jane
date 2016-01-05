export default class InsertIntoStatement {

  constructor(tableName, values) {
    this.tableName = tableName;
    this.values = values;
  }

  toString() {
    var keys = Object.keys(this.values);
    var str = '';

    str += 'INSERT INTO ' + this.tableName + ' VALUES (\n';

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      str += '  ' + JSON.stringify(this.values[key]);

      if (i < (keys.length - 1))
        str += ',';

      str += ' /* ' + key + ' */';
      str += '\n';
    }

    str += ');';

    return str;
  }
}
