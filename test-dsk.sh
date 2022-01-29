#!/bin/bash
bash -v build.sh
browserify build/index.js --debug -o public/index.js
browserify build/login.js --debug -o public/login.js
browserify build/menu.js --debug -o public/menu.js
rm -rf ../qinpel-dsk/run/app/qinpel-app
mkdir ../qinpel-dsk/run/app/qinpel-app
cd public
cp -r * ../../qinpel-dsk/run/app/qinpel-app
cd ..
