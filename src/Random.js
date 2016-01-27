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
    return parseFloat(left + '.' + right);
  }

  static float() {
    return parseFloat(Random.integer(0, 999999) + '.' + Random.integer(0, 999999));
  }

  static integer(min = 1, max = 10) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  static string(options = {}) {
    if (options.nullable && Random.boolean())
      return null;

    if (!options.genre) {
      if (options.exactLength)
        return Jane.randomstring.generate(options.exactLength)
      else if (options.maxLength && options.minLength)
        return Jane.randomstring.generate(Random.integer(options.minLength, options.maxLength));
      else if (options.maxLength)
        return Jane.randomstring.generate(Random.integer(0, options.maxLength));
      else if (options.minLength)
        return Jane.randomstring.generate(
          Random.integer(
            options.minLength,
            options.minLength + Math.pow(Random.integer(), Random.integer())
          )
        );
      else
        return Jane.chance.string();
    }

    var res = null;

    switch (options.genre) {
      case 'address':
        res = Jane.chance.address();
      break;
      case 'city':
        res = Jane.chance.city();
      break;
      case 'country_code':
        res = Jane.chance.country();
      break;
      case 'country':
        res = Jane.chance.country({ full: true });
      break;
      case 'email':
        res = Jane.chance.email();
      break;
      case 'first_name':
        res = Jane.chance.first();
      break;
      case 'last_name':
        res = Jane.chance.last();
      break;
      case 'md5':
        res = Jane.chance.md5();
      break;
      case 'paragraph':
        res = Jane.chance.paragraph();
      break;
      case 'postal_code':
        res = Jane.chance.string({
          pool: '0123456789'
        });
      break;
      case 'phone':
        res = Jane.chance.paragraph();
      break;
      case 'sha1':
        res = Jane.crypto.randomBytes(20).toString('hex');
      break;
      case 'word':
        res = Jane.chance.word();
      break;
    }

    return res;
  }

  static time() {
    return new Date(0, 0, 0, Random.integer(0, 23), Random.integer(0, 59), Random.integer(0, 59));
  }

  static value(attr) {
    var val;

    if (attr.regex) {
      val = new Jane.randexp(attr.regex).gen();

      return val;
    }

    switch (attr.type) {
      case 'Boolean':
        val = Random.boolean();
      break;
      case 'Date':
        val = Random.date();
      break;
      case 'DateTime':
        val = Random.datetime();
      break;
      case 'Decimal':
        val = Random.decimal(attr.precision, attr.scale);
      break;
      case 'Float':
        val = Random.float();
      break;
      case 'Integer':
        val = Random.integer();
      break;
      case 'String':
        val = Random.string(attr);
      break;
      case 'Time':
        val = Random.time();
      break;
      default:
        throw 'Unsupported attribute type "' + attr.type + '"';
      break;
    }

    if (attr.isValueValid(val))
      return val;
    else
      return Random.value(attr);
  }
}
