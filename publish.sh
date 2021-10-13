rm -rf dist
mkdir dist
cd public
rm -rf *.js
rm -rf *.js.map
cp -r * ../dist/
cd ..
browserify src/index.js | uglifyjs -cm > dist/index.js
browserify src/login.js | uglifyjs -cm > dist/login.js
browserify src/menu.js | uglifyjs -cm > dist/menu.js