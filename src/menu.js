"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qinpel = window.frameElement.qinpel;
var Menu = (function () {
    function Menu() {
        this.divBody = document.createElement("div");
        this.divApps = document.createElement("div");
        this.divConfigs = document.createElement("div");
        this.initBody();
        this.initApps();
        this.initCfgs();
    }
    Menu.prototype.initBody = function () {
        this.divBody.id = "QinpelMenuDivBody";
        this.divBody.appendChild(this.divApps);
        this.divBody.appendChild(this.divConfigs);
    };
    Menu.prototype.initApps = function () {
        var _this = this;
        qinpel.get("/list/app2")
            .then(function (res) {
            for (var _i = 0, _a = _this.listApps(res.data); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                _this.tryAddApp(name_1);
            }
            ;
        })
            .catch(function (err) {
            _this.divBody.innerText = qinpel.util.getErrorMessage(err, __filename, Menu.name, _this.initApps.name);
        });
    };
    Menu.prototype.listApps = function (response) {
        return qinpel.util.getTextLines(response);
    };
    Menu.prototype.tryAddApp = function (name) {
        var _this = this;
        if (name && name != "qinpel-app") {
            qinpel.get("/run/app/" + name + "/title.txt")
                .then(function (res) {
                var title = res.data;
                var icon = "../" + name + "/favicon.ico";
                _this.addMenu(_this.divApps, _this.newMenu(title, icon, function () {
                    qinpel.manager.newFrame(title, "../" + name + "/index.html");
                    qinpel.frame.headCloseAction();
                }));
            })
                .catch(function (err) {
                var divError = document.createElement("div");
                divError.innerText = qinpel.util.getErrorMessage(err, __filename, Menu.name, _this.tryAddApp.name);
                _this.addMenu(_this.divApps, divError);
            });
        }
    };
    Menu.prototype.initCfgs = function () {
        if (qinpel.util.isLocalHost()) {
            this.addDevTools();
        }
    };
    Menu.prototype.addDevTools = function () {
        this.addMenu(this.divConfigs, this.newMenu("DevTools", "./assets/devtools.ico", function () {
            qinpel.util.toggleDevTools();
        }));
    };
    Menu.prototype.newMenu = function (title, icon, action) {
        var divContent = document.createElement("div");
        divContent.className = "QinpelMenuDivMenuContent";
        var imgIcon = document.createElement("img");
        imgIcon.src = icon;
        var spanTitle = document.createElement("span");
        spanTitle.innerText = title;
        divContent.appendChild(imgIcon);
        divContent.appendChild(spanTitle);
        qinpel.util.addAction(divContent, action);
        return divContent;
    };
    Menu.prototype.addMenu = function (divContainer, divContent) {
        var divMenu = document.createElement("div");
        divMenu.className = 'QinpelMenuDivMenu';
        divMenu.appendChild(divContent);
        divContainer.appendChild(divMenu);
    };
    Menu.prototype.putInDocument = function () {
        document.body.appendChild(this.divBody);
    };
    return Menu;
}());
if (qinpel.manager.needToLog()) {
    window.frameElement.src = "./login.html";
}
else {
    new Menu().putInDocument();
}
//# sourceMappingURL=menu.js.map