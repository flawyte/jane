# jane

Jane is an extensible code generator. It is RDBMS and programming language agnostic. It allows you to define your data in XML and then generate the related SQL queries to create, drop and populate your database. You can also write your own generator to generate isolated model classes or whole APIs, based on your data description.

Jane is data-oriented and thus doesn't require any programming knowledge to be used, except knowing XML (or HTML) syntax. However if you want to write your own generator or to modify an existing one, JavaScript (ES6) knowledge is required.

## Supported generators

Currently supported generators [by default](https://github.com/flawyte/jane/tree/master/src/generators) include :

- SQLite
- JS/ES6 (work in progress, very basic support)

## Installation

Coming soon to NPM. In the meantime just clone the repo locally :

```bash
git clone https://github.com/flawyte/jane.git
cd jane
```

## Usage

```bash
node index.js <generator-name> --from <XML file/directory> [<generator-specific arguments>]
```

- `generator-name` : See the [list of supported generators](#supported-generators) above or add your own.
- `from` : Relative path to a Jane-compliant XML source file or to a whole directory (each XML file it contains will be processed). See the XML files in one of the `tests/example*/` directories

For example, if you want to generate the SQL code to create, drop and insert some data, say 5 rows in each table, into the SQLite database corresponding to `tests/example1/` :

```bash
node index.js sqlite --from tests/example1/ --create --drop --insert-into=5
```

And see the output files in `tests/example1/output/sqlite/`. For example, `create-database.sql`'s content is :

```sql
CREATE TABLE Labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR NOT NULL,
  color VARCHAR NOT NULL
);

CREATE TABLE Tasks (
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
