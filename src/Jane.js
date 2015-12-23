import Entity from './Entity';
import Toolkit from './Toolkit';

export default class Jane {

  static init(fs, generator, glob, xml2js) {
    Jane.fs = fs;
    Jane.generator = generator;
    Jane.glob = glob;
    Jane.xml2js = xml2js;
  }

  static processDirectory(path, callback) {
    if (!Toolkit.directoryExists(path))
      throw path + ' is not a directory';
    if (!Jane.generator)
      throw "Jane.generator is null or undefined, can't generate code"
    if (!Jane.glob)
      throw "Jane.glob is null or undefined, can't list directory's XML files without the npm package 'glob'"

    if (path.slice(-1) !== '/') // Check if path contains a trailing '/' and if not adds one
      path += '/';

    var gen = Jane.generator;

    Jane.basePath = path;

    Jane.glob(path + '*.xml', function(err, files) {
      if (err)
        throw err;

      files.forEach(function(file) {
        gen.addEntity(Entity.fromXMLFile(file));
      });

      gen.generate();
      gen.getOutputFilesNames().forEach(function(fileName) {
        Jane.saveCode(gen.getContent(fileName), fileName + '.' + gen.getOutputFilesExtension());
      });

      if (callback instanceof Function)
        callback(true);
    });
  }

  static processFile(path, callback) {
    var gen = Jane.generator;

    Jane.basePath = Toolkit.getDirectoryPath(path);

    gen.addEntity(Entity.fromXMLFile(path));
    gen.generate();
    gen.getOutputFilesNames().forEach(function(fileName) {
      Jane.saveCode(gen.getContent(fileName), fileName + '.' + gen.getOutputFilesExtension());
    });

    if (callback instanceof Function)
      callback(true);
  }

  static saveCode(code, file) {
    if (!Toolkit.directoryExists(Jane.basePath + 'output/'))
      Toolkit.createDirectory(Jane.basePath + 'output/');
    if (!Toolkit.directoryExists(Jane.basePath + 'output/' + Jane.generator.name))
      Toolkit.createDirectory(Jane.basePath + 'output/' + Jane.generator.name);

    Jane.fs.writeFileSync(Jane.basePath + 'output/' + Jane.generator.name + '/' + file, code, 'utf8');
  }
}
