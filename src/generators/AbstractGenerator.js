/*
 * Abstract output class. Can be inherited by all classes whose goal is to generate code from one or multiple Entity objects.
 */
export default class AbstractGenerator {

  constructor(options = {}) {
    this.entities = [];
    this.indentation = 0;
    this.name = null;
    this.options = options;
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  /*
   * Should generate code based on the 'entities' array.
   */
  generate() {}

  /*
   * Should return an object literal with allowed options (typically CLI arguments) as keys and options' descriptions as values.
   */
  getAllowedOptions() {
    return null;
  }

  /*
   * Should return the output file's final content based on its name. Content will then be saved in the file, replacing its current content if any.
   */
  getContent(file) {
    return null;
  }

  /*
   * Should return an array containing the output file(s) name(s) (specific to almost each generator) with the extension (e.g. 'file.sql').
   */
  getOutputFilesNames() {
    return null;
  }

  /*
   * Returns `this.indentation * 2` whitespaces (e.g. 2, 4...).
   */
  indent() {
    var str = '';

    for (var i = 0; i < this.indentation * 2; i++)
      str += ' ';

    return str;
  }

  sortEntities() {
    this.entities.sort(function(a, b) {
      return a.references.length - b.references.length;
    });
  }
}
