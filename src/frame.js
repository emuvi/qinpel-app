"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = void 0;
var qinpel_res_1 = require("qinpel-res");
var param_1 = require("./param");
var qinpel_1 = require("./qinpel");
var frame_styles_1 = require("./styles/frame-styles");
var Frame = (function () {
    function Frame(manager, title, address) {
        this.rndID = Math.floor(Math.random() * 1000000);
        this.divFrame = document.createElement("div");
        this.divHead = document.createElement("div");
        this.imgMenu = document.createElement("img");
        this.divTitle = document.createElement("div");
        this.imgMinimize = document.createElement("img");
        this.imgMaximize = document.createElement("img");
        this.imgClose = document.createElement("img");
        this.iframeBody = document.createElement("iframe");
        this.divFoot = document.createElement("div");
        this.imgStatusType = document.createElement("img");
        this.divStatusText = document.createElement("div");
        this.imgResize = document.createElement("img");
        this.minimized = false;
        this.maximized = false;
        this.lastWidth = -1;
        this.lastHeight = -1;
        this.manager = manager;
        this.title = this.initFrameTitle(title);
        this.address = address;
        this.initDivFrame();
        this.initDivHead();
        this.initIFrameBody();
        this.initDivFoot();
        this.initDraggable();
    }
    Frame.prototype.initFrameTitle = function (title) {
        var result = title;
        var attempt = 1;
        while (true) {
            if (this.manager.getFrame(result) != null) {
                result = title + " (" + (++attempt) + ")";
            }
            else {
                break;
            }
        }
        return result;
    };
    Frame.prototype.initDivFrame = function () {
        this.divFrame.id = "QinpelFrameID" + this.rndID;
        this.divFrame.className = "QinpelWindowFrame";
        var frameInitBounds = this.loadFrameInitBounds();
        this.divFrame.style.left = frameInitBounds.posX + "px";
        this.divFrame.style.top = frameInitBounds.posY + "px";
        this.divFrame.style.width = frameInitBounds.width + "px";
        this.divFrame.style.height = frameInitBounds.height + "px";
        this.lastWidth = frameInitBounds.width;
        this.lastHeight = frameInitBounds.height;
    };
    Frame.prototype.loadFrameInitBounds = function () {
        var result = {
            posX: 64,
            posY: 64,
            width: 800,
            height: 600,
        };
        var windowSizeStyle = qinpel_res_1.QinSoul.skin.getWindowSizeStyle();
        var frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        var frameBoundsSaved = window.localStorage.getItem(frameStyleID);
        if (frameBoundsSaved) {
            var parts = frameBoundsSaved.split(",");
            result.posX = Number(parts[0]);
            result.posY = Number(parts[1]);
            result.width = Number(parts[2]);
            result.height = Number(parts[3]);
        }
        else {
            if (windowSizeStyle === qinpel_res_1.QinGrandeur.SMALL) {
                result.posX = 0;
                result.posY = 0;
                var size = qinpel_res_1.QinSoul.skin.getWindowSize();
                result.width = size.width - 4;
                result.height = size.height - 4;
            }
            else if (windowSizeStyle === qinpel_res_1.QinGrandeur.MEDIUM) {
                result.posX = 48;
                result.posY = 48;
                result.width = 500;
                result.height = 375;
            }
        }
        return result;
    };
    Frame.prototype.getFrameWindowStyleID = function (windowSizeStyle) {
        return "window " + windowSizeStyle + " size of: " + this.title;
    };
    Frame.prototype.initDivHead = function () {
        var _this = this;
        this.divHead.className = "QinpelWindowFrameHead";
        this.imgMenu.src = "./assets/frame-menu.png";
        this.imgMenu.alt = "o";
        qinpel_res_1.QinSoul.arm.addAction(this.imgMenu, function () { return _this.headMenuAction(); });
        this.divHead.appendChild(this.imgMenu);
        this.divTitle.className = "QinpelWindowFrameHeadTitle";
        this.divTitle.innerText = this.title;
        this.divHead.appendChild(this.divTitle);
        this.imgMinimize.src = "./assets/frame-minimize.png";
        this.imgMinimize.alt = "-";
        qinpel_res_1.QinSoul.arm.addAction(this.imgMinimize, function () { return _this.headMinimizeAction(); });
        this.divHead.appendChild(this.imgMinimize);
        this.imgMaximize.src = "./assets/frame-maximize.png";
        this.imgMaximize.alt = "+";
        qinpel_res_1.QinSoul.arm.addAction(this.imgMaximize, function () { return _this.headMaximizeAction(); });
        this.divHead.appendChild(this.imgMaximize);
        this.imgClose.src = "./assets/frame-close.png";
        this.imgClose.alt = "x";
        qinpel_res_1.QinSoul.arm.addAction(this.imgClose, function () { return _this.headCloseAction(); });
        this.divHead.appendChild(this.imgClose);
        this.divFrame.appendChild(this.divHead);
    };
    Frame.prototype.initIFrameBody = function () {
        var _this = this;
        this.iframeBody.id = "QinpelInsideFrameID" + this.rndID;
        this.iframeBody.className = "QinpelWindowFrameBody";
        this.iframeBody.src = this.address;
        this.iframeBody.onload = function (_) {
            frame_styles_1.default.applyOnIFrame(_this.iframeBody);
        };
        this.divFrame.appendChild(this.iframeBody);
    };
    Frame.prototype.initDivFoot = function () {
        this.divFoot.className = "QinpelWindowFrameFoot";
        this.imgStatusType.src = "./assets/frame-status-info.png";
        this.divFoot.appendChild(this.imgStatusType);
        this.divStatusText.className = "QinpelWindowFrameFootStatus";
        this.divStatusText.innerText = "StatusBar";
        this.divFoot.appendChild(this.divStatusText);
        this.imgResize.src = "./assets/frame-resize.png";
        this.imgResize.alt = "/";
        this.divFoot.appendChild(this.imgResize);
        this.divFrame.appendChild(this.divFoot);
    };
    Frame.prototype.initDraggable = function () {
        var _this = this;
        qinpel_res_1.QinSoul.arm.addMover([this.divHead, this.divStatusText], this.divFrame, {
            onDouble: function () { return _this.headMaximizeAction(); },
            onEnd: function () {
                _this.manager.showElement(_this.divFrame);
                qinpel_res_1.QinSoul.skin.clearSelection();
            }
        });
        qinpel_res_1.QinSoul.arm.addResizer([this.imgResize], this.divFrame, {
            onDouble: function () { return _this.headMaximizeAction(); },
            onEnd: function () {
                _this.maximized = false;
                _this.lastWidth = parseInt(_this.divFrame.style.width, 10);
                _this.lastHeight = parseInt(_this.divFrame.style.height, 10);
                _this.manager.showElement(_this.divFrame);
                qinpel_res_1.QinSoul.skin.clearSelection();
            }
        });
    };
    Frame.prototype.getTitle = function () {
        return this.title;
    };
    Frame.prototype.getID = function () {
        return this.divFrame.id;
    };
    Frame.prototype.install = function () {
        this.iframeBody.qinpel = new qinpel_1.Qinpel(this.manager, this);
        this.manager.addChild(this.divFrame);
        this.show();
    };
    Frame.prototype.headMenuAction = function () {
        this.manager.showMenu();
    };
    Frame.prototype.headMinimizeAction = function () {
        if (this.minimized) {
            this.divFrame.style.width = this.lastWidth + "px";
            this.divFrame.style.height = this.lastHeight + "px";
            this.iframeBody.style.display = "";
            this.divFoot.style.display = "";
            this.minimized = false;
        }
        else {
            if (this.maximized) {
                this.headMaximizeAction();
            }
            this.lastWidth = parseInt(this.divFrame.style.width, 10);
            this.lastHeight = parseInt(this.divFrame.style.height, 10);
            this.iframeBody.style.display = "none";
            this.divFoot.style.display = "none";
            this.divFrame.style.width = param_1.default.MINIMIZED_WIDTH + "px";
            this.divFrame.style.height = this.divHead.clientHeight + "px";
            this.minimized = true;
        }
        this.manager.showElement(this.divFrame);
    };
    Frame.prototype.headMaximizeAction = function () {
        if (this.maximized) {
            this.divFrame.style.width = this.lastWidth + "px";
            this.divFrame.style.height = this.lastHeight + "px";
            this.maximized = false;
        }
        else {
            if (this.minimized) {
                this.headMinimizeAction();
            }
            this.lastWidth = parseInt(this.divFrame.style.width, 10);
            this.lastHeight = parseInt(this.divFrame.style.height, 10);
            this.divFrame.style.width = this.manager.getBodyWidth() - 4 + "px";
            this.divFrame.style.height = this.manager.getBodyHeight() - 4 + "px";
            this.maximized = true;
        }
        this.manager.showElement(this.divFrame);
    };
    Frame.prototype.headCloseAction = function () {
        this.close();
    };
    Frame.prototype.statusInfo = function (message) {
        this.divStatusText.innerText = message;
    };
    Frame.prototype.statusError = function (error, origin) {
        this.imgStatusType.src = "./assets/frame-status-error.png";
        this.divStatusText.innerText = qinpel_res_1.QinSoul.head.getErrorMessage(error, origin);
    };
    Frame.prototype.saveFrameBounds = function () {
        var windowSizeStyle = qinpel_res_1.QinSoul.skin.getWindowSizeStyle();
        var frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        var frameBounds = parseInt(this.divFrame.style.left, 10) + "," +
            parseInt(this.divFrame.style.top, 10) + "," +
            parseInt(this.divFrame.style.width, 10) + "," +
            parseInt(this.divFrame.style.height, 10);
        window.localStorage.setItem(frameStyleID, frameBounds);
    };
    Frame.prototype.show = function () {
        this.manager.showElement(this.divFrame);
    };
    Frame.prototype.close = function () {
        this.saveFrameBounds();
        this.manager.delChild(this.divFrame);
        this.manager.delFrame(this);
    };
    Frame.prototype.newDialog = function (title, divContent) {
        var docBody = this.iframeBody.contentWindow.document.body;
        return new FrameDialog(title, docBody, divContent);
    };
    return Frame;
}());
exports.Frame = Frame;
var FrameDialog = (function () {
    function FrameDialog(title, docBody, divContent) {
        this.divDialog = document.createElement("div");
        this.divTop = document.createElement("div");
        this.spanTitle = document.createElement("span");
        this.spanClose = document.createElement("span");
        this.imgClose = document.createElement("img");
        this.divPack = document.createElement("div");
        this.showing = false;
        this.docNodes = [];
        this.title = title;
        this.docBody = docBody;
        this.divContent = divContent;
        this.initDialog();
        this.initTop();
        this.initPack();
    }
    FrameDialog.prototype.initDialog = function () {
        frame_styles_1.default.applyOnDialog(this.divDialog);
    };
    FrameDialog.prototype.initTop = function () {
        var _this = this;
        frame_styles_1.default.applyOnDialogTop(this.divTop);
        this.divDialog.appendChild(this.divTop);
        frame_styles_1.default.applyOnDialogTitle(this.spanTitle);
        this.spanTitle.innerText = this.title;
        this.divTop.appendChild(this.spanTitle);
        frame_styles_1.default.applyOnDialogClose(this.spanClose);
        this.divTop.appendChild(this.spanClose);
        frame_styles_1.default.applyOnDialogImage(this.imgClose);
        this.imgClose.src = "/run/app/qinpel-app/assets/frame-close.png";
        this.spanClose.appendChild(this.imgClose);
        qinpel_res_1.QinSoul.arm.addAction(this.spanClose, function (_) {
            _this.close();
        });
    };
    FrameDialog.prototype.initPack = function () {
        this.divDialog.appendChild(this.divPack);
        frame_styles_1.default.applyOnDialogPack(this.divPack);
        this.divPack.appendChild(this.divContent);
    };
    FrameDialog.prototype.show = function () {
        if (this.showing) {
            return;
        }
        this.docNodes = [];
        for (var i = 0; i < this.docBody.childNodes.length; i++) {
            var child = this.docBody.childNodes[i];
            this.docNodes.push(child);
        }
        for (var _i = 0, _a = this.docNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            this.docBody.removeChild(child);
        }
        this.docBody.appendChild(this.divDialog);
        this.showing = true;
    };
    FrameDialog.prototype.close = function () {
        if (!this.showing) {
            return;
        }
        this.docBody.removeChild(this.divDialog);
        for (var _i = 0, _a = this.docNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            this.docBody.appendChild(child);
        }
        this.docNodes = [];
        this.showing = false;
    };
    return FrameDialog;
}());
//# sourceMappingURL=frame.js.map