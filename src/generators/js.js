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
}
