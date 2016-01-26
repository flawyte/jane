import AbstractSQLGenerator from './../AbstractSQLGenerator';
import Toolkit from './../../Toolkit';

export default class PostgreSQLGenerator extends AbstractSQLGenerator {

  constructor(options) {
    super(options);
    this.name = 'postgresql';
  }

  connectDatabase(name) {
    return '\\connect ' + name + ';';
  }

  createColumnPrimaryKey(name) {
    return name + ' SERIAL PRIMARY KEY';
  }

  createDatabase(name) {
    return 'CREATE DATABASE ' + name + ';';
  }

  dropDatabase(name) {
    return '\\connect postgres;\nDROP DATABASE ' + name + ';';
  }

  escapeColumnName(name) {
    if (name === 'user')
      return '"user"';
    else
      return super.escapeColumnName(name);
  }

  generate() {
    if (!this.options['db-name'])
      throw 'You must specify a database name using the --db-name argument.';
    if (!this.options['user'])
      throw 'You must specify a database user using the --user argument.';

    super.generate();
  }

  getAllowedOptions() {
    var opts = super.getAllowedOptions();

    opts['db-name'] = 'The database name.';
    opts['user'] = 'The database user.';

    return opts;
  }

  getContent(fileName) {
    var str = '';

    this.options['db-name'] = this.options['db-name'].toLowerCase();

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
        content += 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/insert-into-' + fileName +'-default-data.sql';
    else {
      if (this.options.drop) {
        content += 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/drop-' + fileName + '.sql';
      }
      if (this.options.create) {
        content += '\n';
        content += 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/create-' + fileName + '.sql';
      }
      if (this.options['insert-into']) {
        content += '\n';
        content += 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/insert-into-' + fileName + '.sql';
      }
    }

    return content + '\n';
  }

  toSQLType(attr) {
    var res = null;

    if (attr.primaryKey)
      return 'SERIAL';

    switch (attr.type) {
      case 'DateTime': {
        res = 'TIMESTAMP';
      }
      break;
      case 'String': {
        if (attr.maxLength)
          res = 'VARCHAR(' + attr.maxLength + ')';
        else
          res = 'TEXT';
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
        res = "'" + attr.defaultValue + "'";
      }
      break;
      case 'Time': {
        res = "'" + new Date(attr.defaultValue).toLocaleTimeString(Toolkit.getLocale(), { hour12: false }) + "'";
      }
      break;
    }

    return res;
  }
}
