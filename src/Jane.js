import Entity from './Entity';
import Toolkit from './Toolkit';

export default class Jane {

  static init(fs, generator, glob, path, xml2js) {
    Jane.fs = fs;
    Jane.generator = generator;
    Jane.glob = glob;
    Jane.path = path;
    Jane.xml2js = xml2js;
  }

  static logHelpGenerator() {
    if (!Jane.generator)
      return;

    var allowedOptions = Jane.generator.getAllowedOptions();

    if (!allowedOptions)
      console.log('Specified generator hasn\'t provided any help informations.');

    console.log('Help for generator: ' + Jane.generator.name);
    console.log('');

    for (let key in allowedOptions) {
      console.log('--' + key + ' : ' + allowedOptions[key]);
    }
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
    var gen = Jane.generator;
    var path = args.src;

    if (!Toolkit.directoryExists(path))
      throw path + ' is not a directory';
    if (!Jane.generator)
      throw "Jane.generator is null or undefined, can't generate code"
    if (!Jane.glob)
      throw "Jane.glob is null or undefined, can't list directory's XML files without the npm package 'glob'"

    if (path.slice(-1) !== '/') // Check if path contains a trailing '/' and if not adds one
      path += '/';

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
        Jane.saveCode(gen.getContent(fileName),
          fileName + '.' + gen.getOutputFilesExtension(),
          args.to || ('output/' + Jane.generator.name));
      });

      if (callback instanceof Function)
        callback(true);
    });
  }

  static processFile(args, callback) {
    var gen = Jane.generator;
    var path = args.src;

    if (!Jane.generator)
      throw "Jane.generator is null or undefined, can't generate code"

    Jane.basePath = Toolkit.getDirectoryPath(path);

    gen.addEntity(Entity.fromXMLFile(path));
    gen.generate();
    gen.getOutputFilesNames().forEach(function(fileName) {
        Jane.saveCode(gen.getContent(fileName),
          fileName + '.' + gen.getOutputFilesExtension(),
          args.to || ('output/' + Jane.generator.name));
    });

    if (callback instanceof Function)
      callback(true);
  }

  static saveCode(code, fileName, dir) {
    var dirPath;
    var fullPath;

    if (dir.startsWith('/')) // Absolute path
      dirPath = dir;
    else
      dirPath = Jane.basePath + dir; // Relative path (to source(s) file(s)'s parent directory)

    dirPath = Jane.path.normalize(dirPath + '/'); // Normalize to avoid '..' and '//' parts
    fullPath = dirPath + fileName;

    if (!Toolkit.directoryExists(dirPath))
      Toolkit.createDirectory(dirPath);

    console.log('Writing ' + fullPath);
    Jane.fs.writeFileSync(fullPath, code, 'utf8');
  }
}
