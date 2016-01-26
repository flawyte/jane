import Entity from './Entity';
import InsertIntoStatement from './generators/InsertIntoStatement';

export default class DataRecord {

  static fromXMLObject(entity, obj) {
    var values = {};

    for (var key in obj.$) {
      values[key] = obj.$[key];
    }

    return new DataRecord(entity, values);
  }

  constructor(entity, values) {
    this.entity = entity;
    this.values = values;
  }

  toSQLStatement(generator) {
    if (generator.toSQLValue) {
      var keys = Object.keys(this.values);

      for (let key of keys) {
        var attr = this.entity.getAttributeByName(key);
        var type = attr ? attr.type : 'Integer'; // Attribute or Reference (then type is always 'Integer')

        this.values[key] = generator.toSQLValue({
          defaultValue: this.values[key],
          type: type
        });
      }
    }

    return new InsertIntoStatement(generator, this.entity, this.values);
  }
}
