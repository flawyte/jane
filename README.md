# jane

## Introduction

Jane is an extensible code generator which allows you to generate SQL queries to create, drop and populate your database based on its data description. You describe these data in XML and Jane will then generate SQL queries for you, for the desired RDBMS (can be anything as long as [there's a generator for it](https://github.com/flawyte/jane/tree/master/src/generators)).

In short, it allows you to turn this:

```xml
<entity name="Product" plural="Products">
  <attributes>
    <attribute name="id" type="Integer" primary-key="true" />
    <attribute name="name" type="String" max-length="63" />
    <attribute name="price" type="Decimal(5,2)" />
    <attribute name="description" type="String" max-length="1023" />
    <attribute name="stock" type="Integer" />
  </attributes>
  <references>
    <reference entity="ProductCategory" attribute="id" as="category" />
  </references>
</entity>
```

into this (for MySQL) :

```sql
CREATE DATABASE IF NOT EXISTS MyDatabaseName;
USE MyDatabaseName;

CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(63) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  description VARCHAR(1023) NOT NULL,
  stock INT NOT NULL,
  category INT NOT NULL,

  FOREIGN KEY (category) REFERENCES ProductsCategories (id)
);
```

or this (for SQLite) :

```sql
CREATE TABLE Products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  description VARCHAR NOT NULL,
  stock INTEGER NOT NULL,
  category INTEGER NOT NULL,

  FOREIGN KEY (category) REFERENCES ProductsCategories (id)
);
```

Jane is RDBMS and programming language agnostic. You can use one of the [generators supported by default](#supported-generators) or write your own generator to generate isolated model classes for a specific programming language, whole APIs or to add support for another RDBMS, everything based only on your data description.

Jane is an object-oriented method and only requires to know the basics of programming (including XML or HTML) to be used. However if you want to write your own generator or to modify an existing one, JavaScript (ES6) knowledge is required.

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
- `generator-specific arguments` : Type `node index.js <generator-name> --help` for a list of additional arguments supported by a generator if any

For example, if you want to generate the SQL code to create, drop and insert some data, say 5 rows in each table, into the SQLite database corresponding to `tests/example1/` :

```bash
node index.js sqlite --from tests/example1/ --create --drop --insert-into=5
```

And see the output files in `tests/example1/generated/sqlite/`.

## Supported generators

Currently supported generators [by default](https://github.com/flawyte/jane/tree/master/src/generators) :

- MySQL
- PostgreSQL
- SQLite
- JS/ES6 (work in progress, very basic support)
