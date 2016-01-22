export default class Cast {

  static boolean(val) {
    var res;

    if (val === 'false')
      res = false;
    else if (val === 'true')
      res = true;
    else
      throw 'Invalid boolean value given : ' + val;

    return res;
  }

  static date(val) {
    var res = new Date(val);

    if (isNaN(res.getTime()))
      throw 'Invalid date value given : ' + val;

    res.setMonth(res.getMonth() + 1);

    return res;
  }

  static datetime(val) {
    var res = new Date(val);

    if (isNaN(res.getTime()))
      throw 'Invalid datetime value given : ' + val;

    res.setMonth(res.getMonth() + 1);

    return res;
  }

  static decimal(val) {
    return parseFloat(val);
  }

  static integer(val) {
    return parseInt(parseInt(val).toFixed(0)); // Removes any floating part
  }

  static string(val) {
    return new String(val);
  }

  static value(val, type) {
    var res;

    if (val === 'null')
      return null;

    switch (type) {
      case 'Boolean': {
        res = Cast.boolean(val);
      }
      break;
      case 'Date': {
        res = Cast.date(val);
      }
      break;
      case 'DateTime': {
        res = Cast.datetime(val);
      }
      break;
      case 'Decimal': {
        res = Cast.decimal(val);
      }
      break;
      case 'Integer': {
        res = Cast.integer(val);
      }
      break;
      case 'String': {
        res = Cast.string(val);
      }
      break;
      default: {
        throw 'Unsupported attribute type "' + attr.type + '"';
      }
      break;
    }

    return res;
  }
}
