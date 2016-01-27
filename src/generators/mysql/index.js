import AbstractSQLGenerator from './../AbstractSQLGenerator';
import Toolkit from './../../Toolkit';

export default class MySQLGenerator extends AbstractSQLGenerator {

  constructor(options = {}) {
    super(options);
    this.name = 'mysql';
  }

  connectDatabase(name) {
    return 'USE ' + name + ';';
  }

  createColumnPrimaryKey(name) {
    return name + ' INT PRIMARY KEY AUTO_INCREMENT';
  }

  createDatabase(name) {
    return 'CREATE DATABASE IF NOT EXISTS ' + name + ';';
  }

  dropDatabase(name) {
    return '\nDROP DATABASE ' + name + ';';
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
    var str = '';

    if (~fileName.indexOf('create-database'))
      str += this.createDatabase(this.options['db-name']) + '\n';
    if (~fileName.indexOf('.sql'))
      str += this.connectDatabase(this.options['db-name']) + '\n\n';

    str += super.getContent(fileName);

    if (~fileName.indexOf('drop-database'))
      str += this.dropDatabase(this.options['db-name']) + '\n';

    return str;
  }

  getExecuteScriptContent() {
    var content = '#!/bin/bash\n\n';
    var fileName = (this.entities.length === 1) ? 'table-' + this.entities[0].plural.toLowerCase() : 'database';
    var userName = 'root';

    if (typeof this.options['user'] === 'string')
      userName = this.options['user'];

    if (this.options.data)
        content += 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/insert-into-' + fileName +'-default-data.sql';
    else {
      if (this.options.drop) {
        content += 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/drop-' + fileName +'.sql';
      }
      if (this.options.create) {
        content += '\n';
        content += 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/create-' + fileName +'.sql';
      }
      if (this.options['insert-into']) {
        content += '\n';
        content += 'mysql -h localhost -u\'' + userName + '\' -p < `pwd`/`dirname $0`/insert-into-' + fileName +'.sql';
      }
    }

    return content + '\n';
  }

  toSQLType(attr) {
    var res = null;

    if (attr.defaultValueIsFunction) {
      if (attr.defaultValue === 'DATE()' || attr.defaultValue === 'TIME()')
        console.log('Warning: MySQL does not allow functions as a default values for columns except CURRENT_TIMESTAMP for TIMESTAMP (and DATETIME since MySQL 5.6.5) columns. Therefore, attributes of type ' + attr.type + ' are converted to DATETIME columns.');
        return 'DATETIME';
    }

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
      if (attr.defaultValue !== 'DATE()' && attr.defaultValue !== 'TIME()')
        return super.toSQLValue(attr, createStatement);
      else
        return 'CURRENT_TIMESTAMP';
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
      case 'Time': {
        res = '"' + new Date(attr.defaultValue).toLocaleTimeString(Toolkit.getLocale(), { hour12: false }) + '"';
      }
      break;
    }

    return res;
  }
}
