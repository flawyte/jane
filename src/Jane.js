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

  static logHelp() {
    console.log('Jane version 0.0.0');
    console.log('Usage: node index.js <generator-name> --from <XML file/directory> [--to <output directory>] [<generator-specific arguments>]');
    console.log('');
    console.log('Arguments');
    console.log('=========');
    console.log('');
    console.log('* generator-name : Supported values by default => sqlite');
    console.log('* from : A Jane-compliant XML source file or a whole directory (each XML file it contains will be processed). See the XML files in one of the tests/example*/ directories for an example');
    console.log('* to : Relative path (to the "from" argument) to a directory to write the output file(s) in. Default is "output/<generator-name>/"');
    console.log('* generator-specific arguments : Type "node index.js <generator-name> --help" for a list of additional arguments supported by a generator if any');
  }

  static logHelpGenerator() {
    var allowedOptions = Jane.generator.getAllowedOptions();

    if (!allowedOptions) {
      console.log('Generator "' + Jane.generator.name + '" hasn\'t provided any help informations.');
      return;
    }
    else if (Object.keys(allowedOptions).length === 0) {
      console.log('Generator "' + Jane.generator.name + '" doesn\'t support any additional arguments.');
      return;
    }

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
    if (!Jane.ready)
      throw "You must call Jane.init(<params>) first";

    var gen = Jane.generator;
    var path = Jane.path.normalize(args.src + '/');

    if (!Toolkit.directoryExists(path))
      throw path + ' is not a directory';

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
    if (!Jane.ready)
      throw "You must call Jane.init(<params>) first";

    var gen = Jane.generator;
    var path = args.src;

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

  static get ready() {
    return Jane.fs
      && Jane.generator
      && Jane.glob
      && Jane.path
      && Jane.xml2js;
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
