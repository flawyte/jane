import AbstractSQLGenerator from './../AbstractSQLGenerator';
import InsertIntoStatement from './../InsertIntoStatement';
import Random from './../../Random';

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

    super.generate();
  }

  getAllowedOptions() {
    var opts = super.getAllowedOptions();

    opts['db-name'] = 'The database name.';

    return opts;
  }

  getContent(fileName) {
    if (~fileName.indexOf('create-database'))
      return 'CREATE DATABASE ' + this.options['db-name'].toLowerCase() + ';\n'
        + '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'
        + super.getContent(fileName);
    else if (~fileName.indexOf('drop-database'))
      return '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'
        + super.getContent(fileName)
        + '\\connect postgres;\n'
        + 'DROP DATABASE ' + this.options['db-name'].toLowerCase() + ';\n';
    else
      return '\\connect ' + this.options['db-name'].toLowerCase() + ';\n\n'
        + super.getContent(fileName);
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
    }

    return res;
  }
}
