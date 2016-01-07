import Entity from './Entity';
import Toolkit from './Toolkit';

export default class Jane {

  static init(fs, generator, glob, xml2js) {
    Jane.fs = fs;
    Jane.generator = generator;
    Jane.glob = glob;
    Jane.xml2js = xml2js;
  }

  static process(args) {
    var src = args.src;

    if (Toolkit.directoryExists(src)) { // Source is a directory
      Jane.processDirectory(args, function(success) {
        if (success)
          console.log('✓ Done !');
        else
          console.log('Error while processing directory' + src + '.');
      });
    }
    else { // Source is an XML file
      Jane.processFile(args, function(success) {
        if (success)
          console.log('✓ Done !');
        else
          console.log('Error while processing file' + src + '.');
      });
    }
  }

  static processDirectory(args, callback) {
    var path = args.src;

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
        if (Entity.instances !== undefined)
          if (Entity.instances[Toolkit.getEntityName(file)] !== undefined)
            gen.addEntity(Entity.instances[Toolkit.getEntityName(file)]);
          else
            gen.addEntity(Entity.fromXMLFile(file));
        else
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

  static processFile(args, callback) {
    var path = args.src;
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

    var fullFileName = Jane.basePath + 'output/' + Jane.generator.name + '/' + file;
    console.log('Writing ' + fullFileName);
    Jane.fs.writeFileSync(fullFileName, code, 'utf8');
  }
}
