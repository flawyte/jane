import AbstractSQLGenerator from './../AbstractSQLGenerator';
import InsertIntoStatement from './../InsertIntoStatement';
import Random from './../../Random';
import Toolkit from './../../Toolkit';

export default class SQLiteGenerator extends AbstractSQLGenerator {

  constructor(options) {
    super(options);
    this.name = 'sqlite';
  }

  createColumnPrimaryKey(name) {
    return name + ' INTEGER PRIMARY KEY AUTOINCREMENT';
  }

  getAllowedOptions() {
    var opts = super.getAllowedOptions();

    opts['db-name'] = 'Optional. The database file name. Default is "data.db".';

    return opts;
  }

  getAutoIncrementString() {
    return 'AUTOINCREMENT';
  }

  getExecuteScriptContent() {
    var dbName = 'data.db';
    var fileName = (this.entities.length === 1) ? 'table-' + this.entities[0].plural.toLowerCase() : 'database';

    if (typeof this.options['db-name'] === 'string')
      dbName = this.options['db-name'];

    return '#!/bin/bash\n\n'
      + 'sqlite3 `pwd`/`dirname $0`/' + dbName + ' < `pwd`/`dirname $0`/drop-' + fileName + '.sql\n'
      + 'sqlite3 `pwd`/`dirname $0`/' + dbName + ' < `pwd`/`dirname $0`/create-' + fileName + '.sql\n'
      + 'sqlite3 `pwd`/`dirname $0`/' + dbName + ' < `pwd`/`dirname $0`/insert-into-' + fileName + '.sql\n';
  }

  toSQLType(attr) {
    var res = null;

    switch (attr.type) {
      case 'String': {
        res = 'VARCHAR';
      }
      break;
      case 'Time': {
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
      case 'Time': {
        res = '"' + new Date(attr.defaultValue).toLocaleTimeString(Toolkit.getLocale(), { hour12: false }) + '"';
      }
      break;
    }

    return res;
  }
}
