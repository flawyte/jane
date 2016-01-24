#!/bin/bash

base_dir=`pwd`

node_modules/nodeunit/bin/nodeunit tests/units/AttributeTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/CastTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/EntityTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/RandomTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/ValidTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/InsertIntoStatementTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/generators/MySQLTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/generators/PostgreSQLTest.js \
  && node_modules/nodeunit/bin/nodeunit tests/units/generators/SQLiteTest.js
