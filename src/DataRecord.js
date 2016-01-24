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
    return new InsertIntoStatement(generator, this.entity, this.values);
  }
}
