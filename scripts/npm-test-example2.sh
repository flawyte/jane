#!/bin/bash

from=tests/example2/

node index.js mysql --from $from --create --drop --insert-into 2 --db-name jane --user root
node index.js mysql --from $from --data --db-name jane --user root
node index.js postgresql --from $from --create --drop --insert-into 2 --db-name jane --user $USER
node index.js postgresql --from $from --data --db-name jane --user $USER
node index.js sqlite --from $from --create --drop --insert-into 2
node index.js sqlite --from $from --data
