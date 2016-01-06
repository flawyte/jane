export default class Random {

  static boolean() {
    return (Math.random() >= 0.5);
  }

  static integer(min = 1, max = 10) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  static string() {
    return (Math.random() + 1).toString(36).slice(2);
  }

  static value(attr) {
    var val;

    switch (attr.type) {
      case 'Boolean': {
        val = Random.boolean();
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
