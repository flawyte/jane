import Entity from './Entity';
import Jane from './Jane';

export default class Toolkit {

  static createDirectory(path) {
    try {
      Jane.default.fs.mkdirSync(path);
    } catch (e) { // One of the parent directory doesn't exist
      Toolkit.createDirectory(Jane.default.path.dirname(path)); // Create all the parents recursively
      Toolkit.createDirectory(path); // And then the director
    }
  }

  static directoryExists(path) {
    try {
      return Jane.default.fs.statSync(path).isDirectory();
    } catch (e) {
      return false;
    }
  }

  static fileExists(path) {
    try {
      return Jane.default.fs.statSync(path).isFile();
    } catch (e) {
      return false;
    }
  }

  static get ready() {
    return Jane.default
      && Jane.default.fs
      && Jane.default.path
      && Jane.default.xml2js;
  }

  static getLocale() {
    if (process.env.LANG)
      return process.env.LANG.split('.')[0].replace('_', '-');
    else
      return 'en-US';
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

  static loadEntities(path) {
    return Toolkit.readXMLDirectory(path).map(function(xmlFile) {
      return Entity.default.fromXMLFile(xmlFile);
    });
  }

  static readXMLDirectory(path) {
    if (!Toolkit.ready)
      throw "You must call Jane.init() first";

    return Jane.default.glob.sync(path + '*.xml');
  }

  static readXMLFile(path) {
    if (!Toolkit.ready)
      throw "You must call Jane.init() first";

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