import AbstractSQLGenerator from './../AbstractSQLGenerator';
import InsertIntoStatement from './../InsertIntoStatement';
import Random from './../../Random';

export default class SQLiteGenerator extends AbstractSQLGenerator {

  constructor(options) {
    super(options);
    this.name = 'sqlite';
  }

  getAutoIncrementString() {
    return 'AUTOINCREMENT';
  }

  getAllowedOptions() {
    return {
      'create': 'For each entity, will generate the SQL query to create the related database table.',
      'drop': 'For each entity, will generate the SQL query to drop the related database table.',
      'insert-into <rows-count>': 'For each entity, will generate <rows-count> SQL queries to insert randomly generated data in the related database table.'
    };
  }

  toSQLType(attr) {
    var res = null;

    switch (attr.type) {
      case 'String': {
        res = 'VARCHAR';
      }
      break;
      default: {
        res = super.toSQLType(attr);
      }
      break;
    }

    return res;
  }

  toSQLValue(value, isDefault = false) {
    var res = null;

    switch (value) {
      case true:
      case false:
        res = Number(value);
      break;
      case 'DATE()':
      case 'DATETIME()':
      case 'TIME()':
      default: {
        res = value;
      }
      break;
    }

    if (isDefault)
      res = '(' + res + ')';

    return res;
  }
}
