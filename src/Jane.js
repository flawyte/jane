import DataRecord from './DataRecord';
import Entity from './Entity';
import Toolkit from './Toolkit';

export default class Jane {

  static init(require, generator, workingDir) {
    Jane.fs = require('fs');
    Jane.generator = generator;
    Jane.glob = require('glob');
    Jane.path = require('path');
    Jane.randomstring = require('randomstring');
    Jane.randexp = require('randexp');
    Jane.xml2js = require('xml2js');

    Jane.workingDir = Jane.path.normalize(workingDir + '/');
  }

  static logHelp() {
    console.log('Jane version 0.6.0');
    console.log('Usage: node index.js <generator-name> --from <XML file/directory> [--to <output directory>] [<generator-specific arguments>]');
    console.log('');
    console.log('Arguments');
    console.log('=========');
    console.log('');
    console.log('* generator-name: Supported values by default => mysql, postgresql, sqlite');
    console.log('* from: A Jane-compliant XML source file or a whole directory (each XML file it contains will be processed). See the XML files in one of the tests/example*/ directories for an example');
    console.log('* [to]: Relative path (to the "from" argument) to a directory to write the output file(s) in. Default is "generated/<generator-name>/"');
    console.log('* [generator-specific arguments]: Type "node index.js <generator-name> --help" for a list of additional arguments supported by a generator if any');
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
    if (!args.from) {
      Jane.logHelp();
      return;
    }

    var gen = Jane.generator;
    var src = Jane.path.normalize(Jane.workingDir + args.from);

    gen.setOptions(args);

    if (args.data) {
      var dataSrc;

      if (~src.indexOf(/.*\.xml$/)) {
        dataSrc = Jane.path.normalize(Jane.path.dirname(src) + '/data/');
      }
      else {
        dataSrc = Jane.path.normalize(src + '/data/');
      }

      if (!Toolkit.directoryExists(dataSrc)) {
        console.log(dataSrc + ' does not exist... Aborting.');
        return;
      }

      if (Toolkit.directoryExists(src)) { // Source is a directory
        Jane.baseDir = Jane.path.normalize(src + '/');

        Toolkit.loadEntities(Jane.baseDir);
        gen.data = Jane.processDataDirectory(Jane.baseDir + 'data/');
      }
      else if (Toolkit.fileExists(src)) { // Source is an XML file
        Jane.baseDir = Jane.path.normalize(Jane.path.dirname(src) + '/');
        var entity = Entity.fromXMLFile(src);

        try {
          gen.addEntity(entity);
          gen.data = Jane.processDataFile(Jane.baseDir + 'data/' + entity.plural + '.xml');
        } catch (e) {
          console.log('No data for the entity named ' + entity.name + ' (corresponding to the table ' + entity.plural + ')... Aborting.');
          return;
        }
      }
      else {
        console.log(src + ' does not exist');
        return;
      }
    }
    else {
      if (Toolkit.directoryExists(src)) { // Source is a directory
        Jane.baseDir = Jane.path.normalize(src + '/');

        var entities = Jane.processEntitiesDirectory(Jane.baseDir);

        if (!entities || entities.length === 0)
          console.log('Error while processing directory : ' + src);

        for (let entity of entities)
          gen.addEntity(entity);
      }
      else if (Toolkit.fileExists(src)) { // Source is an XML file
        Jane.baseDir = Jane.path.normalize(Jane.path.dirname(src) + '/');

        var entity = Jane.processEntityFile(src);

        if (!entity)
          console.log('Error while processing file : ' + src);

        gen.addEntity(entity);
      }
      else {
        console.log(src + ' does not exist');
        return;
      }
    }

    var outputDir;

    if (args.to)
      outputDir = Jane.workingDir + args.to;
    else
      outputDir = Jane.baseDir + 'generated/' + Jane.generator.name;

    gen.generate();
    gen.getOutputFilesNames().forEach(function(fileName) {
      Jane.saveCode(
        gen.getContent(fileName),
        fileName,
        outputDir
      );
    });
    console.log('✓ Done !');
  }

  static processDataDirectory(path) {
    if (!Toolkit.directoryExists(path))
      throw path + ' is not a directory';

    var files = Jane.glob.sync(path + '*.xml');
    var records = [];

    files.forEach(function(file) {
      records = records.concat(Jane.processDataFile(file));
    });

    return records;
  }

  static processDataFile(path) {
    var obj = Toolkit.readXMLFile(path).data;
    var entity = Entity.getByPlural(obj.$.for);

    if (!entity)
      throw 'There is no entity whose name in plural form is "' + obj.$.for + '"';

    return obj.record.map(function(xmlRecord) {
      return DataRecord.fromXMLObject(entity, xmlRecord);
    });
  }

  static processEntitiesDirectory(path) {
    if (!Jane.ready)
      throw "You must call Jane.init() first";
    if (!Toolkit.directoryExists(path))
      throw path + ' is not a directory';

    var entities = [];
    var files = Jane.glob.sync(path + '*.xml');

    files.forEach(function(file) {
      entities.push(Jane.processEntityFile(file));
    });

    return entities;
  }

  static processEntityFile(path) {
    return Entity.fromXMLFile(path);
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
      dirPath = Jane.baseDir + dir; // Relative path (to source(s) file(s)'s parent directory)

    dirPath = Jane.path.normalize(dirPath + '/'); // Normalize to avoid '..' and '//' parts
    fullPath = dirPath + fileName;

    if (!Toolkit.directoryExists(dirPath))
      Toolkit.createDirectory(dirPath);

    console.log('Writing ' + fullPath);
    Jane.fs.writeFileSync(fullPath, code, 'utf8');
  }
}
