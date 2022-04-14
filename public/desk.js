(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qin_desk_1 = require("./qin-desk");
const qinpel = window.frameElement.qinpel;
if (qinpel.manager.needToEnter()) {
    window.frameElement.src = "./login.html";
}
else {
    new qin_desk_1.QinDesk(qinpel, {
        addsApps: (manifest) => !manifest.group,
    }).putInDocument();
}

},{"./qin-desk":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinDesk = void 0;
const qinpel_res_1 = require("qinpel-res");
class QinDesk {
    constructor(qinpel, options) {
        var _a, _b;
        this.divMain = document.createElement("div");
        this.divApps = document.createElement("div");
        this.divCfgs = document.createElement("div");
        this.qinpel = qinpel;
        this.options = options;
        this.initMain();
        if (!(((_a = this.options) === null || _a === void 0 ? void 0 : _a.showApps) === false)) {
            this.initApps();
        }
        if (!(((_b = this.options) === null || _b === void 0 ? void 0 : _b.showCfgs) === false)) {
            this.initCfgs();
        }
    }
    initMain() {
        styles.applyOnDivMain(this.divMain);
    }
    initApps() {
        styles.applyOnDivLine(this.divApps);
        this.qinpel
            .get("/list/apps")
            .then((res) => {
            for (let name of this.listApps(res.data)) {
                this.tryAddApp(name);
            }
        })
            .catch((err) => {
            var _a;
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 403) {
                this.qinpel.manager.exit();
            }
            this.qinpel.frame.statusError(err, "{qinpel-app}(ErrCode-000002)");
        });
        this.divMain.appendChild(this.divApps);
    }
    listApps(response) {
        return qinpel_res_1.QinSoul.body.getTextLines(response);
    }
    tryAddApp(name) {
        if (name && name != "qinpel-app") {
            this.qinpel
                .get("/app/" + name + "/manifest.json")
                .then((res) => {
                var _a;
                const manifest = res.data;
                if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.addsApps) {
                    if (!this.options.addsApps(manifest)) {
                        return;
                    }
                }
                const title = manifest.title;
                const icon = "../" + name + "/favicon.ico";
                this.addMenu(this.divApps, this.newMenu(title, icon, (ev) => {
                    if (ev.isPrimary) {
                        this.qinpel.manager.newFrame(title, name);
                        this.qinpel.frame.headCloseAction();
                    }
                }));
            })
                .catch((err) => {
                this.qinpel.frame.statusError(err, "{qinpel-app}(ErrCode-000001)");
            });
        }
    }
    initCfgs() {
        var _a;
        styles.applyOnDivLine(this.divCfgs);
        if (qinpel_res_1.QinSoul.foot.isLocalHost()) {
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.addsCfgs) {
                if (!this.options.addsCfgs({
                    title: "DevTools",
                })) {
                    return;
                }
            }
            this.addDevTools();
        }
        this.divMain.appendChild(this.divCfgs);
    }
    addDevTools() {
        this.addMenu(this.divCfgs, this.newMenu("DevTools", "/app/qinpel-app/assets/menu-devtools.ico", (ev) => {
            if (ev.isPrimary) {
                qinpel_res_1.QinSoul.head.toggleDevTools();
                this.qinpel.frame.headCloseAction();
            }
        }));
    }
    newMenu(title, icon, action) {
        const menuBody = document.createElement("div");
        styles.applyOnMenuBody(menuBody);
        const menuIcon = document.createElement("img");
        styles.applyOnMenuIcon(menuIcon);
        menuIcon.src = icon;
        const menuText = document.createElement("span");
        styles.applyOnMenuText(menuText);
        menuText.innerText = title;
        menuBody.appendChild(menuIcon);
        menuBody.appendChild(menuText);
        qinpel_res_1.QinSoul.arm.addAction(menuBody, action);
        return menuBody;
    }
    addMenu(divContainer, divContent) {
        const divMenu = document.createElement("div");
        styles.applyOnDivMenu(divMenu);
        divMenu.appendChild(divContent);
        divContainer.appendChild(divMenu);
    }
    putInDocument() {
        document.body.appendChild(this.divMain);
    }
    getMain() {
        return this.divMain;
    }
}
exports.QinDesk = QinDesk;
const styles = {
    applyOnDivMain: (el) => {
        el.style.padding = "18px 3px";
    },
    applyOnDivLine: (el) => {
        el.style.padding = "3px";
        el.style.display = "flex";
        el.style.flexDirection = "row";
        el.style.flexWrap = "wrap";
    },
    applyOnDivMenu: (el) => {
        el.style.margin = "3px";
        el.style.minWidth = "96px";
        el.style.maxWidth = "96px";
        el.style.cursor = "pointer";
    },
    applyOnMenuBody: (el) => {
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.alignItems = "center";
    },
    applyOnMenuIcon: (el) => {
        el.style.width = "48px";
        el.style.height = "48px";
        el.style.margin = "3px";
    },
    applyOnMenuText: (el) => {
        el.style.margin = "3px";
        el.style.fontWeight = "bold";
    },
};

},{"qinpel-res":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinFoot = exports.QinFilesDescriptor = exports.QinFilesOperation = exports.QinFilesNature = exports.QinArm = exports.QinPointerCalls = exports.QinWaiters = exports.QinEvent = exports.QinSoul = exports.QinBody = exports.QinHead = exports.QinGrandeur = exports.QinBounds = exports.QinDimension = exports.QinPoint = exports.QinSkin = exports.QinStyles = void 0;
var qin_skin_1 = require("./qin-skin");
Object.defineProperty(exports, "QinStyles", { enumerable: true, get: function () { return qin_skin_1.QinStyles; } });
var qin_skin_2 = require("./qin-skin");
Object.defineProperty(exports, "QinSkin", { enumerable: true, get: function () { return qin_skin_2.QinSkin; } });
var qin_head_1 = require("./qin-head");
Object.defineProperty(exports, "QinPoint", { enumerable: true, get: function () { return qin_head_1.QinPoint; } });
var qin_head_2 = require("./qin-head");
Object.defineProperty(exports, "QinDimension", { enumerable: true, get: function () { return qin_head_2.QinDimension; } });
var qin_head_3 = require("./qin-head");
Object.defineProperty(exports, "QinBounds", { enumerable: true, get: function () { return qin_head_3.QinBounds; } });
var qin_head_4 = require("./qin-head");
Object.defineProperty(exports, "QinGrandeur", { enumerable: true, get: function () { return qin_head_4.QinGrandeur; } });
var qin_head_5 = require("./qin-head");
Object.defineProperty(exports, "QinHead", { enumerable: true, get: function () { return qin_head_5.QinHead; } });
var qin_body_1 = require("./qin-body");
Object.defineProperty(exports, "QinBody", { enumerable: true, get: function () { return qin_body_1.QinBody; } });
var qin_soul_1 = require("./qin-soul");
Object.defineProperty(exports, "QinSoul", { enumerable: true, get: function () { return qin_soul_1.QinSoul; } });
var qin_arm_1 = require("./qin-arm");
Object.defineProperty(exports, "QinEvent", { enumerable: true, get: function () { return qin_arm_1.QinEvent; } });
var qin_arm_2 = require("./qin-arm");
Object.defineProperty(exports, "QinWaiters", { enumerable: true, get: function () { return qin_arm_2.QinWaiters; } });
var qin_arm_3 = require("./qin-arm");
Object.defineProperty(exports, "QinPointerCalls", { enumerable: true, get: function () { return qin_arm_3.QinPointerCalls; } });
var qin_arm_4 = require("./qin-arm");
Object.defineProperty(exports, "QinArm", { enumerable: true, get: function () { return qin_arm_4.QinArm; } });
var qin_foot_1 = require("./qin-foot");
Object.defineProperty(exports, "QinFilesNature", { enumerable: true, get: function () { return qin_foot_1.QinFilesNature; } });
var qin_foot_2 = require("./qin-foot");
Object.defineProperty(exports, "QinFilesOperation", { enumerable: true, get: function () { return qin_foot_2.QinFilesOperation; } });
var qin_foot_3 = require("./qin-foot");
Object.defineProperty(exports, "QinFilesDescriptor", { enumerable: true, get: function () { return qin_foot_3.QinFilesDescriptor; } });
var qin_foot_4 = require("./qin-foot");
Object.defineProperty(exports, "QinFoot", { enumerable: true, get: function () { return qin_foot_4.QinFoot; } });

},{"./qin-arm":4,"./qin-body":5,"./qin-foot":6,"./qin-head":7,"./qin-skin":8,"./qin-soul":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinArm = exports.QinPointerCalls = exports.QinWaiters = exports.QinEvent = void 0;
const qin_skin_1 = require("./qin-skin");
class QinEvent {
    constructor(isStart, event) {
        this._event = null;
        this._point = null;
        this._stop = false;
        this._start = isStart;
        this._event = event;
        if (event instanceof MouseEvent || event instanceof TouchEvent) {
            this._point = makeEventPointer(isStart, event);
        }
    }
    get isStart() {
        return this._start;
    }
    get fromOrigin() {
        if (this._event) {
            return this._event.target;
        }
        return null;
    }
    get fromTyping() {
        return this._event instanceof KeyboardEvent;
    }
    get fromPointing() {
        return (this._event instanceof MouseEvent || this._event instanceof TouchEvent);
    }
    get hasAlt() {
        var _a;
        return (_a = this._event) === null || _a === void 0 ? void 0 : _a.altKey;
    }
    get hasCtrl() {
        var _a;
        return (_a = this._event) === null || _a === void 0 ? void 0 : _a.ctrlKey;
    }
    get hasShift() {
        var _a;
        return (_a = this._event) === null || _a === void 0 ? void 0 : _a.shiftKey;
    }
    get hasMeta() {
        var _a;
        return (_a = this._event) === null || _a === void 0 ? void 0 : _a.metaKey;
    }
    get keyTyped() {
        if (this._event instanceof KeyboardEvent) {
            return this._event.key;
        }
        return null;
    }
    get isEnter() {
        if (this._event instanceof KeyboardEvent) {
            return isKeyEnter(this._event);
        }
        return false;
    }
    get isEscape() {
        if (this._event instanceof KeyboardEvent) {
            return isKeyEscape(this._event);
        }
        return false;
    }
    get isSpace() {
        if (this._event instanceof KeyboardEvent) {
            return isKeySpace(this._event);
        }
        return false;
    }
    get isDouble() {
        if (this._event instanceof MouseEvent ||
            this._event instanceof TouchEvent) {
            return isEventPointerDouble(this._start, this._event);
        }
        return false;
    }
    get isLong() {
        if (this._event instanceof MouseEvent ||
            this._event instanceof TouchEvent) {
            return isEventPointerLong(this._start, this._event);
        }
        return false;
    }
    get point() {
        return this._point;
    }
    get pointX() {
        if (this._event instanceof MouseEvent) {
            return this._event.clientX;
        }
        else if (this._event instanceof TouchEvent) {
            if (this._event.touches.length > 0) {
                let index = (this._event.touches.length / 2) | 0;
                return this._event.touches[index].clientX;
            }
        }
        return null;
    }
    get pointY() {
        if (this._event instanceof MouseEvent) {
            return this._event.clientY;
        }
        else if (this._event instanceof TouchEvent) {
            if (this._event.touches.length > 0) {
                let index = (this._event.touches.length / 2) | 0;
                return this._event.touches[index].clientY;
            }
        }
        return null;
    }
    get isFirstButton() {
        if (this._event instanceof MouseEvent) {
            return isFirstButton(this._event);
        }
        return false;
    }
    get isMiddleButton() {
        if (this._event instanceof MouseEvent) {
            return isMiddleButton(this._event);
        }
        return false;
    }
    get isSecondButton() {
        if (this._event instanceof MouseEvent) {
            return isSecondButton(this._event);
        }
        return false;
    }
    get isOneFinger() {
        if (this._event instanceof TouchEvent) {
            return isOneFinger(this._event);
        }
        return false;
    }
    get isTwoFingers() {
        if (this._event instanceof TouchEvent) {
            return isTwoFingers(this._event);
        }
        return false;
    }
    get isThreeFingers() {
        if (this._event instanceof TouchEvent) {
            return isThreeFingers(this._event);
        }
        return false;
    }
    get isFourFingers() {
        if (this._event instanceof TouchEvent) {
            return isFourFingers(this._event);
        }
        return false;
    }
    get isPrimary() {
        if (this._start) {
            return false;
        }
        if (this._event instanceof KeyboardEvent) {
            return isPrimaryKey(this._event);
        }
        else if (this._event instanceof MouseEvent ||
            this._event instanceof TouchEvent) {
            return isPrimaryPoint(this._event);
        }
        return false;
    }
    get isAuxiliary() {
        if (this._start) {
            return false;
        }
        if (this._event instanceof KeyboardEvent) {
            return isAuxiliaryKey(this._event);
        }
        else if (this._event instanceof MouseEvent ||
            this._event instanceof TouchEvent) {
            return isAuxiliaryPoint(this._event);
        }
        return false;
    }
    get isSecondary() {
        if (this._start) {
            return false;
        }
        if (this._event instanceof KeyboardEvent) {
            return isSecondaryKey(this._event);
        }
        else if (this._event instanceof MouseEvent ||
            this._event instanceof TouchEvent) {
            return isSecondaryPoint(this._event);
        }
        return false;
    }
    get stop() {
        return this._stop;
    }
    consumed() {
        this._stop = true;
    }
}
exports.QinEvent = QinEvent;
class QinWaiters {
    constructor(initial) {
        this.waiters = initial ? initial : [];
    }
    addWaiter(waiter) {
        this.waiters.push(waiter);
        return this;
    }
    hasWaiter() {
        return this.waiters.length > 0;
    }
    sendWaiters(result) {
        for (const waiter of this.waiters) {
            waiter(result);
        }
    }
}
exports.QinWaiters = QinWaiters;
class QinPointerCalls {
}
exports.QinPointerCalls = QinPointerCalls;
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
function makeEventPointer(isStart, ev) {
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
        if (ev.touches && this._event.touches.length > 1) {
            let index = Math.floor(this._event.touches.length / 2);
            result.posX = ev.touches[index].clientX;
            result.posY = ev.touches[index].clientY;
        }
    }
    if (isStart) {
        lastEventPointer = ev;
    }
    return result;
}
function isEventPointerDouble(isStart, ev) {
    if (!isStart || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif < 450;
}
function isEventPointerLong(isStart, ev) {
    if (!isStart || lastEventPointer == null || ev == null) {
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
function isFirstButton(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.button) == 0;
}
function isMiddleButton(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.button) == 1;
}
function isSecondButton(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.button) == 2;
}
function isOneFinger(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.touches.length) == 1;
}
function isTwoFingers(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.touches.length) == 2;
}
function isThreeFingers(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.touches.length) == 3;
}
function isFourFingers(ev) {
    return (ev === null || ev === void 0 ? void 0 : ev.touches.length) == 4;
}
function isPrimaryKey(ev) {
    return isKeyEnter(ev);
}
function isAuxiliaryKey(ev) {
    return ev.ctrlKey && ev.altKey && isKeySpace(ev);
}
function isSecondaryKey(ev) {
    return ev.ctrlKey && !ev.altKey && isKeySpace(ev);
}
function isPrimaryPoint(ev) {
    if (ev instanceof MouseEvent) {
        return isFirstButton(ev);
    }
    else if (ev instanceof TouchEvent) {
        return isOneFinger(ev);
    }
    return false;
}
function isAuxiliaryPoint(ev) {
    if (ev instanceof MouseEvent) {
        return isMiddleButton(ev);
    }
    else if (ev instanceof TouchEvent) {
        return isThreeFingers(ev);
    }
    return false;
}
function isSecondaryPoint(ev) {
    if (ev instanceof MouseEvent) {
        return isSecondButton(ev);
    }
    else if (ev instanceof TouchEvent) {
        return isTwoFingers(ev);
    }
    return false;
}
function addAction(element, action) {
    element.addEventListener("keydown", actKeyDown);
    element.addEventListener("keyup", actKeyUp);
    element.addEventListener("mousedown", actMouseDown);
    element.addEventListener("mouseup", actMouseUp);
    element.addEventListener("touchstart", actTouchStart);
    element.addEventListener("touchend", actTouchEnd);
    function actKeyDown(ev) {
        let qinEvent = new QinEvent(true, ev);
        action(qinEvent);
        if (qinEvent.stop) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actKeyUp(ev) {
        let qinEvent = new QinEvent(false, ev);
        action(qinEvent);
        if (qinEvent.stop) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actMouseDown(ev) {
        let qinEvent = new QinEvent(true, ev);
        action(qinEvent);
        if (qinEvent.stop) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actMouseUp(ev) {
        let qinEvent = new QinEvent(false, ev);
        action(qinEvent);
        if (qinEvent.stop) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actTouchStart(ev) {
        let qinEvent = new QinEvent(true, ev);
        action(qinEvent);
        if (qinEvent.stop) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actTouchEnd(ev) {
        let qinEvent = new QinEvent(false, ev);
        action(qinEvent);
        if (qinEvent.stop) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
}
function addActionMain(element, action) {
    element.onkeyup = actKeyUp;
    element.onmouseup = actMouseUp;
    element.ontouchend = actTouchEnd;
    function actKeyUp(ev) {
        let qinEvent = new QinEvent(false, ev);
        if (qinEvent.isPrimary) {
            action(qinEvent);
            return stopEvent(ev);
        }
    }
    function actMouseUp(ev) {
        let qinEvent = new QinEvent(false, ev);
        if (qinEvent.isPrimary) {
            action(qinEvent);
            return stopEvent(ev);
        }
    }
    function actTouchEnd(ev) {
        let qinEvent = new QinEvent(false, ev);
        if (qinEvent.isPrimary) {
            action(qinEvent);
            return stopEvent(ev);
        }
    }
}
function putActionProxy(destiny, origins) {
    for (const origin of origins) {
        origin.addEventListener("keydown", (e) => {
            destiny.dispatchEvent(e);
        });
        origin.addEventListener("keyup", (e) => {
            destiny.dispatchEvent(e);
        });
        origin.addEventListener("mousedown", (e) => {
            destiny.dispatchEvent(e);
        });
        origin.addEventListener("mouseup", (e) => {
            destiny.dispatchEvent(e);
        });
        origin.addEventListener("touchstart", (e) => {
            destiny.dispatchEvent(e);
        });
        origin.addEventListener("touchend", (e) => {
            destiny.dispatchEvent(e);
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
        target.style.width =
            (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
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
    isFirstButton,
    isMiddleButton,
    isSecondButton,
    isOneFinger,
    isTwoFingers,
    isThreeFingers,
    isFourFingers,
    isPrimaryPoint,
    isAuxiliaryPoint,
    isSecondaryPoint,
    addAction,
    addActionMain,
    putActionProxy,
    addMover,
    addResizer,
    addScroller,
};

},{"./qin-skin":8}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinBody = void 0;
function getCookie(name, orDefault) {
    let cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        let cookiePair = cookies[i].split("=");
        if (name == decodeURIComponent(cookiePair[0]).trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return orDefault;
}
function setCookie(name, value, options = {}) {
    options = Object.assign({ path: "/" }, options);
    if (!options.expires) {
        let date = new Date();
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        options.expires = date;
    }
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}
function delCookie(name, options = {}) {
    let updatedCookie = encodeURIComponent(name) + "=;  expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (options.expires) {
        delete options.expires;
    }
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}
function getTextLines(fromText) {
    return fromText.match(/[^\r\n]+/g);
}
function getCSVRows(fromText, names) {
    var lines = getTextLines(fromText);
    var result = [];
    for (let line of lines) {
        let row = !names ? [] : {};
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
                else if (actual == ",") {
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
            else if (letter == " ") {
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
    getCookie,
    setCookie,
    delCookie,
    getTextLines,
    getCSVRows,
    maskSpecialChars,
    unmaskSpecialChars,
    parseParameters,
};

},{}],6:[function(require,module,exports){
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
function getParent(path) {
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
    getParent,
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
    el.style.border = "1px solid #180027";
    el.style.borderRadius = "3px";
    el.style.color = "#180027";
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
        el.style.border = "1px solid #180027";
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

},{"./qin-arm":4,"./qin-head":7}],9:[function(require,module,exports){
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

},{"./qin-arm":4,"./qin-body":5,"./qin-foot":6,"./qin-head":7,"./qin-skin":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2Rlc2suanMiLCJidWlsZC9xaW4tZGVzay5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvYWxsLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tYXJtLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tYm9keS5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvcWluLWZvb3QuanMiLCIuLi9xaW5wZWwtcmVzL2J1aWxkL3Fpbi1oZWFkLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tc2tpbi5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvcWluLXNvdWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1cEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcWluX2Rlc2tfMSA9IHJlcXVpcmUoXCIuL3Fpbi1kZXNrXCIpO1xuY29uc3QgcWlucGVsID0gd2luZG93LmZyYW1lRWxlbWVudC5xaW5wZWw7XG5pZiAocWlucGVsLm1hbmFnZXIubmVlZFRvRW50ZXIoKSkge1xuICAgIHdpbmRvdy5mcmFtZUVsZW1lbnQuc3JjID0gXCIuL2xvZ2luLmh0bWxcIjtcbn1cbmVsc2Uge1xuICAgIG5ldyBxaW5fZGVza18xLlFpbkRlc2socWlucGVsLCB7XG4gICAgICAgIGFkZHNBcHBzOiAobWFuaWZlc3QpID0+ICFtYW5pZmVzdC5ncm91cCxcbiAgICB9KS5wdXRJbkRvY3VtZW50KCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZXNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RaW5EZXNrID0gdm9pZCAwO1xuY29uc3QgcWlucGVsX3Jlc18xID0gcmVxdWlyZShcInFpbnBlbC1yZXNcIik7XG5jbGFzcyBRaW5EZXNrIHtcbiAgICBjb25zdHJ1Y3RvcihxaW5wZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy5kaXZNYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kaXZBcHBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kaXZDZmdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5xaW5wZWwgPSBxaW5wZWw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuaW5pdE1haW4oKTtcbiAgICAgICAgaWYgKCEoKChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNob3dBcHBzKSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBcHBzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoKChfYiA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNob3dDZmdzKSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRDZmdzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5pdE1haW4oKSB7XG4gICAgICAgIHN0eWxlcy5hcHBseU9uRGl2TWFpbih0aGlzLmRpdk1haW4pO1xuICAgIH1cbiAgICBpbml0QXBwcygpIHtcbiAgICAgICAgc3R5bGVzLmFwcGx5T25EaXZMaW5lKHRoaXMuZGl2QXBwcyk7XG4gICAgICAgIHRoaXMucWlucGVsXG4gICAgICAgICAgICAuZ2V0KFwiL2xpc3QvYXBwc1wiKVxuICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBvZiB0aGlzLmxpc3RBcHBzKHJlcy5kYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJ5QWRkQXBwKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGlmICgoKF9hID0gZXJyLnJlc3BvbnNlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3RhdHVzKSA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xaW5wZWwubWFuYWdlci5leGl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnFpbnBlbC5mcmFtZS5zdGF0dXNFcnJvcihlcnIsIFwie3FpbnBlbC1hcHB9KEVyckNvZGUtMDAwMDAyKVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGl2TWFpbi5hcHBlbmRDaGlsZCh0aGlzLmRpdkFwcHMpO1xuICAgIH1cbiAgICBsaXN0QXBwcyhyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcWlucGVsX3Jlc18xLlFpblNvdWwuYm9keS5nZXRUZXh0TGluZXMocmVzcG9uc2UpO1xuICAgIH1cbiAgICB0cnlBZGRBcHAobmFtZSkge1xuICAgICAgICBpZiAobmFtZSAmJiBuYW1lICE9IFwicWlucGVsLWFwcFwiKSB7XG4gICAgICAgICAgICB0aGlzLnFpbnBlbFxuICAgICAgICAgICAgICAgIC5nZXQoXCIvYXBwL1wiICsgbmFtZSArIFwiL21hbmlmZXN0Lmpzb25cIilcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZHNBcHBzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmFkZHNBcHBzKG1hbmlmZXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gbWFuaWZlc3QudGl0bGU7XG4gICAgICAgICAgICAgICAgY29uc3QgaWNvbiA9IFwiLi4vXCIgKyBuYW1lICsgXCIvZmF2aWNvbi5pY29cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZE1lbnUodGhpcy5kaXZBcHBzLCB0aGlzLm5ld01lbnUodGl0bGUsIGljb24sIChldikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXYuaXNQcmltYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnFpbnBlbC5tYW5hZ2VyLm5ld0ZyYW1lKHRpdGxlLCBuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucWlucGVsLmZyYW1lLmhlYWRDbG9zZUFjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucWlucGVsLmZyYW1lLnN0YXR1c0Vycm9yKGVyciwgXCJ7cWlucGVsLWFwcH0oRXJyQ29kZS0wMDAwMDEpXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5pdENmZ3MoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgc3R5bGVzLmFwcGx5T25EaXZMaW5lKHRoaXMuZGl2Q2Zncyk7XG4gICAgICAgIGlmIChxaW5wZWxfcmVzXzEuUWluU291bC5mb290LmlzTG9jYWxIb3N0KCkpIHtcbiAgICAgICAgICAgIGlmICgoX2EgPSB0aGlzLm9wdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRzQ2Zncykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmFkZHNDZmdzKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGV2VG9vbHNcIixcbiAgICAgICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZGREZXZUb29scygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGl2TWFpbi5hcHBlbmRDaGlsZCh0aGlzLmRpdkNmZ3MpO1xuICAgIH1cbiAgICBhZGREZXZUb29scygpIHtcbiAgICAgICAgdGhpcy5hZGRNZW51KHRoaXMuZGl2Q2ZncywgdGhpcy5uZXdNZW51KFwiRGV2VG9vbHNcIiwgXCIvYXBwL3FpbnBlbC1hcHAvYXNzZXRzL21lbnUtZGV2dG9vbHMuaWNvXCIsIChldikgPT4ge1xuICAgICAgICAgICAgaWYgKGV2LmlzUHJpbWFyeSkge1xuICAgICAgICAgICAgICAgIHFpbnBlbF9yZXNfMS5RaW5Tb3VsLmhlYWQudG9nZ2xlRGV2VG9vbHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnFpbnBlbC5mcmFtZS5oZWFkQ2xvc2VBY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICBuZXdNZW51KHRpdGxlLCBpY29uLCBhY3Rpb24pIHtcbiAgICAgICAgY29uc3QgbWVudUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzdHlsZXMuYXBwbHlPbk1lbnVCb2R5KG1lbnVCb2R5KTtcbiAgICAgICAgY29uc3QgbWVudUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBzdHlsZXMuYXBwbHlPbk1lbnVJY29uKG1lbnVJY29uKTtcbiAgICAgICAgbWVudUljb24uc3JjID0gaWNvbjtcbiAgICAgICAgY29uc3QgbWVudVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgc3R5bGVzLmFwcGx5T25NZW51VGV4dChtZW51VGV4dCk7XG4gICAgICAgIG1lbnVUZXh0LmlubmVyVGV4dCA9IHRpdGxlO1xuICAgICAgICBtZW51Qm9keS5hcHBlbmRDaGlsZChtZW51SWNvbik7XG4gICAgICAgIG1lbnVCb2R5LmFwcGVuZENoaWxkKG1lbnVUZXh0KTtcbiAgICAgICAgcWlucGVsX3Jlc18xLlFpblNvdWwuYXJtLmFkZEFjdGlvbihtZW51Qm9keSwgYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIG1lbnVCb2R5O1xuICAgIH1cbiAgICBhZGRNZW51KGRpdkNvbnRhaW5lciwgZGl2Q29udGVudCkge1xuICAgICAgICBjb25zdCBkaXZNZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgc3R5bGVzLmFwcGx5T25EaXZNZW51KGRpdk1lbnUpO1xuICAgICAgICBkaXZNZW51LmFwcGVuZENoaWxkKGRpdkNvbnRlbnQpO1xuICAgICAgICBkaXZDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2TWVudSk7XG4gICAgfVxuICAgIHB1dEluRG9jdW1lbnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kaXZNYWluKTtcbiAgICB9XG4gICAgZ2V0TWFpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2TWFpbjtcbiAgICB9XG59XG5leHBvcnRzLlFpbkRlc2sgPSBRaW5EZXNrO1xuY29uc3Qgc3R5bGVzID0ge1xuICAgIGFwcGx5T25EaXZNYWluOiAoZWwpID0+IHtcbiAgICAgICAgZWwuc3R5bGUucGFkZGluZyA9IFwiMThweCAzcHhcIjtcbiAgICB9LFxuICAgIGFwcGx5T25EaXZMaW5lOiAoZWwpID0+IHtcbiAgICAgICAgZWwuc3R5bGUucGFkZGluZyA9IFwiM3B4XCI7XG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgZWwuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwicm93XCI7XG4gICAgICAgIGVsLnN0eWxlLmZsZXhXcmFwID0gXCJ3cmFwXCI7XG4gICAgfSxcbiAgICBhcHBseU9uRGl2TWVudTogKGVsKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm1hcmdpbiA9IFwiM3B4XCI7XG4gICAgICAgIGVsLnN0eWxlLm1pbldpZHRoID0gXCI5NnB4XCI7XG4gICAgICAgIGVsLnN0eWxlLm1heFdpZHRoID0gXCI5NnB4XCI7XG4gICAgICAgIGVsLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgIH0sXG4gICAgYXBwbHlPbk1lbnVCb2R5OiAoZWwpID0+IHtcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICBlbC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW5cIjtcbiAgICAgICAgZWwuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgfSxcbiAgICBhcHBseU9uTWVudUljb246IChlbCkgPT4ge1xuICAgICAgICBlbC5zdHlsZS53aWR0aCA9IFwiNDhweFwiO1xuICAgICAgICBlbC5zdHlsZS5oZWlnaHQgPSBcIjQ4cHhcIjtcbiAgICAgICAgZWwuc3R5bGUubWFyZ2luID0gXCIzcHhcIjtcbiAgICB9LFxuICAgIGFwcGx5T25NZW51VGV4dDogKGVsKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm1hcmdpbiA9IFwiM3B4XCI7XG4gICAgICAgIGVsLnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICB9LFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1kZXNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RaW5Gb290ID0gZXhwb3J0cy5RaW5GaWxlc0Rlc2NyaXB0b3IgPSBleHBvcnRzLlFpbkZpbGVzT3BlcmF0aW9uID0gZXhwb3J0cy5RaW5GaWxlc05hdHVyZSA9IGV4cG9ydHMuUWluQXJtID0gZXhwb3J0cy5RaW5Qb2ludGVyQ2FsbHMgPSBleHBvcnRzLlFpbldhaXRlcnMgPSBleHBvcnRzLlFpbkV2ZW50ID0gZXhwb3J0cy5RaW5Tb3VsID0gZXhwb3J0cy5RaW5Cb2R5ID0gZXhwb3J0cy5RaW5IZWFkID0gZXhwb3J0cy5RaW5HcmFuZGV1ciA9IGV4cG9ydHMuUWluQm91bmRzID0gZXhwb3J0cy5RaW5EaW1lbnNpb24gPSBleHBvcnRzLlFpblBvaW50ID0gZXhwb3J0cy5RaW5Ta2luID0gZXhwb3J0cy5RaW5TdHlsZXMgPSB2b2lkIDA7XG52YXIgcWluX3NraW5fMSA9IHJlcXVpcmUoXCIuL3Fpbi1za2luXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluU3R5bGVzXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fc2tpbl8xLlFpblN0eWxlczsgfSB9KTtcbnZhciBxaW5fc2tpbl8yID0gcmVxdWlyZShcIi4vcWluLXNraW5cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Ta2luXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fc2tpbl8yLlFpblNraW47IH0gfSk7XG52YXIgcWluX2hlYWRfMSA9IHJlcXVpcmUoXCIuL3Fpbi1oZWFkXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluUG9pbnRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzEuUWluUG9pbnQ7IH0gfSk7XG52YXIgcWluX2hlYWRfMiA9IHJlcXVpcmUoXCIuL3Fpbi1oZWFkXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluRGltZW5zaW9uXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5faGVhZF8yLlFpbkRpbWVuc2lvbjsgfSB9KTtcbnZhciBxaW5faGVhZF8zID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Cb3VuZHNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzMuUWluQm91bmRzOyB9IH0pO1xudmFyIHFpbl9oZWFkXzQgPSByZXF1aXJlKFwiLi9xaW4taGVhZFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkdyYW5kZXVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5faGVhZF80LlFpbkdyYW5kZXVyOyB9IH0pO1xudmFyIHFpbl9oZWFkXzUgPSByZXF1aXJlKFwiLi9xaW4taGVhZFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkhlYWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzUuUWluSGVhZDsgfSB9KTtcbnZhciBxaW5fYm9keV8xID0gcmVxdWlyZShcIi4vcWluLWJvZHlcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Cb2R5XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fYm9keV8xLlFpbkJvZHk7IH0gfSk7XG52YXIgcWluX3NvdWxfMSA9IHJlcXVpcmUoXCIuL3Fpbi1zb3VsXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluU291bFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX3NvdWxfMS5RaW5Tb3VsOyB9IH0pO1xudmFyIHFpbl9hcm1fMSA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5FdmVudFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2FybV8xLlFpbkV2ZW50OyB9IH0pO1xudmFyIHFpbl9hcm1fMiA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5XYWl0ZXJzXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fYXJtXzIuUWluV2FpdGVyczsgfSB9KTtcbnZhciBxaW5fYXJtXzMgPSByZXF1aXJlKFwiLi9xaW4tYXJtXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluUG9pbnRlckNhbGxzXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fYXJtXzMuUWluUG9pbnRlckNhbGxzOyB9IH0pO1xudmFyIHFpbl9hcm1fNCA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Bcm1cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9hcm1fNC5RaW5Bcm07IH0gfSk7XG52YXIgcWluX2Zvb3RfMSA9IHJlcXVpcmUoXCIuL3Fpbi1mb290XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluRmlsZXNOYXR1cmVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9mb290XzEuUWluRmlsZXNOYXR1cmU7IH0gfSk7XG52YXIgcWluX2Zvb3RfMiA9IHJlcXVpcmUoXCIuL3Fpbi1mb290XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluRmlsZXNPcGVyYXRpb25cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9mb290XzIuUWluRmlsZXNPcGVyYXRpb247IH0gfSk7XG52YXIgcWluX2Zvb3RfMyA9IHJlcXVpcmUoXCIuL3Fpbi1mb290XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluRmlsZXNEZXNjcmlwdG9yXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fZm9vdF8zLlFpbkZpbGVzRGVzY3JpcHRvcjsgfSB9KTtcbnZhciBxaW5fZm9vdF80ID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Gb290XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fZm9vdF80LlFpbkZvb3Q7IH0gfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbGwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkFybSA9IGV4cG9ydHMuUWluUG9pbnRlckNhbGxzID0gZXhwb3J0cy5RaW5XYWl0ZXJzID0gZXhwb3J0cy5RaW5FdmVudCA9IHZvaWQgMDtcbmNvbnN0IHFpbl9za2luXzEgPSByZXF1aXJlKFwiLi9xaW4tc2tpblwiKTtcbmNsYXNzIFFpbkV2ZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihpc1N0YXJ0LCBldmVudCkge1xuICAgICAgICB0aGlzLl9ldmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3BvaW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RvcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdGFydCA9IGlzU3RhcnQ7XG4gICAgICAgIHRoaXMuX2V2ZW50ID0gZXZlbnQ7XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgfHwgZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wb2ludCA9IG1ha2VFdmVudFBvaW50ZXIoaXNTdGFydCwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBpc1N0YXJ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gICAgfVxuICAgIGdldCBmcm9tT3JpZ2luKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudC50YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldCBmcm9tVHlwaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50O1xuICAgIH1cbiAgICBnZXQgZnJvbVBvaW50aW5nKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCB8fCB0aGlzLl9ldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpO1xuICAgIH1cbiAgICBnZXQgaGFzQWx0KCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLl9ldmVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFsdEtleTtcbiAgICB9XG4gICAgZ2V0IGhhc0N0cmwoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIChfYSA9IHRoaXMuX2V2ZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY3RybEtleTtcbiAgICB9XG4gICAgZ2V0IGhhc1NoaWZ0KCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLl9ldmVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNoaWZ0S2V5O1xuICAgIH1cbiAgICBnZXQgaGFzTWV0YSgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5fZXZlbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXRhS2V5O1xuICAgIH1cbiAgICBnZXQga2V5VHlwZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudC5rZXk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldCBpc0VudGVyKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNLZXlFbnRlcih0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNFc2NhcGUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0tleUVzY2FwZSh0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNTcGFjZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzS2V5U3BhY2UodGhpcy5fZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZ2V0IGlzRG91YmxlKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50IHx8XG4gICAgICAgICAgICB0aGlzLl9ldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0aGlzLl9zdGFydCwgdGhpcy5fZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZ2V0IGlzTG9uZygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCB8fFxuICAgICAgICAgICAgdGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNFdmVudFBvaW50ZXJMb25nKHRoaXMuX3N0YXJ0LCB0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgcG9pbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb2ludDtcbiAgICB9XG4gICAgZ2V0IHBvaW50WCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50LmNsaWVudFg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnQudG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gKHRoaXMuX2V2ZW50LnRvdWNoZXMubGVuZ3RoIC8gMikgfCAwO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudC50b3VjaGVzW2luZGV4XS5jbGllbnRYO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnZXQgcG9pbnRZKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQuY2xpZW50WTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudC50b3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAodGhpcy5fZXZlbnQudG91Y2hlcy5sZW5ndGggLyAyKSB8IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50LnRvdWNoZXNbaW5kZXhdLmNsaWVudFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGdldCBpc0ZpcnN0QnV0dG9uKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNGaXJzdEJ1dHRvbih0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNNaWRkbGVCdXR0b24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBpc01pZGRsZUJ1dHRvbih0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNTZWNvbmRCdXR0b24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1NlY29uZEJ1dHRvbih0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNPbmVGaW5nZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBpc09uZUZpbmdlcih0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNUd29GaW5nZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNUd29GaW5nZXJzKHRoaXMuX2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGdldCBpc1RocmVlRmluZ2VycygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVGhyZWVGaW5nZXJzKHRoaXMuX2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGdldCBpc0ZvdXJGaW5nZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNGb3VyRmluZ2Vycyh0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaXNQcmltYXJ5KCkge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNQcmltYXJ5S2V5KHRoaXMuX2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgfHxcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzUHJpbWFyeVBvaW50KHRoaXMuX2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGdldCBpc0F1eGlsaWFyeSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXV4aWxpYXJ5S2V5KHRoaXMuX2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9ldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgfHxcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXV4aWxpYXJ5UG9pbnQodGhpcy5fZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZ2V0IGlzU2Vjb25kYXJ5KCkge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNTZWNvbmRhcnlLZXkodGhpcy5fZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCB8fFxuICAgICAgICAgICAgdGhpcy5fZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gaXNTZWNvbmRhcnlQb2ludCh0aGlzLl9ldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgc3RvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3A7XG4gICAgfVxuICAgIGNvbnN1bWVkKCkge1xuICAgICAgICB0aGlzLl9zdG9wID0gdHJ1ZTtcbiAgICB9XG59XG5leHBvcnRzLlFpbkV2ZW50ID0gUWluRXZlbnQ7XG5jbGFzcyBRaW5XYWl0ZXJzIHtcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHRoaXMud2FpdGVycyA9IGluaXRpYWwgPyBpbml0aWFsIDogW107XG4gICAgfVxuICAgIGFkZFdhaXRlcih3YWl0ZXIpIHtcbiAgICAgICAgdGhpcy53YWl0ZXJzLnB1c2god2FpdGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGhhc1dhaXRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdGVycy5sZW5ndGggPiAwO1xuICAgIH1cbiAgICBzZW5kV2FpdGVycyhyZXN1bHQpIHtcbiAgICAgICAgZm9yIChjb25zdCB3YWl0ZXIgb2YgdGhpcy53YWl0ZXJzKSB7XG4gICAgICAgICAgICB3YWl0ZXIocmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuUWluV2FpdGVycyA9IFFpbldhaXRlcnM7XG5jbGFzcyBRaW5Qb2ludGVyQ2FsbHMge1xufVxuZXhwb3J0cy5RaW5Qb2ludGVyQ2FsbHMgPSBRaW5Qb2ludGVyQ2FsbHM7XG5mdW5jdGlvbiBzdG9wRXZlbnQoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG52YXIgbGFzdEV2ZW50UG9pbnRlciA9IG51bGw7XG5mdW5jdGlvbiBtYWtlRXZlbnRQb2ludGVyKGlzU3RhcnQsIGV2KSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICBwb3NYOiAwLFxuICAgICAgICBwb3NZOiAwLFxuICAgIH07XG4gICAgaWYgKGV2IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgICBpZiAoZXYuY2xpZW50WCB8fCBldi5jbGllbnRZKSB7XG4gICAgICAgICAgICByZXN1bHQucG9zWCA9IGV2LmNsaWVudFg7XG4gICAgICAgICAgICByZXN1bHQucG9zWSA9IGV2LmNsaWVudFk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZXYgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgIGlmIChldi50b3VjaGVzICYmIHRoaXMuX2V2ZW50LnRvdWNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcih0aGlzLl9ldmVudC50b3VjaGVzLmxlbmd0aCAvIDIpO1xuICAgICAgICAgICAgcmVzdWx0LnBvc1ggPSBldi50b3VjaGVzW2luZGV4XS5jbGllbnRYO1xuICAgICAgICAgICAgcmVzdWx0LnBvc1kgPSBldi50b3VjaGVzW2luZGV4XS5jbGllbnRZO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc1N0YXJ0KSB7XG4gICAgICAgIGxhc3RFdmVudFBvaW50ZXIgPSBldjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGlzRXZlbnRQb2ludGVyRG91YmxlKGlzU3RhcnQsIGV2KSB7XG4gICAgaWYgKCFpc1N0YXJ0IHx8IGxhc3RFdmVudFBvaW50ZXIgPT0gbnVsbCB8fCBldiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGltZURpZiA9IGV2LnRpbWVTdGFtcCAtIGxhc3RFdmVudFBvaW50ZXIudGltZVN0YW1wO1xuICAgIHJldHVybiB0aW1lRGlmIDwgNDUwO1xufVxuZnVuY3Rpb24gaXNFdmVudFBvaW50ZXJMb25nKGlzU3RhcnQsIGV2KSB7XG4gICAgaWYgKCFpc1N0YXJ0IHx8IGxhc3RFdmVudFBvaW50ZXIgPT0gbnVsbCB8fCBldiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGltZURpZiA9IGV2LnRpbWVTdGFtcCAtIGxhc3RFdmVudFBvaW50ZXIudGltZVN0YW1wO1xuICAgIHJldHVybiB0aW1lRGlmID4gODQwO1xufVxuZnVuY3Rpb24gaXNLZXlJbkxpc3QoZXYsIGxpc3QpIHtcbiAgICBsZXQga2V5TG93ZXIgPSBldi5rZXkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGlzdC5pbmRleE9mKGtleUxvd2VyKSA+IC0xO1xufVxuZnVuY3Rpb24gaXNLZXlFbnRlcihldikge1xuICAgIHJldHVybiBpc0tleUluTGlzdChldiwgW1wiZW50ZXJcIiwgXCJyZXR1cm5cIl0pIHx8IGV2LmtleUNvZGUgPT09IDEzO1xufVxuZnVuY3Rpb24gaXNLZXlFc2NhcGUoZXYpIHtcbiAgICByZXR1cm4gaXNLZXlJbkxpc3QoZXYsIFtcImVzY1wiLCBcImVzY2FwZVwiXSkgfHwgZXYua2V5Q29kZSA9PT0gMjc7XG59XG5mdW5jdGlvbiBpc0tleVNwYWNlKGV2KSB7XG4gICAgcmV0dXJuIGlzS2V5SW5MaXN0KGV2LCBbXCIgXCIsIFwic3BhY2VcIiwgXCJzcGFjZWJhclwiXSkgfHwgZXYua2V5Q29kZSA9PT0gMzI7XG59XG5mdW5jdGlvbiBpc0ZpcnN0QnV0dG9uKGV2KSB7XG4gICAgcmV0dXJuIChldiA9PT0gbnVsbCB8fCBldiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXYuYnV0dG9uKSA9PSAwO1xufVxuZnVuY3Rpb24gaXNNaWRkbGVCdXR0b24oZXYpIHtcbiAgICByZXR1cm4gKGV2ID09PSBudWxsIHx8IGV2ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBldi5idXR0b24pID09IDE7XG59XG5mdW5jdGlvbiBpc1NlY29uZEJ1dHRvbihldikge1xuICAgIHJldHVybiAoZXYgPT09IG51bGwgfHwgZXYgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV2LmJ1dHRvbikgPT0gMjtcbn1cbmZ1bmN0aW9uIGlzT25lRmluZ2VyKGV2KSB7XG4gICAgcmV0dXJuIChldiA9PT0gbnVsbCB8fCBldiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXYudG91Y2hlcy5sZW5ndGgpID09IDE7XG59XG5mdW5jdGlvbiBpc1R3b0ZpbmdlcnMoZXYpIHtcbiAgICByZXR1cm4gKGV2ID09PSBudWxsIHx8IGV2ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBldi50b3VjaGVzLmxlbmd0aCkgPT0gMjtcbn1cbmZ1bmN0aW9uIGlzVGhyZWVGaW5nZXJzKGV2KSB7XG4gICAgcmV0dXJuIChldiA9PT0gbnVsbCB8fCBldiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXYudG91Y2hlcy5sZW5ndGgpID09IDM7XG59XG5mdW5jdGlvbiBpc0ZvdXJGaW5nZXJzKGV2KSB7XG4gICAgcmV0dXJuIChldiA9PT0gbnVsbCB8fCBldiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXYudG91Y2hlcy5sZW5ndGgpID09IDQ7XG59XG5mdW5jdGlvbiBpc1ByaW1hcnlLZXkoZXYpIHtcbiAgICByZXR1cm4gaXNLZXlFbnRlcihldik7XG59XG5mdW5jdGlvbiBpc0F1eGlsaWFyeUtleShldikge1xuICAgIHJldHVybiBldi5jdHJsS2V5ICYmIGV2LmFsdEtleSAmJiBpc0tleVNwYWNlKGV2KTtcbn1cbmZ1bmN0aW9uIGlzU2Vjb25kYXJ5S2V5KGV2KSB7XG4gICAgcmV0dXJuIGV2LmN0cmxLZXkgJiYgIWV2LmFsdEtleSAmJiBpc0tleVNwYWNlKGV2KTtcbn1cbmZ1bmN0aW9uIGlzUHJpbWFyeVBvaW50KGV2KSB7XG4gICAgaWYgKGV2IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgICByZXR1cm4gaXNGaXJzdEJ1dHRvbihldik7XG4gICAgfVxuICAgIGVsc2UgaWYgKGV2IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgICByZXR1cm4gaXNPbmVGaW5nZXIoZXYpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc0F1eGlsaWFyeVBvaW50KGV2KSB7XG4gICAgaWYgKGV2IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgICByZXR1cm4gaXNNaWRkbGVCdXR0b24oZXYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChldiBpbnN0YW5jZW9mIFRvdWNoRXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGlzVGhyZWVGaW5nZXJzKGV2KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNTZWNvbmRhcnlQb2ludChldikge1xuICAgIGlmIChldiBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGlzU2Vjb25kQnV0dG9uKGV2KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXYgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICAgIHJldHVybiBpc1R3b0ZpbmdlcnMoZXYpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBhZGRBY3Rpb24oZWxlbWVudCwgYWN0aW9uKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBhY3RLZXlEb3duKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBhY3RLZXlVcCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGFjdE1vdXNlRG93bik7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBhY3RNb3VzZVVwKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGFjdFRvdWNoU3RhcnQpO1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGFjdFRvdWNoRW5kKTtcbiAgICBmdW5jdGlvbiBhY3RLZXlEb3duKGV2KSB7XG4gICAgICAgIGxldCBxaW5FdmVudCA9IG5ldyBRaW5FdmVudCh0cnVlLCBldik7XG4gICAgICAgIGFjdGlvbihxaW5FdmVudCk7XG4gICAgICAgIGlmIChxaW5FdmVudC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFjdEtleVVwKGV2KSB7XG4gICAgICAgIGxldCBxaW5FdmVudCA9IG5ldyBRaW5FdmVudChmYWxzZSwgZXYpO1xuICAgICAgICBhY3Rpb24ocWluRXZlbnQpO1xuICAgICAgICBpZiAocWluRXZlbnQuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBhY3RNb3VzZURvd24oZXYpIHtcbiAgICAgICAgbGV0IHFpbkV2ZW50ID0gbmV3IFFpbkV2ZW50KHRydWUsIGV2KTtcbiAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYWN0TW91c2VVcChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQoZmFsc2UsIGV2KTtcbiAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYWN0VG91Y2hTdGFydChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQodHJ1ZSwgZXYpO1xuICAgICAgICBhY3Rpb24ocWluRXZlbnQpO1xuICAgICAgICBpZiAocWluRXZlbnQuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBhY3RUb3VjaEVuZChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQoZmFsc2UsIGV2KTtcbiAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBhZGRBY3Rpb25NYWluKGVsZW1lbnQsIGFjdGlvbikge1xuICAgIGVsZW1lbnQub25rZXl1cCA9IGFjdEtleVVwO1xuICAgIGVsZW1lbnQub25tb3VzZXVwID0gYWN0TW91c2VVcDtcbiAgICBlbGVtZW50Lm9udG91Y2hlbmQgPSBhY3RUb3VjaEVuZDtcbiAgICBmdW5jdGlvbiBhY3RLZXlVcChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQoZmFsc2UsIGV2KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LmlzUHJpbWFyeSkge1xuICAgICAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFjdE1vdXNlVXAoZXYpIHtcbiAgICAgICAgbGV0IHFpbkV2ZW50ID0gbmV3IFFpbkV2ZW50KGZhbHNlLCBldik7XG4gICAgICAgIGlmIChxaW5FdmVudC5pc1ByaW1hcnkpIHtcbiAgICAgICAgICAgIGFjdGlvbihxaW5FdmVudCk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBhY3RUb3VjaEVuZChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQoZmFsc2UsIGV2KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LmlzUHJpbWFyeSkge1xuICAgICAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gcHV0QWN0aW9uUHJveHkoZGVzdGlueSwgb3JpZ2lucykge1xuICAgIGZvciAoY29uc3Qgb3JpZ2luIG9mIG9yaWdpbnMpIHtcbiAgICAgICAgb3JpZ2luLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBkZXN0aW55LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBvcmlnaW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBkZXN0aW55LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBvcmlnaW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZGVzdGlueS5kaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgb3JpZ2luLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBkZXN0aW55LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBvcmlnaW4uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGRlc3RpbnkuZGlzcGF0Y2hFdmVudChlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9yaWdpbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGRlc3RpbnkuZGlzcGF0Y2hFdmVudChlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkTW92ZXIoc291cmNlcywgdGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRFdmVudFggPSAwO1xuICAgIHZhciBkcmFnSW5pdEV2ZW50WSA9IDA7XG4gICAgdmFyIGRyYWdJbml0UG9zWCA9IDA7XG4gICAgdmFyIGRyYWdJbml0UG9zWSA9IDA7XG4gICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLm9ubW91c2Vkb3duID0gb25Nb3ZlckluaXQ7XG4gICAgICAgIHNvdXJjZS5vbnRvdWNoc3RhcnQgPSBvbk1vdmVySW5pdDtcbiAgICAgICAgc291cmNlLm9uZHJhZ3N0YXJ0ID0gc3RvcEV2ZW50O1xuICAgIH1cbiAgICBmdW5jdGlvbiBvbk1vdmVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdEV2ZW50WCA9IHBvaW50ZXIucG9zWDtcbiAgICAgICAgZHJhZ0luaXRFdmVudFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdJbml0UG9zWCA9IHBhcnNlSW50KHRhcmdldC5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgIGRyYWdJbml0UG9zWSA9IHBhcnNlSW50KHRhcmdldC5zdHlsZS50b3AsIDEwKTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaG1vdmUgPSBvbk1vdmVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvbk1vdmVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG9uTW92ZXJDbG9zZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gb25Nb3ZlckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3Zlck1vdmUoZXYpIHtcbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIoZmFsc2UsIGV2KTtcbiAgICAgICAgdmFyIGRyYWdEaWZYID0gcG9pbnRlci5wb3NYIC0gZHJhZ0luaXRFdmVudFg7XG4gICAgICAgIHZhciBkcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0RXZlbnRZO1xuICAgICAgICB2YXIgZHJhZ0ZpbmFsWCA9IGRyYWdJbml0UG9zWCArIGRyYWdEaWZYO1xuICAgICAgICB2YXIgZHJhZ0ZpbmFsWSA9IGRyYWdJbml0UG9zWSArIGRyYWdEaWZZO1xuICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IChkcmFnRmluYWxYID4gMCA/IGRyYWdGaW5hbFggOiAwKSArIFwicHhcIjtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IChkcmFnRmluYWxZID4gMCA/IGRyYWdGaW5hbFkgOiAwKSArIFwicHhcIjtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25Nb3ZlKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW92ZXJDbG9zZShldikge1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNobW92ZSA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGw7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5zaG93QWxsSUZyYW1lcygpO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25FbmQpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZFJlc2l6ZXIoc291cmNlcywgdGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRFdmVudFggPSAwO1xuICAgIHZhciBkcmFnSW5pdEV2ZW50WSA9IDA7XG4gICAgdmFyIGRyYWdJbml0V2lkdGggPSAwO1xuICAgIHZhciBkcmFnSW5pdEhlaWdodCA9IDA7XG4gICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLm9ubW91c2Vkb3duID0gb25SZXNpemVySW5pdDtcbiAgICAgICAgc291cmNlLm9udG91Y2hzdGFydCA9IG9uUmVzaXplckluaXQ7XG4gICAgICAgIHNvdXJjZS5vbmRyYWdzdGFydCA9IHN0b3BFdmVudDtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25SZXNpemVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdEV2ZW50WCA9IHBvaW50ZXIucG9zWDtcbiAgICAgICAgZHJhZ0luaXRFdmVudFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdJbml0V2lkdGggPSBwYXJzZUludCh0YXJnZXQuc3R5bGUud2lkdGgsIDEwKTtcbiAgICAgICAgZHJhZ0luaXRIZWlnaHQgPSBwYXJzZUludCh0YXJnZXQuc3R5bGUuaGVpZ2h0LCAxMCk7XG4gICAgICAgIGRvY3VtZW50Lm9udG91Y2htb3ZlID0gb25SZXNpemVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvblJlc2l6ZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gb25SZXNpemVyQ2xvc2U7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG9uUmVzaXplckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25SZXNpemVyTW92ZShldikge1xuICAgICAgICBjb25zdCBwb2ludGVyID0gbWFrZUV2ZW50UG9pbnRlcihmYWxzZSwgZXYpO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRGlmWCA9IHBvaW50ZXIucG9zWCAtIGRyYWdJbml0RXZlbnRYO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0RXZlbnRZO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRmluYWxXaWR0aCA9IGRyYWdJbml0V2lkdGggKyBmcmFtZURyYWdEaWZYO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRmluYWxIZWlnaHQgPSBkcmFnSW5pdEhlaWdodCArIGZyYW1lRHJhZ0RpZlk7XG4gICAgICAgIHRhcmdldC5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgICAoZnJhbWVEcmFnRmluYWxXaWR0aCA+IDAgPyBmcmFtZURyYWdGaW5hbFdpZHRoIDogMCkgKyBcInB4XCI7XG4gICAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPVxuICAgICAgICAgICAgKGZyYW1lRHJhZ0ZpbmFsSGVpZ2h0ID4gMCA/IGZyYW1lRHJhZ0ZpbmFsSGVpZ2h0IDogMCkgKyBcInB4XCI7XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTW92ZSkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uTW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblJlc2l6ZXJDbG9zZShldikge1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNobW92ZSA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGw7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5zaG93QWxsSUZyYW1lcygpO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25FbmQpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZFNjcm9sbGVyKHRhcmdldCwgZHJhZ0NhbGxzKSB7XG4gICAgdmFyIGRyYWdJbml0WCA9IDA7XG4gICAgdmFyIGRyYWdJbml0WSA9IDA7XG4gICAgdmFyIGRyYWdTY3JvbGxYID0gMDtcbiAgICB2YXIgZHJhZ1Njcm9sbFkgPSAwO1xuICAgIHRhcmdldC5vbmRyYWdzdGFydCA9IHN0b3BFdmVudDtcbiAgICB0YXJnZXQub250b3VjaHN0YXJ0ID0gb25TY3JvbGxlckluaXQ7XG4gICAgdGFyZ2V0Lm9ubW91c2Vkb3duID0gb25TY3JvbGxlckluaXQ7XG4gICAgZnVuY3Rpb24gb25TY3JvbGxlckluaXQoZXYpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50Lm9ubW91c2Vtb3ZlIHx8IGRvY3VtZW50Lm9udG91Y2htb3ZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25Eb3VibGUgJiYgaXNFdmVudFBvaW50ZXJEb3VibGUodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Eb3VibGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkxvbmcgJiYgaXNFdmVudFBvaW50ZXJMb25nKHRydWUsIGV2KSkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uTG9uZygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50ZXIgPSBtYWtlRXZlbnRQb2ludGVyKHRydWUsIGV2KTtcbiAgICAgICAgZHJhZ0luaXRYID0gcG9pbnRlci5wb3NYO1xuICAgICAgICBkcmFnSW5pdFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdTY3JvbGxYID0gdGFyZ2V0LnNjcm9sbExlZnQ7XG4gICAgICAgIGRyYWdTY3JvbGxZID0gdGFyZ2V0LnNjcm9sbFRvcDtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaG1vdmUgPSBvblNjcm9sbGVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvblNjcm9sbGVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG9uU2Nyb2xsZXJDbG9zZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gb25TY3JvbGxlckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25TY3JvbGxlck1vdmUoZXYpIHtcbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIoZmFsc2UsIGV2KTtcbiAgICAgICAgdmFyIGRyYWdEaWZYID0gcG9pbnRlci5wb3NYIC0gZHJhZ0luaXRYO1xuICAgICAgICB2YXIgZHJhZ0RpZlkgPSBwb2ludGVyLnBvc1kgLSBkcmFnSW5pdFk7XG4gICAgICAgIHZhciBkcmFnTmV3WCA9IGRyYWdTY3JvbGxYIC0gZHJhZ0RpZlg7XG4gICAgICAgIHZhciBkcmFnTmV3WSA9IGRyYWdTY3JvbGxZIC0gZHJhZ0RpZlk7XG4gICAgICAgIHRhcmdldC5zY3JvbGxUbyhkcmFnTmV3WCwgZHJhZ05ld1kpO1xuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbk1vdmUpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbk1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25TY3JvbGxlckNsb3NlKGV2KSB7XG4gICAgICAgIGRvY3VtZW50Lm9udG91Y2htb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcbiAgICAgICAgcWluX3NraW5fMS5RaW5Ta2luLnNob3dBbGxJRnJhbWVzKCk7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkVuZCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxufVxuZXhwb3J0cy5RaW5Bcm0gPSB7XG4gICAgc3RvcEV2ZW50LFxuICAgIG1ha2VFdmVudFBvaW50ZXIsXG4gICAgaXNFdmVudFBvaW50ZXJEb3VibGUsXG4gICAgaXNFdmVudFBvaW50ZXJMb25nLFxuICAgIGlzS2V5SW5MaXN0LFxuICAgIGlzS2V5RW50ZXIsXG4gICAgaXNLZXlTcGFjZSxcbiAgICBpc0ZpcnN0QnV0dG9uLFxuICAgIGlzTWlkZGxlQnV0dG9uLFxuICAgIGlzU2Vjb25kQnV0dG9uLFxuICAgIGlzT25lRmluZ2VyLFxuICAgIGlzVHdvRmluZ2VycyxcbiAgICBpc1RocmVlRmluZ2VycyxcbiAgICBpc0ZvdXJGaW5nZXJzLFxuICAgIGlzUHJpbWFyeVBvaW50LFxuICAgIGlzQXV4aWxpYXJ5UG9pbnQsXG4gICAgaXNTZWNvbmRhcnlQb2ludCxcbiAgICBhZGRBY3Rpb24sXG4gICAgYWRkQWN0aW9uTWFpbixcbiAgICBwdXRBY3Rpb25Qcm94eSxcbiAgICBhZGRNb3ZlcixcbiAgICBhZGRSZXNpemVyLFxuICAgIGFkZFNjcm9sbGVyLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1hcm0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkJvZHkgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSwgb3JEZWZhdWx0KSB7XG4gICAgbGV0IGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoXCI7XCIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY29va2llUGFpciA9IGNvb2tpZXNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICBpZiAobmFtZSA9PSBkZWNvZGVVUklDb21wb25lbnQoY29va2llUGFpclswXSkudHJpbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVBhaXJbMV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvckRlZmF1bHQ7XG59XG5mdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgcGF0aDogXCIvXCIgfSwgb3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLmV4cGlyZXMpIHtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAxICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IGRhdGU7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmV4cGlyZXMgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBsZXQgdXBkYXRlZENvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICBmb3IgKGxldCBvcHRpb25LZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB1cGRhdGVkQ29va2llICs9IFwiOyBcIiArIG9wdGlvbktleTtcbiAgICAgICAgbGV0IG9wdGlvblZhbHVlID0gb3B0aW9uc1tvcHRpb25LZXldO1xuICAgICAgICBpZiAob3B0aW9uVmFsdWUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHVwZGF0ZWRDb29raWUgKz0gXCI9XCIgKyBvcHRpb25WYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSB1cGRhdGVkQ29va2llO1xufVxuZnVuY3Rpb24gZGVsQ29va2llKG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCB1cGRhdGVkQ29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgXCI9OyAgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiO1xuICAgIGlmIChvcHRpb25zLmV4cGlyZXMpIHtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuZXhwaXJlcztcbiAgICB9XG4gICAgZm9yIChsZXQgb3B0aW9uS2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdXBkYXRlZENvb2tpZSArPSBcIjsgXCIgKyBvcHRpb25LZXk7XG4gICAgICAgIGxldCBvcHRpb25WYWx1ZSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgICAgICAgaWYgKG9wdGlvblZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB1cGRhdGVkQ29va2llICs9IFwiPVwiICsgb3B0aW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZG9jdW1lbnQuY29va2llID0gdXBkYXRlZENvb2tpZTtcbn1cbmZ1bmN0aW9uIGdldFRleHRMaW5lcyhmcm9tVGV4dCkge1xuICAgIHJldHVybiBmcm9tVGV4dC5tYXRjaCgvW15cXHJcXG5dKy9nKTtcbn1cbmZ1bmN0aW9uIGdldENTVlJvd3MoZnJvbVRleHQsIG5hbWVzKSB7XG4gICAgdmFyIGxpbmVzID0gZ2V0VGV4dExpbmVzKGZyb21UZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xuICAgICAgICBsZXQgcm93ID0gIW5hbWVzID8gW10gOiB7fTtcbiAgICAgICAgbGV0IGluc2lkZV9xdW90ZXMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGNvbHVtbl92YWx1ZSA9IFwiXCI7XG4gICAgICAgIGxldCBjb2x1bW5faW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBjaGFyX2luZGV4ID0gMDsgY2hhcl9pbmRleCA8IGxpbmUubGVuZ3RoOyBjaGFyX2luZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBhY3R1YWwgPSBsaW5lLmNoYXJBdChjaGFyX2luZGV4KTtcbiAgICAgICAgICAgIGlmIChpbnNpZGVfcXVvdGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA9PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gY2hhcl9pbmRleCA8IGxpbmUubGVuZ3RoIC0gMSA/IGxpbmUuY2hhckF0KGNoYXJfaW5kZXggKyAxKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSArPSBhY3R1YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyX2luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGVfcXVvdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSArPSBhY3R1YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA9PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc2lkZV9xdW90ZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhY3R1YWwgPT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX3ZhbHVlID0gdW5tYXNrU3BlY2lhbENoYXJzKGNvbHVtbl92YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKGNvbHVtbl92YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uX25hbWUgPSBcImNvbF9cIiArIGNvbHVtbl9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5faW5kZXggPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5fbmFtZSA9IG5hbWVzW2NvbHVtbl9pbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dbY29sdW1uX25hbWVdID0gY29sdW1uX3ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl92YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl9pbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX3ZhbHVlICs9IGFjdHVhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29sdW1uX3ZhbHVlID0gdW5tYXNrU3BlY2lhbENoYXJzKGNvbHVtbl92YWx1ZSk7XG4gICAgICAgIGlmICghbmFtZXMpIHtcbiAgICAgICAgICAgIHJvdy5wdXNoKGNvbHVtbl92YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHQucHVzaChyb3cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGNvbHVtbl9uYW1lID0gXCJjb2xfXCIgKyBjb2x1bW5faW5kZXg7XG4gICAgICAgICAgICBpZiAoY29sdW1uX2luZGV4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uX25hbWUgPSBuYW1lc1tjb2x1bW5faW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93W2NvbHVtbl9uYW1lXSA9IGNvbHVtbl92YWx1ZTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1hc2tTcGVjaWFsQ2hhcnMoZnJvbVRleHQpIHtcbiAgICByZXR1cm4gZnJvbVRleHRcbiAgICAgICAgLnJlcGxhY2UoXCJcXFxcXCIsIFwiXFxcXFxcXFxcIilcbiAgICAgICAgLnJlcGxhY2UoXCJcXHJcIiwgXCJcXFxcclwiKVxuICAgICAgICAucmVwbGFjZShcIlxcblwiLCBcIlxcXFxuXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiXFx0XCIsIFwiXFxcXHRcIik7XG59XG5mdW5jdGlvbiB1bm1hc2tTcGVjaWFsQ2hhcnMoZnJvbVRleHQpIHtcbiAgICByZXR1cm4gZnJvbVRleHRcbiAgICAgICAgLnJlcGxhY2UoXCJcXFxcXFxcXFwiLCBcIlxcXFxcIilcbiAgICAgICAgLnJlcGxhY2UoXCJcXFxcclwiLCBcIlxcclwiKVxuICAgICAgICAucmVwbGFjZShcIlxcXFxuXCIsIFwiXFxuXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiXFxcXHRcIiwgXCJcXHRcIik7XG59XG5mdW5jdGlvbiBwYXJzZVBhcmFtZXRlcnMoc291cmNlKSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBvcGVuID0gZmFsc2U7XG4gICAgbGV0IGFjdHVhbCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBsZXR0ZXIgb2YgQXJyYXkuZnJvbShzb3VyY2UpKSB7XG4gICAgICAgIGlmIChvcGVuKSB7XG4gICAgICAgICAgICBpZiAobGV0dGVyID09ICdcIicpIHtcbiAgICAgICAgICAgICAgICBvcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhY3R1YWwpO1xuICAgICAgICAgICAgICAgICAgICBhY3R1YWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFjdHVhbCArPSBsZXR0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAobGV0dGVyID09ICdcIicpIHtcbiAgICAgICAgICAgICAgICBvcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGV0dGVyID09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhY3R1YWwpO1xuICAgICAgICAgICAgICAgICAgICBhY3R1YWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFjdHVhbCArPSBsZXR0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuUWluQm9keSA9IHtcbiAgICBnZXRDb29raWUsXG4gICAgc2V0Q29va2llLFxuICAgIGRlbENvb2tpZSxcbiAgICBnZXRUZXh0TGluZXMsXG4gICAgZ2V0Q1NWUm93cyxcbiAgICBtYXNrU3BlY2lhbENoYXJzLFxuICAgIHVubWFza1NwZWNpYWxDaGFycyxcbiAgICBwYXJzZVBhcmFtZXRlcnMsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLWJvZHkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkZvb3QgPSBleHBvcnRzLlFpbkZpbGVzRGVzY3JpcHRvciA9IGV4cG9ydHMuUWluRmlsZXNPcGVyYXRpb24gPSBleHBvcnRzLlFpbkZpbGVzTmF0dXJlID0gdm9pZCAwO1xudmFyIFFpbkZpbGVzTmF0dXJlO1xuKGZ1bmN0aW9uIChRaW5GaWxlc05hdHVyZSkge1xuICAgIFFpbkZpbGVzTmF0dXJlW1wiQk9USFwiXSA9IFwiYm90aFwiO1xuICAgIFFpbkZpbGVzTmF0dXJlW1wiRElSRUNUT1JJRVNcIl0gPSBcImRpcmVjdG9yaWVzXCI7XG4gICAgUWluRmlsZXNOYXR1cmVbXCJGSUxFU1wiXSA9IFwiZmlsZXNcIjtcbn0pKFFpbkZpbGVzTmF0dXJlID0gZXhwb3J0cy5RaW5GaWxlc05hdHVyZSB8fCAoZXhwb3J0cy5RaW5GaWxlc05hdHVyZSA9IHt9KSk7XG52YXIgUWluRmlsZXNPcGVyYXRpb247XG4oZnVuY3Rpb24gKFFpbkZpbGVzT3BlcmF0aW9uKSB7XG4gICAgUWluRmlsZXNPcGVyYXRpb25bXCJPUEVOXCJdID0gXCJvcGVuXCI7XG4gICAgUWluRmlsZXNPcGVyYXRpb25bXCJTQVZFXCJdID0gXCJzYXZlXCI7XG59KShRaW5GaWxlc09wZXJhdGlvbiA9IGV4cG9ydHMuUWluRmlsZXNPcGVyYXRpb24gfHwgKGV4cG9ydHMuUWluRmlsZXNPcGVyYXRpb24gPSB7fSkpO1xuY2xhc3MgUWluRmlsZXNEZXNjcmlwdG9yIHtcbn1cbmV4cG9ydHMuUWluRmlsZXNEZXNjcmlwdG9yID0gUWluRmlsZXNEZXNjcmlwdG9yO1xuZnVuY3Rpb24gZ2V0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xufVxuZnVuY3Rpb24gaXNMb2NhbEhvc3QoKSB7XG4gICAgdmFyIGxvY2F0aW9uID0gZ2V0TG9jYXRpb24oKTtcbiAgICB2YXIgc3RhcnQgPSBsb2NhdGlvbi5pbmRleE9mKFwiOi8vXCIpO1xuICAgIGlmIChzdGFydCA9PSAtMSkge1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGFydCArPSAzO1xuICAgIH1cbiAgICBsb2NhdGlvbiA9IGxvY2F0aW9uLnN1YnN0cmluZyhzdGFydCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLmluZGV4T2YoXCJsb2NhbGhvc3RcIikgPT09IDAgfHwgbG9jYXRpb24uaW5kZXhPZihcIjEyNy4wLjAuMVwiKSA9PT0gMDtcbn1cbmZ1bmN0aW9uIGdldFNlcGFyYXRvcihvZlBhdGgpIHtcbiAgICBsZXQgcmVzdWx0ID0gXCIvXCI7XG4gICAgaWYgKG9mUGF0aCAmJiBvZlBhdGguaW5kZXhPZihcIlxcXFxcIikgPiAtMSkge1xuICAgICAgICByZXN1bHQgPSBcIlxcXFxcIjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGdldFBhdGhKb2luKHBhdGhBLCBwYXRoQikge1xuICAgIGlmIChwYXRoQSA9PSBudWxsIHx8IHBhdGhBID09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXRoQSA9IFwiXCI7XG4gICAgfVxuICAgIGlmIChwYXRoQiA9PSBudWxsIHx8IHBhdGhCID09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXRoQiA9IFwiXCI7XG4gICAgfVxuICAgIGlmIChwYXRoQS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gcGF0aEI7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBhdGhCLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBwYXRoQTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCB1bmlvbiA9IFwiL1wiO1xuICAgICAgICBpZiAocGF0aEEuaW5kZXhPZihcIlxcXFxcIikgPiAtMSB8fCBwYXRoQi5pbmRleE9mKFwiXFxcXFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB1bmlvbiA9IFwiXFxcXFwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwYXRoQUVuZCA9IHBhdGhBLnN1YnN0cmluZyhwYXRoQS5sZW5ndGggLSAxLCBwYXRoQS5sZW5ndGgpO1xuICAgICAgICBsZXQgcGF0aEJTdGFydCA9IHBhdGhCLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgaWYgKHBhdGhBRW5kID09IHVuaW9uIHx8IHBhdGhCU3RhcnQgPT0gdW5pb24pIHtcbiAgICAgICAgICAgIHVuaW9uID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aEEgKyB1bmlvbiArIHBhdGhCO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFBhcmVudChwYXRoKSB7XG4gICAgaWYgKHBhdGgpIHtcbiAgICAgICAgbGV0IHNlcGFyYXRvciA9IGdldFNlcGFyYXRvcihwYXRoKTtcbiAgICAgICAgbGV0IGxhc3QgPSBwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvcik7XG4gICAgICAgIGlmIChsYXN0ID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnN1YnN0cmluZygwLCBsYXN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn1cbmZ1bmN0aW9uIGdldFN0ZW0ocGF0aCkge1xuICAgIGlmIChwYXRoKSB7XG4gICAgICAgIGxldCBzZXBhcmF0b3IgPSBnZXRTZXBhcmF0b3IocGF0aCk7XG4gICAgICAgIGxldCBsYXN0ID0gcGF0aC5sYXN0SW5kZXhPZihzZXBhcmF0b3IpO1xuICAgICAgICBpZiAobGFzdCA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5zdWJzdHJpbmcobGFzdCArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufVxuZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbihuYW1lKSB7XG4gICAgbGV0IHBvc2l0aW9uID0gbmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XG4gICAgaWYgKHBvc2l0aW9uID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKHBvc2l0aW9uICsgMSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG59XG5jb25zdCBhcHBzRXh0ZW5zaW9ucyA9IFtcbiAgICBcImh0bVwiLCBcImh0bWxcIiwgXCJjc3NcIiwgXCJqc1wiLCBcImpzeFwiLCBcInRzXCIsIFwidHN4XCIsIFwicGh0bWxcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZUFwcChleHRlbnNpb24pIHtcbiAgICByZXR1cm4gYXBwc0V4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTE7XG59XG5jb25zdCBjbWRzRXh0ZW5zaW9ucyA9IFtcbiAgICBcImhcIiwgXCJjXCIsIFwiaHBwXCIsIFwiY3BwXCIsIFwicnNcIiwgXCJqbFwiLFxuICAgIFwiY3NcIiwgXCJjc3Byb2pcIiwgXCJmc1wiLCBcIm1sXCIsIFwiZnNpXCIsIFwibWxpXCIsIFwiZnN4XCIsIFwiZnNzY3JpcHRcIixcbiAgICBcImphdmFcIiwgXCJneVwiLCBcImd2eVwiLCBcImdyb292eVwiLCBcInNjXCIsIFwic2NhbGFcIiwgXCJjbGpcIixcbiAgICBcInB5XCIsIFwicnVieVwiLCBcInBocFwiLCBcInBodG1sXCIsXG5dO1xuZnVuY3Rpb24gaXNGaWxlQ21kKGV4dGVuc2lvbikge1xuICAgIHJldHVybiBjbWRzRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IGV4ZWNFeHRlbnNpb25zID0gW1xuICAgIFwiZXhlXCIsIFwiamFyXCIsIFwiY29tXCIsIFwiYmF0XCIsIFwic2hcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZUV4ZWMoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIGV4ZWNFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgaW1hZ2VFeHRlbnNpb25zID0gW1xuICAgIFwianBnXCIsIFwianBlZ1wiLCBcInBuZ1wiLCBcImdpZlwiLCBcImJtcFwiXG5dO1xuZnVuY3Rpb24gaXNGaWxlSW1hZ2UoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIGltYWdlRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IHZlY3RvckV4dGVuc2lvbnMgPSBbXG4gICAgXCJzdmdcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZVZlY3RvcihleHRlbnNpb24pIHtcbiAgICByZXR1cm4gdmVjdG9yRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IG1vdmllRXh0ZW5zaW9ucyA9IFtcbiAgICBcImF2aVwiLCBcIm1wNFwiXG5dO1xuZnVuY3Rpb24gaXNGaWxlTW92aWUoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIG1vdmllRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IG11c2ljRXh0ZW5zaW9ucyA9IFtcbiAgICBcIndhdlwiLCBcIm1wM1wiXG5dO1xuZnVuY3Rpb24gaXNGaWxlTXVzaWMoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIG11c2ljRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IHppcHBlZEV4dGVuc2lvbnMgPSBbXG4gICAgXCJ6aXBcIiwgXCJyYXJcIiwgXCI3elwiLCBcInRhclwiLCBcImd6XCJcbl07XG5mdW5jdGlvbiBpc0ZpbGVaaXBwZWQoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIHppcHBlZEV4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTE7XG59XG5leHBvcnRzLlFpbkZvb3QgPSB7XG4gICAgZ2V0TG9jYXRpb24sXG4gICAgaXNMb2NhbEhvc3QsXG4gICAgZ2V0U2VwYXJhdG9yLFxuICAgIGdldFBhdGhKb2luLFxuICAgIGdldFBhcmVudCxcbiAgICBnZXRTdGVtLFxuICAgIGdldEZpbGVFeHRlbnNpb24sXG4gICAgaXNGaWxlQXBwLFxuICAgIGlzRmlsZUNtZCxcbiAgICBpc0ZpbGVFeGVjLFxuICAgIGlzRmlsZUltYWdlLFxuICAgIGlzRmlsZVZlY3RvcixcbiAgICBpc0ZpbGVNb3ZpZSxcbiAgICBpc0ZpbGVNdXNpYyxcbiAgICBpc0ZpbGVaaXBwZWQsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLWZvb3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkhlYWQgPSBleHBvcnRzLlFpbkdyYW5kZXVyID0gZXhwb3J0cy5RaW5Cb3VuZHMgPSBleHBvcnRzLlFpbkRpbWVuc2lvbiA9IGV4cG9ydHMuUWluUG9pbnQgPSB2b2lkIDA7XG5jbGFzcyBRaW5Qb2ludCB7XG59XG5leHBvcnRzLlFpblBvaW50ID0gUWluUG9pbnQ7XG47XG5jbGFzcyBRaW5EaW1lbnNpb24ge1xufVxuZXhwb3J0cy5RaW5EaW1lbnNpb24gPSBRaW5EaW1lbnNpb247XG47XG5jbGFzcyBRaW5Cb3VuZHMge1xufVxuZXhwb3J0cy5RaW5Cb3VuZHMgPSBRaW5Cb3VuZHM7XG47XG52YXIgUWluR3JhbmRldXI7XG4oZnVuY3Rpb24gKFFpbkdyYW5kZXVyKSB7XG4gICAgUWluR3JhbmRldXJbXCJTTUFMTFwiXSA9IFwic21hbGxcIjtcbiAgICBRaW5HcmFuZGV1cltcIk1FRElVTVwiXSA9IFwibWVkaXVtXCI7XG4gICAgUWluR3JhbmRldXJbXCJMQVJHRVwiXSA9IFwibGFyZ2VcIjtcbn0pKFFpbkdyYW5kZXVyID0gZXhwb3J0cy5RaW5HcmFuZGV1ciB8fCAoZXhwb3J0cy5RaW5HcmFuZGV1ciA9IHt9KSk7XG5mdW5jdGlvbiBnZXREZXNrQVBJKCkge1xuICAgIHZhciB3aW4gPSB3aW5kb3c7XG4gICAgaWYgKHdpbi5kZXNrQVBJKSB7XG4gICAgICAgIHJldHVybiB3aW4uZGVza0FQSTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbiA9IHdpbmRvdy5wYXJlbnQ7XG4gICAgfVxuICAgIGlmICh3aW4uZGVza0FQSSkge1xuICAgICAgICByZXR1cm4gd2luLmRlc2tBUEk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW4gPSB3aW5kb3cudG9wO1xuICAgIH1cbiAgICBpZiAod2luLmRlc2tBUEkpIHtcbiAgICAgICAgcmV0dXJuIHdpbi5kZXNrQVBJO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuY29uc3QgbG9nZ2VkID0gW107XG5mdW5jdGlvbiBnZXRMb2dnZWQoKSB7XG4gICAgcmV0dXJuIGxvZ2dlZDtcbn1cbmZ1bmN0aW9uIGxvZyhtZXNzYWdlKSB7XG4gICAgbG9nZ2VkLnB1c2gobWVzc2FnZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuICAgIGNhdGNoIChfKSB7IH1cbiAgICB0cnkge1xuICAgICAgICBnZXREZXNrQVBJKCkuc2VuZChcImxvZ09uTWFpblwiLCBtZXNzYWdlKTtcbiAgICB9XG4gICAgY2F0Y2ggKF8pIHsgfVxufVxuZnVuY3Rpb24gbG9nRXJyb3IoZXJyb3IsIG9yaWdpbikge1xuICAgIGxvZyhnZXRFcnJvck1lc3NhZ2UoZXJyb3IsIG9yaWdpbikpO1xufVxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGVycm9yLCBvcmlnaW4pIHtcbiAgICByZXR1cm4gZ2V0VHJlYXRNZXNzYWdlKFwiUHJvYmxlbSB3aXRoOlwiLCBlcnJvciwgb3JpZ2luKTtcbn1cbmZ1bmN0aW9uIGxvZ1dhcm5pbmcoZXJyb3IsIG9yaWdpbikge1xuICAgIGxvZyhnZXRXYXJuaW5nTWVzc2FnZShlcnJvciwgb3JpZ2luKSk7XG59XG5mdW5jdGlvbiBnZXRXYXJuaW5nTWVzc2FnZShlcnJvciwgb3JpZ2luKSB7XG4gICAgcmV0dXJuIGdldFRyZWF0TWVzc2FnZShcIkNoZWNrb3V0IHRoaXM6XCIsIGVycm9yLCBvcmlnaW4pO1xufVxuZnVuY3Rpb24gbG9nU3VwcG9ydChlcnJvciwgb3JpZ2luKSB7XG4gICAgbG9nKGdldFN1cHBvcnRNZXNzYWdlKGVycm9yLCBvcmlnaW4pKTtcbn1cbmZ1bmN0aW9uIGdldFN1cHBvcnRNZXNzYWdlKGVycm9yLCBvcmlnaW4pIHtcbiAgICByZXR1cm4gZ2V0VHJlYXRNZXNzYWdlKFwiTmVlZCBTdXBwb3J0IG9uOlwiLCBlcnJvciwgb3JpZ2luKTtcbn1cbmZ1bmN0aW9uIGdldFRyZWF0TWVzc2FnZShwcmVmaXgsIGVycm9yLCBvcmlnaW4pIHtcbiAgICB2YXIgcmVzdWx0ID0gcHJlZml4ICsgKGVycm9yID8gXCIgXCIgKyBlcnJvci50b1N0cmluZygpIDogXCJcIik7XG4gICAgaWYgKGVycm9yLnJlc3BvbnNlICYmIGVycm9yLnJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgdmFyIGVycm9yRGF0YSA9IGVycm9yLnJlc3BvbnNlLmRhdGE7XG4gICAgICAgIGlmICghKHR5cGVvZiBlcnJvckRhdGEgPT0gXCJzdHJpbmdcIiB8fCBlcnJvckRhdGEgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICBlcnJvckRhdGEgPSBKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBcIiAtIERhdGE6IFwiICsgZXJyb3JEYXRhO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCEodHlwZW9mIGVycm9yID09IFwic3RyaW5nXCIgfHwgZXJyb3IgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCIgLSBEYXRhOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAob3JpZ2luKSB7XG4gICAgICAgIHJlc3VsdCArPSBcIiAtIE9yaWdpbjogXCIgKyBvcmlnaW47XG4gICAgfVxuICAgIGNvbnN0IHN0YWNrID0gKG5ldyBFcnJvcihcIlwiKSkuc3RhY2s7XG4gICAgaWYgKHN0YWNrKSB7XG4gICAgICAgIHJlc3VsdCArPSBcIiAtIFN0YWNrOiBcIiArIHN0YWNrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gdG9nZ2xlRGV2VG9vbHMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgZ2V0RGVza0FQSSgpLnNlbmQoXCJ0b2dnbGVEZXZUb29sc1wiKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nRXJyb3IoZSwgXCJ7cWlucGVsLXJlc30oRXJyQ29kZS0wMDAwMDEpXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuUWluSGVhZCA9IHtcbiAgICBnZXREZXNrQVBJLFxuICAgIGdldExvZ2dlZCxcbiAgICBsb2csXG4gICAgbG9nRXJyb3IsXG4gICAgZ2V0RXJyb3JNZXNzYWdlLFxuICAgIGxvZ1dhcm5pbmcsXG4gICAgZ2V0V2FybmluZ01lc3NhZ2UsXG4gICAgbG9nU3VwcG9ydCxcbiAgICBnZXRTdXBwb3J0TWVzc2FnZSxcbiAgICBnZXRUcmVhdE1lc3NhZ2UsXG4gICAgdG9nZ2xlRGV2VG9vbHMsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLWhlYWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpblNraW4gPSBleHBvcnRzLlFpblN0eWxlcyA9IHZvaWQgMDtcbmNvbnN0IHFpbl9hcm1fMSA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5jb25zdCBxaW5faGVhZF8xID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5leHBvcnRzLlFpblN0eWxlcyA9IHtcbiAgICBDb2xvckZvcmVncm91bmQ6IFwiIzI3MDAzNlwiLFxuICAgIENvbG9yQmFja2dyb3VuZDogXCIjZmZmYWVmXCIsXG4gICAgQ29sb3JJbmFjdGl2ZTogXCIjZmFlZmZmXCIsXG4gICAgQ29sb3JBY3RpdmU6IFwiI2ZhY2RjZFwiLFxuICAgIEZvbnROYW1lOiBcIlNvdXJjZVNhbnNQcm9cIixcbiAgICBGb250U2l6ZTogXCIxNnB4XCIsXG59O1xuZnVuY3Rpb24gc3R5bGVBc0JvZHkoZWwpIHtcbiAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBlbC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgIGVsLnN0eWxlLnJpZ2h0ID0gXCIwcHhcIjtcbiAgICBlbC5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgIGVsLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgIGVsLnN0eWxlLnBhZGRpbmcgPSBcIjlweFwiO1xuICAgIGVsLnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCI7XG59XG5mdW5jdGlvbiBzdHlsZUFzRWRpdChlbCkge1xuICAgIGVsLnN0eWxlLm1hcmdpbiA9IFwiMXB4XCI7XG4gICAgZWwuc3R5bGUucGFkZGluZyA9IFwiM3B4XCI7XG4gICAgZWwuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xuICAgIGVsLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICMxODAwMjdcIjtcbiAgICBlbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjNweFwiO1xuICAgIGVsLnN0eWxlLmNvbG9yID0gXCIjMTgwMDI3XCI7XG4gICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZmZmZmXCI7XG4gICAgZWwuc3R5bGUuZm9udEZhbWlseSA9IFwiU291cmNlU2Fuc1Byb1wiO1xuICAgIGVsLnN0eWxlLmZvbnRTaXplID0gXCIxNnB4XCI7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmYWVmZmZcIjtcbiAgICAgICAgZWwuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgI2FlMDAwMFwiO1xuICAgIH0pO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCAoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZmZmZmXCI7XG4gICAgICAgIGVsLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICMxODAwMjdcIjtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHN0eWxlTWF4U2l6ZUZvck5vdE92ZXJGbG93KGVsLCBwYXJlbnQpIHtcbiAgICBjb25zb2xlLmxvZyhcIkQxXCIpO1xuICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgIHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRDI6IFwiICsgcGFyZW50KTtcbiAgICB9XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICBsZXQgbWF4V2lkdGggPSAwO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgICAgICAgbGV0IGltZWRpYXRlID0gZWw7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gbWF4V2lkdGggKyBpbWVkaWF0ZS5jbGllbnRMZWZ0O1xuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gbWF4SGVpZ2h0ICsgaW1lZGlhdGUuY2xpZW50VG9wO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEMzogXCIgKyBtYXhXaWR0aCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkQ0OiBcIiArIG1heEhlaWdodCk7XG4gICAgICAgICAgICBpbWVkaWF0ZSA9IGltZWRpYXRlLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH0gd2hpbGUgKGltZWRpYXRlICE9IG51bGwgJiYgaW1lZGlhdGUgIT0gcGFyZW50KTtcbiAgICAgICAgbWF4V2lkdGggPSBwYXJlbnQuY2xpZW50V2lkdGggLSBtYXhXaWR0aDtcbiAgICAgICAgbWF4SGVpZ2h0ID0gcGFyZW50LmNsaWVudEhlaWdodCAtIG1heEhlaWdodDtcbiAgICAgICAgY29uc29sZS5sb2coXCJENTogXCIgKyBtYXhXaWR0aCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRDY6IFwiICsgbWF4SGVpZ2h0KTtcbiAgICAgICAgZWwuc3R5bGUubWF4V2lkdGggPSBtYXhXaWR0aCArIFwicHhcIjtcbiAgICAgICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gbWF4SGVpZ2h0ICsgXCJweFwiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN0eWxlU2l6ZShlbCwgc2l6ZSkge1xuICAgIGlmIChzaXplKSB7XG4gICAgICAgIGlmIChzaXplIGluc3RhbmNlb2YgcWluX2hlYWRfMS5RaW5EaW1lbnNpb24pIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLndpZHRoID0gc2l6ZS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsLnN0eWxlLmhlaWdodCA9IHNpemUuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGRpbSA9IGdldERpbWVuc2lvblNpemUoc2l6ZSk7XG4gICAgICAgICAgICBlbC5zdHlsZS53aWR0aCA9IGRpbS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsLnN0eWxlLmhlaWdodCA9IGRpbS5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzdHlsZUZsZXhNYXgoZWwpIHtcbiAgICBlbC5zdHlsZS5mbGV4ID0gXCIxXCI7XG59XG5mdW5jdGlvbiBzdHlsZUZsZXhNaW4oZWwpIHtcbiAgICBlbC5zdHlsZS5mbGV4ID0gXCIwXCI7XG59XG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0LFxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplU3R5bGUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSBnZXRXaW5kb3dTaXplKCkud2lkdGg7XG4gICAgaWYgKHdpZHRoIDwgNjAwKSB7XG4gICAgICAgIHJldHVybiBxaW5faGVhZF8xLlFpbkdyYW5kZXVyLlNNQUxMO1xuICAgIH1cbiAgICBlbHNlIGlmICh3aWR0aCA8IDEwMDApIHtcbiAgICAgICAgcmV0dXJuIHFpbl9oZWFkXzEuUWluR3JhbmRldXIuTUVESVVNO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHFpbl9oZWFkXzEuUWluR3JhbmRldXIuTEFSR0U7XG4gICAgfVxufVxuZnVuY3Rpb24gaGlkZUFsbElGcmFtZXMoKSB7XG4gICAgdmFyIGRvY19pZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpZnJhbWVcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb2NfaWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZG9jX2lmcmFtZSA9IGRvY19pZnJhbWVzW2ldO1xuICAgICAgICBkb2NfaWZyYW1lLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNob3dBbGxJRnJhbWVzKCkge1xuICAgIHZhciBkb2NfaWZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWZyYW1lXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jX2lmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGRvY19pZnJhbWUgPSBkb2NfaWZyYW1lc1tpXTtcbiAgICAgICAgZG9jX2lmcmFtZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgfVxufVxuZnVuY3Rpb24gZGlzYWJsZVNlbGVjdGlvbihlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS51c2VyU2VsZWN0ID0gXCJub25lXCI7XG4gICAgZWxlbWVudC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gXCJub25lXCI7XG4gICAgZWxlbWVudC5vbnNlbGVjdHN0YXJ0ID0gcWluX2FybV8xLlFpbkFybS5zdG9wRXZlbnQ7XG59XG5mdW5jdGlvbiBjbGVhclNlbGVjdGlvbigpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH0sIDM2MCk7XG59XG5mdW5jdGlvbiBpc0VsZW1lbnRWaXNpYmxlSW5TY3JvbGwoZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0VG9wIDwgZWxlbWVudC5wYXJlbnRFbGVtZW50LnNjcm9sbFRvcCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldExlZnQgPCBlbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmNsaWVudFdpZHRoID5cbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAtXG4gICAgICAgICAgICAgICAgKGVsZW1lbnQub2Zmc2V0TGVmdCAtIGVsZW1lbnQucGFyZW50RWxlbWVudC5zY3JvbGxMZWZ0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmNsaWVudEhlaWdodCA+XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC1cbiAgICAgICAgICAgICAgICAoZWxlbWVudC5vZmZzZXRUb3AgLSBlbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gZ2V0RGltZW5zaW9uU2l6ZShzaXplKSB7XG4gICAgaWYgKHNpemUgPT0gcWluX2hlYWRfMS5RaW5HcmFuZGV1ci5MQVJHRSkge1xuICAgICAgICByZXR1cm4gZ2V0RGltZW5zaW9uTGFyZ2UoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2l6ZSA9PSBxaW5faGVhZF8xLlFpbkdyYW5kZXVyLk1FRElVTSkge1xuICAgICAgICByZXR1cm4gZ2V0RGltZW5zaW9uTWVkaXVtKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZ2V0RGltZW5zaW9uU21hbGwoKTtcbiAgICB9XG59XG5jb25zdCBkaW1lbnNpb25TbWFsbCA9IHtcbiAgICB3aWR0aDogMTYsXG4gICAgaGVpZ2h0OiAxNixcbn07XG5mdW5jdGlvbiBnZXREaW1lbnNpb25TbWFsbCgpIHtcbiAgICByZXR1cm4gZGltZW5zaW9uU21hbGw7XG59XG5jb25zdCBkaW1lbnNpb25NZWRpdW0gPSB7XG4gICAgd2lkdGg6IDMyLFxuICAgIGhlaWdodDogMzIsXG59O1xuZnVuY3Rpb24gZ2V0RGltZW5zaW9uTWVkaXVtKCkge1xuICAgIHJldHVybiBkaW1lbnNpb25NZWRpdW07XG59XG5jb25zdCBkaW1lbnNpb25MYXJnZSA9IHtcbiAgICB3aWR0aDogNjQsXG4gICAgaGVpZ2h0OiA2NCxcbn07XG5mdW5jdGlvbiBnZXREaW1lbnNpb25MYXJnZSgpIHtcbiAgICByZXR1cm4gZGltZW5zaW9uTGFyZ2U7XG59XG5leHBvcnRzLlFpblNraW4gPSB7XG4gICAgc3R5bGVzOiBleHBvcnRzLlFpblN0eWxlcyxcbiAgICBzdHlsZUFzQm9keSxcbiAgICBzdHlsZUFzRWRpdCxcbiAgICBzdHlsZU1heFNpemVGb3JOb3RPdmVyRmxvdyxcbiAgICBzdHlsZVNpemUsXG4gICAgc3R5bGVGbGV4TWF4LFxuICAgIHN0eWxlRmxleE1pbixcbiAgICBnZXRXaW5kb3dTaXplLFxuICAgIGdldFdpbmRvd1NpemVTdHlsZSxcbiAgICBoaWRlQWxsSUZyYW1lcyxcbiAgICBzaG93QWxsSUZyYW1lcyxcbiAgICBkaXNhYmxlU2VsZWN0aW9uLFxuICAgIGNsZWFyU2VsZWN0aW9uLFxuICAgIGlzRWxlbWVudFZpc2libGVJblNjcm9sbCxcbiAgICBnZXREaW1lbnNpb25TaXplLFxuICAgIGdldERpbWVuc2lvblNtYWxsLFxuICAgIGdldERpbWVuc2lvbk1lZGl1bSxcbiAgICBnZXREaW1lbnNpb25MYXJnZSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tc2tpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWluU291bCA9IHZvaWQgMDtcbmNvbnN0IHFpbl9hcm1fMSA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5jb25zdCBxaW5fYm9keV8xID0gcmVxdWlyZShcIi4vcWluLWJvZHlcIik7XG5jb25zdCBxaW5fZm9vdF8xID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5jb25zdCBxaW5faGVhZF8xID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5jb25zdCBxaW5fc2tpbl8xID0gcmVxdWlyZShcIi4vcWluLXNraW5cIik7XG5leHBvcnRzLlFpblNvdWwgPSB7XG4gICAgYXJtOiBxaW5fYXJtXzEuUWluQXJtLFxuICAgIGJvZHk6IHFpbl9ib2R5XzEuUWluQm9keSxcbiAgICBmb290OiBxaW5fZm9vdF8xLlFpbkZvb3QsXG4gICAgaGVhZDogcWluX2hlYWRfMS5RaW5IZWFkLFxuICAgIHNraW46IHFpbl9za2luXzEuUWluU2tpbixcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tc291bC5qcy5tYXAiXX0=
