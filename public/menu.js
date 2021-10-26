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
        qinpel.get("/list/app")
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
        this.addMenu(this.divConfigs, this.newMenu("DevTools", "./assets/menu-devtools.ico", function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL1VzZXJzL2V2ZXJ0L0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9tZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHFpbnBlbCA9IHdpbmRvdy5mcmFtZUVsZW1lbnQucWlucGVsO1xyXG52YXIgTWVudSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNZW51KCkge1xyXG4gICAgICAgIHRoaXMuZGl2Qm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5kaXZBcHBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmRpdkNvbmZpZ3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcclxuICAgICAgICB0aGlzLmluaXRBcHBzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2ZncygpO1xyXG4gICAgfVxyXG4gICAgTWVudS5wcm90b3R5cGUuaW5pdEJvZHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXZCb2R5LmlkID0gXCJRaW5wZWxNZW51RGl2Qm9keVwiO1xyXG4gICAgICAgIHRoaXMuZGl2Qm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpdkFwcHMpO1xyXG4gICAgICAgIHRoaXMuZGl2Qm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpdkNvbmZpZ3MpO1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLmluaXRBcHBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgcWlucGVsLmdldChcIi9saXN0L2FwcFwiKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBfdGhpcy5saXN0QXBwcyhyZXMuZGF0YSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZV8xID0gX2FbX2ldO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudHJ5QWRkQXBwKG5hbWVfMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmRpdkJvZHkuaW5uZXJUZXh0ID0gcWlucGVsLnV0aWwuZ2V0RXJyb3JNZXNzYWdlKGVyciwgXCIoRXJyQ29kZS0wMDAwMDIpXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLmxpc3RBcHBzID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHFpbnBlbC51dGlsLmdldFRleHRMaW5lcyhyZXNwb25zZSk7XHJcbiAgICB9O1xyXG4gICAgTWVudS5wcm90b3R5cGUudHJ5QWRkQXBwID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChuYW1lICYmIG5hbWUgIT0gXCJxaW5wZWwtYXBwXCIpIHtcclxuICAgICAgICAgICAgcWlucGVsLmdldChcIi9ydW4vYXBwL1wiICsgbmFtZSArIFwiL3RpdGxlLnR4dFwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IFwiLi4vXCIgKyBuYW1lICsgXCIvZmF2aWNvbi5pY29cIjtcclxuICAgICAgICAgICAgICAgIF90aGlzLmFkZE1lbnUoX3RoaXMuZGl2QXBwcywgX3RoaXMubmV3TWVudSh0aXRsZSwgaWNvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHFpbnBlbC5tYW5hZ2VyLm5ld0ZyYW1lKHRpdGxlLCBcIi4uL1wiICsgbmFtZSArIFwiL2luZGV4Lmh0bWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcWlucGVsLmZyYW1lLmhlYWRDbG9zZUFjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkaXZFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICAgICBkaXZFcnJvci5pbm5lclRleHQgPSBxaW5wZWwudXRpbC5nZXRFcnJvck1lc3NhZ2UoZXJyLCBcIihFcnJDb2RlLTAwMDAwMSlcIik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5hZGRNZW51KF90aGlzLmRpdkFwcHMsIGRpdkVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLmluaXRDZmdzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChxaW5wZWwudXRpbC5pc0xvY2FsSG9zdCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRGV2VG9vbHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTWVudS5wcm90b3R5cGUuYWRkRGV2VG9vbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNZW51KHRoaXMuZGl2Q29uZmlncywgdGhpcy5uZXdNZW51KFwiRGV2VG9vbHNcIiwgXCIuL2Fzc2V0cy9tZW51LWRldnRvb2xzLmljb1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHFpbnBlbC51dGlsLnRvZ2dsZURldlRvb2xzKCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLm5ld01lbnUgPSBmdW5jdGlvbiAodGl0bGUsIGljb24sIGFjdGlvbikge1xyXG4gICAgICAgIHZhciBkaXZDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZDb250ZW50LmNsYXNzTmFtZSA9IFwiUWlucGVsTWVudURpdk1lbnVDb250ZW50XCI7XHJcbiAgICAgICAgdmFyIGltZ0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZ0ljb24uc3JjID0gaWNvbjtcclxuICAgICAgICB2YXIgc3BhblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhblRpdGxlLmlubmVyVGV4dCA9IHRpdGxlO1xyXG4gICAgICAgIGRpdkNvbnRlbnQuYXBwZW5kQ2hpbGQoaW1nSWNvbik7XHJcbiAgICAgICAgZGl2Q29udGVudC5hcHBlbmRDaGlsZChzcGFuVGl0bGUpO1xyXG4gICAgICAgIHFpbnBlbC51dGlsLmFkZEFjdGlvbihkaXZDb250ZW50LCBhY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiBkaXZDb250ZW50O1xyXG4gICAgfTtcclxuICAgIE1lbnUucHJvdG90eXBlLmFkZE1lbnUgPSBmdW5jdGlvbiAoZGl2Q29udGFpbmVyLCBkaXZDb250ZW50KSB7XHJcbiAgICAgICAgdmFyIGRpdk1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdk1lbnUuY2xhc3NOYW1lID0gJ1FpbnBlbE1lbnVEaXZNZW51JztcclxuICAgICAgICBkaXZNZW51LmFwcGVuZENoaWxkKGRpdkNvbnRlbnQpO1xyXG4gICAgICAgIGRpdkNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZNZW51KTtcclxuICAgIH07XHJcbiAgICBNZW51LnByb3RvdHlwZS5wdXRJbkRvY3VtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kaXZCb2R5KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTWVudTtcclxufSgpKTtcclxuaWYgKHFpbnBlbC5tYW5hZ2VyLm5lZWRUb0xvZygpKSB7XHJcbiAgICB3aW5kb3cuZnJhbWVFbGVtZW50LnNyYyA9IFwiLi9sb2dpbi5odG1sXCI7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBuZXcgTWVudSgpLnB1dEluRG9jdW1lbnQoKTtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZW51LmpzLm1hcCJdfQ==
