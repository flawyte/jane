export default class Toolkit {

  static cast(val) {
    if (Toolkit.type(val) === 'String')
      return JSON.parse(val);
    else
      return val;
  }

  static getDirectoryPath(filePath) {
    return filePath.substring(0, filePath.lastIndexOf('/') + 1);
  }

  static getFileName(filePath) {
    return filePath.substring(filePath.lastIndexOf('/') + 1);
  }

  static readXMLFile(name) {
    if (!Toolkit.fs)
      throw "Toolkit.fs not set, can't read file '" + path + name + "'";
    if (!Toolkit.xml2js)
      throw "Toolkit.xml2js not set, can't parse file '" + path + name + "'";

    var path = Toolkit.basePath;
    var res = null;
    var buffer = Toolkit.fs.readFileSync(path + name); // sync function

    Toolkit.xml2js.parseString(buffer, function(err, obj) { // sync function
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