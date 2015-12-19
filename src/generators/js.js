import AbstractGenerator from './AbstractGenerator';

export default class JSGenerator extends AbstractGenerator {

  generate() {
    var e = this.entity;
    var str = '';

    this.entity.attributes.sort(function(a, b) {
      if (a.required && b.optional)
        return -1;
      else if (a.optional && b.required)
        return 1;
      else
        return 0;
    });

    str += 'export default class ' + e.name + ' {\n';
    str += '\n';
    str += this.generateConstructor();
    str += '\n}';
    str += '\n';

    return str;
  }

  generateConstructor() {
    var str = '';

    this.indentation++;
    str += this.indent() + 'constructor(' + this.generateConstructorParameters() + ') {\n';
    str += this.generateConstructorBody();
    str += this.indent() + '}'
    this.indentation--;

    return str;
  }

  generateConstructorBody() {
    var str = '';

    this.entity.attributes.sort(function(a, b) {
      return ~~(a.name > b.name);
    }); // sort in alphabetical order

    this.indentation++;
    for (var attr of this.entity.attributes) {
      str += this.indent() + 'this.' + attr.name + ' = ' + attr.name + ';\n';
    }
    str += '\n';
    str += this.generateConstructorValidation();
    this.indentation--;

    return str;
  }

  generateConstructorParameters() {
    var self = this;
    var str = '';

    this.entity.attributes.forEach(function(attr, i) {
      str += attr.name;

      if (attr.optional) {
        if (attr.type !== 'String' || attr.defaultValue == null)
          str += ' = ' + attr.defaultValue;
        else
          str += ' = "' + attr.defaultValue + '"';
      }

      if (i !== (self.entity.attributes.length - 1)) { // not last attribute
        str += ', ';
      }
    });

    return str;
  }

  generateConstructorValidation() {
    var e = this.entity;
    var self = this;
    var str = '';

    e.attributes.forEach(function(attr, i) {
      if (attr.required) {
        str += self.indent() + 'if (! (' + self.generateValidationCondition('required', attr) + '))\n';
        self.indentation++;
        str += self.indent() + 'throw "' + self.generateValidationErrorMessage('required', attr) + '";';
        self.indentation--;
        str += self.indent() + '\n';
      }
      if (attr.maxLength !== Number.POSITIVE_INFINITY) {
        str += self.indent() + 'if (! (' + self.generateValidationCondition('maxLength', attr) + '))\n';
        self.indentation++;
        str += self.indent() + 'throw "' + self.generateValidationErrorMessage('maxLength', attr) + '";';
        self.indentation--;
        str += self.indent() + '\n';
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
}
