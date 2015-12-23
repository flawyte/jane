# jane

Jane is an extensible programming language agnostic code generator.

## Installation

Coming soon to NPM. In the meantime just clone the repo locally:

```bash
git clone https://github.com/flawyte/jane.git
cd jane
```

## Usage

```bash
node index.js --src=<XML SOURCE FILE> --gen=<GENERATOR>
```

- \<XML SOURCE FILE\>: Relative path to an XML file which structure is similar to the two XML files in the `tests/example1/` directory.
- \<GENERATOR\>: One of `js` or `sqlite`. To add a new generator, just create a new ES6 class in `src/generators/` and name the file `<my-generator-name>.js`. Then use it with `node index.js --src <...> --gen=<my-generator-name>`.

### Example

There's two XML files as examples in the `tests/example1` directory. Open them to see how you should write yours for Jane to be able to parse them and generate code for you. To generate code for this example, run the following command:

```bash
node index.js --src tests/example1/Task.xml --gen sqlite
```

Output:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER DEFAULT 800,
  description VARCHAR DEFAULT "",
  completed BOOLEAN DEFAULT 0,
  label INTEGER NOT NULL,
  parent INTEGER DEFAULT NULL,

  FOREIGN KEY (label) REFERENCES Labels (id),
  FOREIGN KEY (parent) REFERENCES Tasks (id)
);
```
