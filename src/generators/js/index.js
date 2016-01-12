import AbstractGenerator from './../AbstractGenerator';

export default class JSGenerator extends AbstractGenerator {

  constructor(options) {
    super(options);
    this.name = 'js';
    this.results = {};
  }

  generate() {
    var self = this;

    this.entities.forEach(function(e) {
      var str = '';

      e.attributes.sort(function(a, b) {
        if (a.required && b.optional)
          return -1;
        else if (a.optional && b.required)
          return 1;
        else
          return 0;
      });

      str += 'export default class ' + e.name + ' {\n';
      str += '\n';
      str += self.generateConstructor(e);
      str += '\n}';
      str += '\n';

      self.results[e.name] = str;
    });
  }

  generateConstructor(e) {
    var str = '';

    this.indentation++;
    str += this.indent() + 'constructor(' + this.generateConstructorParameters(e) + ') {\n';
    str += this.generateConstructorBody(e);
    str += this.indent() + '}'
    this.indentation--;

    return str;
  }

  generateConstructorBody(e) {
    var str = '';

    e.attributes.sort(function(a, b) {
      return ~~(a.name > b.name);
    }); // sort in alphabetical order

    this.indentation++;
    for (var attr of e.attributes) {
      str += this.indent() + 'this.' + attr.name + ' = ' + attr.name + ';\n';
    }
    str += '\n';
    str += this.generateConstructorValidation(e);
    this.indentation--;

    return str;
  }

  generateConstructorParameters(e) {
    var self = this;
    var str = '';

    e.attributes.forEach(function(attr, i) {
      str += attr.name;

      if (attr.optional) {
        if (attr.type !== 'String' || attr.defaultValue == null)
          str += ' = ' + attr.defaultValue;
        else
          str += ' = "' + attr.defaultValue + '"';
      }

      if (i !== (e.attributes.length - 1)) { // not last attribute
        str += ', ';
      }
    });

    return str;
  }

  generateConstructorValidation(e) {
    var self = this;
    var str = '';

    e.attributes.forEach(function(attr, i) {
      if (attr.required) {
        str += self.indent() + 'if (! (' + self.generateValidationCondition('required', attr) + '))\n';
        self.indentation++;
        str += self.indent() + 'throw "' + self.generateValidationErrorMessage('required', attr) + '";';
        self.indentation--;
        str += '\n';
      }
      if (attr.maxLength) {
        str += self.indent() + 'if (! (' + self.generateValidationCondition('maxLength', attr) + '))\n';
        self.indentation++;
        str += self.indent() + 'throw "' + self.generateValidationErrorMessage('maxLength', attr) + '";';
        self.indentation--;
        str += '\n';
      }
    });

    return str;
  }

  generateValidationCondition(type, attr) {
    var str = '';

    switch (type) {
      case 'maxLength': {
        str += '("" + ' + attr.name + ').length <= ' + attr.maxLength;
      }
      break;
      case 'required': {
        str += '(' + attr.name + ' !== undefined) && (' + attr.name + ' !== null)';
      }
      break;
    }

    return str;
  }

  generateValidationErrorMessage(type, attr) {
    var str = '';

    switch (type) {
      case 'maxLength': {
        str += "'" + attr.name + "' must be less than or equal to " + attr.maxLength + " characters";
      }
      break;
      case 'required': {
        str += "'" + attr.name + "' is a required field and thus it can't be null or undefined";
      }
      break;
      default: {
        throw 'Unknown error type, can\'t generate related error message for "' + attr.name + '".';
      }
      break;
    }

    return str;
  }

  getContent(file) {
    return this.results[file];
  }

  getOutputFilesExtension() {
    return 'js';
  }

  getOutputFilesNames() {
    return this.entities.map(function(e) {
      return e.name;
    });
  }
}
