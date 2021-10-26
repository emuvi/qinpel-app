"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
var frame_1 = require("./frame");
var utils_1 = require("./utils");
var axios_1 = require("axios");
var Manager = (function () {
    function Manager() {
        this.divBody = document.createElement("div");
        this.divMenu = document.createElement("div");
        this.imgMenu = document.createElement("img");
        this.frames = [];
        this.framesTopZ = 1;
        this.token = "";
        this.userLang = "";
        this.initBody();
        this.initMenu();
        this.initDraggable();
    }
    Manager.prototype.initBody = function () {
        this.divBody.className = "QinpelWindowBody";
    };
    Manager.prototype.initMenu = function () {
        var _this = this;
        this.divMenu.id = "QinpelMenuID0";
        this.divMenu.className = "QinpelWindowMenu";
        this.imgMenu.src = "./assets/qinpel.png";
        this.imgMenu.alt = "Menu";
        this.divMenu.appendChild(this.imgMenu);
        this.divBody.appendChild(this.divMenu);
        utils_1.default.addAction(this.divMenu, function (event) {
            if (event.hasShift) {
                document.body.requestFullscreen();
            }
            else {
                _this.newFrame("Qinpel", "./menu.html");
            }
            return false;
        });
    };
    Manager.prototype.initDraggable = function () {
        var _this = this;
        utils_1.default.addScroller(this.divBody, {
            onDouble: function () {
                _this.divBody.scrollTo(0, 0);
                utils_1.default.clearSelection();
            },
            onEnd: function () {
                utils_1.default.clearSelection();
            }
        });
    };
    Manager.prototype.putInDocument = function () {
        document.body.appendChild(this.divBody);
        utils_1.default.disableSelection(document.body);
    };
    Manager.prototype.newFrame = function (title, address) {
        var frame = new frame_1.Frame(this, title, address);
        frame.install();
        this.frames.push(frame);
    };
    Manager.prototype.getFrame = function (fromTitle) {
        for (var _i = 0, _a = this.frames; _i < _a.length; _i++) {
            var frame = _a[_i];
            if (frame.getTitle() === fromTitle) {
                return frame;
            }
        }
        return null;
    };
    Manager.prototype.addChild = function (child) {
        this.divBody.appendChild(child);
    };
    Manager.prototype.delChild = function (child) {
        this.divBody.removeChild(child);
    };
    Manager.prototype.getFrameFromID = function (fromID) {
        for (var _i = 0, _a = this.frames; _i < _a.length; _i++) {
            var frame = _a[_i];
            if (frame.getID() === fromID) {
                return frame;
            }
        }
        return null;
    };
    Manager.prototype.getFrameIndexFromID = function (fromID) {
        for (var i = 0; i < this.frames.length; i++) {
            if (this.frames[i].getID() === fromID) {
                return i;
            }
        }
        return -1;
    };
    Manager.prototype.delFrame = function (frame) {
        var index = this.frames.indexOf(frame);
        if (index > -1) {
            this.frames.splice(index, 1);
        }
    };
    Manager.prototype.showMenu = function () {
        this.divBody.scrollTo(0, 0);
        this.showElement(this.divMenu);
    };
    Manager.prototype.showElement = function (element) {
        var _this = this;
        setTimeout(function () {
            if (element.id != "QinpelPopMenuID1") {
                _this.closePopMenu();
            }
            element.style.zIndex = String(++_this.framesTopZ);
            if (!utils_1.default.isElementVisibleInScroll(element)) {
                element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
            }
            if (element.id.indexOf("QinpelFrameID") === 0) {
                var index = _this.getFrameIndexFromID(element.id);
                if (index > 0) {
                    var frame = _this.frames[index];
                    _this.frames.splice(index, 1);
                    _this.frames.unshift(frame);
                }
            }
        }, 360);
    };
    Manager.prototype.closePopMenu = function () {
    };
    Manager.prototype.getBodyWidth = function () {
        return this.divBody.clientWidth;
    };
    Manager.prototype.getBodyHeight = function () {
        return this.divBody.clientHeight;
    };
    Manager.prototype.hasLogged = function () {
        return this.token != "";
    };
    Manager.prototype.needToLog = function () {
        return !utils_1.default.isLocalHost() && !this.hasLogged();
    };
    Manager.prototype.get = function (address, headers) {
        var configs = this.getAxiosConfig(headers);
        return axios_1.default.get(address, configs);
    };
    Manager.prototype.post = function (address, data, headers) {
        var configs = this.getAxiosConfig(headers);
        if (!configs.headers['Content-Type']) {
            if (typeof data === 'string' || data instanceof String) {
                configs.headers['Content-Type'] = "text/plain";
            }
            else if (data instanceof FormData) {
                configs.headers['Content-Type'] = "multipart/form-data";
            }
            else {
                configs.headers['Content-Type'] = "application/json";
            }
        }
        return axios_1.default.post(address, data, configs);
    };
    Manager.prototype.getAxiosConfig = function (headers) {
        if (!headers) {
            headers = {};
        }
        headers['Qinpel-Token'] = this.token;
        if (!headers['Accept-Language']) {
            if (this.userLang) {
                headers['Accept-Language'] = this.userLang;
            }
            else if (navigator.language) {
                headers['Accept-Language'] = navigator.language;
            }
        }
        var configs = {
            headers: headers
        };
        return configs;
    };
    return Manager;
}());
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map