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

  getExecuteScriptContent() {
    return '#!/bin/bash\n\n'
      + 'sqlite3 `pwd`/`dirname $0`/data.db < `pwd`/`dirname $0`/drop-database.sql\n'
      + 'sqlite3 `pwd`/`dirname $0`/data.db < `pwd`/`dirname $0`/create-database.sql\n'
      + 'sqlite3 `pwd`/`dirname $0`/data.db < `pwd`/`dirname $0`/insert-into-database.sql\n';
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

  toSQLValue(attr, createStatement = false) {
    var res = null;

    if (attr.defaultValueIsFunction) {
      return super.toSQLValue(attr, createStatement);
    }

    switch (attr.type) {
      case 'Boolean': {
        res = Number(attr.defaultValue);
      }
      break;
      case 'Date': {
        res = attr.defaultValue;
      }
      break;
      case 'DateTime': {
        res = attr.defaultValue;
      }
      break;
      case 'Decimal': {
        res = attr.defaultValue;
      }
      break;
      case 'Integer': {
        res = attr.defaultValue;
      }
      break;
      case 'String': {
        res = JSON.stringify(attr.defaultValue);
      }
      break;
    }

    return res;
  }
}
