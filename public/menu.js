(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
            _this.divBody.innerText = qinpel.util.getErrorMessage(err, "(ErrCode-000002)");
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
                divError.innerText = qinpel.util.getErrorMessage(err, "(ErrCode-000001)");
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL2V2ZXJ0L0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9tZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHFpbnBlbCA9IHdpbmRvdy5mcmFtZUVsZW1lbnQucWlucGVsO1xyXG52YXIgTWVudSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNZW51KCkge1xyXG4gICAgICAgIHRoaXMuZGl2Qm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5kaXZBcHBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmRpdkNvbmZpZ3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcclxuICAgICAgICB0aGlzLmluaXRBcHBzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2ZncygpO1xyXG4gICAgfVxyXG4gICAgTWVudS5wcm90b3R5cGUuaW5pdEJvZHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXZCb2R5LmlkID0gXCJRaW5wZWxNZW51RGl2Qm9keVwiO1xyXG4gICAgICAgIHRoaXMuZGl2Qm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpdkFwcHMpO1xyXG4gICAgICAgIHRoaXMuZGl2Qm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpdkNvbmZpZ3MpO1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLmluaXRBcHBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgcWlucGVsLmdldChcIi9saXN0L2FwcDJcIilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gX3RoaXMubGlzdEFwcHMocmVzLmRhdGEpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVfMSA9IF9hW19pXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnRyeUFkZEFwcChuYW1lXzEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICBfdGhpcy5kaXZCb2R5LmlubmVyVGV4dCA9IHFpbnBlbC51dGlsLmdldEVycm9yTWVzc2FnZShlcnIsIFwiKEVyckNvZGUtMDAwMDAyKVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBNZW51LnByb3RvdHlwZS5saXN0QXBwcyA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiBxaW5wZWwudXRpbC5nZXRUZXh0TGluZXMocmVzcG9uc2UpO1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLnRyeUFkZEFwcCA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lICE9IFwicWlucGVsLWFwcFwiKSB7XHJcbiAgICAgICAgICAgIHFpbnBlbC5nZXQoXCIvcnVuL2FwcC9cIiArIG5hbWUgKyBcIi90aXRsZS50eHRcIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGljb24gPSBcIi4uL1wiICsgbmFtZSArIFwiL2Zhdmljb24uaWNvXCI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5hZGRNZW51KF90aGlzLmRpdkFwcHMsIF90aGlzLm5ld01lbnUodGl0bGUsIGljb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBxaW5wZWwubWFuYWdlci5uZXdGcmFtZSh0aXRsZSwgXCIuLi9cIiArIG5hbWUgKyBcIi9pbmRleC5odG1sXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHFpbnBlbC5mcmFtZS5oZWFkQ2xvc2VBY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGl2RXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgZGl2RXJyb3IuaW5uZXJUZXh0ID0gcWlucGVsLnV0aWwuZ2V0RXJyb3JNZXNzYWdlKGVyciwgXCIoRXJyQ29kZS0wMDAwMDEpXCIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYWRkTWVudShfdGhpcy5kaXZBcHBzLCBkaXZFcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBNZW51LnByb3RvdHlwZS5pbml0Q2ZncyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAocWlucGVsLnV0aWwuaXNMb2NhbEhvc3QoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZERldlRvb2xzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLmFkZERldlRvb2xzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYWRkTWVudSh0aGlzLmRpdkNvbmZpZ3MsIHRoaXMubmV3TWVudShcIkRldlRvb2xzXCIsIFwiLi9hc3NldHMvZGV2dG9vbHMuaWNvXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcWlucGVsLnV0aWwudG9nZ2xlRGV2VG9vbHMoKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG4gICAgTWVudS5wcm90b3R5cGUubmV3TWVudSA9IGZ1bmN0aW9uICh0aXRsZSwgaWNvbiwgYWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGRpdkNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkNvbnRlbnQuY2xhc3NOYW1lID0gXCJRaW5wZWxNZW51RGl2TWVudUNvbnRlbnRcIjtcclxuICAgICAgICB2YXIgaW1nSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgaW1nSWNvbi5zcmMgPSBpY29uO1xyXG4gICAgICAgIHZhciBzcGFuVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuVGl0bGUuaW5uZXJUZXh0ID0gdGl0bGU7XHJcbiAgICAgICAgZGl2Q29udGVudC5hcHBlbmRDaGlsZChpbWdJY29uKTtcclxuICAgICAgICBkaXZDb250ZW50LmFwcGVuZENoaWxkKHNwYW5UaXRsZSk7XHJcbiAgICAgICAgcWlucGVsLnV0aWwuYWRkQWN0aW9uKGRpdkNvbnRlbnQsIGFjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGRpdkNvbnRlbnQ7XHJcbiAgICB9O1xyXG4gICAgTWVudS5wcm90b3R5cGUuYWRkTWVudSA9IGZ1bmN0aW9uIChkaXZDb250YWluZXIsIGRpdkNvbnRlbnQpIHtcclxuICAgICAgICB2YXIgZGl2TWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2TWVudS5jbGFzc05hbWUgPSAnUWlucGVsTWVudURpdk1lbnUnO1xyXG4gICAgICAgIGRpdk1lbnUuYXBwZW5kQ2hpbGQoZGl2Q29udGVudCk7XHJcbiAgICAgICAgZGl2Q29udGFpbmVyLmFwcGVuZENoaWxkKGRpdk1lbnUpO1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLnB1dEluRG9jdW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpdkJvZHkpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNZW51O1xyXG59KCkpO1xyXG5pZiAocWlucGVsLm1hbmFnZXIubmVlZFRvTG9nKCkpIHtcclxuICAgIHdpbmRvdy5mcmFtZUVsZW1lbnQuc3JjID0gXCIuL2xvZ2luLmh0bWxcIjtcclxufVxyXG5lbHNlIHtcclxuICAgIG5ldyBNZW51KCkucHV0SW5Eb2N1bWVudCgpO1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnUuanMubWFwIl19
