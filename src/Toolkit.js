import Jane from './Jane';

export default class Toolkit {

  static createDirectory(dir) {
    try {
      Jane.default.fs.mkdirSync(dir);
    } catch (e) { // One of the parent directory doesn't exist
      Toolkit.createDirectory(Jane.default.path.dirname(dir)); // Create all the parents recursively
      Toolkit.createDirectory(dir); // And then the director
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
    return Jane.default.fs
      && Jane.default.path
      && Jane.default.xml2js;
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

  static values(object) {
    var values = [];

    for (let key in object)
      values.push(object[key]);

    return values;
  }
}