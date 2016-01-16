import Jane from './Jane';

export default class Random {

  static boolean() {
    return (Math.random() >= 0.5);
  }

  static date() {
    return new Date(Random.integer(1, 2015), Random.integer(0, 11), Random.integer(1, 31));
  }

  static datetime() {
    return new Date(Random.integer(1, 2015), Random.integer(0, 11), Random.integer(1, 31),
      Random.integer(0, 23), Random.integer(0, 59), Random.integer(0, 59));
  }

  static decimal(precision = 10, scale = 5) {
    if (scale >= precision)
      throw "Can't generate a decimal with scale >= precision";

    var left = Random.integer(0, Math.pow(10, (precision - scale)) - 1);
    var right = Random.integer(0, Math.pow(10, scale) - 1);
    return Number(left + '.' + right);
  }

  static integer(min = 1, max = 10) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  static string() {
    return (Math.random() + 1).toString(36).slice(2);
  }

  static value(attr) {
    var val;

    if (attr.regex) {
      val = new Jane.randexp(attr.regex).gen();

      return val;
    }

    switch (attr.type) {
      case 'Boolean': {
        val = Random.boolean();
      }
      break;
      case 'Date': {
        val = Random.date();
      }
      break;
      case 'DateTime': {
        val = Random.datetime();
      }
      break;
      case 'Decimal': {
        val = Random.decimal(attr.precision, attr.scale);
      }
      break;
      case 'Integer': {
        val = Random.integer();
      }
      break;
      case 'String': {
        val = Random.string();
      }
      break;
      default: {
        throw 'Unsupported attribute type "' + attr.type + '"';
      }
      break;
    }

    return val;
  }
}
