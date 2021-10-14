rm -rf out
mkdir out
cd public
rm -rf *.js
rm -rf *.js.map
cp -r * ../out/
cd ..
browserify src/index.js | uglifyjs -cm > out/index.js
browserify src/login.js | uglifyjs -cm > out/login.js
browserify src/menu.js | uglifyjs -cm > out/menu.js