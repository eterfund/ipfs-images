#!/usr/bin/env bash

find . -maxdepth 2 -type f -name "*.js" -print0 |\
xargs -0 ./node_modules/.bin/jsdoc2md > DOCS.md

cat DESC.md > README.md
echo >> README.md
cat DOCS.md >> README.md
