/*
 * Abstract output class. Should be inherited by all classes whose goal is to generate code from an Entity object.
 */
export default class AbstractGenerator {

  constructor() {
    this.entities = [];
    this.indentation = 0;
    this.name = null;
    this.options = {};
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  /*
   * Should generate code based on the 'entities' array.
   */
  generate() {}

  /*
   * Should return the output file's final content based on its name. Content will then be saved in the file, replacing its current content if any.
   */
  getContent(file) {
    return null;
  }

  /*
   * The output file(s) extension without leading dot e.g. 'js', 'sql', 'java'...
   */
  getOutputFilesExtension() {
    return null;
  }

  /*
   * Should return an array containing the output file(s) name(s) (specific to almost each generator).
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
