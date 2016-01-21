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

    return opts;
  }

  getAutoIncrementString() {
    return 'AUTO_INCREMENT';
  }

  getContent(fileName) {
    return 'CREATE DATABASE IF NOT EXISTS ' + this.options['db-name'] + ';\n'
      + 'USE ' + this.options['db-name'] + ';\n\n'
      + super.getContent(fileName);
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

  toSQLValue(value) {
    var res = null;

    switch (value) {
      case 'DATE()': {
        res = 'CURRENT_DATE'; // sql value == js value
      }
      break;
      case 'DATETIME()': {
        res = 'CURRENT_TIMESTAMP'; // sql value == js value
      }
      break;
      case 'TIME()': {
        res = 'CURRENT_TIME'; // sql value == js value
      }
      break;
      case true:
      case false:
        res = String(value).toUpperCase();
      break;
      default: {
        res = value;
      }
      break;
    }

    return res;
  }
}
