(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qin_manager_1 = require("./qin-manager");
const manager = new qin_manager_1.QinManager();
manager.putInDocument();
exports.default = manager;

},{"./qin-manager":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinFramePopup = exports.QinFrameDialog = exports.QinFrame = void 0;
const qinpel_res_1 = require("qinpel-res");
const qinpel_1 = require("./qinpel");
class QinFrame {
    constructor(manager, title, appName, options) {
        this.waiters = [];
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
        this.statusRecords = [];
        this.manager = manager;
        this.title = this.initFrameTitle(title);
        this.appName = appName;
        this.options = options ? options : {};
        this.initDivFrame();
        this.initDivHead();
        this.initIFrameBody();
        this.initDivFoot();
        this.initDraggable();
    }
    initFrameTitle(title) {
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
    }
    initDivFrame() {
        this.divFrame.id = "QinpelFrameID" + this.rndID;
        this.divFrame.className = "QinpelWindowFrame";
        const frameInitBounds = this.loadFrameInitBounds();
        this.divFrame.style.left = frameInitBounds.posX + "px";
        this.divFrame.style.top = frameInitBounds.posY + "px";
        this.divFrame.style.width = frameInitBounds.width + "px";
        this.divFrame.style.height = frameInitBounds.height + "px";
        this.lastWidth = frameInitBounds.width;
        this.lastHeight = frameInitBounds.height;
    }
    loadFrameInitBounds() {
        const result = {
            posX: 64,
            posY: 64,
            width: 800,
            height: 600,
        };
        let windowSizeStyle = qinpel_res_1.QinSoul.skin.getWindowSizeStyle();
        const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        const frameBoundsSaved = window.localStorage.getItem(frameStyleID);
        if (frameBoundsSaved) {
            let parts = frameBoundsSaved.split(",");
            result.posX = Number(parts[0]);
            result.posY = Number(parts[1]);
            result.width = Number(parts[2]);
            result.height = Number(parts[3]);
        }
        else {
            if (windowSizeStyle === qinpel_res_1.QinGrandeur.SMALL) {
                result.posX = 0;
                result.posY = 0;
                const size = qinpel_res_1.QinSoul.skin.getWindowSize();
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
    }
    getFrameWindowStyleID(windowSizeStyle) {
        return "window " + windowSizeStyle + " size of: " + this.title;
    }
    initDivHead() {
        this.divHead.className = "QinpelWindowFrameHead";
        this.imgMenu.src = "./assets/frame-menu.png";
        this.imgMenu.alt = "o";
        qinpel_res_1.QinSoul.arm.addAction(this.imgMenu, () => this.headMenuAction());
        this.divHead.appendChild(this.imgMenu);
        this.divTitle.className = "QinpelWindowFrameHeadTitle";
        this.divTitle.innerText = this.title;
        this.divHead.appendChild(this.divTitle);
        this.imgMinimize.src = "./assets/frame-minimize.png";
        this.imgMinimize.alt = "-";
        qinpel_res_1.QinSoul.arm.addAction(this.imgMinimize, () => this.headMinimizeAction());
        this.divHead.appendChild(this.imgMinimize);
        this.imgMaximize.src = "./assets/frame-maximize.png";
        this.imgMaximize.alt = "+";
        qinpel_res_1.QinSoul.arm.addAction(this.imgMaximize, () => this.headMaximizeAction());
        this.divHead.appendChild(this.imgMaximize);
        this.imgClose.src = "./assets/frame-close.png";
        this.imgClose.alt = "x";
        qinpel_res_1.QinSoul.arm.addAction(this.imgClose, () => this.headCloseAction());
        this.divHead.appendChild(this.imgClose);
        this.divFrame.appendChild(this.divHead);
    }
    initIFrameBody() {
        this.iframeBody.id = "QinpelInsideFrameID" + this.rndID;
        this.iframeBody.className = "QinpelWindowFrameBody";
        let address = this.appName;
        if (!address.startsWith("/run/app/")) {
            address = "/run/app/" + address + "/index.html";
        }
        this.iframeBody.src = address;
        this.iframeBody.onload = (_) => {
            styles.applyOnIFrame(this.iframeBody);
        };
        this.divFrame.appendChild(this.iframeBody);
    }
    initDivFoot() {
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
    }
    initDraggable() {
        qinpel_res_1.QinSoul.arm.addMover([this.divHead, this.divStatusText], this.divFrame, {
            onDouble: () => this.headMaximizeAction(),
            onEnd: () => {
                this.manager.showElement(this.divFrame);
                qinpel_res_1.QinSoul.skin.clearSelection();
            }
        });
        qinpel_res_1.QinSoul.arm.addResizer([this.imgResize], this.divFrame, {
            onDouble: () => this.headMaximizeAction(),
            onEnd: () => {
                this.maximized = false;
                this.lastWidth = parseInt(this.divFrame.style.width, 10);
                this.lastHeight = parseInt(this.divFrame.style.height, 10);
                this.manager.showElement(this.divFrame);
                qinpel_res_1.QinSoul.skin.clearSelection();
            }
        });
    }
    getManager() {
        return this.manager;
    }
    getTitle() {
        return this.title;
    }
    getAppName() {
        return this.appName;
    }
    getOption(name) {
        return this.options[name];
    }
    setOption(name, value) {
        this.options[name] = value;
    }
    putOptions(options) {
        if (options) {
            Object.assign(this.options, options);
        }
    }
    cleanOptions() {
        this.options = {};
    }
    addWaiter(waiter) {
        this.waiters.push(waiter);
    }
    hasWaiters() {
        return this.waiters.length > 0;
    }
    sendWaiters(withResult) {
        for (const waiter of this.waiters) {
            waiter(withResult);
        }
    }
    cleanWaiters() {
        this.waiters = [];
    }
    getID() {
        return this.divFrame.id;
    }
    install() {
        this.iframeBody.qinpel = new qinpel_1.Qinpel(this.manager, this);
        this.manager.addChild(this.divFrame);
        this.show();
    }
    headMenuAction() {
        this.manager.showMenu();
    }
    headMinimizeAction() {
        this.minimize();
    }
    headMaximizeAction() {
        this.maximize();
    }
    headCloseAction() {
        this.close();
    }
    statusInfo(message) {
        let rec = {
            kind: StatusKind.INFO,
            message: message
        };
        this.statusRecords.push(rec);
        this.divStatusText.innerText = this.getDisplayStatusMessage(message);
    }
    statusError(error, origin) {
        let message = qinpel_res_1.QinSoul.head.getErrorMessage(error, origin);
        let rec = {
            kind: StatusKind.ERROR,
            message: message
        };
        this.statusRecords.push(rec);
        this.imgStatusType.src = "./assets/frame-status-error.png";
        this.divStatusText.innerText = this.getDisplayStatusMessage(message);
    }
    getDisplayStatusMessage(message) {
        if (message.length > FaceConfigs.STATUS_MESSAGE_MAX_LENGTH) {
            return message.substring(0, FaceConfigs.STATUS_MESSAGE_MAX_LENGTH);
        }
        else {
            return message;
        }
    }
    saveFrameBounds() {
        let windowSizeStyle = qinpel_res_1.QinSoul.skin.getWindowSizeStyle();
        const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        const frameBounds = parseInt(this.divFrame.style.left, 10) + "," +
            parseInt(this.divFrame.style.top, 10) + "," +
            parseInt(this.divFrame.style.width, 10) + "," +
            parseInt(this.divFrame.style.height, 10);
        window.localStorage.setItem(frameStyleID, frameBounds);
    }
    show() {
        this.manager.showElement(this.divFrame);
    }
    minimize() {
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
            this.divFrame.style.width = FaceConfigs.MINIMIZED_WIDTH + "px";
            this.divFrame.style.height = this.divHead.clientHeight + "px";
            this.minimized = true;
        }
        this.manager.showElement(this.divFrame);
    }
    maximize() {
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
    }
    close() {
        this.saveFrameBounds();
        this.manager.delChild(this.divFrame);
        this.manager.delFrame(this);
    }
    getIFrame() {
        return this.iframeBody;
    }
    getIFrameDocument() {
        return this.iframeBody.contentWindow.document;
    }
    newDialog(title, divContent) {
        return new QinFrameDialog(this, title, divContent);
    }
    newPopup(divContent) {
        return new QinFramePopup(this, divContent);
    }
    navigate(url) {
        this.iframeBody.src = url;
    }
}
exports.QinFrame = QinFrame;
class QinFrameDialog {
    constructor(frame, title, divContent) {
        this.divDialog = document.createElement("div");
        this.divTop = document.createElement("div");
        this.spanTitle = document.createElement("span");
        this.spanClose = document.createElement("span");
        this.imgClose = document.createElement("img");
        this.divPack = document.createElement("div");
        this.showing = false;
        this.docNodes = [];
        this.frame = frame;
        this.title = title;
        this.divContent = divContent;
        this.initDialog();
        this.initTop();
        this.initPack();
    }
    initDialog() {
        styles.applyOnDialog(this.divDialog);
    }
    initTop() {
        styles.applyOnDialogTop(this.divTop);
        this.divDialog.appendChild(this.divTop);
        styles.applyOnDialogTitle(this.spanTitle);
        this.spanTitle.innerText = this.title;
        this.divTop.appendChild(this.spanTitle);
        styles.applyOnDialogClose(this.spanClose);
        this.divTop.appendChild(this.spanClose);
        styles.applyOnDialogImage(this.imgClose);
        this.imgClose.src = "/run/app/qinpel-app/assets/frame-close.png";
        this.spanClose.appendChild(this.imgClose);
        qinpel_res_1.QinSoul.arm.addAction(this.spanClose, (_) => {
            this.close();
        });
    }
    initPack() {
        this.divDialog.appendChild(this.divPack);
        styles.applyOnDialogPack(this.divPack);
        this.divPack.appendChild(this.divContent);
    }
    show() {
        if (this.showing) {
            return;
        }
        this.docNodes = [];
        for (let i = 0; i < this.frame.getIFrameDocument().body.childNodes.length; i++) {
            const child = this.frame.getIFrameDocument().body.childNodes[i];
            this.docNodes.push(child);
        }
        for (const child of this.docNodes) {
            this.frame.getIFrameDocument().body.removeChild(child);
        }
        this.frame.getIFrameDocument().body.appendChild(this.divDialog);
        this.showing = true;
    }
    close() {
        if (!this.showing) {
            return;
        }
        this.frame.getIFrameDocument().body.removeChild(this.divDialog);
        for (const child of this.docNodes) {
            this.frame.getIFrameDocument().body.appendChild(child);
        }
        this.docNodes = [];
        this.showing = false;
    }
}
exports.QinFrameDialog = QinFrameDialog;
class QinFramePopup {
    constructor(frame, divContent) {
        this._divMain = document.createElement("div");
        this._posLeft = 18;
        this._posTop = 18;
        this._frame = frame;
        this._divContent = divContent;
        this.initMain();
    }
    initMain() {
        this._divMain.appendChild(this._divContent);
        qinpel_res_1.QinSoul.skin.styleAsEdit(this._divMain);
        this._divMain.style.position = "absolute";
        this._divMain.style.padding = "5px";
        this._divMain.style.overflow = "auto";
        this.addFocusOutCloseToAll(this._divMain);
    }
    addFocusOutCloseToAll(el) {
        el.addEventListener("focusout", (ev) => this.onFocusOutClose(ev));
        for (let index = 0; index < el.children.length; index++) {
            const child = el.children.item(index);
            if (child instanceof HTMLElement) {
                this.addFocusOutCloseToAll(child);
            }
        }
    }
    onFocusOutClose(ev) {
        setTimeout(() => {
            if (!this._divMain.contains(this._frame.getIFrameDocument().activeElement)) {
                this.close();
            }
        }, 360);
        return qinpel_res_1.QinSoul.arm.stopEvent(ev);
    }
    show() {
        this.close();
        this._frame.getIFrameDocument().body.appendChild(this._divMain);
        this._maxWidth = this._frame.getIFrame().clientWidth - (this._posLeft * 3);
        this._maxHeight = this._frame.getIFrame().clientHeight - (this._posTop * 3);
        this._divMain.style.left = this._posLeft + "px";
        this._divMain.style.top = this._posTop + "px";
        this._divMain.style.maxWidth = this._maxWidth + "px";
        this._divMain.style.maxHeight = this._maxHeight + "px";
        this._divMain.tabIndex = 0;
        this._divMain.focus();
    }
    close() {
        if (this._frame.getIFrameDocument().body.contains(this._divMain)) {
            this._frame.getIFrameDocument().body.removeChild(this._divMain);
        }
    }
    toggle() {
        if (this._frame.getIFrameDocument().body.contains(this._divMain)) {
            this.close();
        }
        else {
            this.show();
        }
    }
    get frame() {
        return this._frame;
    }
    get divContent() {
        return this._divContent;
    }
    get divMain() {
        return this._divMain;
    }
    get posLeft() {
        return this._posLeft;
    }
    get posTop() {
        return this._posTop;
    }
    get maxWidth() {
        return this._maxWidth;
    }
    get maxHeight() {
        return this._maxHeight;
    }
}
exports.QinFramePopup = QinFramePopup;
const styles = {
    applyOnIFrame: (el) => {
        const head = el.contentWindow.document.head;
        const defaultCSS = document.createElement('link');
        defaultCSS.id = "QinpelIFrameDefaultCSS";
        defaultCSS.rel = "stylesheet";
        defaultCSS.type = "text/css";
        defaultCSS.href = "/run/app/qinpel-app/default.css";
        defaultCSS.media = "all";
        head.appendChild(defaultCSS);
    },
    applyOnDialog: (el) => {
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.right = "0px";
        el.style.bottom = "0px";
        el.style.left = "0px";
        el.style.display = "flex";
        el.style.flexDirection = "column";
    },
    applyOnDialogTop: (el) => {
        el.style.flex = "0";
        el.style.padding = "3px";
        el.style.margin = "0px";
        el.style.border = "0px";
        el.style.display = "flex";
        el.style.flexDirection = "row";
        el.style.flexWrap = "wrap";
        el.style.alignItems = "center";
        el.style.backgroundColor = qinpel_res_1.QinStyles.ColorForeground;
        el.style.color = qinpel_res_1.QinStyles.ColorBackground;
    },
    applyOnDialogPack: (el) => {
        el.style.flex = "1";
        el.style.overflow = "auto";
        el.style.display = "flex";
        el.style.justifyContent = "center";
        el.style.alignItems = "center";
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
    },
    applyOnDialogTitle: (el) => {
        el.style.flex = "1";
        el.style.textAlign = "center";
        el.style.fontWeight = "bold";
    },
    applyOnDialogClose: (el) => {
        el.style.flex = "0";
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
        el.style.display = "flex";
        el.style.justifyContent = "center";
        el.style.alignItems = "center";
    },
    applyOnDialogImage: (el) => {
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
    },
};
var StatusKind;
(function (StatusKind) {
    StatusKind[StatusKind["INFO"] = 0] = "INFO";
    StatusKind[StatusKind["ERROR"] = 1] = "ERROR";
})(StatusKind || (StatusKind = {}));
const FaceConfigs = {
    POP_MENU_MAX_HEIGHT: 270,
    POP_MENU_WIDTH: 180,
    MINIMIZED_WIDTH: 180,
    STATUS_MESSAGE_MAX_LENGTH: 180,
};

},{"./qinpel":4,"qinpel-res":34}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinManager = void 0;
const axios_1 = require("axios");
const qinpel_res_1 = require("qinpel-res");
const qin_frame_1 = require("./qin-frame");
class QinManager {
    constructor() {
        this.divBody = document.createElement("div");
        this.divMenu = document.createElement("div");
        this.imgMenu = document.createElement("img");
        this.frames = [];
        this.framesTopZ = 1;
        this.userLang = "";
        this.userToken = "";
        this.initBody();
        this.initMenu();
        this.initDraggable();
    }
    initBody() {
        this.divBody.className = "QinpelWindowBody";
    }
    initMenu() {
        this.divMenu.id = "QinpelMenuID0";
        this.divMenu.className = "QinpelWindowMenu";
        this.imgMenu.src = "./assets/qinpel.png";
        this.imgMenu.alt = "Menu";
        this.divMenu.appendChild(this.imgMenu);
        this.divBody.appendChild(this.divMenu);
        qinpel_res_1.QinSoul.arm.addAction(this.divMenu, (event) => {
            if (event.hasShift) {
                document.body.requestFullscreen();
            }
            else {
                this.newFrame("Qinpel", "/run/app/qinpel-app/menu.html");
            }
            return false;
        });
    }
    initDraggable() {
        qinpel_res_1.QinSoul.arm.addScroller(this.divBody, {
            onDouble: () => {
                this.divBody.scrollTo(0, 0);
                qinpel_res_1.QinSoul.skin.clearSelection();
            },
            onEnd: () => {
                qinpel_res_1.QinSoul.skin.clearSelection();
            }
        });
    }
    putInDocument() {
        document.body.appendChild(this.divBody);
        qinpel_res_1.QinSoul.skin.disableSelection(document.body);
    }
    newFrame(title, appName, options) {
        let result = new qin_frame_1.QinFrame(this, title, appName, options);
        result.install();
        this.frames.push(result);
        return result;
    }
    getFrame(fromTitle) {
        for (const frame of this.frames) {
            if (frame.getTitle() === fromTitle) {
                return frame;
            }
        }
        return null;
    }
    addChild(child) {
        this.divBody.appendChild(child);
    }
    delChild(child) {
        this.divBody.removeChild(child);
    }
    getFrameFromID(fromID) {
        for (const frame of this.frames) {
            if (frame.getID() === fromID) {
                return frame;
            }
        }
        return null;
    }
    getFrameIndexFromID(fromID) {
        for (let i = 0; i < this.frames.length; i++) {
            if (this.frames[i].getID() === fromID) {
                return i;
            }
        }
        return -1;
    }
    delFrame(frame) {
        const index = this.frames.indexOf(frame);
        if (index > -1) {
            this.frames.splice(index, 1);
        }
    }
    showElement(element) {
        setTimeout(() => {
            if (element.id != "QinpelPopMenuID1") {
                this.popMenuClose();
            }
            element.style.zIndex = String(++this.framesTopZ);
            if (!qinpel_res_1.QinSoul.skin.isElementVisibleInScroll(element)) {
                element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
            }
            if (element.id.indexOf("QinpelFrameID") === 0) {
                const index = this.getFrameIndexFromID(element.id);
                if (index > 0) {
                    const frame = this.frames[index];
                    this.frames.splice(index, 1);
                    this.frames.unshift(frame);
                }
            }
        }, 360);
    }
    showMenu() {
        this.divBody.scrollTo(0, 0);
        this.showElement(this.divMenu);
    }
    showPopMenu() {
    }
    popMenuClose() {
    }
    showAlert(message) {
        alert(message);
    }
    getBodyWidth() {
        return this.divBody.clientWidth;
    }
    getBodyHeight() {
        return this.divBody.clientHeight;
    }
    hasLogged() {
        return this.userToken != "";
    }
    needToLog() {
        return !qinpel_res_1.QinSoul.foot.isLocalHost() && !this.hasLogged();
    }
    getAxiosConfig(headers) {
        if (!headers) {
            headers = {};
        }
        headers['Qinpel-Token'] = this.userToken;
        if (!headers['Accept-Language']) {
            if (this.userLang) {
                headers['Accept-Language'] = this.userLang;
            }
            else if (navigator.language) {
                headers['Accept-Language'] = navigator.language;
            }
        }
        let configs = {
            headers
        };
        return configs;
    }
    get(address, headers) {
        let configs = this.getAxiosConfig(headers);
        return axios_1.default.get(address, configs);
    }
    post(address, data, headers) {
        let configs = this.getAxiosConfig(headers);
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
    }
    tryEnter(name, pass) {
        return new Promise((resolve, reject) => {
            this.post("/enter", { name, pass })
                .then(res => {
                this.userLang = res.data.lang;
                this.userToken = res.data.token;
                resolve(this.userLang);
            })
                .catch(err => reject(err));
        });
    }
}
exports.QinManager = QinManager;

},{"./qin-frame":2,"axios":5,"qinpel-res":34}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qinpel = void 0;
const qinpel_res_1 = require("qinpel-res");
class Qinpel {
    constructor(manager, frame) {
        this.utils = qinpel_res_1.QinSoul;
        this.manager = manager;
        this.frame = frame;
    }
    get(address, headers) {
        return this.manager.get(address, headers);
    }
    post(address, data, headers) {
        return this.manager.post(address, data, headers);
    }
}
exports.Qinpel = Qinpel;

},{"qinpel-res":34}],5:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":7}],6:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var defaults = require('../defaults');
var Cancel = require('../cancel/Cancel');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../cancel/Cancel":8,"../core/buildFullPath":13,"../core/createError":14,"../defaults":20,"./../core/settle":18,"./../helpers/buildURL":23,"./../helpers/cookies":25,"./../helpers/isURLSameOrigin":28,"./../helpers/parseHeaders":30,"./../utils":33}],7:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
axios.VERSION = require('./env/data').version;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":8,"./cancel/CancelToken":9,"./cancel/isCancel":10,"./core/Axios":11,"./core/mergeConfig":17,"./defaults":20,"./env/data":21,"./helpers/bind":22,"./helpers/isAxiosError":27,"./helpers/spread":31,"./utils":33}],8:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],9:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":8}],10:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],11:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":23,"../helpers/validator":32,"./../utils":33,"./InterceptorManager":12,"./dispatchRequest":15,"./mergeConfig":17}],12:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":33}],13:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":24,"../helpers/isAbsoluteURL":26}],14:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":16}],15:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var Cancel = require('../cancel/Cancel');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/Cancel":8,"../cancel/isCancel":10,"../defaults":20,"./../utils":33,"./transformData":19}],16:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};

},{}],17:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};

},{"../utils":33}],18:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":14}],19:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":20,"./../utils":33}],20:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))

},{"./adapters/http":6,"./adapters/xhr":6,"./core/enhanceError":16,"./helpers/normalizeHeaderName":29,"./utils":33,"_process":41}],21:[function(require,module,exports){
module.exports = {
  "version": "0.22.0"
};
},{}],22:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],23:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":33}],24:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],25:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":33}],26:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],27:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],28:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":33}],29:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":33}],30:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":33}],31:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],32:[function(require,module,exports){
'use strict';

var VERSION = require('../env/data').version;

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};

},{"../env/data":21}],33:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":22}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinFoot = exports.QinFilesDescriptor = exports.QinFilesOperation = exports.QinFilesNature = exports.QinArm = exports.QinDragCalls = exports.QinEvent = exports.QinSoul = exports.QinBody = exports.QinHead = exports.QinGrandeur = exports.QinBounds = exports.QinDimension = exports.QinPoint = exports.QinSkin = exports.QinStyles = void 0;
var qin_skin_1 = require("./qin-skin");
Object.defineProperty(exports, "QinStyles", { enumerable: true, get: function () { return qin_skin_1.QinStyles; } });
Object.defineProperty(exports, "QinSkin", { enumerable: true, get: function () { return qin_skin_1.QinSkin; } });
var qin_head_1 = require("./qin-head");
Object.defineProperty(exports, "QinPoint", { enumerable: true, get: function () { return qin_head_1.QinPoint; } });
Object.defineProperty(exports, "QinDimension", { enumerable: true, get: function () { return qin_head_1.QinDimension; } });
Object.defineProperty(exports, "QinBounds", { enumerable: true, get: function () { return qin_head_1.QinBounds; } });
Object.defineProperty(exports, "QinGrandeur", { enumerable: true, get: function () { return qin_head_1.QinGrandeur; } });
Object.defineProperty(exports, "QinHead", { enumerable: true, get: function () { return qin_head_1.QinHead; } });
var qin_body_1 = require("./qin-body");
Object.defineProperty(exports, "QinBody", { enumerable: true, get: function () { return qin_body_1.QinBody; } });
var qin_soul_1 = require("./qin-soul");
Object.defineProperty(exports, "QinSoul", { enumerable: true, get: function () { return qin_soul_1.QinSoul; } });
var qin_arm_1 = require("./qin-arm");
Object.defineProperty(exports, "QinEvent", { enumerable: true, get: function () { return qin_arm_1.QinEvent; } });
Object.defineProperty(exports, "QinDragCalls", { enumerable: true, get: function () { return qin_arm_1.QinDragCalls; } });
Object.defineProperty(exports, "QinArm", { enumerable: true, get: function () { return qin_arm_1.QinArm; } });
var qin_foot_1 = require("./qin-foot");
Object.defineProperty(exports, "QinFilesNature", { enumerable: true, get: function () { return qin_foot_1.QinFilesNature; } });
Object.defineProperty(exports, "QinFilesOperation", { enumerable: true, get: function () { return qin_foot_1.QinFilesOperation; } });
Object.defineProperty(exports, "QinFilesDescriptor", { enumerable: true, get: function () { return qin_foot_1.QinFilesDescriptor; } });
Object.defineProperty(exports, "QinFoot", { enumerable: true, get: function () { return qin_foot_1.QinFoot; } });

},{"./qin-arm":35,"./qin-body":36,"./qin-foot":37,"./qin-head":38,"./qin-skin":39,"./qin-soul":40}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinArm = exports.QinDragCalls = exports.QinEvent = void 0;
const qin_skin_1 = require("./qin-skin");
class QinEvent {
    constructor() {
        this.fromOrigin = null;
        this.fromTyping = false;
        this.fromPointing = false;
        this.hasAlt = false;
        this.hasCtrl = false;
        this.hasShift = false;
        this.hasMeta = false;
        this.isEnter = false;
        this.isEscape = false;
        this.isSpace = false;
        this.isDouble = false;
        this.isLong = false;
        this.keyTyped = "";
        this.pointOnX = -1;
        this.pointOnY = -1;
        this.isFirstButton = false;
        this.isMiddleButton = false;
        this.isSecondButton = false;
        this.isOneFinger = false;
        this.isTwoFingers = false;
        this.isThreeFingers = false;
        this.stopEvent = false;
    }
    setFromKeyboard(ev) {
        this.fromOrigin = ev.target;
        this.fromTyping = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        this.isEnter = isKeyEnter(ev);
        this.isEscape = isKeyEscape(ev);
        this.isSpace = isKeySpace(ev);
        this.keyTyped = ev.key;
        return this;
    }
    setFromMouse(ev) {
        this.fromOrigin = ev.target;
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        this.pointOnX = ev.clientX;
        this.pointOnY = ev.clientY;
        this.isFirstButton = ev.button == 0;
        this.isMiddleButton = ev.button == 1;
        this.isSecondButton = ev.button == 2;
        return this;
    }
    setFromTouch(ev) {
        this.fromOrigin = ev.target;
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        if (ev.touches.length > 0) {
            let index = (ev.touches.length / 2) | 0;
            this.pointOnX = ev.touches[index].clientX;
            this.pointOnY = ev.touches[index].clientY;
        }
        this.isOneFinger = ev.touches.length == 1;
        this.isTwoFingers = ev.touches.length == 2;
        this.isThreeFingers = ev.touches.length == 3;
        return this;
    }
    stop() {
        this.stopEvent = true;
    }
    isPrimary() {
        if (this.fromTyping) {
            return this.isEnter || this.isSpace;
        }
        else if (this.fromPointing) {
            return this.isFirstButton || this.isOneFinger;
        }
        return false;
    }
    isAuxiliary() {
        if (this.fromTyping) {
            return this.hasCtrl && this.hasAlt && this.isSpace;
        }
        else if (this.fromPointing) {
            return this.isMiddleButton || this.isThreeFingers;
        }
        return false;
    }
    isSecondary() {
        if (this.fromTyping) {
            return this.hasCtrl && !this.hasAlt && this.isSpace;
        }
        else if (this.fromPointing) {
            return this.isSecondButton || this.isTwoFingers;
        }
        return false;
    }
}
exports.QinEvent = QinEvent;
;
class QinDragCalls {
}
exports.QinDragCalls = QinDragCalls;
function stopEvent(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    event.cancelBubble = true;
    return false;
}
var lastEventPointer = null;
function makeEventPointer(isDown, ev) {
    const result = {
        posX: 0,
        posY: 0,
    };
    if (ev instanceof MouseEvent) {
        if (ev.clientX || ev.clientY) {
            result.posX = ev.clientX;
            result.posY = ev.clientY;
        }
    }
    else if (ev instanceof TouchEvent) {
        if (ev.touches &&
            ev.touches[0] &&
            (ev.touches[0].clientX || ev.touches[0].clientY)) {
            result.posX = ev.touches[0].clientX;
            result.posY = ev.touches[0].clientY;
        }
    }
    if (isDown) {
        lastEventPointer = ev;
    }
    return result;
}
function isEventPointerDouble(isDown, ev) {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif < 450;
}
function isEventPointerLong(isDown, ev) {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif > 840;
}
function isKeyInList(ev, list) {
    let keyLower = ev.key.toLowerCase();
    return list.indexOf(keyLower) > -1;
}
function isKeyEnter(ev) {
    return isKeyInList(ev, ["enter", "return"]) || ev.keyCode === 13;
}
function isKeyEscape(ev) {
    return isKeyInList(ev, ["esc", "escape"]) || ev.keyCode === 27;
}
function isKeySpace(ev) {
    return isKeyInList(ev, [" ", "space", "spacebar"]) || ev.keyCode === 32;
}
function addAction(element, action) {
    element.addEventListener("keydown", stopEvent);
    element.addEventListener("keyup", actionKeyboard);
    element.addEventListener("mousedown", stopEvent);
    element.addEventListener("mouseup", actionMouse);
    element.addEventListener("touchstart", stopEvent);
    element.addEventListener("touchend", actionTouch);
    function actionKeyboard(ev) {
        let qinEvent = new QinEvent().setFromKeyboard(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actionMouse(ev) {
        let qinEvent = new QinEvent().setFromMouse(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actionTouch(ev) {
        let qinEvent = new QinEvent().setFromTouch(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
}
function addActionEnter(element, action) {
    element.onkeydown = actionKeyboard;
    function actionKeyboard(ev) {
        if (isKeyEnter(ev)) {
            action(new QinEvent().setFromKeyboard(ev));
            return stopEvent(ev);
        }
    }
}
function putActionProxy(destiny, origins) {
    for (const origin of origins) {
        origin.addEventListener("keyup", e => {
            destiny.onkeydown(e);
        });
        origin.addEventListener("mouseup", e => {
            destiny.onmouseup(e);
        });
        origin.addEventListener("touchend", e => {
            destiny.ontouchend(e);
        });
    }
}
function addMover(sources, target, dragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitPosX = 0;
    var dragInitPosY = 0;
    for (let source of sources) {
        source.onmousedown = onMoverInit;
        source.ontouchstart = onMoverInit;
        source.ondragstart = stopEvent;
    }
    function onMoverInit(ev) {
        if (document.onmousemove || document.ontouchmove) {
            return;
        }
        if (dragCalls && dragCalls.onDouble && isEventPointerDouble(true, ev)) {
            dragCalls.onDouble();
            return;
        }
        if (dragCalls && dragCalls.onLong && isEventPointerLong(true, ev)) {
            dragCalls.onLong();
            return;
        }
        const pointer = makeEventPointer(true, ev);
        dragInitEventX = pointer.posX;
        dragInitEventY = pointer.posY;
        dragInitPosX = parseInt(target.style.left, 10);
        dragInitPosY = parseInt(target.style.top, 10);
        document.ontouchmove = onMoverMove;
        document.onmousemove = onMoverMove;
        document.ontouchend = onMoverClose;
        document.onmouseup = onMoverClose;
        qin_skin_1.QinSkin.hideAllIFrames();
        if (dragCalls && dragCalls.onStart) {
            dragCalls.onStart();
        }
        return stopEvent(ev);
    }
    function onMoverMove(ev) {
        const pointer = makeEventPointer(false, ev);
        var dragDifX = pointer.posX - dragInitEventX;
        var dragDifY = pointer.posY - dragInitEventY;
        var dragFinalX = dragInitPosX + dragDifX;
        var dragFinalY = dragInitPosY + dragDifY;
        target.style.left = (dragFinalX > 0 ? dragFinalX : 0) + "px";
        target.style.top = (dragFinalY > 0 ? dragFinalY : 0) + "px";
        if (dragCalls && dragCalls.onMove) {
            dragCalls.onMove();
        }
        return stopEvent(ev);
    }
    function onMoverClose(ev) {
        document.ontouchmove = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.onmouseup = null;
        qin_skin_1.QinSkin.showAllIFrames();
        qin_skin_1.QinSkin.clearSelection();
        if (dragCalls && dragCalls.onEnd) {
            dragCalls.onEnd();
        }
        return stopEvent(ev);
    }
}
function addResizer(sources, target, dragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitWidth = 0;
    var dragInitHeight = 0;
    for (let source of sources) {
        source.onmousedown = onResizerInit;
        source.ontouchstart = onResizerInit;
        source.ondragstart = stopEvent;
    }
    function onResizerInit(ev) {
        if (document.onmousemove || document.ontouchmove) {
            return;
        }
        if (dragCalls && dragCalls.onDouble && isEventPointerDouble(true, ev)) {
            dragCalls.onDouble();
            return;
        }
        if (dragCalls && dragCalls.onLong && isEventPointerLong(true, ev)) {
            dragCalls.onLong();
            return;
        }
        const pointer = makeEventPointer(true, ev);
        dragInitEventX = pointer.posX;
        dragInitEventY = pointer.posY;
        dragInitWidth = parseInt(target.style.width, 10);
        dragInitHeight = parseInt(target.style.height, 10);
        document.ontouchmove = onResizerMove;
        document.onmousemove = onResizerMove;
        document.ontouchend = onResizerClose;
        document.onmouseup = onResizerClose;
        qin_skin_1.QinSkin.hideAllIFrames();
        if (dragCalls && dragCalls.onStart) {
            dragCalls.onStart();
        }
        return stopEvent(ev);
    }
    function onResizerMove(ev) {
        const pointer = makeEventPointer(false, ev);
        var frameDragDifX = pointer.posX - dragInitEventX;
        var frameDragDifY = pointer.posY - dragInitEventY;
        var frameDragFinalWidth = dragInitWidth + frameDragDifX;
        var frameDragFinalHeight = dragInitHeight + frameDragDifY;
        target.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
        target.style.height =
            (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
        if (dragCalls && dragCalls.onMove) {
            dragCalls.onMove();
        }
        return stopEvent(ev);
    }
    function onResizerClose(ev) {
        document.ontouchmove = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.onmouseup = null;
        qin_skin_1.QinSkin.showAllIFrames();
        qin_skin_1.QinSkin.clearSelection();
        if (dragCalls && dragCalls.onEnd) {
            dragCalls.onEnd();
        }
        return stopEvent(ev);
    }
}
function addScroller(target, dragCalls) {
    var dragInitX = 0;
    var dragInitY = 0;
    var dragScrollX = 0;
    var dragScrollY = 0;
    target.ondragstart = stopEvent;
    target.ontouchstart = onScrollerInit;
    target.onmousedown = onScrollerInit;
    function onScrollerInit(ev) {
        if (document.onmousemove || document.ontouchmove) {
            return;
        }
        if (dragCalls && dragCalls.onDouble && isEventPointerDouble(true, ev)) {
            dragCalls.onDouble();
            return;
        }
        if (dragCalls && dragCalls.onLong && isEventPointerLong(true, ev)) {
            dragCalls.onLong();
            return;
        }
        const pointer = makeEventPointer(true, ev);
        dragInitX = pointer.posX;
        dragInitY = pointer.posY;
        dragScrollX = target.scrollLeft;
        dragScrollY = target.scrollTop;
        document.ontouchmove = onScrollerMove;
        document.onmousemove = onScrollerMove;
        document.ontouchend = onScrollerClose;
        document.onmouseup = onScrollerClose;
        qin_skin_1.QinSkin.hideAllIFrames();
        if (dragCalls && dragCalls.onStart) {
            dragCalls.onStart();
        }
        return stopEvent(ev);
    }
    function onScrollerMove(ev) {
        const pointer = makeEventPointer(false, ev);
        var dragDifX = pointer.posX - dragInitX;
        var dragDifY = pointer.posY - dragInitY;
        var dragNewX = dragScrollX - dragDifX;
        var dragNewY = dragScrollY - dragDifY;
        target.scrollTo(dragNewX, dragNewY);
        if (dragCalls && dragCalls.onMove) {
            dragCalls.onMove();
        }
        return stopEvent(ev);
    }
    function onScrollerClose(ev) {
        document.ontouchmove = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
        qin_skin_1.QinSkin.showAllIFrames();
        qin_skin_1.QinSkin.clearSelection();
        if (dragCalls && dragCalls.onEnd) {
            dragCalls.onEnd();
        }
        return stopEvent(ev);
    }
}
exports.QinArm = {
    stopEvent,
    makeEventPointer,
    isEventPointerDouble,
    isEventPointerLong,
    isKeyInList,
    isKeyEnter,
    isKeySpace,
    addAction,
    addActionEnter,
    putActionProxy,
    addMover,
    addResizer,
    addScroller,
};

},{"./qin-skin":39}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinBody = void 0;
function getTextLines(fromText) {
    return fromText.match(/[^\r\n]+/g);
}
function getCSVRows(fromText, names) {
    var lines = getTextLines(fromText);
    var result = [];
    for (let line of lines) {
        let row = (!names) ? [] : {};
        let inside_quotes = false;
        let column_value = "";
        let column_index = 0;
        for (let char_index = 0; char_index < line.length; char_index++) {
            let actual = line.charAt(char_index);
            if (inside_quotes) {
                if (actual == '"') {
                    let next = char_index < line.length - 1 ? line.charAt(char_index + 1) : "";
                    if (next == '"') {
                        column_value += actual;
                        char_index++;
                    }
                    else {
                        inside_quotes = false;
                    }
                }
                else {
                    column_value += actual;
                }
            }
            else {
                if (actual == '"') {
                    inside_quotes = true;
                }
                else if (actual == ',') {
                    column_value = unmaskSpecialChars(column_value);
                    if (!names) {
                        row.push(column_value);
                    }
                    else {
                        let column_name = "col_" + column_index;
                        if (column_index < names.length) {
                            column_name = names[column_index];
                        }
                        row[column_name] = column_value;
                    }
                    column_value = "";
                    column_index++;
                }
                else {
                    column_value += actual;
                }
            }
        }
        column_value = unmaskSpecialChars(column_value);
        if (!names) {
            row.push(column_value);
            result.push(row);
        }
        else {
            let column_name = "col_" + column_index;
            if (column_index < names.length) {
                column_name = names[column_index];
            }
            row[column_name] = column_value;
            result.push(row);
        }
    }
    return result;
}
function maskSpecialChars(fromText) {
    return fromText
        .replace("\\", "\\\\")
        .replace("\r", "\\r")
        .replace("\n", "\\n")
        .replace("\t", "\\t");
}
function unmaskSpecialChars(fromText) {
    return fromText
        .replace("\\\\", "\\")
        .replace("\\r", "\r")
        .replace("\\n", "\n")
        .replace("\\t", "\t");
}
function parseParameters(source) {
    let result = [];
    let open = false;
    let actual = "";
    for (const letter of Array.from(source)) {
        if (open) {
            if (letter == '"') {
                open = false;
                if (actual) {
                    result.push(actual);
                    actual = "";
                }
            }
            else {
                actual += letter;
            }
        }
        else {
            if (letter == '"') {
                open = true;
                if (actual) {
                    result.push(actual);
                    actual = "";
                }
            }
            else if (letter == ' ') {
                if (actual) {
                    result.push(actual);
                    actual = "";
                }
            }
            else {
                actual += letter;
            }
        }
    }
    return result;
}
exports.QinBody = {
    getTextLines,
    getCSVRows,
    maskSpecialChars,
    unmaskSpecialChars,
    parseParameters,
};

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinFoot = exports.QinFilesDescriptor = exports.QinFilesOperation = exports.QinFilesNature = void 0;
var QinFilesNature;
(function (QinFilesNature) {
    QinFilesNature["BOTH"] = "both";
    QinFilesNature["DIRECTORIES"] = "directories";
    QinFilesNature["FILES"] = "files";
})(QinFilesNature = exports.QinFilesNature || (exports.QinFilesNature = {}));
var QinFilesOperation;
(function (QinFilesOperation) {
    QinFilesOperation["OPEN"] = "open";
    QinFilesOperation["SAVE"] = "save";
})(QinFilesOperation = exports.QinFilesOperation || (exports.QinFilesOperation = {}));
class QinFilesDescriptor {
}
exports.QinFilesDescriptor = QinFilesDescriptor;
function getLocation() {
    return window.location.href;
}
function isLocalHost() {
    var location = getLocation();
    var start = location.indexOf("://");
    if (start == -1) {
        start = 0;
    }
    else {
        start += 3;
    }
    location = location.substring(start);
    return location.indexOf("localhost") === 0 || location.indexOf("127.0.0.1") === 0;
}
function getSeparator(ofPath) {
    let result = "/";
    if (ofPath && ofPath.indexOf("\\") > -1) {
        result = "\\";
    }
    return result;
}
function getPathJoin(pathA, pathB) {
    if (pathA == null || pathA == undefined) {
        pathA = "";
    }
    if (pathB == null || pathB == undefined) {
        pathB = "";
    }
    if (pathA.length == 0) {
        return pathB;
    }
    else if (pathB.length == 0) {
        return pathA;
    }
    else {
        let union = "/";
        if (pathA.indexOf("\\") > -1 || pathB.indexOf("\\") > -1) {
            union = "\\";
        }
        let pathAEnd = pathA.substring(pathA.length - 1, pathA.length);
        let pathBStart = pathB.substring(0, 1);
        if (pathAEnd == union || pathBStart == union) {
            union = "";
        }
        return pathA + union + pathB;
    }
}
function getRoot(path) {
    if (path) {
        let separator = getSeparator(path);
        let last = path.lastIndexOf(separator);
        if (last > -1) {
            return path.substring(0, last);
        }
    }
    return "";
}
function getStem(path) {
    if (path) {
        let separator = getSeparator(path);
        let last = path.lastIndexOf(separator);
        if (last > -1) {
            return path.substring(last + 1);
        }
    }
    return "";
}
function getFileExtension(name) {
    let position = name.lastIndexOf(".");
    if (position > -1) {
        return name.substring(position + 1);
    }
    else {
        return "";
    }
}
const appsExtensions = [
    "htm", "html", "css", "js", "jsx", "ts", "tsx", "phtml"
];
function isFileApp(extension) {
    return appsExtensions.indexOf(extension) > -1;
}
const cmdsExtensions = [
    "h", "c", "hpp", "cpp", "rs", "jl",
    "cs", "csproj", "fs", "ml", "fsi", "mli", "fsx", "fsscript",
    "java", "gy", "gvy", "groovy", "sc", "scala", "clj",
    "py", "ruby", "php", "phtml",
];
function isFileCmd(extension) {
    return cmdsExtensions.indexOf(extension) > -1;
}
const execExtensions = [
    "exe", "jar", "com", "bat", "sh"
];
function isFileExec(extension) {
    return execExtensions.indexOf(extension) > -1;
}
const imageExtensions = [
    "jpg", "jpeg", "png", "gif", "bmp"
];
function isFileImage(extension) {
    return imageExtensions.indexOf(extension) > -1;
}
const vectorExtensions = [
    "svg"
];
function isFileVector(extension) {
    return vectorExtensions.indexOf(extension) > -1;
}
const movieExtensions = [
    "avi", "mp4"
];
function isFileMovie(extension) {
    return movieExtensions.indexOf(extension) > -1;
}
const musicExtensions = [
    "wav", "mp3"
];
function isFileMusic(extension) {
    return musicExtensions.indexOf(extension) > -1;
}
const zippedExtensions = [
    "zip", "rar", "7z", "tar", "gz"
];
function isFileZipped(extension) {
    return zippedExtensions.indexOf(extension) > -1;
}
exports.QinFoot = {
    getLocation,
    isLocalHost,
    getSeparator,
    getPathJoin,
    getRoot,
    getStem,
    getFileExtension,
    isFileApp,
    isFileCmd,
    isFileExec,
    isFileImage,
    isFileVector,
    isFileMovie,
    isFileMusic,
    isFileZipped,
};

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinHead = exports.QinGrandeur = exports.QinBounds = exports.QinDimension = exports.QinPoint = void 0;
class QinPoint {
}
exports.QinPoint = QinPoint;
;
class QinDimension {
}
exports.QinDimension = QinDimension;
;
class QinBounds {
}
exports.QinBounds = QinBounds;
;
var QinGrandeur;
(function (QinGrandeur) {
    QinGrandeur["SMALL"] = "small";
    QinGrandeur["MEDIUM"] = "medium";
    QinGrandeur["LARGE"] = "large";
})(QinGrandeur = exports.QinGrandeur || (exports.QinGrandeur = {}));
function getDeskAPI() {
    var win = window;
    if (win.deskAPI) {
        return win.deskAPI;
    }
    else {
        win = window.parent;
    }
    if (win.deskAPI) {
        return win.deskAPI;
    }
    else {
        win = window.top;
    }
    if (win.deskAPI) {
        return win.deskAPI;
    }
    return undefined;
}
const logged = [];
function getLogged() {
    return logged;
}
function log(message) {
    logged.push(message);
    try {
        console.log(message);
    }
    catch (_) { }
    try {
        getDeskAPI().send("logOnMain", message);
    }
    catch (_) { }
}
function logError(error, origin) {
    log(getErrorMessage(error, origin));
}
function getErrorMessage(error, origin) {
    return getTreatMessage("Problem with:", error, origin);
}
function logWarning(error, origin) {
    log(getWarningMessage(error, origin));
}
function getWarningMessage(error, origin) {
    return getTreatMessage("Checkout this:", error, origin);
}
function logSupport(error, origin) {
    log(getSupportMessage(error, origin));
}
function getSupportMessage(error, origin) {
    return getTreatMessage("Need Support on:", error, origin);
}
function getTreatMessage(prefix, error, origin) {
    var result = prefix + (error ? " " + error.toString() : "");
    if (error.response && error.response.data) {
        var errorData = error.response.data;
        if (!(typeof errorData == "string" || errorData instanceof String)) {
            errorData = JSON.stringify(errorData);
        }
        result += " - Data: " + errorData;
    }
    else {
        if (!(typeof error == "string" || error instanceof String)) {
            result += " - Data: " + JSON.stringify(error);
        }
    }
    if (origin) {
        result += " - Origin: " + origin;
    }
    const stack = (new Error("")).stack;
    if (stack) {
        result += " - Stack: " + stack;
    }
    return result;
}
function toggleDevTools() {
    try {
        getDeskAPI().send("toggleDevTools");
    }
    catch (e) {
        logError(e, "{qinpel-res}(ErrCode-000001)");
    }
}
exports.QinHead = {
    getDeskAPI,
    getLogged,
    log,
    logError,
    getErrorMessage,
    logWarning,
    getWarningMessage,
    logSupport,
    getSupportMessage,
    getTreatMessage,
    toggleDevTools,
};

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinSkin = exports.QinStyles = void 0;
const qin_arm_1 = require("./qin-arm");
const qin_head_1 = require("./qin-head");
exports.QinStyles = {
    ColorForeground: "#270036",
    ColorBackground: "#fffaef",
    ColorInactive: "#faefff",
    ColorActive: "#facdcd",
    FontName: "SourceSansPro",
    FontSize: "16px",
};
function styleAsBody(el) {
    el.style.position = "absolute";
    el.style.top = "0px";
    el.style.right = "0px";
    el.style.bottom = "0px";
    el.style.left = "0px";
    el.style.padding = "9px";
    el.style.overflow = "auto";
}
function styleAsEdit(el) {
    el.style.margin = "1px";
    el.style.padding = "3px";
    el.style.outline = "none";
    el.style.border = "1px solid #270036";
    el.style.borderRadius = "3px";
    el.style.color = "#270036";
    el.style.backgroundColor = "#ffffff";
    el.style.fontFamily = "SourceSansPro";
    el.style.fontSize = "16px";
    el.addEventListener("focus", () => {
        el.style.outline = "none";
        el.style.backgroundColor = "#faefff";
        el.style.border = "1px solid #ae0000";
    });
    el.addEventListener("focusout", () => {
        el.style.outline = "none";
        el.style.backgroundColor = "#ffffff";
        el.style.border = "1px solid #270036";
    });
}
function styleMaxSizeForNotOverFlow(el, parent) {
    console.log("D1");
    if (!parent) {
        parent = el.parentElement;
        console.log("D2: " + parent);
    }
    if (parent) {
        let maxWidth = 0;
        let maxHeight = 0;
        let imediate = el;
        do {
            maxWidth = maxWidth + imediate.clientLeft;
            maxHeight = maxHeight + imediate.clientTop;
            console.log("D3: " + maxWidth);
            console.log("D4: " + maxHeight);
            imediate = imediate.parentElement;
        } while (imediate != null && imediate != parent);
        maxWidth = parent.clientWidth - maxWidth;
        maxHeight = parent.clientHeight - maxHeight;
        console.log("D5: " + maxWidth);
        console.log("D6: " + maxHeight);
        el.style.maxWidth = maxWidth + "px";
        el.style.maxHeight = maxHeight + "px";
    }
}
function styleSize(el, size) {
    if (size) {
        if (size instanceof qin_head_1.QinDimension) {
            el.style.width = size.width + "px";
            el.style.height = size.height + "px";
        }
        else {
            let dim = getDimensionSize(size);
            el.style.width = dim.width + "px";
            el.style.height = dim.height + "px";
        }
    }
}
function styleFlexMax(el) {
    el.style.flex = "1";
}
function styleFlexMin(el) {
    el.style.flex = "0";
}
function getWindowSize() {
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
    };
}
function getWindowSizeStyle() {
    const width = getWindowSize().width;
    if (width < 600) {
        return qin_head_1.QinGrandeur.SMALL;
    }
    else if (width < 1000) {
        return qin_head_1.QinGrandeur.MEDIUM;
    }
    else {
        return qin_head_1.QinGrandeur.LARGE;
    }
}
function hideAllIFrames() {
    var doc_iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < doc_iframes.length; i++) {
        let doc_iframe = doc_iframes[i];
        doc_iframe.style.visibility = "hidden";
    }
}
function showAllIFrames() {
    var doc_iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < doc_iframes.length; i++) {
        let doc_iframe = doc_iframes[i];
        doc_iframe.style.visibility = "visible";
    }
}
function disableSelection(element) {
    element.style.userSelect = "none";
    element.style.webkitUserSelect = "none";
    element.onselectstart = qin_arm_1.QinArm.stopEvent;
}
function clearSelection() {
    setTimeout(() => {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }, 360);
}
function isElementVisibleInScroll(element) {
    if (element.parentElement) {
        if (element.offsetTop < element.parentElement.scrollTop) {
            return false;
        }
        if (element.offsetLeft < element.parentElement.scrollLeft) {
            return false;
        }
        if (element.clientWidth >
            element.parentElement.clientWidth -
                (element.offsetLeft - element.parentElement.scrollLeft)) {
            return false;
        }
        if (element.clientHeight >
            element.parentElement.clientHeight -
                (element.offsetTop - element.parentElement.scrollTop)) {
            return false;
        }
    }
    return true;
}
function getDimensionSize(size) {
    if (size == qin_head_1.QinGrandeur.LARGE) {
        return getDimensionLarge();
    }
    else if (size == qin_head_1.QinGrandeur.MEDIUM) {
        return getDimensionMedium();
    }
    else {
        return getDimensionSmall();
    }
}
const dimensionSmall = {
    width: 16,
    height: 16,
};
function getDimensionSmall() {
    return dimensionSmall;
}
const dimensionMedium = {
    width: 32,
    height: 32,
};
function getDimensionMedium() {
    return dimensionMedium;
}
const dimensionLarge = {
    width: 64,
    height: 64,
};
function getDimensionLarge() {
    return dimensionLarge;
}
exports.QinSkin = {
    styles: exports.QinStyles,
    styleAsBody,
    styleAsEdit,
    styleMaxSizeForNotOverFlow,
    styleSize,
    styleFlexMax,
    styleFlexMin,
    getWindowSize,
    getWindowSizeStyle,
    hideAllIFrames,
    showAllIFrames,
    disableSelection,
    clearSelection,
    isElementVisibleInScroll,
    getDimensionSize,
    getDimensionSmall,
    getDimensionMedium,
    getDimensionLarge,
};

},{"./qin-arm":35,"./qin-head":38}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinSoul = void 0;
const qin_arm_1 = require("./qin-arm");
const qin_body_1 = require("./qin-body");
const qin_foot_1 = require("./qin-foot");
const qin_head_1 = require("./qin-head");
const qin_skin_1 = require("./qin-skin");
exports.QinSoul = {
    arm: qin_arm_1.QinArm,
    body: qin_body_1.QinBody,
    foot: qin_foot_1.QinFoot,
    head: qin_head_1.QinHead,
    skin: qin_skin_1.QinSkin,
};

},{"./qin-arm":35,"./qin-body":36,"./qin-foot":37,"./qin-head":38,"./qin-skin":39}],41:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2luZGV4LmpzIiwiYnVpbGQvcWluLWZyYW1lLmpzIiwiYnVpbGQvcWluLW1hbmFnZXIuanMiLCJidWlsZC9xaW5wZWwuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9lbnYvZGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9hbGwuanMiLCIuLi9xaW5wZWwtcmVzL2J1aWxkL3Fpbi1hcm0uanMiLCIuLi9xaW5wZWwtcmVzL2J1aWxkL3Fpbi1ib2R5LmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tZm9vdC5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvcWluLWhlYWQuanMiLCIuLi9xaW5wZWwtcmVzL2J1aWxkL3Fpbi1za2luLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tc291bC5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdElBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHFpbl9tYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9xaW4tbWFuYWdlclwiKTtcbmNvbnN0IG1hbmFnZXIgPSBuZXcgcWluX21hbmFnZXJfMS5RaW5NYW5hZ2VyKCk7XG5tYW5hZ2VyLnB1dEluRG9jdW1lbnQoKTtcbmV4cG9ydHMuZGVmYXVsdCA9IG1hbmFnZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWluRnJhbWVQb3B1cCA9IGV4cG9ydHMuUWluRnJhbWVEaWFsb2cgPSBleHBvcnRzLlFpbkZyYW1lID0gdm9pZCAwO1xuY29uc3QgcWlucGVsX3Jlc18xID0gcmVxdWlyZShcInFpbnBlbC1yZXNcIik7XG5jb25zdCBxaW5wZWxfMSA9IHJlcXVpcmUoXCIuL3FpbnBlbFwiKTtcbmNsYXNzIFFpbkZyYW1lIHtcbiAgICBjb25zdHJ1Y3RvcihtYW5hZ2VyLCB0aXRsZSwgYXBwTmFtZSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLndhaXRlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5ybmRJRCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xuICAgICAgICB0aGlzLmRpdkZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kaXZIZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5pbWdNZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgdGhpcy5kaXZUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuaW1nTWluaW1pemUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aGlzLmltZ01heGltaXplID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgdGhpcy5pbWdDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIHRoaXMuaWZyYW1lQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgIHRoaXMuZGl2Rm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuaW1nU3RhdHVzVHlwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIHRoaXMuZGl2U3RhdHVzVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuaW1nUmVzaXplID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgdGhpcy5taW5pbWl6ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXhpbWl6ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYXN0V2lkdGggPSAtMTtcbiAgICAgICAgdGhpcy5sYXN0SGVpZ2h0ID0gLTE7XG4gICAgICAgIHRoaXMuc3RhdHVzUmVjb3JkcyA9IFtdO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLnRpdGxlID0gdGhpcy5pbml0RnJhbWVUaXRsZSh0aXRsZSk7XG4gICAgICAgIHRoaXMuYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgPyBvcHRpb25zIDoge307XG4gICAgICAgIHRoaXMuaW5pdERpdkZyYW1lKCk7XG4gICAgICAgIHRoaXMuaW5pdERpdkhlYWQoKTtcbiAgICAgICAgdGhpcy5pbml0SUZyYW1lQm9keSgpO1xuICAgICAgICB0aGlzLmluaXREaXZGb290KCk7XG4gICAgICAgIHRoaXMuaW5pdERyYWdnYWJsZSgpO1xuICAgIH1cbiAgICBpbml0RnJhbWVUaXRsZSh0aXRsZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGl0bGU7XG4gICAgICAgIHZhciBhdHRlbXB0ID0gMTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hbmFnZXIuZ2V0RnJhbWUocmVzdWx0KSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGl0bGUgKyBcIiAoXCIgKyAoKythdHRlbXB0KSArIFwiKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgaW5pdERpdkZyYW1lKCkge1xuICAgICAgICB0aGlzLmRpdkZyYW1lLmlkID0gXCJRaW5wZWxGcmFtZUlEXCIgKyB0aGlzLnJuZElEO1xuICAgICAgICB0aGlzLmRpdkZyYW1lLmNsYXNzTmFtZSA9IFwiUWlucGVsV2luZG93RnJhbWVcIjtcbiAgICAgICAgY29uc3QgZnJhbWVJbml0Qm91bmRzID0gdGhpcy5sb2FkRnJhbWVJbml0Qm91bmRzKCk7XG4gICAgICAgIHRoaXMuZGl2RnJhbWUuc3R5bGUubGVmdCA9IGZyYW1lSW5pdEJvdW5kcy5wb3NYICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRpdkZyYW1lLnN0eWxlLnRvcCA9IGZyYW1lSW5pdEJvdW5kcy5wb3NZICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRpdkZyYW1lLnN0eWxlLndpZHRoID0gZnJhbWVJbml0Qm91bmRzLndpZHRoICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRpdkZyYW1lLnN0eWxlLmhlaWdodCA9IGZyYW1lSW5pdEJvdW5kcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIHRoaXMubGFzdFdpZHRoID0gZnJhbWVJbml0Qm91bmRzLndpZHRoO1xuICAgICAgICB0aGlzLmxhc3RIZWlnaHQgPSBmcmFtZUluaXRCb3VuZHMuaGVpZ2h0O1xuICAgIH1cbiAgICBsb2FkRnJhbWVJbml0Qm91bmRzKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBwb3NYOiA2NCxcbiAgICAgICAgICAgIHBvc1k6IDY0LFxuICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgd2luZG93U2l6ZVN0eWxlID0gcWlucGVsX3Jlc18xLlFpblNvdWwuc2tpbi5nZXRXaW5kb3dTaXplU3R5bGUoKTtcbiAgICAgICAgY29uc3QgZnJhbWVTdHlsZUlEID0gdGhpcy5nZXRGcmFtZVdpbmRvd1N0eWxlSUQod2luZG93U2l6ZVN0eWxlKTtcbiAgICAgICAgY29uc3QgZnJhbWVCb3VuZHNTYXZlZCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShmcmFtZVN0eWxlSUQpO1xuICAgICAgICBpZiAoZnJhbWVCb3VuZHNTYXZlZCkge1xuICAgICAgICAgICAgbGV0IHBhcnRzID0gZnJhbWVCb3VuZHNTYXZlZC5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXN1bHQucG9zWCA9IE51bWJlcihwYXJ0c1swXSk7XG4gICAgICAgICAgICByZXN1bHQucG9zWSA9IE51bWJlcihwYXJ0c1sxXSk7XG4gICAgICAgICAgICByZXN1bHQud2lkdGggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgICAgICAgICAgcmVzdWx0LmhlaWdodCA9IE51bWJlcihwYXJ0c1szXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAod2luZG93U2l6ZVN0eWxlID09PSBxaW5wZWxfcmVzXzEuUWluR3JhbmRldXIuU01BTEwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucG9zWCA9IDA7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnBvc1kgPSAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmdldFdpbmRvd1NpemUoKTtcbiAgICAgICAgICAgICAgICByZXN1bHQud2lkdGggPSBzaXplLndpZHRoIC0gNDtcbiAgICAgICAgICAgICAgICByZXN1bHQuaGVpZ2h0ID0gc2l6ZS5oZWlnaHQgLSA0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAod2luZG93U2l6ZVN0eWxlID09PSBxaW5wZWxfcmVzXzEuUWluR3JhbmRldXIuTUVESVVNKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnBvc1ggPSA0ODtcbiAgICAgICAgICAgICAgICByZXN1bHQucG9zWSA9IDQ4O1xuICAgICAgICAgICAgICAgIHJlc3VsdC53aWR0aCA9IDUwMDtcbiAgICAgICAgICAgICAgICByZXN1bHQuaGVpZ2h0ID0gMzc1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGdldEZyYW1lV2luZG93U3R5bGVJRCh3aW5kb3dTaXplU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIFwid2luZG93IFwiICsgd2luZG93U2l6ZVN0eWxlICsgXCIgc2l6ZSBvZjogXCIgKyB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBpbml0RGl2SGVhZCgpIHtcbiAgICAgICAgdGhpcy5kaXZIZWFkLmNsYXNzTmFtZSA9IFwiUWlucGVsV2luZG93RnJhbWVIZWFkXCI7XG4gICAgICAgIHRoaXMuaW1nTWVudS5zcmMgPSBcIi4vYXNzZXRzL2ZyYW1lLW1lbnUucG5nXCI7XG4gICAgICAgIHRoaXMuaW1nTWVudS5hbHQgPSBcIm9cIjtcbiAgICAgICAgcWlucGVsX3Jlc18xLlFpblNvdWwuYXJtLmFkZEFjdGlvbih0aGlzLmltZ01lbnUsICgpID0+IHRoaXMuaGVhZE1lbnVBY3Rpb24oKSk7XG4gICAgICAgIHRoaXMuZGl2SGVhZC5hcHBlbmRDaGlsZCh0aGlzLmltZ01lbnUpO1xuICAgICAgICB0aGlzLmRpdlRpdGxlLmNsYXNzTmFtZSA9IFwiUWlucGVsV2luZG93RnJhbWVIZWFkVGl0bGVcIjtcbiAgICAgICAgdGhpcy5kaXZUaXRsZS5pbm5lclRleHQgPSB0aGlzLnRpdGxlO1xuICAgICAgICB0aGlzLmRpdkhlYWQuYXBwZW5kQ2hpbGQodGhpcy5kaXZUaXRsZSk7XG4gICAgICAgIHRoaXMuaW1nTWluaW1pemUuc3JjID0gXCIuL2Fzc2V0cy9mcmFtZS1taW5pbWl6ZS5wbmdcIjtcbiAgICAgICAgdGhpcy5pbWdNaW5pbWl6ZS5hbHQgPSBcIi1cIjtcbiAgICAgICAgcWlucGVsX3Jlc18xLlFpblNvdWwuYXJtLmFkZEFjdGlvbih0aGlzLmltZ01pbmltaXplLCAoKSA9PiB0aGlzLmhlYWRNaW5pbWl6ZUFjdGlvbigpKTtcbiAgICAgICAgdGhpcy5kaXZIZWFkLmFwcGVuZENoaWxkKHRoaXMuaW1nTWluaW1pemUpO1xuICAgICAgICB0aGlzLmltZ01heGltaXplLnNyYyA9IFwiLi9hc3NldHMvZnJhbWUtbWF4aW1pemUucG5nXCI7XG4gICAgICAgIHRoaXMuaW1nTWF4aW1pemUuYWx0ID0gXCIrXCI7XG4gICAgICAgIHFpbnBlbF9yZXNfMS5RaW5Tb3VsLmFybS5hZGRBY3Rpb24odGhpcy5pbWdNYXhpbWl6ZSwgKCkgPT4gdGhpcy5oZWFkTWF4aW1pemVBY3Rpb24oKSk7XG4gICAgICAgIHRoaXMuZGl2SGVhZC5hcHBlbmRDaGlsZCh0aGlzLmltZ01heGltaXplKTtcbiAgICAgICAgdGhpcy5pbWdDbG9zZS5zcmMgPSBcIi4vYXNzZXRzL2ZyYW1lLWNsb3NlLnBuZ1wiO1xuICAgICAgICB0aGlzLmltZ0Nsb3NlLmFsdCA9IFwieFwiO1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkQWN0aW9uKHRoaXMuaW1nQ2xvc2UsICgpID0+IHRoaXMuaGVhZENsb3NlQWN0aW9uKCkpO1xuICAgICAgICB0aGlzLmRpdkhlYWQuYXBwZW5kQ2hpbGQodGhpcy5pbWdDbG9zZSk7XG4gICAgICAgIHRoaXMuZGl2RnJhbWUuYXBwZW5kQ2hpbGQodGhpcy5kaXZIZWFkKTtcbiAgICB9XG4gICAgaW5pdElGcmFtZUJvZHkoKSB7XG4gICAgICAgIHRoaXMuaWZyYW1lQm9keS5pZCA9IFwiUWlucGVsSW5zaWRlRnJhbWVJRFwiICsgdGhpcy5ybmRJRDtcbiAgICAgICAgdGhpcy5pZnJhbWVCb2R5LmNsYXNzTmFtZSA9IFwiUWlucGVsV2luZG93RnJhbWVCb2R5XCI7XG4gICAgICAgIGxldCBhZGRyZXNzID0gdGhpcy5hcHBOYW1lO1xuICAgICAgICBpZiAoIWFkZHJlc3Muc3RhcnRzV2l0aChcIi9ydW4vYXBwL1wiKSkge1xuICAgICAgICAgICAgYWRkcmVzcyA9IFwiL3J1bi9hcHAvXCIgKyBhZGRyZXNzICsgXCIvaW5kZXguaHRtbFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaWZyYW1lQm9keS5zcmMgPSBhZGRyZXNzO1xuICAgICAgICB0aGlzLmlmcmFtZUJvZHkub25sb2FkID0gKF8pID0+IHtcbiAgICAgICAgICAgIHN0eWxlcy5hcHBseU9uSUZyYW1lKHRoaXMuaWZyYW1lQm9keSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGl2RnJhbWUuYXBwZW5kQ2hpbGQodGhpcy5pZnJhbWVCb2R5KTtcbiAgICB9XG4gICAgaW5pdERpdkZvb3QoKSB7XG4gICAgICAgIHRoaXMuZGl2Rm9vdC5jbGFzc05hbWUgPSBcIlFpbnBlbFdpbmRvd0ZyYW1lRm9vdFwiO1xuICAgICAgICB0aGlzLmltZ1N0YXR1c1R5cGUuc3JjID0gXCIuL2Fzc2V0cy9mcmFtZS1zdGF0dXMtaW5mby5wbmdcIjtcbiAgICAgICAgdGhpcy5kaXZGb290LmFwcGVuZENoaWxkKHRoaXMuaW1nU3RhdHVzVHlwZSk7XG4gICAgICAgIHRoaXMuZGl2U3RhdHVzVGV4dC5jbGFzc05hbWUgPSBcIlFpbnBlbFdpbmRvd0ZyYW1lRm9vdFN0YXR1c1wiO1xuICAgICAgICB0aGlzLmRpdlN0YXR1c1RleHQuaW5uZXJUZXh0ID0gXCJTdGF0dXNCYXJcIjtcbiAgICAgICAgdGhpcy5kaXZGb290LmFwcGVuZENoaWxkKHRoaXMuZGl2U3RhdHVzVGV4dCk7XG4gICAgICAgIHRoaXMuaW1nUmVzaXplLnNyYyA9IFwiLi9hc3NldHMvZnJhbWUtcmVzaXplLnBuZ1wiO1xuICAgICAgICB0aGlzLmltZ1Jlc2l6ZS5hbHQgPSBcIi9cIjtcbiAgICAgICAgdGhpcy5kaXZGb290LmFwcGVuZENoaWxkKHRoaXMuaW1nUmVzaXplKTtcbiAgICAgICAgdGhpcy5kaXZGcmFtZS5hcHBlbmRDaGlsZCh0aGlzLmRpdkZvb3QpO1xuICAgIH1cbiAgICBpbml0RHJhZ2dhYmxlKCkge1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkTW92ZXIoW3RoaXMuZGl2SGVhZCwgdGhpcy5kaXZTdGF0dXNUZXh0XSwgdGhpcy5kaXZGcmFtZSwge1xuICAgICAgICAgICAgb25Eb3VibGU6ICgpID0+IHRoaXMuaGVhZE1heGltaXplQWN0aW9uKCksXG4gICAgICAgICAgICBvbkVuZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5zaG93RWxlbWVudCh0aGlzLmRpdkZyYW1lKTtcbiAgICAgICAgICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkUmVzaXplcihbdGhpcy5pbWdSZXNpemVdLCB0aGlzLmRpdkZyYW1lLCB7XG4gICAgICAgICAgICBvbkRvdWJsZTogKCkgPT4gdGhpcy5oZWFkTWF4aW1pemVBY3Rpb24oKSxcbiAgICAgICAgICAgIG9uRW5kOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhpbWl6ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RXaWR0aCA9IHBhcnNlSW50KHRoaXMuZGl2RnJhbWUuc3R5bGUud2lkdGgsIDEwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIZWlnaHQgPSBwYXJzZUludCh0aGlzLmRpdkZyYW1lLnN0eWxlLmhlaWdodCwgMTApO1xuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5zaG93RWxlbWVudCh0aGlzLmRpdkZyYW1lKTtcbiAgICAgICAgICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRNYW5hZ2VyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyO1xuICAgIH1cbiAgICBnZXRUaXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGU7XG4gICAgfVxuICAgIGdldEFwcE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5hbWU7XG4gICAgfVxuICAgIGdldE9wdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbbmFtZV07XG4gICAgfVxuICAgIHNldE9wdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnNbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcHV0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xlYW5PcHRpb25zKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgYWRkV2FpdGVyKHdhaXRlcikge1xuICAgICAgICB0aGlzLndhaXRlcnMucHVzaCh3YWl0ZXIpO1xuICAgIH1cbiAgICBoYXNXYWl0ZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0ZXJzLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIHNlbmRXYWl0ZXJzKHdpdGhSZXN1bHQpIHtcbiAgICAgICAgZm9yIChjb25zdCB3YWl0ZXIgb2YgdGhpcy53YWl0ZXJzKSB7XG4gICAgICAgICAgICB3YWl0ZXIod2l0aFJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xlYW5XYWl0ZXJzKCkge1xuICAgICAgICB0aGlzLndhaXRlcnMgPSBbXTtcbiAgICB9XG4gICAgZ2V0SUQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpdkZyYW1lLmlkO1xuICAgIH1cbiAgICBpbnN0YWxsKCkge1xuICAgICAgICB0aGlzLmlmcmFtZUJvZHkucWlucGVsID0gbmV3IHFpbnBlbF8xLlFpbnBlbCh0aGlzLm1hbmFnZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLm1hbmFnZXIuYWRkQ2hpbGQodGhpcy5kaXZGcmFtZSk7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cbiAgICBoZWFkTWVudUFjdGlvbigpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnNob3dNZW51KCk7XG4gICAgfVxuICAgIGhlYWRNaW5pbWl6ZUFjdGlvbigpIHtcbiAgICAgICAgdGhpcy5taW5pbWl6ZSgpO1xuICAgIH1cbiAgICBoZWFkTWF4aW1pemVBY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubWF4aW1pemUoKTtcbiAgICB9XG4gICAgaGVhZENsb3NlQWN0aW9uKCkge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICAgIHN0YXR1c0luZm8obWVzc2FnZSkge1xuICAgICAgICBsZXQgcmVjID0ge1xuICAgICAgICAgICAga2luZDogU3RhdHVzS2luZC5JTkZPLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnN0YXR1c1JlY29yZHMucHVzaChyZWMpO1xuICAgICAgICB0aGlzLmRpdlN0YXR1c1RleHQuaW5uZXJUZXh0ID0gdGhpcy5nZXREaXNwbGF5U3RhdHVzTWVzc2FnZShtZXNzYWdlKTtcbiAgICB9XG4gICAgc3RhdHVzRXJyb3IoZXJyb3IsIG9yaWdpbikge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IHFpbnBlbF9yZXNfMS5RaW5Tb3VsLmhlYWQuZ2V0RXJyb3JNZXNzYWdlKGVycm9yLCBvcmlnaW4pO1xuICAgICAgICBsZXQgcmVjID0ge1xuICAgICAgICAgICAga2luZDogU3RhdHVzS2luZC5FUlJPUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zdGF0dXNSZWNvcmRzLnB1c2gocmVjKTtcbiAgICAgICAgdGhpcy5pbWdTdGF0dXNUeXBlLnNyYyA9IFwiLi9hc3NldHMvZnJhbWUtc3RhdHVzLWVycm9yLnBuZ1wiO1xuICAgICAgICB0aGlzLmRpdlN0YXR1c1RleHQuaW5uZXJUZXh0ID0gdGhpcy5nZXREaXNwbGF5U3RhdHVzTWVzc2FnZShtZXNzYWdlKTtcbiAgICB9XG4gICAgZ2V0RGlzcGxheVN0YXR1c01lc3NhZ2UobWVzc2FnZSkge1xuICAgICAgICBpZiAobWVzc2FnZS5sZW5ndGggPiBGYWNlQ29uZmlncy5TVEFUVVNfTUVTU0FHRV9NQVhfTEVOR1RIKSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHJpbmcoMCwgRmFjZUNvbmZpZ3MuU1RBVFVTX01FU1NBR0VfTUFYX0xFTkdUSCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzYXZlRnJhbWVCb3VuZHMoKSB7XG4gICAgICAgIGxldCB3aW5kb3dTaXplU3R5bGUgPSBxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmdldFdpbmRvd1NpemVTdHlsZSgpO1xuICAgICAgICBjb25zdCBmcmFtZVN0eWxlSUQgPSB0aGlzLmdldEZyYW1lV2luZG93U3R5bGVJRCh3aW5kb3dTaXplU3R5bGUpO1xuICAgICAgICBjb25zdCBmcmFtZUJvdW5kcyA9IHBhcnNlSW50KHRoaXMuZGl2RnJhbWUuc3R5bGUubGVmdCwgMTApICsgXCIsXCIgK1xuICAgICAgICAgICAgcGFyc2VJbnQodGhpcy5kaXZGcmFtZS5zdHlsZS50b3AsIDEwKSArIFwiLFwiICtcbiAgICAgICAgICAgIHBhcnNlSW50KHRoaXMuZGl2RnJhbWUuc3R5bGUud2lkdGgsIDEwKSArIFwiLFwiICtcbiAgICAgICAgICAgIHBhcnNlSW50KHRoaXMuZGl2RnJhbWUuc3R5bGUuaGVpZ2h0LCAxMCk7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShmcmFtZVN0eWxlSUQsIGZyYW1lQm91bmRzKTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnNob3dFbGVtZW50KHRoaXMuZGl2RnJhbWUpO1xuICAgIH1cbiAgICBtaW5pbWl6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWluaW1pemVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpdkZyYW1lLnN0eWxlLndpZHRoID0gdGhpcy5sYXN0V2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmRpdkZyYW1lLnN0eWxlLmhlaWdodCA9IHRoaXMubGFzdEhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lQm9keS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuZGl2Rm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMubWluaW1pemVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXhpbWl6ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRNYXhpbWl6ZUFjdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sYXN0V2lkdGggPSBwYXJzZUludCh0aGlzLmRpdkZyYW1lLnN0eWxlLndpZHRoLCAxMCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RIZWlnaHQgPSBwYXJzZUludCh0aGlzLmRpdkZyYW1lLnN0eWxlLmhlaWdodCwgMTApO1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVCb2R5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuZGl2Rm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICB0aGlzLmRpdkZyYW1lLnN0eWxlLndpZHRoID0gRmFjZUNvbmZpZ3MuTUlOSU1JWkVEX1dJRFRIICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5kaXZGcmFtZS5zdHlsZS5oZWlnaHQgPSB0aGlzLmRpdkhlYWQuY2xpZW50SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5taW5pbWl6ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFuYWdlci5zaG93RWxlbWVudCh0aGlzLmRpdkZyYW1lKTtcbiAgICB9XG4gICAgbWF4aW1pemUoKSB7XG4gICAgICAgIGlmICh0aGlzLm1heGltaXplZCkge1xuICAgICAgICAgICAgdGhpcy5kaXZGcmFtZS5zdHlsZS53aWR0aCA9IHRoaXMubGFzdFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5kaXZGcmFtZS5zdHlsZS5oZWlnaHQgPSB0aGlzLmxhc3RIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLm1heGltaXplZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMubWluaW1pemVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkTWluaW1pemVBY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGFzdFdpZHRoID0gcGFyc2VJbnQodGhpcy5kaXZGcmFtZS5zdHlsZS53aWR0aCwgMTApO1xuICAgICAgICAgICAgdGhpcy5sYXN0SGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5kaXZGcmFtZS5zdHlsZS5oZWlnaHQsIDEwKTtcbiAgICAgICAgICAgIHRoaXMuZGl2RnJhbWUuc3R5bGUud2lkdGggPSB0aGlzLm1hbmFnZXIuZ2V0Qm9keVdpZHRoKCkgLSA0ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5kaXZGcmFtZS5zdHlsZS5oZWlnaHQgPSB0aGlzLm1hbmFnZXIuZ2V0Qm9keUhlaWdodCgpIC0gNCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMubWF4aW1pemVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hbmFnZXIuc2hvd0VsZW1lbnQodGhpcy5kaXZGcmFtZSk7XG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLnNhdmVGcmFtZUJvdW5kcygpO1xuICAgICAgICB0aGlzLm1hbmFnZXIuZGVsQ2hpbGQodGhpcy5kaXZGcmFtZSk7XG4gICAgICAgIHRoaXMubWFuYWdlci5kZWxGcmFtZSh0aGlzKTtcbiAgICB9XG4gICAgZ2V0SUZyYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZnJhbWVCb2R5O1xuICAgIH1cbiAgICBnZXRJRnJhbWVEb2N1bWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWZyYW1lQm9keS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICAgIH1cbiAgICBuZXdEaWFsb2codGl0bGUsIGRpdkNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBRaW5GcmFtZURpYWxvZyh0aGlzLCB0aXRsZSwgZGl2Q29udGVudCk7XG4gICAgfVxuICAgIG5ld1BvcHVwKGRpdkNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBRaW5GcmFtZVBvcHVwKHRoaXMsIGRpdkNvbnRlbnQpO1xuICAgIH1cbiAgICBuYXZpZ2F0ZSh1cmwpIHtcbiAgICAgICAgdGhpcy5pZnJhbWVCb2R5LnNyYyA9IHVybDtcbiAgICB9XG59XG5leHBvcnRzLlFpbkZyYW1lID0gUWluRnJhbWU7XG5jbGFzcyBRaW5GcmFtZURpYWxvZyB7XG4gICAgY29uc3RydWN0b3IoZnJhbWUsIHRpdGxlLCBkaXZDb250ZW50KSB7XG4gICAgICAgIHRoaXMuZGl2RGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kaXZUb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnNwYW5UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICB0aGlzLnNwYW5DbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICB0aGlzLmltZ0Nsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgdGhpcy5kaXZQYWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zaG93aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZG9jTm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMuZGl2Q29udGVudCA9IGRpdkNvbnRlbnQ7XG4gICAgICAgIHRoaXMuaW5pdERpYWxvZygpO1xuICAgICAgICB0aGlzLmluaXRUb3AoKTtcbiAgICAgICAgdGhpcy5pbml0UGFjaygpO1xuICAgIH1cbiAgICBpbml0RGlhbG9nKCkge1xuICAgICAgICBzdHlsZXMuYXBwbHlPbkRpYWxvZyh0aGlzLmRpdkRpYWxvZyk7XG4gICAgfVxuICAgIGluaXRUb3AoKSB7XG4gICAgICAgIHN0eWxlcy5hcHBseU9uRGlhbG9nVG9wKHRoaXMuZGl2VG9wKTtcbiAgICAgICAgdGhpcy5kaXZEaWFsb2cuYXBwZW5kQ2hpbGQodGhpcy5kaXZUb3ApO1xuICAgICAgICBzdHlsZXMuYXBwbHlPbkRpYWxvZ1RpdGxlKHRoaXMuc3BhblRpdGxlKTtcbiAgICAgICAgdGhpcy5zcGFuVGl0bGUuaW5uZXJUZXh0ID0gdGhpcy50aXRsZTtcbiAgICAgICAgdGhpcy5kaXZUb3AuYXBwZW5kQ2hpbGQodGhpcy5zcGFuVGl0bGUpO1xuICAgICAgICBzdHlsZXMuYXBwbHlPbkRpYWxvZ0Nsb3NlKHRoaXMuc3BhbkNsb3NlKTtcbiAgICAgICAgdGhpcy5kaXZUb3AuYXBwZW5kQ2hpbGQodGhpcy5zcGFuQ2xvc2UpO1xuICAgICAgICBzdHlsZXMuYXBwbHlPbkRpYWxvZ0ltYWdlKHRoaXMuaW1nQ2xvc2UpO1xuICAgICAgICB0aGlzLmltZ0Nsb3NlLnNyYyA9IFwiL3J1bi9hcHAvcWlucGVsLWFwcC9hc3NldHMvZnJhbWUtY2xvc2UucG5nXCI7XG4gICAgICAgIHRoaXMuc3BhbkNsb3NlLmFwcGVuZENoaWxkKHRoaXMuaW1nQ2xvc2UpO1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkQWN0aW9uKHRoaXMuc3BhbkNsb3NlLCAoXykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW5pdFBhY2soKSB7XG4gICAgICAgIHRoaXMuZGl2RGlhbG9nLmFwcGVuZENoaWxkKHRoaXMuZGl2UGFjayk7XG4gICAgICAgIHN0eWxlcy5hcHBseU9uRGlhbG9nUGFjayh0aGlzLmRpdlBhY2spO1xuICAgICAgICB0aGlzLmRpdlBhY2suYXBwZW5kQ2hpbGQodGhpcy5kaXZDb250ZW50KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd2luZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9jTm9kZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZyYW1lLmdldElGcmFtZURvY3VtZW50KCkuYm9keS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuZnJhbWUuZ2V0SUZyYW1lRG9jdW1lbnQoKS5ib2R5LmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICB0aGlzLmRvY05vZGVzLnB1c2goY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5kb2NOb2Rlcykge1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5nZXRJRnJhbWVEb2N1bWVudCgpLmJvZHkucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZnJhbWUuZ2V0SUZyYW1lRG9jdW1lbnQoKS5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZGl2RGlhbG9nKTtcbiAgICAgICAgdGhpcy5zaG93aW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIGlmICghdGhpcy5zaG93aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mcmFtZS5nZXRJRnJhbWVEb2N1bWVudCgpLmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5kaXZEaWFsb2cpO1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuZG9jTm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZ2V0SUZyYW1lRG9jdW1lbnQoKS5ib2R5LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRvY05vZGVzID0gW107XG4gICAgICAgIHRoaXMuc2hvd2luZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuUWluRnJhbWVEaWFsb2cgPSBRaW5GcmFtZURpYWxvZztcbmNsYXNzIFFpbkZyYW1lUG9wdXAge1xuICAgIGNvbnN0cnVjdG9yKGZyYW1lLCBkaXZDb250ZW50KSB7XG4gICAgICAgIHRoaXMuX2Rpdk1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLl9wb3NMZWZ0ID0gMTg7XG4gICAgICAgIHRoaXMuX3Bvc1RvcCA9IDE4O1xuICAgICAgICB0aGlzLl9mcmFtZSA9IGZyYW1lO1xuICAgICAgICB0aGlzLl9kaXZDb250ZW50ID0gZGl2Q29udGVudDtcbiAgICAgICAgdGhpcy5pbml0TWFpbigpO1xuICAgIH1cbiAgICBpbml0TWFpbigpIHtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5hcHBlbmRDaGlsZCh0aGlzLl9kaXZDb250ZW50KTtcbiAgICAgICAgcWlucGVsX3Jlc18xLlFpblNvdWwuc2tpbi5zdHlsZUFzRWRpdCh0aGlzLl9kaXZNYWluKTtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5zdHlsZS5wYWRkaW5nID0gXCI1cHhcIjtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5zdHlsZS5vdmVyZmxvdyA9IFwiYXV0b1wiO1xuICAgICAgICB0aGlzLmFkZEZvY3VzT3V0Q2xvc2VUb0FsbCh0aGlzLl9kaXZNYWluKTtcbiAgICB9XG4gICAgYWRkRm9jdXNPdXRDbG9zZVRvQWxsKGVsKSB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCAoZXYpID0+IHRoaXMub25Gb2N1c091dENsb3NlKGV2KSk7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBlbC5jaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZWwuY2hpbGRyZW4uaXRlbShpbmRleCk7XG4gICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRm9jdXNPdXRDbG9zZVRvQWxsKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkZvY3VzT3V0Q2xvc2UoZXYpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2Rpdk1haW4uY29udGFpbnModGhpcy5fZnJhbWUuZ2V0SUZyYW1lRG9jdW1lbnQoKS5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMzYwKTtcbiAgICAgICAgcmV0dXJuIHFpbnBlbF9yZXNfMS5RaW5Tb3VsLmFybS5zdG9wRXZlbnQoZXYpO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuX2ZyYW1lLmdldElGcmFtZURvY3VtZW50KCkuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9kaXZNYWluKTtcbiAgICAgICAgdGhpcy5fbWF4V2lkdGggPSB0aGlzLl9mcmFtZS5nZXRJRnJhbWUoKS5jbGllbnRXaWR0aCAtICh0aGlzLl9wb3NMZWZ0ICogMyk7XG4gICAgICAgIHRoaXMuX21heEhlaWdodCA9IHRoaXMuX2ZyYW1lLmdldElGcmFtZSgpLmNsaWVudEhlaWdodCAtICh0aGlzLl9wb3NUb3AgKiAzKTtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5zdHlsZS5sZWZ0ID0gdGhpcy5fcG9zTGVmdCArIFwicHhcIjtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5zdHlsZS50b3AgPSB0aGlzLl9wb3NUb3AgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuX2Rpdk1haW4uc3R5bGUubWF4V2lkdGggPSB0aGlzLl9tYXhXaWR0aCArIFwicHhcIjtcbiAgICAgICAgdGhpcy5fZGl2TWFpbi5zdHlsZS5tYXhIZWlnaHQgPSB0aGlzLl9tYXhIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuX2Rpdk1haW4udGFiSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9kaXZNYWluLmZvY3VzKCk7XG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICBpZiAodGhpcy5fZnJhbWUuZ2V0SUZyYW1lRG9jdW1lbnQoKS5ib2R5LmNvbnRhaW5zKHRoaXMuX2Rpdk1haW4pKSB7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZS5nZXRJRnJhbWVEb2N1bWVudCgpLmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5fZGl2TWFpbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5fZnJhbWUuZ2V0SUZyYW1lRG9jdW1lbnQoKS5ib2R5LmNvbnRhaW5zKHRoaXMuX2Rpdk1haW4pKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgZnJhbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcmFtZTtcbiAgICB9XG4gICAgZ2V0IGRpdkNvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXZDb250ZW50O1xuICAgIH1cbiAgICBnZXQgZGl2TWFpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpdk1haW47XG4gICAgfVxuICAgIGdldCBwb3NMZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zTGVmdDtcbiAgICB9XG4gICAgZ2V0IHBvc1RvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1RvcDtcbiAgICB9XG4gICAgZ2V0IG1heFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4V2lkdGg7XG4gICAgfVxuICAgIGdldCBtYXhIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgfVxufVxuZXhwb3J0cy5RaW5GcmFtZVBvcHVwID0gUWluRnJhbWVQb3B1cDtcbmNvbnN0IHN0eWxlcyA9IHtcbiAgICBhcHBseU9uSUZyYW1lOiAoZWwpID0+IHtcbiAgICAgICAgY29uc3QgaGVhZCA9IGVsLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuaGVhZDtcbiAgICAgICAgY29uc3QgZGVmYXVsdENTUyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgZGVmYXVsdENTUy5pZCA9IFwiUWlucGVsSUZyYW1lRGVmYXVsdENTU1wiO1xuICAgICAgICBkZWZhdWx0Q1NTLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuICAgICAgICBkZWZhdWx0Q1NTLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgICAgIGRlZmF1bHRDU1MuaHJlZiA9IFwiL3J1bi9hcHAvcWlucGVsLWFwcC9kZWZhdWx0LmNzc1wiO1xuICAgICAgICBkZWZhdWx0Q1NTLm1lZGlhID0gXCJhbGxcIjtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChkZWZhdWx0Q1NTKTtcbiAgICB9LFxuICAgIGFwcGx5T25EaWFsb2c6IChlbCkgPT4ge1xuICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgZWwuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUucmlnaHQgPSBcIjBweFwiO1xuICAgICAgICBlbC5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICBlbC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW5cIjtcbiAgICB9LFxuICAgIGFwcGx5T25EaWFsb2dUb3A6IChlbCkgPT4ge1xuICAgICAgICBlbC5zdHlsZS5mbGV4ID0gXCIwXCI7XG4gICAgICAgIGVsLnN0eWxlLnBhZGRpbmcgPSBcIjNweFwiO1xuICAgICAgICBlbC5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICBlbC5zdHlsZS5ib3JkZXIgPSBcIjBweFwiO1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIGVsLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcInJvd1wiO1xuICAgICAgICBlbC5zdHlsZS5mbGV4V3JhcCA9IFwid3JhcFwiO1xuICAgICAgICBlbC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcWlucGVsX3Jlc18xLlFpblN0eWxlcy5Db2xvckZvcmVncm91bmQ7XG4gICAgICAgIGVsLnN0eWxlLmNvbG9yID0gcWlucGVsX3Jlc18xLlFpblN0eWxlcy5Db2xvckJhY2tncm91bmQ7XG4gICAgfSxcbiAgICBhcHBseU9uRGlhbG9nUGFjazogKGVsKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLmZsZXggPSBcIjFcIjtcbiAgICAgICAgZWwuc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIjtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICBlbC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgICAgIGVsLnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgICAgICBlbC5zdHlsZS5wYWRkaW5nID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUuYm9yZGVyID0gXCIwcHhcIjtcbiAgICB9LFxuICAgIGFwcGx5T25EaWFsb2dUaXRsZTogKGVsKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLmZsZXggPSBcIjFcIjtcbiAgICAgICAgZWwuc3R5bGUudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgICAgZWwuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xuICAgIH0sXG4gICAgYXBwbHlPbkRpYWxvZ0Nsb3NlOiAoZWwpID0+IHtcbiAgICAgICAgZWwuc3R5bGUuZmxleCA9IFwiMFwiO1xuICAgICAgICBlbC5zdHlsZS5wYWRkaW5nID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUuYm9yZGVyID0gXCIwcHhcIjtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICBlbC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgICAgIGVsLnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIH0sXG4gICAgYXBwbHlPbkRpYWxvZ0ltYWdlOiAoZWwpID0+IHtcbiAgICAgICAgZWwuc3R5bGUucGFkZGluZyA9IFwiMHB4XCI7XG4gICAgICAgIGVsLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgIGVsLnN0eWxlLmJvcmRlciA9IFwiMHB4XCI7XG4gICAgfSxcbn07XG52YXIgU3RhdHVzS2luZDtcbihmdW5jdGlvbiAoU3RhdHVzS2luZCkge1xuICAgIFN0YXR1c0tpbmRbU3RhdHVzS2luZFtcIklORk9cIl0gPSAwXSA9IFwiSU5GT1wiO1xuICAgIFN0YXR1c0tpbmRbU3RhdHVzS2luZFtcIkVSUk9SXCJdID0gMV0gPSBcIkVSUk9SXCI7XG59KShTdGF0dXNLaW5kIHx8IChTdGF0dXNLaW5kID0ge30pKTtcbmNvbnN0IEZhY2VDb25maWdzID0ge1xuICAgIFBPUF9NRU5VX01BWF9IRUlHSFQ6IDI3MCxcbiAgICBQT1BfTUVOVV9XSURUSDogMTgwLFxuICAgIE1JTklNSVpFRF9XSURUSDogMTgwLFxuICAgIFNUQVRVU19NRVNTQUdFX01BWF9MRU5HVEg6IDE4MCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tZnJhbWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbk1hbmFnZXIgPSB2b2lkIDA7XG5jb25zdCBheGlvc18xID0gcmVxdWlyZShcImF4aW9zXCIpO1xuY29uc3QgcWlucGVsX3Jlc18xID0gcmVxdWlyZShcInFpbnBlbC1yZXNcIik7XG5jb25zdCBxaW5fZnJhbWVfMSA9IHJlcXVpcmUoXCIuL3Fpbi1mcmFtZVwiKTtcbmNsYXNzIFFpbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRpdkJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRpdk1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmltZ01lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLmZyYW1lc1RvcFogPSAxO1xuICAgICAgICB0aGlzLnVzZXJMYW5nID0gXCJcIjtcbiAgICAgICAgdGhpcy51c2VyVG9rZW4gPSBcIlwiO1xuICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgICAgIHRoaXMuaW5pdE1lbnUoKTtcbiAgICAgICAgdGhpcy5pbml0RHJhZ2dhYmxlKCk7XG4gICAgfVxuICAgIGluaXRCb2R5KCkge1xuICAgICAgICB0aGlzLmRpdkJvZHkuY2xhc3NOYW1lID0gXCJRaW5wZWxXaW5kb3dCb2R5XCI7XG4gICAgfVxuICAgIGluaXRNZW51KCkge1xuICAgICAgICB0aGlzLmRpdk1lbnUuaWQgPSBcIlFpbnBlbE1lbnVJRDBcIjtcbiAgICAgICAgdGhpcy5kaXZNZW51LmNsYXNzTmFtZSA9IFwiUWlucGVsV2luZG93TWVudVwiO1xuICAgICAgICB0aGlzLmltZ01lbnUuc3JjID0gXCIuL2Fzc2V0cy9xaW5wZWwucG5nXCI7XG4gICAgICAgIHRoaXMuaW1nTWVudS5hbHQgPSBcIk1lbnVcIjtcbiAgICAgICAgdGhpcy5kaXZNZW51LmFwcGVuZENoaWxkKHRoaXMuaW1nTWVudSk7XG4gICAgICAgIHRoaXMuZGl2Qm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpdk1lbnUpO1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkQWN0aW9uKHRoaXMuZGl2TWVudSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuaGFzU2hpZnQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0ZyYW1lKFwiUWlucGVsXCIsIFwiL3J1bi9hcHAvcWlucGVsLWFwcC9tZW51Lmh0bWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbml0RHJhZ2dhYmxlKCkge1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkU2Nyb2xsZXIodGhpcy5kaXZCb2R5LCB7XG4gICAgICAgICAgICBvbkRvdWJsZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGl2Qm9keS5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25FbmQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdXRJbkRvY3VtZW50KCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZGl2Qm9keSk7XG4gICAgICAgIHFpbnBlbF9yZXNfMS5RaW5Tb3VsLnNraW4uZGlzYWJsZVNlbGVjdGlvbihkb2N1bWVudC5ib2R5KTtcbiAgICB9XG4gICAgbmV3RnJhbWUodGl0bGUsIGFwcE5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBxaW5fZnJhbWVfMS5RaW5GcmFtZSh0aGlzLCB0aXRsZSwgYXBwTmFtZSwgb3B0aW9ucyk7XG4gICAgICAgIHJlc3VsdC5pbnN0YWxsKCk7XG4gICAgICAgIHRoaXMuZnJhbWVzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZ2V0RnJhbWUoZnJvbVRpdGxlKSB7XG4gICAgICAgIGZvciAoY29uc3QgZnJhbWUgb2YgdGhpcy5mcmFtZXMpIHtcbiAgICAgICAgICAgIGlmIChmcmFtZS5nZXRUaXRsZSgpID09PSBmcm9tVGl0bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJhbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGFkZENoaWxkKGNoaWxkKSB7XG4gICAgICAgIHRoaXMuZGl2Qm9keS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuICAgIGRlbENoaWxkKGNoaWxkKSB7XG4gICAgICAgIHRoaXMuZGl2Qm9keS5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgfVxuICAgIGdldEZyYW1lRnJvbUlEKGZyb21JRCkge1xuICAgICAgICBmb3IgKGNvbnN0IGZyYW1lIG9mIHRoaXMuZnJhbWVzKSB7XG4gICAgICAgICAgICBpZiAoZnJhbWUuZ2V0SUQoKSA9PT0gZnJvbUlEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXRGcmFtZUluZGV4RnJvbUlEKGZyb21JRCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mcmFtZXNbaV0uZ2V0SUQoKSA9PT0gZnJvbUlEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBkZWxGcmFtZShmcmFtZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZnJhbWVzLmluZGV4T2YoZnJhbWUpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5mcmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzaG93RWxlbWVudChlbGVtZW50KSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaWQgIT0gXCJRaW5wZWxQb3BNZW51SUQxXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcE1lbnVDbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56SW5kZXggPSBTdHJpbmcoKyt0aGlzLmZyYW1lc1RvcFopO1xuICAgICAgICAgICAgaWYgKCFxaW5wZWxfcmVzXzEuUWluU291bC5za2luLmlzRWxlbWVudFZpc2libGVJblNjcm9sbChlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5zY3JvbGxUbyhlbGVtZW50Lm9mZnNldExlZnQsIGVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlkLmluZGV4T2YoXCJRaW5wZWxGcmFtZUlEXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdldEZyYW1lSW5kZXhGcm9tSUQoZWxlbWVudC5pZCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFtZSA9IHRoaXMuZnJhbWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcmFtZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcmFtZXMudW5zaGlmdChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAzNjApO1xuICAgIH1cbiAgICBzaG93TWVudSgpIHtcbiAgICAgICAgdGhpcy5kaXZCb2R5LnNjcm9sbFRvKDAsIDApO1xuICAgICAgICB0aGlzLnNob3dFbGVtZW50KHRoaXMuZGl2TWVudSk7XG4gICAgfVxuICAgIHNob3dQb3BNZW51KCkge1xuICAgIH1cbiAgICBwb3BNZW51Q2xvc2UoKSB7XG4gICAgfVxuICAgIHNob3dBbGVydChtZXNzYWdlKSB7XG4gICAgICAgIGFsZXJ0KG1lc3NhZ2UpO1xuICAgIH1cbiAgICBnZXRCb2R5V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpdkJvZHkuY2xpZW50V2lkdGg7XG4gICAgfVxuICAgIGdldEJvZHlIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpdkJvZHkuY2xpZW50SGVpZ2h0O1xuICAgIH1cbiAgICBoYXNMb2dnZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJUb2tlbiAhPSBcIlwiO1xuICAgIH1cbiAgICBuZWVkVG9Mb2coKSB7XG4gICAgICAgIHJldHVybiAhcWlucGVsX3Jlc18xLlFpblNvdWwuZm9vdC5pc0xvY2FsSG9zdCgpICYmICF0aGlzLmhhc0xvZ2dlZCgpO1xuICAgIH1cbiAgICBnZXRBeGlvc0NvbmZpZyhoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycykge1xuICAgICAgICAgICAgaGVhZGVycyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGhlYWRlcnNbJ1FpbnBlbC1Ub2tlbiddID0gdGhpcy51c2VyVG9rZW47XG4gICAgICAgIGlmICghaGVhZGVyc1snQWNjZXB0LUxhbmd1YWdlJ10pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJMYW5nKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyc1snQWNjZXB0LUxhbmd1YWdlJ10gPSB0aGlzLnVzZXJMYW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmF2aWdhdG9yLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyc1snQWNjZXB0LUxhbmd1YWdlJ10gPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbmZpZ3MgPSB7XG4gICAgICAgICAgICBoZWFkZXJzXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjb25maWdzO1xuICAgIH1cbiAgICBnZXQoYWRkcmVzcywgaGVhZGVycykge1xuICAgICAgICBsZXQgY29uZmlncyA9IHRoaXMuZ2V0QXhpb3NDb25maWcoaGVhZGVycyk7XG4gICAgICAgIHJldHVybiBheGlvc18xLmRlZmF1bHQuZ2V0KGFkZHJlc3MsIGNvbmZpZ3MpO1xuICAgIH1cbiAgICBwb3N0KGFkZHJlc3MsIGRhdGEsIGhlYWRlcnMpIHtcbiAgICAgICAgbGV0IGNvbmZpZ3MgPSB0aGlzLmdldEF4aW9zQ29uZmlnKGhlYWRlcnMpO1xuICAgICAgICBpZiAoIWNvbmZpZ3MuaGVhZGVyc1snQ29udGVudC1UeXBlJ10pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgfHwgZGF0YSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3MuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBcInRleHQvcGxhaW5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3MuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBcIm11bHRpcGFydC9mb3JtLWRhdGFcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3MuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXhpb3NfMS5kZWZhdWx0LnBvc3QoYWRkcmVzcywgZGF0YSwgY29uZmlncyk7XG4gICAgfVxuICAgIHRyeUVudGVyKG5hbWUsIHBhc3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdChcIi9lbnRlclwiLCB7IG5hbWUsIHBhc3MgfSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckxhbmcgPSByZXMuZGF0YS5sYW5nO1xuICAgICAgICAgICAgICAgIHRoaXMudXNlclRva2VuID0gcmVzLmRhdGEudG9rZW47XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnVzZXJMYW5nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuUWluTWFuYWdlciA9IFFpbk1hbmFnZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tbWFuYWdlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWlucGVsID0gdm9pZCAwO1xuY29uc3QgcWlucGVsX3Jlc18xID0gcmVxdWlyZShcInFpbnBlbC1yZXNcIik7XG5jbGFzcyBRaW5wZWwge1xuICAgIGNvbnN0cnVjdG9yKG1hbmFnZXIsIGZyYW1lKSB7XG4gICAgICAgIHRoaXMudXRpbHMgPSBxaW5wZWxfcmVzXzEuUWluU291bDtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xuICAgIH1cbiAgICBnZXQoYWRkcmVzcywgaGVhZGVycykge1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmdldChhZGRyZXNzLCBoZWFkZXJzKTtcbiAgICB9XG4gICAgcG9zdChhZGRyZXNzLCBkYXRhLCBoZWFkZXJzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIucG9zdChhZGRyZXNzLCBkYXRhLCBoZWFkZXJzKTtcbiAgICB9XG59XG5leHBvcnRzLlFpbnBlbCA9IFFpbnBlbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbnBlbC5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9DYW5jZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuICAgIHZhciByZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgIHZhciBvbkNhbmNlbGVkO1xuICAgIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi51bnN1YnNjcmliZShvbkNhbmNlbGVkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgY29uZmlnLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgZnVuY3Rpb24gb25sb2FkZW5kKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCAgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWwgfHwgZGVmYXVsdHMudHJhbnNpdGlvbmFsO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/ICdFVElNRURPVVQnIDogJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAocmVzcG9uc2VUeXBlICYmIHJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbiB8fCBjb25maWcuc2lnbmFsKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgb25DYW5jZWxlZCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgKGNhbmNlbCAmJiBjYW5jZWwudHlwZSkgPyBuZXcgQ2FuY2VsKCdjYW5jZWxlZCcpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbiAmJiBjb25maWcuY2FuY2VsVG9rZW4uc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgY29uZmlnLnNpZ25hbC5hYm9ydGVkID8gb25DYW5jZWxlZCgpIDogY29uZmlnLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbiAgaW5zdGFuY2UuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGRlZmF1bHRDb25maWcsIGluc3RhbmNlQ29uZmlnKSk7XG4gIH07XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuYXhpb3MuVkVSU0lPTiA9IHJlcXVpcmUoJy4vZW52L2RhdGEnKS52ZXJzaW9uO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4oZnVuY3Rpb24oY2FuY2VsKSB7XG4gICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKSByZXR1cm47XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgbCA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgIH1cbiAgICB0b2tlbi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbihvbmZ1bGZpbGxlZCkge1xuICAgIHZhciBfcmVzb2x2ZTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pLnRoZW4ob25mdWxmaWxsZWQpO1xuXG4gICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICB0b2tlbi51bnN1YnNjcmliZShfcmVzb2x2ZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byB0aGUgY2FuY2VsIHNpZ25hbFxuICovXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxuLyoqXG4gKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gKi9cblxuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gdW5zdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdmFsaWRhdG9yJyk7XG5cbnZhciB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH1cblxuICB2YXIgdHJhbnNpdGlvbmFsID0gY29uZmlnLnRyYW5zaXRpb25hbDtcblxuICBpZiAodHJhbnNpdGlvbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyh0cmFuc2l0aW9uYWwsIHtcbiAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgZm9yY2VkSlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICBjbGFyaWZ5VGltZW91dEVycm9yOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pXG4gICAgfSwgZmFsc2UpO1xuICB9XG5cbiAgLy8gZmlsdGVyIG91dCBza2lwcGVkIGludGVyY2VwdG9yc1xuICB2YXIgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdmFyIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHRydWU7XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGlmICh0eXBlb2YgaW50ZXJjZXB0b3IucnVuV2hlbiA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnRlcmNlcHRvci5ydW5XaGVuKGNvbmZpZykgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzICYmIGludGVyY2VwdG9yLnN5bmNocm9ub3VzO1xuXG4gICAgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB2YXIgcHJvbWlzZTtcblxuICBpZiAoIXN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycykge1xuICAgIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG5cbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjaGFpbiwgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4pO1xuICAgIGNoYWluID0gY2hhaW4uY29uY2F0KHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbik7XG5cbiAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG4gICAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG5cbiAgdmFyIG5ld0NvbmZpZyA9IGNvbmZpZztcbiAgd2hpbGUgKHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLmxlbmd0aCkge1xuICAgIHZhciBvbkZ1bGZpbGxlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCk7XG4gICAgdmFyIG9uUmVqZWN0ZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHRyeSB7XG4gICAgICBuZXdDb25maWcgPSBvbkZ1bGZpbGxlZChuZXdDb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBvblJlamVjdGVkKGVycm9yKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgcHJvbWlzZSA9IGRpc3BhdGNoUmVxdWVzdChuZXdDb25maWcpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gIH1cblxuICB3aGlsZSAocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4ocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCksIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkLCBvcHRpb25zKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkLFxuICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbCcpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5zaWduYWwgJiYgY29uZmlnLnNpZ25hbC5hYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IENhbmNlbCgnY2FuY2VsZWQnKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgY29uZmlnLFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICBjb25maWcsXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZSxcbiAgICAgIHN0YXR1czogdGhpcy5yZXNwb25zZSAmJiB0aGlzLnJlc3BvbnNlLnN0YXR1cyA/IHRoaXMucmVzcG9uc2Uuc3RhdHVzIDogbnVsbFxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gbWVyZ2VEaXJlY3RLZXlzKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBtZXJnZU1hcCA9IHtcbiAgICAndXJsJzogdmFsdWVGcm9tQ29uZmlnMixcbiAgICAnbWV0aG9kJzogdmFsdWVGcm9tQ29uZmlnMixcbiAgICAnZGF0YSc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2Jhc2VVUkwnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0cmFuc2Zvcm1SZXF1ZXN0JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVzcG9uc2UnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdwYXJhbXNTZXJpYWxpemVyJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndGltZW91dCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXRNZXNzYWdlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnd2l0aENyZWRlbnRpYWxzJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnYWRhcHRlcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3Jlc3BvbnNlVHlwZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZDb29raWVOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAneHNyZkhlYWRlck5hbWUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdvblVwbG9hZFByb2dyZXNzJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25Eb3dubG9hZFByb2dyZXNzJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnZGVjb21wcmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhCb2R5TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNwb3J0JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnaHR0cEFnZW50JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnaHR0cHNBZ2VudCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2NhbmNlbFRva2VuJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnc29ja2V0UGF0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3Jlc3BvbnNlRW5jb2RpbmcnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd2YWxpZGF0ZVN0YXR1cyc6IG1lcmdlRGlyZWN0S2V5c1xuICB9O1xuXG4gIHV0aWxzLmZvckVhY2goT2JqZWN0LmtleXMoY29uZmlnMSkuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKSwgZnVuY3Rpb24gY29tcHV0ZUNvbmZpZ1ZhbHVlKHByb3ApIHtcbiAgICB2YXIgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIHZhciBjb25maWdWYWx1ZSA9IG1lcmdlKHByb3ApO1xuICAgICh1dGlscy5pc1VuZGVmaW5lZChjb25maWdWYWx1ZSkgJiYgbWVyZ2UgIT09IG1lcmdlRGlyZWN0S2V5cykgfHwgKGNvbmZpZ1twcm9wXSA9IGNvbmZpZ1ZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi8uLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgdmFyIGNvbnRleHQgPSB0aGlzIHx8IGRlZmF1bHRzO1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbi5jYWxsKGNvbnRleHQsIGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2NvcmUvZW5oYW5jZUVycm9yJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5U2FmZWx5KHJhd1ZhbHVlLCBwYXJzZXIsIGVuY29kZXIpIHtcbiAgaWYgKHV0aWxzLmlzU3RyaW5nKHJhd1ZhbHVlKSkge1xuICAgIHRyeSB7XG4gICAgICAocGFyc2VyIHx8IEpTT04ucGFyc2UpKHJhd1ZhbHVlKTtcbiAgICAgIHJldHVybiB1dGlscy50cmltKHJhd1ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChlbmNvZGVyIHx8IEpTT04uc3RyaW5naWZ5KShyYXdWYWx1ZSk7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcblxuICB0cmFuc2l0aW9uYWw6IHtcbiAgICBzaWxlbnRKU09OUGFyc2luZzogdHJ1ZSxcbiAgICBmb3JjZWRKU09OUGFyc2luZzogdHJ1ZSxcbiAgICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxuICB9LFxuXG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkgfHwgKGhlYWRlcnMgJiYgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPT09ICdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeVNhZmVseShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIHZhciB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbCB8fCBkZWZhdWx0cy50cmFuc2l0aW9uYWw7XG4gICAgdmFyIHNpbGVudEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5zaWxlbnRKU09OUGFyc2luZztcbiAgICB2YXIgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgIHZhciBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nO1xuXG4gICAgaWYgKHN0cmljdEpTT05QYXJzaW5nIHx8IChmb3JjZWRKU09OUGFyc2luZyAmJiB1dGlscy5pc1N0cmluZyhkYXRhKSAmJiBkYXRhLmxlbmd0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lID09PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBlbmhhbmNlRXJyb3IoZSwgdGhpcywgJ0VfSlNPTl9QQVJTRScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9LFxuXG4gIGhlYWRlcnM6IHtcbiAgICBjb21tb246IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICAgIH1cbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcInZlcnNpb25cIjogXCIwLjIyLjBcIlxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiAodHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2Vudi9kYXRhJykudmVyc2lvbjtcblxudmFyIHZhbGlkYXRvcnMgPSB7fTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblsnb2JqZWN0JywgJ2Jvb2xlYW4nLCAnbnVtYmVyJywgJ2Z1bmN0aW9uJywgJ3N0cmluZycsICdzeW1ib2wnXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUsIGkpIHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbnZhciBkZXByZWNhdGVkV2FybmluZ3MgPSB7fTtcblxuLyoqXG4gKiBUcmFuc2l0aW9uYWwgb3B0aW9uIHZhbGlkYXRvclxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yIC0gc2V0IHRvIGZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uYWwgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvbiAtIGRlcHJlY2F0ZWQgdmVyc2lvbiAvIHJlbW92ZWQgc2luY2UgdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSBtZXNzYWdlIC0gc29tZSBtZXNzYWdlIHdpdGggYWRkaXRpb25hbCBpbmZvXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICBmdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG9wdCwgZGVzYykge1xuICAgIHJldHVybiAnW0F4aW9zIHYnICsgVkVSU0lPTiArICddIFRyYW5zaXRpb25hbCBvcHRpb24gXFwnJyArIG9wdCArICdcXCcnICsgZGVzYyArIChtZXNzYWdlID8gJy4gJyArIG1lc3NhZ2UgOiAnJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG9wdCwgb3B0cykge1xuICAgIGlmICh2YWxpZGF0b3IgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0TWVzc2FnZShvcHQsICcgaGFzIGJlZW4gcmVtb3ZlZCcgKyAodmVyc2lvbiA/ICcgaW4gJyArIHZlcnNpb24gOiAnJykpKTtcbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbiAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgIGRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdID0gdHJ1ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgb3B0LFxuICAgICAgICAgICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2JyArIHZlcnNpb24gKyAnIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5lYXIgZnV0dXJlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IgPyB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0cykgOiB0cnVlO1xuICB9O1xufTtcblxuLyoqXG4gKiBBc3NlcnQgb2JqZWN0J3MgcHJvcGVydGllcyB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHBhcmFtIHtib29sZWFuP30gYWxsb3dVbmtub3duXG4gKi9cblxuZnVuY3Rpb24gYXNzZXJ0T3B0aW9ucyhvcHRpb25zLCBzY2hlbWEsIGFsbG93VW5rbm93bikge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgdmFyIG9wdCA9IGtleXNbaV07XG4gICAgdmFyIHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbb3B0XTtcbiAgICAgIHZhciByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uICcgKyBvcHQgKyAnIG11c3QgYmUgJyArIHJlc3VsdCk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFsbG93VW5rbm93biAhPT0gdHJ1ZSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gb3B0aW9uICcgKyBvcHQpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXNzZXJ0T3B0aW9uczogYXNzZXJ0T3B0aW9ucyxcbiAgdmFsaWRhdG9yczogdmFsaWRhdG9yc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RaW5Gb290ID0gZXhwb3J0cy5RaW5GaWxlc0Rlc2NyaXB0b3IgPSBleHBvcnRzLlFpbkZpbGVzT3BlcmF0aW9uID0gZXhwb3J0cy5RaW5GaWxlc05hdHVyZSA9IGV4cG9ydHMuUWluQXJtID0gZXhwb3J0cy5RaW5EcmFnQ2FsbHMgPSBleHBvcnRzLlFpbkV2ZW50ID0gZXhwb3J0cy5RaW5Tb3VsID0gZXhwb3J0cy5RaW5Cb2R5ID0gZXhwb3J0cy5RaW5IZWFkID0gZXhwb3J0cy5RaW5HcmFuZGV1ciA9IGV4cG9ydHMuUWluQm91bmRzID0gZXhwb3J0cy5RaW5EaW1lbnNpb24gPSBleHBvcnRzLlFpblBvaW50ID0gZXhwb3J0cy5RaW5Ta2luID0gZXhwb3J0cy5RaW5TdHlsZXMgPSB2b2lkIDA7XG52YXIgcWluX3NraW5fMSA9IHJlcXVpcmUoXCIuL3Fpbi1za2luXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluU3R5bGVzXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fc2tpbl8xLlFpblN0eWxlczsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpblNraW5cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9za2luXzEuUWluU2tpbjsgfSB9KTtcbnZhciBxaW5faGVhZF8xID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Qb2ludFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2hlYWRfMS5RaW5Qb2ludDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkRpbWVuc2lvblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2hlYWRfMS5RaW5EaW1lbnNpb247IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Cb3VuZHNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzEuUWluQm91bmRzOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluR3JhbmRldXJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzEuUWluR3JhbmRldXI7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5IZWFkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5faGVhZF8xLlFpbkhlYWQ7IH0gfSk7XG52YXIgcWluX2JvZHlfMSA9IHJlcXVpcmUoXCIuL3Fpbi1ib2R5XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluQm9keVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2JvZHlfMS5RaW5Cb2R5OyB9IH0pO1xudmFyIHFpbl9zb3VsXzEgPSByZXF1aXJlKFwiLi9xaW4tc291bFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpblNvdWxcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9zb3VsXzEuUWluU291bDsgfSB9KTtcbnZhciBxaW5fYXJtXzEgPSByZXF1aXJlKFwiLi9xaW4tYXJtXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluRXZlbnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9hcm1fMS5RaW5FdmVudDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkRyYWdDYWxsc1wiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2FybV8xLlFpbkRyYWdDYWxsczsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkFybVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2FybV8xLlFpbkFybTsgfSB9KTtcbnZhciBxaW5fZm9vdF8xID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5GaWxlc05hdHVyZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2Zvb3RfMS5RaW5GaWxlc05hdHVyZTsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkZpbGVzT3BlcmF0aW9uXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fZm9vdF8xLlFpbkZpbGVzT3BlcmF0aW9uOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluRmlsZXNEZXNjcmlwdG9yXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fZm9vdF8xLlFpbkZpbGVzRGVzY3JpcHRvcjsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkZvb3RcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9mb290XzEuUWluRm9vdDsgfSB9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWluQXJtID0gZXhwb3J0cy5RaW5EcmFnQ2FsbHMgPSBleHBvcnRzLlFpbkV2ZW50ID0gdm9pZCAwO1xuY29uc3QgcWluX3NraW5fMSA9IHJlcXVpcmUoXCIuL3Fpbi1za2luXCIpO1xuY2xhc3MgUWluRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZyb21PcmlnaW4gPSBudWxsO1xuICAgICAgICB0aGlzLmZyb21UeXBpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mcm9tUG9pbnRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNBbHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNDdHJsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzU2hpZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNNZXRhID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNFbnRlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRXNjYXBlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRG91YmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNMb25nID0gZmFsc2U7XG4gICAgICAgIHRoaXMua2V5VHlwZWQgPSBcIlwiO1xuICAgICAgICB0aGlzLnBvaW50T25YID0gLTE7XG4gICAgICAgIHRoaXMucG9pbnRPblkgPSAtMTtcbiAgICAgICAgdGhpcy5pc0ZpcnN0QnV0dG9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNNaWRkbGVCdXR0b24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1NlY29uZEJ1dHRvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzT25lRmluZ2VyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNUd29GaW5nZXJzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNUaHJlZUZpbmdlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdG9wRXZlbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgc2V0RnJvbUtleWJvYXJkKGV2KSB7XG4gICAgICAgIHRoaXMuZnJvbU9yaWdpbiA9IGV2LnRhcmdldDtcbiAgICAgICAgdGhpcy5mcm9tVHlwaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNBbHQgPSBldi5hbHRLZXk7XG4gICAgICAgIHRoaXMuaGFzQ3RybCA9IGV2LmN0cmxLZXk7XG4gICAgICAgIHRoaXMuaGFzU2hpZnQgPSBldi5zaGlmdEtleTtcbiAgICAgICAgdGhpcy5oYXNNZXRhID0gZXYubWV0YUtleTtcbiAgICAgICAgdGhpcy5pc0VudGVyID0gaXNLZXlFbnRlcihldik7XG4gICAgICAgIHRoaXMuaXNFc2NhcGUgPSBpc0tleUVzY2FwZShldik7XG4gICAgICAgIHRoaXMuaXNTcGFjZSA9IGlzS2V5U3BhY2UoZXYpO1xuICAgICAgICB0aGlzLmtleVR5cGVkID0gZXYua2V5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0RnJvbU1vdXNlKGV2KSB7XG4gICAgICAgIHRoaXMuZnJvbU9yaWdpbiA9IGV2LnRhcmdldDtcbiAgICAgICAgdGhpcy5mcm9tUG9pbnRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmhhc0FsdCA9IGV2LmFsdEtleTtcbiAgICAgICAgdGhpcy5oYXNDdHJsID0gZXYuY3RybEtleTtcbiAgICAgICAgdGhpcy5oYXNTaGlmdCA9IGV2LnNoaWZ0S2V5O1xuICAgICAgICB0aGlzLmhhc01ldGEgPSBldi5tZXRhS2V5O1xuICAgICAgICB0aGlzLnBvaW50T25YID0gZXYuY2xpZW50WDtcbiAgICAgICAgdGhpcy5wb2ludE9uWSA9IGV2LmNsaWVudFk7XG4gICAgICAgIHRoaXMuaXNGaXJzdEJ1dHRvbiA9IGV2LmJ1dHRvbiA9PSAwO1xuICAgICAgICB0aGlzLmlzTWlkZGxlQnV0dG9uID0gZXYuYnV0dG9uID09IDE7XG4gICAgICAgIHRoaXMuaXNTZWNvbmRCdXR0b24gPSBldi5idXR0b24gPT0gMjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldEZyb21Ub3VjaChldikge1xuICAgICAgICB0aGlzLmZyb21PcmlnaW4gPSBldi50YXJnZXQ7XG4gICAgICAgIHRoaXMuZnJvbVBvaW50aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNBbHQgPSBldi5hbHRLZXk7XG4gICAgICAgIHRoaXMuaGFzQ3RybCA9IGV2LmN0cmxLZXk7XG4gICAgICAgIHRoaXMuaGFzU2hpZnQgPSBldi5zaGlmdEtleTtcbiAgICAgICAgdGhpcy5oYXNNZXRhID0gZXYubWV0YUtleTtcbiAgICAgICAgaWYgKGV2LnRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gKGV2LnRvdWNoZXMubGVuZ3RoIC8gMikgfCAwO1xuICAgICAgICAgICAgdGhpcy5wb2ludE9uWCA9IGV2LnRvdWNoZXNbaW5kZXhdLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLnBvaW50T25ZID0gZXYudG91Y2hlc1tpbmRleF0uY2xpZW50WTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzT25lRmluZ2VyID0gZXYudG91Y2hlcy5sZW5ndGggPT0gMTtcbiAgICAgICAgdGhpcy5pc1R3b0ZpbmdlcnMgPSBldi50b3VjaGVzLmxlbmd0aCA9PSAyO1xuICAgICAgICB0aGlzLmlzVGhyZWVGaW5nZXJzID0gZXYudG91Y2hlcy5sZW5ndGggPT0gMztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuc3RvcEV2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgaXNQcmltYXJ5KCkge1xuICAgICAgICBpZiAodGhpcy5mcm9tVHlwaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0VudGVyIHx8IHRoaXMuaXNTcGFjZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmZyb21Qb2ludGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNGaXJzdEJ1dHRvbiB8fCB0aGlzLmlzT25lRmluZ2VyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNBdXhpbGlhcnkoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyb21UeXBpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc0N0cmwgJiYgdGhpcy5oYXNBbHQgJiYgdGhpcy5pc1NwYWNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZnJvbVBvaW50aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc01pZGRsZUJ1dHRvbiB8fCB0aGlzLmlzVGhyZWVGaW5nZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNTZWNvbmRhcnkoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyb21UeXBpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc0N0cmwgJiYgIXRoaXMuaGFzQWx0ICYmIHRoaXMuaXNTcGFjZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmZyb21Qb2ludGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNTZWNvbmRCdXR0b24gfHwgdGhpcy5pc1R3b0ZpbmdlcnM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuUWluRXZlbnQgPSBRaW5FdmVudDtcbjtcbmNsYXNzIFFpbkRyYWdDYWxscyB7XG59XG5leHBvcnRzLlFpbkRyYWdDYWxscyA9IFFpbkRyYWdDYWxscztcbmZ1bmN0aW9uIHN0b3BFdmVudChldmVudCkge1xuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbn1cbnZhciBsYXN0RXZlbnRQb2ludGVyID0gbnVsbDtcbmZ1bmN0aW9uIG1ha2VFdmVudFBvaW50ZXIoaXNEb3duLCBldikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgcG9zWDogMCxcbiAgICAgICAgcG9zWTogMCxcbiAgICB9O1xuICAgIGlmIChldiBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2LmNsaWVudFggfHwgZXYuY2xpZW50WSkge1xuICAgICAgICAgICAgcmVzdWx0LnBvc1ggPSBldi5jbGllbnRYO1xuICAgICAgICAgICAgcmVzdWx0LnBvc1kgPSBldi5jbGllbnRZO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGV2IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgICBpZiAoZXYudG91Y2hlcyAmJlxuICAgICAgICAgICAgZXYudG91Y2hlc1swXSAmJlxuICAgICAgICAgICAgKGV2LnRvdWNoZXNbMF0uY2xpZW50WCB8fCBldi50b3VjaGVzWzBdLmNsaWVudFkpKSB7XG4gICAgICAgICAgICByZXN1bHQucG9zWCA9IGV2LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgIHJlc3VsdC5wb3NZID0gZXYudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc0Rvd24pIHtcbiAgICAgICAgbGFzdEV2ZW50UG9pbnRlciA9IGV2O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaXNFdmVudFBvaW50ZXJEb3VibGUoaXNEb3duLCBldikge1xuICAgIGlmICghaXNEb3duIHx8IGxhc3RFdmVudFBvaW50ZXIgPT0gbnVsbCB8fCBldiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGltZURpZiA9IGV2LnRpbWVTdGFtcCAtIGxhc3RFdmVudFBvaW50ZXIudGltZVN0YW1wO1xuICAgIHJldHVybiB0aW1lRGlmIDwgNDUwO1xufVxuZnVuY3Rpb24gaXNFdmVudFBvaW50ZXJMb25nKGlzRG93biwgZXYpIHtcbiAgICBpZiAoIWlzRG93biB8fCBsYXN0RXZlbnRQb2ludGVyID09IG51bGwgfHwgZXYgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVEaWYgPSBldi50aW1lU3RhbXAgLSBsYXN0RXZlbnRQb2ludGVyLnRpbWVTdGFtcDtcbiAgICByZXR1cm4gdGltZURpZiA+IDg0MDtcbn1cbmZ1bmN0aW9uIGlzS2V5SW5MaXN0KGV2LCBsaXN0KSB7XG4gICAgbGV0IGtleUxvd2VyID0gZXYua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxpc3QuaW5kZXhPZihrZXlMb3dlcikgPiAtMTtcbn1cbmZ1bmN0aW9uIGlzS2V5RW50ZXIoZXYpIHtcbiAgICByZXR1cm4gaXNLZXlJbkxpc3QoZXYsIFtcImVudGVyXCIsIFwicmV0dXJuXCJdKSB8fCBldi5rZXlDb2RlID09PSAxMztcbn1cbmZ1bmN0aW9uIGlzS2V5RXNjYXBlKGV2KSB7XG4gICAgcmV0dXJuIGlzS2V5SW5MaXN0KGV2LCBbXCJlc2NcIiwgXCJlc2NhcGVcIl0pIHx8IGV2LmtleUNvZGUgPT09IDI3O1xufVxuZnVuY3Rpb24gaXNLZXlTcGFjZShldikge1xuICAgIHJldHVybiBpc0tleUluTGlzdChldiwgW1wiIFwiLCBcInNwYWNlXCIsIFwic3BhY2ViYXJcIl0pIHx8IGV2LmtleUNvZGUgPT09IDMyO1xufVxuZnVuY3Rpb24gYWRkQWN0aW9uKGVsZW1lbnQsIGFjdGlvbikge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgc3RvcEV2ZW50KTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBhY3Rpb25LZXlib2FyZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHN0b3BFdmVudCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBhY3Rpb25Nb3VzZSk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBzdG9wRXZlbnQpO1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGFjdGlvblRvdWNoKTtcbiAgICBmdW5jdGlvbiBhY3Rpb25LZXlib2FyZChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQoKS5zZXRGcm9tS2V5Ym9hcmQoZXYpO1xuICAgICAgICBhY3Rpb24ocWluRXZlbnQpO1xuICAgICAgICBpZiAocWluRXZlbnQuc3RvcEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFjdGlvbk1vdXNlKGV2KSB7XG4gICAgICAgIGxldCBxaW5FdmVudCA9IG5ldyBRaW5FdmVudCgpLnNldEZyb21Nb3VzZShldik7XG4gICAgICAgIGFjdGlvbihxaW5FdmVudCk7XG4gICAgICAgIGlmIChxaW5FdmVudC5zdG9wRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYWN0aW9uVG91Y2goZXYpIHtcbiAgICAgICAgbGV0IHFpbkV2ZW50ID0gbmV3IFFpbkV2ZW50KCkuc2V0RnJvbVRvdWNoKGV2KTtcbiAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LnN0b3BFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZEFjdGlvbkVudGVyKGVsZW1lbnQsIGFjdGlvbikge1xuICAgIGVsZW1lbnQub25rZXlkb3duID0gYWN0aW9uS2V5Ym9hcmQ7XG4gICAgZnVuY3Rpb24gYWN0aW9uS2V5Ym9hcmQoZXYpIHtcbiAgICAgICAgaWYgKGlzS2V5RW50ZXIoZXYpKSB7XG4gICAgICAgICAgICBhY3Rpb24obmV3IFFpbkV2ZW50KCkuc2V0RnJvbUtleWJvYXJkKGV2KSk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHB1dEFjdGlvblByb3h5KGRlc3RpbnksIG9yaWdpbnMpIHtcbiAgICBmb3IgKGNvbnN0IG9yaWdpbiBvZiBvcmlnaW5zKSB7XG4gICAgICAgIG9yaWdpbi5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XG4gICAgICAgICAgICBkZXN0aW55Lm9ua2V5ZG93bihlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9yaWdpbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHtcbiAgICAgICAgICAgIGRlc3Rpbnkub25tb3VzZXVwKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgb3JpZ2luLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBlID0+IHtcbiAgICAgICAgICAgIGRlc3Rpbnkub250b3VjaGVuZChlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkTW92ZXIoc291cmNlcywgdGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRFdmVudFggPSAwO1xuICAgIHZhciBkcmFnSW5pdEV2ZW50WSA9IDA7XG4gICAgdmFyIGRyYWdJbml0UG9zWCA9IDA7XG4gICAgdmFyIGRyYWdJbml0UG9zWSA9IDA7XG4gICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLm9ubW91c2Vkb3duID0gb25Nb3ZlckluaXQ7XG4gICAgICAgIHNvdXJjZS5vbnRvdWNoc3RhcnQgPSBvbk1vdmVySW5pdDtcbiAgICAgICAgc291cmNlLm9uZHJhZ3N0YXJ0ID0gc3RvcEV2ZW50O1xuICAgIH1cbiAgICBmdW5jdGlvbiBvbk1vdmVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdEV2ZW50WCA9IHBvaW50ZXIucG9zWDtcbiAgICAgICAgZHJhZ0luaXRFdmVudFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdJbml0UG9zWCA9IHBhcnNlSW50KHRhcmdldC5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgIGRyYWdJbml0UG9zWSA9IHBhcnNlSW50KHRhcmdldC5zdHlsZS50b3AsIDEwKTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaG1vdmUgPSBvbk1vdmVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvbk1vdmVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG9uTW92ZXJDbG9zZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gb25Nb3ZlckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3Zlck1vdmUoZXYpIHtcbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIoZmFsc2UsIGV2KTtcbiAgICAgICAgdmFyIGRyYWdEaWZYID0gcG9pbnRlci5wb3NYIC0gZHJhZ0luaXRFdmVudFg7XG4gICAgICAgIHZhciBkcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0RXZlbnRZO1xuICAgICAgICB2YXIgZHJhZ0ZpbmFsWCA9IGRyYWdJbml0UG9zWCArIGRyYWdEaWZYO1xuICAgICAgICB2YXIgZHJhZ0ZpbmFsWSA9IGRyYWdJbml0UG9zWSArIGRyYWdEaWZZO1xuICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IChkcmFnRmluYWxYID4gMCA/IGRyYWdGaW5hbFggOiAwKSArIFwicHhcIjtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IChkcmFnRmluYWxZID4gMCA/IGRyYWdGaW5hbFkgOiAwKSArIFwicHhcIjtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25Nb3ZlKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW92ZXJDbG9zZShldikge1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNobW92ZSA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGw7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5zaG93QWxsSUZyYW1lcygpO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25FbmQpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZFJlc2l6ZXIoc291cmNlcywgdGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRFdmVudFggPSAwO1xuICAgIHZhciBkcmFnSW5pdEV2ZW50WSA9IDA7XG4gICAgdmFyIGRyYWdJbml0V2lkdGggPSAwO1xuICAgIHZhciBkcmFnSW5pdEhlaWdodCA9IDA7XG4gICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLm9ubW91c2Vkb3duID0gb25SZXNpemVySW5pdDtcbiAgICAgICAgc291cmNlLm9udG91Y2hzdGFydCA9IG9uUmVzaXplckluaXQ7XG4gICAgICAgIHNvdXJjZS5vbmRyYWdzdGFydCA9IHN0b3BFdmVudDtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25SZXNpemVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdEV2ZW50WCA9IHBvaW50ZXIucG9zWDtcbiAgICAgICAgZHJhZ0luaXRFdmVudFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdJbml0V2lkdGggPSBwYXJzZUludCh0YXJnZXQuc3R5bGUud2lkdGgsIDEwKTtcbiAgICAgICAgZHJhZ0luaXRIZWlnaHQgPSBwYXJzZUludCh0YXJnZXQuc3R5bGUuaGVpZ2h0LCAxMCk7XG4gICAgICAgIGRvY3VtZW50Lm9udG91Y2htb3ZlID0gb25SZXNpemVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvblJlc2l6ZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gb25SZXNpemVyQ2xvc2U7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG9uUmVzaXplckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25SZXNpemVyTW92ZShldikge1xuICAgICAgICBjb25zdCBwb2ludGVyID0gbWFrZUV2ZW50UG9pbnRlcihmYWxzZSwgZXYpO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRGlmWCA9IHBvaW50ZXIucG9zWCAtIGRyYWdJbml0RXZlbnRYO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0RXZlbnRZO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRmluYWxXaWR0aCA9IGRyYWdJbml0V2lkdGggKyBmcmFtZURyYWdEaWZYO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRmluYWxIZWlnaHQgPSBkcmFnSW5pdEhlaWdodCArIGZyYW1lRHJhZ0RpZlk7XG4gICAgICAgIHRhcmdldC5zdHlsZS53aWR0aCA9IChmcmFtZURyYWdGaW5hbFdpZHRoID4gMCA/IGZyYW1lRHJhZ0ZpbmFsV2lkdGggOiAwKSArIFwicHhcIjtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9XG4gICAgICAgICAgICAoZnJhbWVEcmFnRmluYWxIZWlnaHQgPiAwID8gZnJhbWVEcmFnRmluYWxIZWlnaHQgOiAwKSArIFwicHhcIjtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25Nb3ZlKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUmVzaXplckNsb3NlKGV2KSB7XG4gICAgICAgIGRvY3VtZW50Lm9udG91Y2htb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcbiAgICAgICAgcWluX3NraW5fMS5RaW5Ta2luLnNob3dBbGxJRnJhbWVzKCk7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkVuZCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkU2Nyb2xsZXIodGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRYID0gMDtcbiAgICB2YXIgZHJhZ0luaXRZID0gMDtcbiAgICB2YXIgZHJhZ1Njcm9sbFggPSAwO1xuICAgIHZhciBkcmFnU2Nyb2xsWSA9IDA7XG4gICAgdGFyZ2V0Lm9uZHJhZ3N0YXJ0ID0gc3RvcEV2ZW50O1xuICAgIHRhcmdldC5vbnRvdWNoc3RhcnQgPSBvblNjcm9sbGVySW5pdDtcbiAgICB0YXJnZXQub25tb3VzZWRvd24gPSBvblNjcm9sbGVySW5pdDtcbiAgICBmdW5jdGlvbiBvblNjcm9sbGVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdFggPSBwb2ludGVyLnBvc1g7XG4gICAgICAgIGRyYWdJbml0WSA9IHBvaW50ZXIucG9zWTtcbiAgICAgICAgZHJhZ1Njcm9sbFggPSB0YXJnZXQuc2Nyb2xsTGVmdDtcbiAgICAgICAgZHJhZ1Njcm9sbFkgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNobW92ZSA9IG9uU2Nyb2xsZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG9uU2Nyb2xsZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gb25TY3JvbGxlckNsb3NlO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBvblNjcm9sbGVyQ2xvc2U7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5oaWRlQWxsSUZyYW1lcygpO1xuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vblN0YXJ0KSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25TdGFydCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblNjcm9sbGVyTW92ZShldikge1xuICAgICAgICBjb25zdCBwb2ludGVyID0gbWFrZUV2ZW50UG9pbnRlcihmYWxzZSwgZXYpO1xuICAgICAgICB2YXIgZHJhZ0RpZlggPSBwb2ludGVyLnBvc1ggLSBkcmFnSW5pdFg7XG4gICAgICAgIHZhciBkcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0WTtcbiAgICAgICAgdmFyIGRyYWdOZXdYID0gZHJhZ1Njcm9sbFggLSBkcmFnRGlmWDtcbiAgICAgICAgdmFyIGRyYWdOZXdZID0gZHJhZ1Njcm9sbFkgLSBkcmFnRGlmWTtcbiAgICAgICAgdGFyZ2V0LnNjcm9sbFRvKGRyYWdOZXdYLCBkcmFnTmV3WSk7XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTW92ZSkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uTW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblNjcm9sbGVyQ2xvc2UoZXYpIHtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaG1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uc2hvd0FsbElGcmFtZXMoKTtcbiAgICAgICAgcWluX3NraW5fMS5RaW5Ta2luLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uRW5kKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25FbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG59XG5leHBvcnRzLlFpbkFybSA9IHtcbiAgICBzdG9wRXZlbnQsXG4gICAgbWFrZUV2ZW50UG9pbnRlcixcbiAgICBpc0V2ZW50UG9pbnRlckRvdWJsZSxcbiAgICBpc0V2ZW50UG9pbnRlckxvbmcsXG4gICAgaXNLZXlJbkxpc3QsXG4gICAgaXNLZXlFbnRlcixcbiAgICBpc0tleVNwYWNlLFxuICAgIGFkZEFjdGlvbixcbiAgICBhZGRBY3Rpb25FbnRlcixcbiAgICBwdXRBY3Rpb25Qcm94eSxcbiAgICBhZGRNb3ZlcixcbiAgICBhZGRSZXNpemVyLFxuICAgIGFkZFNjcm9sbGVyLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1hcm0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkJvZHkgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRUZXh0TGluZXMoZnJvbVRleHQpIHtcbiAgICByZXR1cm4gZnJvbVRleHQubWF0Y2goL1teXFxyXFxuXSsvZyk7XG59XG5mdW5jdGlvbiBnZXRDU1ZSb3dzKGZyb21UZXh0LCBuYW1lcykge1xuICAgIHZhciBsaW5lcyA9IGdldFRleHRMaW5lcyhmcm9tVGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgICAgbGV0IHJvdyA9ICghbmFtZXMpID8gW10gOiB7fTtcbiAgICAgICAgbGV0IGluc2lkZV9xdW90ZXMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGNvbHVtbl92YWx1ZSA9IFwiXCI7XG4gICAgICAgIGxldCBjb2x1bW5faW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBjaGFyX2luZGV4ID0gMDsgY2hhcl9pbmRleCA8IGxpbmUubGVuZ3RoOyBjaGFyX2luZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhY3R1YWwgPSBsaW5lLmNoYXJBdChjaGFyX2luZGV4KTtcbiAgICAgICAgICAgIGlmIChpbnNpZGVfcXVvdGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA9PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gY2hhcl9pbmRleCA8IGxpbmUubGVuZ3RoIC0gMSA/IGxpbmUuY2hhckF0KGNoYXJfaW5kZXggKyAxKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSArPSBhY3R1YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyX2luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGVfcXVvdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSArPSBhY3R1YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA9PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc2lkZV9xdW90ZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY3R1YWwgPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSA9IHVubWFza1NwZWNpYWxDaGFycyhjb2x1bW5fdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cucHVzaChjb2x1bW5fdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbl9uYW1lID0gXCJjb2xfXCIgKyBjb2x1bW5faW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uX2luZGV4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uX25hbWUgPSBuYW1lc1tjb2x1bW5faW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93W2NvbHVtbl9uYW1lXSA9IGNvbHVtbl92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fdmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5faW5kZXgrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSArPSBhY3R1YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbHVtbl92YWx1ZSA9IHVubWFza1NwZWNpYWxDaGFycyhjb2x1bW5fdmFsdWUpO1xuICAgICAgICBpZiAoIW5hbWVzKSB7XG4gICAgICAgICAgICByb3cucHVzaChjb2x1bW5fdmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5fbmFtZSA9IFwiY29sX1wiICsgY29sdW1uX2luZGV4O1xuICAgICAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbl9uYW1lID0gbmFtZXNbY29sdW1uX2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd1tjb2x1bW5fbmFtZV0gPSBjb2x1bW5fdmFsdWU7XG4gICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtYXNrU3BlY2lhbENoYXJzKGZyb21UZXh0KSB7XG4gICAgcmV0dXJuIGZyb21UZXh0XG4gICAgICAgIC5yZXBsYWNlKFwiXFxcXFwiLCBcIlxcXFxcXFxcXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiXFxyXCIsIFwiXFxcXHJcIilcbiAgICAgICAgLnJlcGxhY2UoXCJcXG5cIiwgXCJcXFxcblwiKVxuICAgICAgICAucmVwbGFjZShcIlxcdFwiLCBcIlxcXFx0XCIpO1xufVxuZnVuY3Rpb24gdW5tYXNrU3BlY2lhbENoYXJzKGZyb21UZXh0KSB7XG4gICAgcmV0dXJuIGZyb21UZXh0XG4gICAgICAgIC5yZXBsYWNlKFwiXFxcXFxcXFxcIiwgXCJcXFxcXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiXFxcXHJcIiwgXCJcXHJcIilcbiAgICAgICAgLnJlcGxhY2UoXCJcXFxcblwiLCBcIlxcblwiKVxuICAgICAgICAucmVwbGFjZShcIlxcXFx0XCIsIFwiXFx0XCIpO1xufVxuZnVuY3Rpb24gcGFyc2VQYXJhbWV0ZXJzKHNvdXJjZSkge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBsZXQgb3BlbiA9IGZhbHNlO1xuICAgIGxldCBhY3R1YWwgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgbGV0dGVyIG9mIEFycmF5LmZyb20oc291cmNlKSkge1xuICAgICAgICBpZiAob3Blbikge1xuICAgICAgICAgICAgaWYgKGxldHRlciA9PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgb3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChhY3R1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYWN0dWFsKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhY3R1YWwgKz0gbGV0dGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGxldHRlciA9PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgb3BlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhY3R1YWwpO1xuICAgICAgICAgICAgICAgICAgICBhY3R1YWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxldHRlciA9PSAnICcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0dWFsICs9IGxldHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5RaW5Cb2R5ID0ge1xuICAgIGdldFRleHRMaW5lcyxcbiAgICBnZXRDU1ZSb3dzLFxuICAgIG1hc2tTcGVjaWFsQ2hhcnMsXG4gICAgdW5tYXNrU3BlY2lhbENoYXJzLFxuICAgIHBhcnNlUGFyYW1ldGVycyxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tYm9keS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWluRm9vdCA9IGV4cG9ydHMuUWluRmlsZXNEZXNjcmlwdG9yID0gZXhwb3J0cy5RaW5GaWxlc09wZXJhdGlvbiA9IGV4cG9ydHMuUWluRmlsZXNOYXR1cmUgPSB2b2lkIDA7XG52YXIgUWluRmlsZXNOYXR1cmU7XG4oZnVuY3Rpb24gKFFpbkZpbGVzTmF0dXJlKSB7XG4gICAgUWluRmlsZXNOYXR1cmVbXCJCT1RIXCJdID0gXCJib3RoXCI7XG4gICAgUWluRmlsZXNOYXR1cmVbXCJESVJFQ1RPUklFU1wiXSA9IFwiZGlyZWN0b3JpZXNcIjtcbiAgICBRaW5GaWxlc05hdHVyZVtcIkZJTEVTXCJdID0gXCJmaWxlc1wiO1xufSkoUWluRmlsZXNOYXR1cmUgPSBleHBvcnRzLlFpbkZpbGVzTmF0dXJlIHx8IChleHBvcnRzLlFpbkZpbGVzTmF0dXJlID0ge30pKTtcbnZhciBRaW5GaWxlc09wZXJhdGlvbjtcbihmdW5jdGlvbiAoUWluRmlsZXNPcGVyYXRpb24pIHtcbiAgICBRaW5GaWxlc09wZXJhdGlvbltcIk9QRU5cIl0gPSBcIm9wZW5cIjtcbiAgICBRaW5GaWxlc09wZXJhdGlvbltcIlNBVkVcIl0gPSBcInNhdmVcIjtcbn0pKFFpbkZpbGVzT3BlcmF0aW9uID0gZXhwb3J0cy5RaW5GaWxlc09wZXJhdGlvbiB8fCAoZXhwb3J0cy5RaW5GaWxlc09wZXJhdGlvbiA9IHt9KSk7XG5jbGFzcyBRaW5GaWxlc0Rlc2NyaXB0b3Ige1xufVxuZXhwb3J0cy5RaW5GaWxlc0Rlc2NyaXB0b3IgPSBRaW5GaWxlc0Rlc2NyaXB0b3I7XG5mdW5jdGlvbiBnZXRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWY7XG59XG5mdW5jdGlvbiBpc0xvY2FsSG9zdCgpIHtcbiAgICB2YXIgbG9jYXRpb24gPSBnZXRMb2NhdGlvbigpO1xuICAgIHZhciBzdGFydCA9IGxvY2F0aW9uLmluZGV4T2YoXCI6Ly9cIik7XG4gICAgaWYgKHN0YXJ0ID09IC0xKSB7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXJ0ICs9IDM7XG4gICAgfVxuICAgIGxvY2F0aW9uID0gbG9jYXRpb24uc3Vic3RyaW5nKHN0YXJ0KTtcbiAgICByZXR1cm4gbG9jYXRpb24uaW5kZXhPZihcImxvY2FsaG9zdFwiKSA9PT0gMCB8fCBsb2NhdGlvbi5pbmRleE9mKFwiMTI3LjAuMC4xXCIpID09PSAwO1xufVxuZnVuY3Rpb24gZ2V0U2VwYXJhdG9yKG9mUGF0aCkge1xuICAgIGxldCByZXN1bHQgPSBcIi9cIjtcbiAgICBpZiAob2ZQYXRoICYmIG9mUGF0aC5pbmRleE9mKFwiXFxcXFwiKSA+IC0xKSB7XG4gICAgICAgIHJlc3VsdCA9IFwiXFxcXFwiO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0UGF0aEpvaW4ocGF0aEEsIHBhdGhCKSB7XG4gICAgaWYgKHBhdGhBID09IG51bGwgfHwgcGF0aEEgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhdGhBID0gXCJcIjtcbiAgICB9XG4gICAgaWYgKHBhdGhCID09IG51bGwgfHwgcGF0aEIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhdGhCID0gXCJcIjtcbiAgICB9XG4gICAgaWYgKHBhdGhBLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBwYXRoQjtcbiAgICB9XG4gICAgZWxzZSBpZiAocGF0aEIubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIHBhdGhBO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGV0IHVuaW9uID0gXCIvXCI7XG4gICAgICAgIGlmIChwYXRoQS5pbmRleE9mKFwiXFxcXFwiKSA+IC0xIHx8IHBhdGhCLmluZGV4T2YoXCJcXFxcXCIpID4gLTEpIHtcbiAgICAgICAgICAgIHVuaW9uID0gXCJcXFxcXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBhdGhBRW5kID0gcGF0aEEuc3Vic3RyaW5nKHBhdGhBLmxlbmd0aCAtIDEsIHBhdGhBLmxlbmd0aCk7XG4gICAgICAgIGxldCBwYXRoQlN0YXJ0ID0gcGF0aEIuc3Vic3RyaW5nKDAsIDEpO1xuICAgICAgICBpZiAocGF0aEFFbmQgPT0gdW5pb24gfHwgcGF0aEJTdGFydCA9PSB1bmlvbikge1xuICAgICAgICAgICAgdW5pb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoQSArIHVuaW9uICsgcGF0aEI7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0Um9vdChwYXRoKSB7XG4gICAgaWYgKHBhdGgpIHtcbiAgICAgICAgbGV0IHNlcGFyYXRvciA9IGdldFNlcGFyYXRvcihwYXRoKTtcbiAgICAgICAgbGV0IGxhc3QgPSBwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvcik7XG4gICAgICAgIGlmIChsYXN0ID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnN1YnN0cmluZygwLCBsYXN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn1cbmZ1bmN0aW9uIGdldFN0ZW0ocGF0aCkge1xuICAgIGlmIChwYXRoKSB7XG4gICAgICAgIGxldCBzZXBhcmF0b3IgPSBnZXRTZXBhcmF0b3IocGF0aCk7XG4gICAgICAgIGxldCBsYXN0ID0gcGF0aC5sYXN0SW5kZXhPZihzZXBhcmF0b3IpO1xuICAgICAgICBpZiAobGFzdCA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5zdWJzdHJpbmcobGFzdCArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufVxuZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbihuYW1lKSB7XG4gICAgbGV0IHBvc2l0aW9uID0gbmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XG4gICAgaWYgKHBvc2l0aW9uID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKHBvc2l0aW9uICsgMSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG59XG5jb25zdCBhcHBzRXh0ZW5zaW9ucyA9IFtcbiAgICBcImh0bVwiLCBcImh0bWxcIiwgXCJjc3NcIiwgXCJqc1wiLCBcImpzeFwiLCBcInRzXCIsIFwidHN4XCIsIFwicGh0bWxcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZUFwcChleHRlbnNpb24pIHtcbiAgICByZXR1cm4gYXBwc0V4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTE7XG59XG5jb25zdCBjbWRzRXh0ZW5zaW9ucyA9IFtcbiAgICBcImhcIiwgXCJjXCIsIFwiaHBwXCIsIFwiY3BwXCIsIFwicnNcIiwgXCJqbFwiLFxuICAgIFwiY3NcIiwgXCJjc3Byb2pcIiwgXCJmc1wiLCBcIm1sXCIsIFwiZnNpXCIsIFwibWxpXCIsIFwiZnN4XCIsIFwiZnNzY3JpcHRcIixcbiAgICBcImphdmFcIiwgXCJneVwiLCBcImd2eVwiLCBcImdyb292eVwiLCBcInNjXCIsIFwic2NhbGFcIiwgXCJjbGpcIixcbiAgICBcInB5XCIsIFwicnVieVwiLCBcInBocFwiLCBcInBodG1sXCIsXG5dO1xuZnVuY3Rpb24gaXNGaWxlQ21kKGV4dGVuc2lvbikge1xuICAgIHJldHVybiBjbWRzRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IGV4ZWNFeHRlbnNpb25zID0gW1xuICAgIFwiZXhlXCIsIFwiamFyXCIsIFwiY29tXCIsIFwiYmF0XCIsIFwic2hcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZUV4ZWMoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIGV4ZWNFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgaW1hZ2VFeHRlbnNpb25zID0gW1xuICAgIFwianBnXCIsIFwianBlZ1wiLCBcInBuZ1wiLCBcImdpZlwiLCBcImJtcFwiXG5dO1xuZnVuY3Rpb24gaXNGaWxlSW1hZ2UoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIGltYWdlRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IHZlY3RvckV4dGVuc2lvbnMgPSBbXG4gICAgXCJzdmdcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZVZlY3RvcihleHRlbnNpb24pIHtcbiAgICByZXR1cm4gdmVjdG9yRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IG1vdmllRXh0ZW5zaW9ucyA9IFtcbiAgICBcImF2aVwiLCBcIm1wNFwiXG5dO1xuZnVuY3Rpb24gaXNGaWxlTW92aWUoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIG1vdmllRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IG11c2ljRXh0ZW5zaW9ucyA9IFtcbiAgICBcIndhdlwiLCBcIm1wM1wiXG5dO1xuZnVuY3Rpb24gaXNGaWxlTXVzaWMoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIG11c2ljRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IHppcHBlZEV4dGVuc2lvbnMgPSBbXG4gICAgXCJ6aXBcIiwgXCJyYXJcIiwgXCI3elwiLCBcInRhclwiLCBcImd6XCJcbl07XG5mdW5jdGlvbiBpc0ZpbGVaaXBwZWQoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIHppcHBlZEV4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTE7XG59XG5leHBvcnRzLlFpbkZvb3QgPSB7XG4gICAgZ2V0TG9jYXRpb24sXG4gICAgaXNMb2NhbEhvc3QsXG4gICAgZ2V0U2VwYXJhdG9yLFxuICAgIGdldFBhdGhKb2luLFxuICAgIGdldFJvb3QsXG4gICAgZ2V0U3RlbSxcbiAgICBnZXRGaWxlRXh0ZW5zaW9uLFxuICAgIGlzRmlsZUFwcCxcbiAgICBpc0ZpbGVDbWQsXG4gICAgaXNGaWxlRXhlYyxcbiAgICBpc0ZpbGVJbWFnZSxcbiAgICBpc0ZpbGVWZWN0b3IsXG4gICAgaXNGaWxlTW92aWUsXG4gICAgaXNGaWxlTXVzaWMsXG4gICAgaXNGaWxlWmlwcGVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1mb290LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RaW5IZWFkID0gZXhwb3J0cy5RaW5HcmFuZGV1ciA9IGV4cG9ydHMuUWluQm91bmRzID0gZXhwb3J0cy5RaW5EaW1lbnNpb24gPSBleHBvcnRzLlFpblBvaW50ID0gdm9pZCAwO1xuY2xhc3MgUWluUG9pbnQge1xufVxuZXhwb3J0cy5RaW5Qb2ludCA9IFFpblBvaW50O1xuO1xuY2xhc3MgUWluRGltZW5zaW9uIHtcbn1cbmV4cG9ydHMuUWluRGltZW5zaW9uID0gUWluRGltZW5zaW9uO1xuO1xuY2xhc3MgUWluQm91bmRzIHtcbn1cbmV4cG9ydHMuUWluQm91bmRzID0gUWluQm91bmRzO1xuO1xudmFyIFFpbkdyYW5kZXVyO1xuKGZ1bmN0aW9uIChRaW5HcmFuZGV1cikge1xuICAgIFFpbkdyYW5kZXVyW1wiU01BTExcIl0gPSBcInNtYWxsXCI7XG4gICAgUWluR3JhbmRldXJbXCJNRURJVU1cIl0gPSBcIm1lZGl1bVwiO1xuICAgIFFpbkdyYW5kZXVyW1wiTEFSR0VcIl0gPSBcImxhcmdlXCI7XG59KShRaW5HcmFuZGV1ciA9IGV4cG9ydHMuUWluR3JhbmRldXIgfHwgKGV4cG9ydHMuUWluR3JhbmRldXIgPSB7fSkpO1xuZnVuY3Rpb24gZ2V0RGVza0FQSSgpIHtcbiAgICB2YXIgd2luID0gd2luZG93O1xuICAgIGlmICh3aW4uZGVza0FQSSkge1xuICAgICAgICByZXR1cm4gd2luLmRlc2tBUEk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW4gPSB3aW5kb3cucGFyZW50O1xuICAgIH1cbiAgICBpZiAod2luLmRlc2tBUEkpIHtcbiAgICAgICAgcmV0dXJuIHdpbi5kZXNrQVBJO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2luID0gd2luZG93LnRvcDtcbiAgICB9XG4gICAgaWYgKHdpbi5kZXNrQVBJKSB7XG4gICAgICAgIHJldHVybiB3aW4uZGVza0FQSTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmNvbnN0IGxvZ2dlZCA9IFtdO1xuZnVuY3Rpb24gZ2V0TG9nZ2VkKCkge1xuICAgIHJldHVybiBsb2dnZWQ7XG59XG5mdW5jdGlvbiBsb2cobWVzc2FnZSkge1xuICAgIGxvZ2dlZC5wdXNoKG1lc3NhZ2UpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH1cbiAgICBjYXRjaCAoXykgeyB9XG4gICAgdHJ5IHtcbiAgICAgICAgZ2V0RGVza0FQSSgpLnNlbmQoXCJsb2dPbk1haW5cIiwgbWVzc2FnZSk7XG4gICAgfVxuICAgIGNhdGNoIChfKSB7IH1cbn1cbmZ1bmN0aW9uIGxvZ0Vycm9yKGVycm9yLCBvcmlnaW4pIHtcbiAgICBsb2coZ2V0RXJyb3JNZXNzYWdlKGVycm9yLCBvcmlnaW4pKTtcbn1cbmZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShlcnJvciwgb3JpZ2luKSB7XG4gICAgcmV0dXJuIGdldFRyZWF0TWVzc2FnZShcIlByb2JsZW0gd2l0aDpcIiwgZXJyb3IsIG9yaWdpbik7XG59XG5mdW5jdGlvbiBsb2dXYXJuaW5nKGVycm9yLCBvcmlnaW4pIHtcbiAgICBsb2coZ2V0V2FybmluZ01lc3NhZ2UoZXJyb3IsIG9yaWdpbikpO1xufVxuZnVuY3Rpb24gZ2V0V2FybmluZ01lc3NhZ2UoZXJyb3IsIG9yaWdpbikge1xuICAgIHJldHVybiBnZXRUcmVhdE1lc3NhZ2UoXCJDaGVja291dCB0aGlzOlwiLCBlcnJvciwgb3JpZ2luKTtcbn1cbmZ1bmN0aW9uIGxvZ1N1cHBvcnQoZXJyb3IsIG9yaWdpbikge1xuICAgIGxvZyhnZXRTdXBwb3J0TWVzc2FnZShlcnJvciwgb3JpZ2luKSk7XG59XG5mdW5jdGlvbiBnZXRTdXBwb3J0TWVzc2FnZShlcnJvciwgb3JpZ2luKSB7XG4gICAgcmV0dXJuIGdldFRyZWF0TWVzc2FnZShcIk5lZWQgU3VwcG9ydCBvbjpcIiwgZXJyb3IsIG9yaWdpbik7XG59XG5mdW5jdGlvbiBnZXRUcmVhdE1lc3NhZ2UocHJlZml4LCBlcnJvciwgb3JpZ2luKSB7XG4gICAgdmFyIHJlc3VsdCA9IHByZWZpeCArIChlcnJvciA/IFwiIFwiICsgZXJyb3IudG9TdHJpbmcoKSA6IFwiXCIpO1xuICAgIGlmIChlcnJvci5yZXNwb25zZSAmJiBlcnJvci5yZXNwb25zZS5kYXRhKSB7XG4gICAgICAgIHZhciBlcnJvckRhdGEgPSBlcnJvci5yZXNwb25zZS5kYXRhO1xuICAgICAgICBpZiAoISh0eXBlb2YgZXJyb3JEYXRhID09IFwic3RyaW5nXCIgfHwgZXJyb3JEYXRhIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICAgICAgZXJyb3JEYXRhID0gSlNPTi5zdHJpbmdpZnkoZXJyb3JEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gXCIgLSBEYXRhOiBcIiArIGVycm9yRGF0YTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICghKHR5cGVvZiBlcnJvciA9PSBcInN0cmluZ1wiIHx8IGVycm9yIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFwiIC0gRGF0YTogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgICByZXN1bHQgKz0gXCIgLSBPcmlnaW46IFwiICsgb3JpZ2luO1xuICAgIH1cbiAgICBjb25zdCBzdGFjayA9IChuZXcgRXJyb3IoXCJcIikpLnN0YWNrO1xuICAgIGlmIChzdGFjaykge1xuICAgICAgICByZXN1bHQgKz0gXCIgLSBTdGFjazogXCIgKyBzdGFjaztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHRvZ2dsZURldlRvb2xzKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGdldERlc2tBUEkoKS5zZW5kKFwidG9nZ2xlRGV2VG9vbHNcIik7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ0Vycm9yKGUsIFwie3FpbnBlbC1yZXN9KEVyckNvZGUtMDAwMDAxKVwiKTtcbiAgICB9XG59XG5leHBvcnRzLlFpbkhlYWQgPSB7XG4gICAgZ2V0RGVza0FQSSxcbiAgICBnZXRMb2dnZWQsXG4gICAgbG9nLFxuICAgIGxvZ0Vycm9yLFxuICAgIGdldEVycm9yTWVzc2FnZSxcbiAgICBsb2dXYXJuaW5nLFxuICAgIGdldFdhcm5pbmdNZXNzYWdlLFxuICAgIGxvZ1N1cHBvcnQsXG4gICAgZ2V0U3VwcG9ydE1lc3NhZ2UsXG4gICAgZ2V0VHJlYXRNZXNzYWdlLFxuICAgIHRvZ2dsZURldlRvb2xzLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1oZWFkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RaW5Ta2luID0gZXhwb3J0cy5RaW5TdHlsZXMgPSB2b2lkIDA7XG5jb25zdCBxaW5fYXJtXzEgPSByZXF1aXJlKFwiLi9xaW4tYXJtXCIpO1xuY29uc3QgcWluX2hlYWRfMSA9IHJlcXVpcmUoXCIuL3Fpbi1oZWFkXCIpO1xuZXhwb3J0cy5RaW5TdHlsZXMgPSB7XG4gICAgQ29sb3JGb3JlZ3JvdW5kOiBcIiMyNzAwMzZcIixcbiAgICBDb2xvckJhY2tncm91bmQ6IFwiI2ZmZmFlZlwiLFxuICAgIENvbG9ySW5hY3RpdmU6IFwiI2ZhZWZmZlwiLFxuICAgIENvbG9yQWN0aXZlOiBcIiNmYWNkY2RcIixcbiAgICBGb250TmFtZTogXCJTb3VyY2VTYW5zUHJvXCIsXG4gICAgRm9udFNpemU6IFwiMTZweFwiLFxufTtcbmZ1bmN0aW9uIHN0eWxlQXNCb2R5KGVsKSB7XG4gICAgZWwuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgZWwuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICBlbC5zdHlsZS5yaWdodCA9IFwiMHB4XCI7XG4gICAgZWwuc3R5bGUuYm90dG9tID0gXCIwcHhcIjtcbiAgICBlbC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICBlbC5zdHlsZS5wYWRkaW5nID0gXCI5cHhcIjtcbiAgICBlbC5zdHlsZS5vdmVyZmxvdyA9IFwiYXV0b1wiO1xufVxuZnVuY3Rpb24gc3R5bGVBc0VkaXQoZWwpIHtcbiAgICBlbC5zdHlsZS5tYXJnaW4gPSBcIjFweFwiO1xuICAgIGVsLnN0eWxlLnBhZGRpbmcgPSBcIjNweFwiO1xuICAgIGVsLnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcbiAgICBlbC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCAjMjcwMDM2XCI7XG4gICAgZWwuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIzcHhcIjtcbiAgICBlbC5zdHlsZS5jb2xvciA9IFwiIzI3MDAzNlwiO1xuICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2ZmZmZmZlwiO1xuICAgIGVsLnN0eWxlLmZvbnRGYW1pbHkgPSBcIlNvdXJjZVNhbnNQcm9cIjtcbiAgICBlbC5zdHlsZS5mb250U2l6ZSA9IFwiMTZweFwiO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmFlZmZmXCI7XG4gICAgICAgIGVsLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICNhZTAwMDBcIjtcbiAgICB9KTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNvdXRcIiwgKCkgPT4ge1xuICAgICAgICBlbC5zdHlsZS5vdXRsaW5lID0gXCJub25lXCI7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2ZmZmZmZlwiO1xuICAgICAgICBlbC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCAjMjcwMDM2XCI7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBzdHlsZU1heFNpemVGb3JOb3RPdmVyRmxvdyhlbCwgcGFyZW50KSB7XG4gICAgY29uc29sZS5sb2coXCJEMVwiKTtcbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICBjb25zb2xlLmxvZyhcIkQyOiBcIiArIHBhcmVudCk7XG4gICAgfVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgbGV0IG1heFdpZHRoID0gMDtcbiAgICAgICAgbGV0IG1heEhlaWdodCA9IDA7XG4gICAgICAgIGxldCBpbWVkaWF0ZSA9IGVsO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IG1heFdpZHRoICsgaW1lZGlhdGUuY2xpZW50TGVmdDtcbiAgICAgICAgICAgIG1heEhlaWdodCA9IG1heEhlaWdodCArIGltZWRpYXRlLmNsaWVudFRvcDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRDM6IFwiICsgbWF4V2lkdGgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJENDogXCIgKyBtYXhIZWlnaHQpO1xuICAgICAgICAgICAgaW1lZGlhdGUgPSBpbWVkaWF0ZS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9IHdoaWxlIChpbWVkaWF0ZSAhPSBudWxsICYmIGltZWRpYXRlICE9IHBhcmVudCk7XG4gICAgICAgIG1heFdpZHRoID0gcGFyZW50LmNsaWVudFdpZHRoIC0gbWF4V2lkdGg7XG4gICAgICAgIG1heEhlaWdodCA9IHBhcmVudC5jbGllbnRIZWlnaHQgLSBtYXhIZWlnaHQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRDU6IFwiICsgbWF4V2lkdGgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkQ2OiBcIiArIG1heEhlaWdodCk7XG4gICAgICAgIGVsLnN0eWxlLm1heFdpZHRoID0gbWF4V2lkdGggKyBcInB4XCI7XG4gICAgICAgIGVsLnN0eWxlLm1heEhlaWdodCA9IG1heEhlaWdodCArIFwicHhcIjtcbiAgICB9XG59XG5mdW5jdGlvbiBzdHlsZVNpemUoZWwsIHNpemUpIHtcbiAgICBpZiAoc2l6ZSkge1xuICAgICAgICBpZiAoc2l6ZSBpbnN0YW5jZW9mIHFpbl9oZWFkXzEuUWluRGltZW5zaW9uKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS53aWR0aCA9IHNpemUud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbC5zdHlsZS5oZWlnaHQgPSBzaXplLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBkaW0gPSBnZXREaW1lbnNpb25TaXplKHNpemUpO1xuICAgICAgICAgICAgZWwuc3R5bGUud2lkdGggPSBkaW0ud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbC5zdHlsZS5oZWlnaHQgPSBkaW0uaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc3R5bGVGbGV4TWF4KGVsKSB7XG4gICAgZWwuc3R5bGUuZmxleCA9IFwiMVwiO1xufVxuZnVuY3Rpb24gc3R5bGVGbGV4TWluKGVsKSB7XG4gICAgZWwuc3R5bGUuZmxleCA9IFwiMFwiO1xufVxuZnVuY3Rpb24gZ2V0V2luZG93U2l6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCxcbiAgICB9O1xufVxuZnVuY3Rpb24gZ2V0V2luZG93U2l6ZVN0eWxlKCkge1xuICAgIGNvbnN0IHdpZHRoID0gZ2V0V2luZG93U2l6ZSgpLndpZHRoO1xuICAgIGlmICh3aWR0aCA8IDYwMCkge1xuICAgICAgICByZXR1cm4gcWluX2hlYWRfMS5RaW5HcmFuZGV1ci5TTUFMTDtcbiAgICB9XG4gICAgZWxzZSBpZiAod2lkdGggPCAxMDAwKSB7XG4gICAgICAgIHJldHVybiBxaW5faGVhZF8xLlFpbkdyYW5kZXVyLk1FRElVTTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBxaW5faGVhZF8xLlFpbkdyYW5kZXVyLkxBUkdFO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGhpZGVBbGxJRnJhbWVzKCkge1xuICAgIHZhciBkb2NfaWZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWZyYW1lXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jX2lmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGRvY19pZnJhbWUgPSBkb2NfaWZyYW1lc1tpXTtcbiAgICAgICAgZG9jX2lmcmFtZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICB9XG59XG5mdW5jdGlvbiBzaG93QWxsSUZyYW1lcygpIHtcbiAgICB2YXIgZG9jX2lmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlmcmFtZVwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRvY19pZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBkb2NfaWZyYW1lID0gZG9jX2lmcmFtZXNbaV07XG4gICAgICAgIGRvY19pZnJhbWUuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRpc2FibGVTZWxlY3Rpb24oZWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUudXNlclNlbGVjdCA9IFwibm9uZVwiO1xuICAgIGVsZW1lbnQuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9IFwibm9uZVwiO1xuICAgIGVsZW1lbnQub25zZWxlY3RzdGFydCA9IHFpbl9hcm1fMS5RaW5Bcm0uc3RvcEV2ZW50O1xufVxuZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9LCAzNjApO1xufVxuZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZUluU2Nyb2xsKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFRvcCA8IGVsZW1lbnQucGFyZW50RWxlbWVudC5zY3JvbGxUb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRMZWZ0IDwgZWxlbWVudC5wYXJlbnRFbGVtZW50LnNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRXaWR0aCA+XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGggLVxuICAgICAgICAgICAgICAgIChlbGVtZW50Lm9mZnNldExlZnQgLSBlbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsTGVmdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRIZWlnaHQgPlxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAtXG4gICAgICAgICAgICAgICAgKGVsZW1lbnQub2Zmc2V0VG9wIC0gZWxlbWVudC5wYXJlbnRFbGVtZW50LnNjcm9sbFRvcCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGdldERpbWVuc2lvblNpemUoc2l6ZSkge1xuICAgIGlmIChzaXplID09IHFpbl9oZWFkXzEuUWluR3JhbmRldXIuTEFSR0UpIHtcbiAgICAgICAgcmV0dXJuIGdldERpbWVuc2lvbkxhcmdlKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNpemUgPT0gcWluX2hlYWRfMS5RaW5HcmFuZGV1ci5NRURJVU0pIHtcbiAgICAgICAgcmV0dXJuIGdldERpbWVuc2lvbk1lZGl1bSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdldERpbWVuc2lvblNtYWxsKCk7XG4gICAgfVxufVxuY29uc3QgZGltZW5zaW9uU21hbGwgPSB7XG4gICAgd2lkdGg6IDE2LFxuICAgIGhlaWdodDogMTYsXG59O1xuZnVuY3Rpb24gZ2V0RGltZW5zaW9uU21hbGwoKSB7XG4gICAgcmV0dXJuIGRpbWVuc2lvblNtYWxsO1xufVxuY29uc3QgZGltZW5zaW9uTWVkaXVtID0ge1xuICAgIHdpZHRoOiAzMixcbiAgICBoZWlnaHQ6IDMyLFxufTtcbmZ1bmN0aW9uIGdldERpbWVuc2lvbk1lZGl1bSgpIHtcbiAgICByZXR1cm4gZGltZW5zaW9uTWVkaXVtO1xufVxuY29uc3QgZGltZW5zaW9uTGFyZ2UgPSB7XG4gICAgd2lkdGg6IDY0LFxuICAgIGhlaWdodDogNjQsXG59O1xuZnVuY3Rpb24gZ2V0RGltZW5zaW9uTGFyZ2UoKSB7XG4gICAgcmV0dXJuIGRpbWVuc2lvbkxhcmdlO1xufVxuZXhwb3J0cy5RaW5Ta2luID0ge1xuICAgIHN0eWxlczogZXhwb3J0cy5RaW5TdHlsZXMsXG4gICAgc3R5bGVBc0JvZHksXG4gICAgc3R5bGVBc0VkaXQsXG4gICAgc3R5bGVNYXhTaXplRm9yTm90T3ZlckZsb3csXG4gICAgc3R5bGVTaXplLFxuICAgIHN0eWxlRmxleE1heCxcbiAgICBzdHlsZUZsZXhNaW4sXG4gICAgZ2V0V2luZG93U2l6ZSxcbiAgICBnZXRXaW5kb3dTaXplU3R5bGUsXG4gICAgaGlkZUFsbElGcmFtZXMsXG4gICAgc2hvd0FsbElGcmFtZXMsXG4gICAgZGlzYWJsZVNlbGVjdGlvbixcbiAgICBjbGVhclNlbGVjdGlvbixcbiAgICBpc0VsZW1lbnRWaXNpYmxlSW5TY3JvbGwsXG4gICAgZ2V0RGltZW5zaW9uU2l6ZSxcbiAgICBnZXREaW1lbnNpb25TbWFsbCxcbiAgICBnZXREaW1lbnNpb25NZWRpdW0sXG4gICAgZ2V0RGltZW5zaW9uTGFyZ2UsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLXNraW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpblNvdWwgPSB2b2lkIDA7XG5jb25zdCBxaW5fYXJtXzEgPSByZXF1aXJlKFwiLi9xaW4tYXJtXCIpO1xuY29uc3QgcWluX2JvZHlfMSA9IHJlcXVpcmUoXCIuL3Fpbi1ib2R5XCIpO1xuY29uc3QgcWluX2Zvb3RfMSA9IHJlcXVpcmUoXCIuL3Fpbi1mb290XCIpO1xuY29uc3QgcWluX2hlYWRfMSA9IHJlcXVpcmUoXCIuL3Fpbi1oZWFkXCIpO1xuY29uc3QgcWluX3NraW5fMSA9IHJlcXVpcmUoXCIuL3Fpbi1za2luXCIpO1xuZXhwb3J0cy5RaW5Tb3VsID0ge1xuICAgIGFybTogcWluX2FybV8xLlFpbkFybSxcbiAgICBib2R5OiBxaW5fYm9keV8xLlFpbkJvZHksXG4gICAgZm9vdDogcWluX2Zvb3RfMS5RaW5Gb290LFxuICAgIGhlYWQ6IHFpbl9oZWFkXzEuUWluSGVhZCxcbiAgICBza2luOiBxaW5fc2tpbl8xLlFpblNraW4sXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLXNvdWwuanMubWFwIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
