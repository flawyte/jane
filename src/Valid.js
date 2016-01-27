import Toolkit from './Toolkit';

export default class Valid {

  static boolean(val) {
    return (Toolkit.typeOf(val) === 'Boolean');
  }

  static date(val) {
    return (Toolkit.typeOf(val) === 'Date')
      && !isNaN(val.getTime());
  }

  static datetime(val) {
    return (Toolkit.typeOf(val) === 'Date')
      && !isNaN(val.getTime());
  }

  static decimal(val, precision, scale) {
    var strValue = ('' + val);

    if (!precision && !scale) {
      return (Toolkit.typeOf(val) === 'Number');
    }
    else if (!scale) {
      if (!~strValue.indexOf('.'))
        return (Toolkit.typeOf(val) === 'Number')
          && (strValue.length <= precision);
      else
        return (Toolkit.typeOf(val) === 'Number')
          && ((strValue.length - 1) <= precision);
    }
    else {
      if (precision === scale)
        throw 'Precision and scale can\'t be equal';

      if (!~strValue.indexOf('.')) {
        return (Toolkit.typeOf(val) === 'Number')
          && (strValue.length <= precision);
      }
      else {
        var values = strValue.split('.');

        return (Toolkit.typeOf(val) === 'Number')
          && ((strValue.length - 1) <= precision)
          && (values[0].length <= (precision - scale))
          && (values[1].length <= scale);
      }
    }
  }

  static float(val) {
    return Valid.integer(val) || Valid.decimal(val);
  }

  static genre(val) {
    var valid = false;

    switch (val) {
      case 'address':
      case 'city':
      case 'country_code':
      case 'country':
      case 'email':
      case 'first_name':
      case 'last_name':
      case 'md5':
      case 'paragraph':
      case 'postal_code':
      case 'phone':
      case 'sha1':
      case 'word':
        valid = true;
      break;
    }

    return valid;
  }

  static integer(val) {
    return (Toolkit.typeOf(val) === 'Number') && (new String(val).indexOf('.') === -1);
  }

  static string(val) {
    return (Toolkit.typeOf(val) === 'String');
  }

  static time(val) {
    return (Toolkit.typeOf(val) === 'Date')
      && !isNaN(val.getTime());
  }
}
