import Jane from './Jane';

export default class Toolkit {

  static cast(val, type) {
    if ((type === 'Date') || (type === 'DateTime'))
      return new Date(val);
    else if (Toolkit.typeOf(val) === 'String')
      return JSON.parse(val);
    else
      return val;
  }

  static createDirectory(dir) {

    try {
      Jane.default.fs.mkdirSync(dir);
    } catch (e) { // One of the parent directory doesn't exist
      // Create all the parents recursively
      Toolkit.createDirectory(Jane.default.path.dirname(dir));
      // And then the directory
      Toolkit.createDirectory(dir);
    }
  }

  static directoryExists(dir) {
    try {
      return Jane.default.fs.statSync(dir).isDirectory();
    } catch (e) {
      return false;
    }
  }

  static get ready() {
    return Jane.default.fs && Jane.default.path && Jane.default.xml2js;
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

  static getGeneratorOptions(args) {
    var arr = JSON.parse(JSON.stringify(args));

    delete arr['_'];
    delete arr['$0'];
    delete arr['from'];
    delete arr['insertInto'];
    delete arr['src'];
    delete arr['to'];

    return arr;
  }

  static readXMLFile(path) {
    if (!Toolkit.ready)
      throw "You must call Jane.init(<params>) first";

    var res = null;
    var buffer = Jane.default.fs.readFileSync(path); // sync function

    Jane.default.xml2js.parseString(buffer, function(err, obj) { // sync function
      if (err)
        throw err;

      res = obj;
    });

    return res;
  }

  static typeOf(val) {
    return Object.prototype.toString.call(val).match(/\[object (.*)\]/)[1];
  }
}