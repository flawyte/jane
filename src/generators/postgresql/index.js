import AbstractSQLGenerator from './../AbstractSQLGenerator';
import InsertIntoStatement from './../InsertIntoStatement';
import Random from './../../Random';
import Toolkit from './../../Toolkit';

export default class PostgreSQLGenerator extends AbstractSQLGenerator {

  constructor(options) {
    super(options);
    this.name = 'postgresql';
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

    if (~fileName.indexOf('create-database'))
      str += 'CREATE DATABASE ' + this.options['db-name'].toLowerCase() + ';\n'
    if (~fileName.indexOf('.sql'))
      str += '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'

    str += super.getContent(fileName);

    if (~fileName.indexOf('drop-database')) {
      str += '\\connect postgres;\n';
      str += 'DROP DATABASE ' + this.options['db-name'].toLowerCase() + ';\n';
    }

    return str;

    if (~fileName.indexOf('create-database'))
      return 'CREATE DATABASE ' + this.options['db-name'].toLowerCase() + ';\n'
        + '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'
        + super.getContent(fileName);
    else if (~fileName.indexOf('drop-database'))
      return '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'
        + super.getContent(fileName)
        + '\\connect postgres;\n'
        + 'DROP DATABASE ' + this.options['db-name'].toLowerCase() + ';\n';
    else if (~fileName.indexOf('.sql'))
      return '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'
        + super.getContent(fileName);
    else
      return super.getContent(fileName);
  }

  getExecuteScriptContent() {
    var fileName = (this.entities.length === 1) ? 'table-' + this.entities[0].plural.toLowerCase() : 'database';

    return '#!/bin/bash\n\n'
      + 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/drop-' + fileName + '.sql\n'
      + 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/create-' + fileName + '.sql\n'
      + 'psql postgres ' + this.options.user + ' < `pwd`/`dirname $0`/insert-into-' + fileName + '.sql\n';
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
