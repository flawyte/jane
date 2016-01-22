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

  static integer(val) {
    return (Toolkit.typeOf(val) === 'Number') && (new String(val).indexOf('.') === -1);
  }

  static string(val) {
    return (Toolkit.typeOf(val) === 'String');
  }
}
