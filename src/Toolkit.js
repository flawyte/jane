import Jane from './Jane';

export default class Toolkit {

  static cast(val) {
    if (Toolkit.type(val) === 'String')
      return JSON.parse(val);
    else
      return val;
  }

  static createDirectory(dir) {
    Jane.default.fs.mkdirSync(dir);
  }

  static directoryExists(dir) {
    try {
      return Jane.default.fs.statSync(dir).isDirectory();
    } catch (e) {
      return false;
    }
  }

  static get ready() {
    return Jane.default.fs && Jane.default.xml2js;
  }

  static getDirectoryPath(filePath) {
    return filePath.substring(0, filePath.lastIndexOf('/') + 1);
  }

  static getEntityName(filePath) {
    return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
  }

  static getFileName(filePath) {
    return filePath.substring(filePath.lastIndexOf('/') + 1);
  }

  static getOptions(args) {
    var arr = JSON.parse(JSON.stringify(args));

    delete arr['_'];
    delete arr['$0'];
    delete arr['gen'];
    delete arr['insertInto'];
    delete arr['src'];

    return arr;
  }

  static readXMLFile(path) {
    if (!Jane.default.fs)
      throw "Jane.fs not set, can't read file '" + path + "'";
    if (!Jane.default.xml2js)
      throw "Jane.xml2js not set, can't parse file '" + path + "'";

    var res = null;
    var buffer = Jane.default.fs.readFileSync(path); // sync function

    Jane.default.xml2js.parseString(buffer, function(err, obj) { // sync function
      if (err)
        throw err;

      res = obj;
    });

    return res;
  }

  static type(val) {
    return Object.prototype.toString.call(val).match(/\[object (.*)\]/)[1];
  }
}