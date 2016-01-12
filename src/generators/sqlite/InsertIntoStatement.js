export default class InsertIntoStatement {

  constructor(entity, values) {
    this.entity = entity;
    this.values = values;
  }

  toString() {
    var keys = Object.keys(this.values);
    var self = this;
    var str = '';

    str += 'INSERT INTO ' + this.entity.plural + ' VALUES (\n';

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var attr = self.entity.attributes.find(function(e) {
        return (e.name === key);
      });

      if (attr && attr.defaultValueIsRaw)
        str += '  ' + this.values[key];
      else
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
