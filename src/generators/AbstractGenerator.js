/*
 * Abstract output class. Should be inherited by all classes whose goal is to generate code from an Entity object.
 */
export default class AbstractGenerator {

  constructor(entity) {
    if (!entity)
      throw '[panda] "entity" should be an instance of the Entity class'

    this.entity = entity;
  }

  /*
   * The function that Jane will call to generate code based on the Entity object passes at instanciation time.
   * Should return a string containing the generated code.
   */
  generate() {
    return null;
  }
}
