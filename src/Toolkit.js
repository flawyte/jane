export default class Toolkit {

  static cast(val) {
    if (Toolkit.type(val) === 'String')
      return JSON.parse(val);
    else
      return val;
  }

  static type(val) {
    return Object.prototype.toString.call(val).match(/\[object (.*)\]/)[1];
  }
}