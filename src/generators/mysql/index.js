import AbstractSQLGenerator from './../AbstractSQLGenerator';
import InsertIntoStatement from './../InsertIntoStatement';
import Random from './../../Random';

export default class MySQLGenerator extends AbstractSQLGenerator {

  constructor(options) {
    super(options);
    this.name = 'mysql';
  }

  generate() {
    if (!this.options['db-name'])
      throw 'You must specify a database name using the --db-name argument.';
    else if (this.options['db-name'].match(/.*-.*/))
      throw 'Mysql does not allow dashes in databases names.';

    super.generate();
  }

  getAllowedOptions() {
    var opts = super.getAllowedOptions();

    opts['db-name'] = 'The database name.';
    opts['user'] = 'Optional. The database user. Default is "root".';

    return opts;
  }

  getAutoIncrementString() {
    return 'AUTO_INCREMENT';
  }

  getContent(fileName) {
    if (~fileName.indexOf('create-database'))
      return 'CREATE DATABASE IF NOT EXISTS ' + this.options['db-name'] + ';\n'
        + 'USE ' + this.options['db-name'] + ';\n\n'
        + super.getContent(fileName);
    else if (~fileName.indexOf('drop-database'))
      return 'USE ' + this.options['db-name'] + ';\n\n'
        + super.getContent(fileName)
        + 'DROP DATABASE ' + this.options['db-name'] + ';\n';
    else if (~fileName.indexOf('.sql'))
      return 'USE ' + this.options['db-name'] + ';\n\n'
        + super.getContent(fileName);
    else
      return super.getContent(fileName);
  }

  getExecuteScriptContent() {
    var userName = 'root';

    if (typeof this.options['user'] === 'string')
      userName = this.options['user'];

    return '#!/bin/bash\n\n'
      + 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/drop-database.sql\n'
      + 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/create-database.sql\n'
      + 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/insert-into-database.sql\n';
  }

  toSQLType(attr) {
    var res = null;

    switch (attr.type) {
      case 'Integer': {
        res = 'INT';
      }
      break;
      case 'String': {
        if (attr.maxLength)
          res = 'VARCHAR(' + attr.maxLength + ')';
        else
          res = 'VARCHAR(255)';
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
        res = String(attr.defaultValue).toUpperCase();
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
