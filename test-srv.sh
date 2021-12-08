bash -v build.sh
browserify build/index.js --debug -o public/index.js
browserify build/login.js --debug -o public/login.js
browserify build/menu.js --debug -o public/menu.js
rm -rf ~/Wizard/run/app/qinpel-app
mkdir ~/Wizard/run/app/qinpel-app
cd public
cp -r * ~/Wizard/run/app/qinpel-app
cd ..