#!/bin/bash
bash -v build.sh
browserify build/index.js --debug -o public/index.js
browserify build/login.js --debug -o public/login.js
browserify build/menu.js --debug -o public/menu.js
rm -rf ~/Devs/run/app/qinpel-app
mkdir ~/Devs/run/app/qinpel-app
cd public
cp -r * ~/Devs/run/app/qinpel-app
cd ..
