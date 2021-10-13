rm *.js
cp src/main.js main.js
call browserify src/index.js -o index.js
call browserify src/menu.js -o menu.js
call browserify src/login.js -o login.js