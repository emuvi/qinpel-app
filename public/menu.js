(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
const qin_desk_1 = require("./qin-desk");
if (qinpel.manager.needToLog()) {
    window.frameElement.src = "./login.html";
}
else {
    new qin_desk_1.QinDesk(qinpel, manifest => !manifest.group).putInDocument();
}

},{"./qin-desk":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinDesk = void 0;
const qinpel_res_1 = require("qinpel-res");
class QinDesk {
    constructor(qinpel, qinAddsApp) {
        this.divMain = document.createElement("div");
        this.divApps = document.createElement("div");
        this.divCfgs = document.createElement("div");
        this.qinpel = qinpel;
        this.qinAddsApp = qinAddsApp;
        this.initMain();
        this.initApps();
        this.initCfgs();
    }
    initMain() {
        this.divMain.style.padding = "3px";
        this.divMain.appendChild(this.divApps);
        this.divMain.appendChild(this.divCfgs);
    }
    initApps() {
        this.divApps.style.padding = "9px";
        this.qinpel
            .get("/list/apps")
            .then((res) => {
            for (let name of this.listApps(res.data)) {
                this.tryAddApp(name);
            }
        })
            .catch((err) => {
            if (err.response.status === 403) {
                this.qinpel.manager.exit();
            }
            this.divMain.innerText = qinpel_res_1.QinSoul.head.getErrorMessage(err, "{qinpel-app}(ErrCode-000002)");
        });
    }
    listApps(response) {
        return qinpel_res_1.QinSoul.body.getTextLines(response);
    }
    tryAddApp(name) {
        if (name && name != "qinpel-app") {
            this.qinpel
                .get("/app/" + name + "/manifest.json")
                .then((res) => {
                const manifest = res.data;
                if (this.qinAddsApp) {
                    if (!this.qinAddsApp(manifest)) {
                        return;
                    }
                }
                const title = manifest.title;
                const icon = "../" + name + "/favicon.ico";
                this.addMenu(this.divApps, this.newMenu(title, icon, () => {
                    this.qinpel.manager.newFrame(title, name);
                    this.qinpel.frame.headCloseAction();
                }));
            })
                .catch((err) => {
                const divError = document.createElement("div");
                divError.innerText = qinpel_res_1.QinSoul.head.getErrorMessage(err, "{qinpel-app}(ErrCode-000001)");
                this.addMenu(this.divApps, divError);
            });
        }
    }
    initCfgs() {
        this.divCfgs.style.padding = "9px";
        if (qinpel_res_1.QinSoul.foot.isLocalHost()) {
            this.addDevTools();
        }
    }
    addDevTools() {
        this.addMenu(this.divCfgs, this.newMenu("DevTools", "./assets/menu-devtools.ico", () => {
            qinpel_res_1.QinSoul.head.toggleDevTools();
            this.qinpel.frame.headCloseAction();
        }));
    }
    newMenu(title, icon, action) {
        const divContent = document.createElement("div");
        divContent.style.display = "flex";
        divContent.style.flexDirection = "column";
        divContent.style.alignItems = "center";
        const imgIcon = document.createElement("img");
        imgIcon.style.width = "48px";
        imgIcon.style.height = "48px";
        imgIcon.style.margin = "3px";
        imgIcon.src = icon;
        const spanTitle = document.createElement("span");
        spanTitle.style.margin = "3px";
        spanTitle.style.fontWeight = "bold";
        spanTitle.innerText = title;
        divContent.appendChild(imgIcon);
        divContent.appendChild(spanTitle);
        qinpel_res_1.QinSoul.arm.addAction(divContent, action);
        return divContent;
    }
    addMenu(divContainer, divContent) {
        const divMenu = document.createElement("div");
        divMenu.style.display = "inline-block";
        divMenu.style.margin = "5px";
        divMenu.style.padding = "5px";
        divMenu.style.maxWidth = "130px";
        divMenu.style.cursor = "pointer";
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

},{"qinpel-res":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinFoot = exports.QinFilesDescriptor = exports.QinFilesOperation = exports.QinFilesNature = exports.QinArm = exports.QinDragCalls = exports.QinWaiters = exports.QinEvent = exports.QinSoul = exports.QinBody = exports.QinHead = exports.QinGrandeur = exports.QinBounds = exports.QinDimension = exports.QinPoint = exports.QinSkin = exports.QinStyles = void 0;
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
Object.defineProperty(exports, "QinDragCalls", { enumerable: true, get: function () { return qin_arm_3.QinDragCalls; } });
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
exports.QinArm = exports.QinDragCalls = exports.QinWaiters = exports.QinEvent = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL21lbnUuanMiLCJidWlsZC9xaW4tZGVzay5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvYWxsLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tYXJtLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tYm9keS5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvcWluLWZvb3QuanMiLCIuLi9xaW5wZWwtcmVzL2J1aWxkL3Fpbi1oZWFkLmpzIiwiLi4vcWlucGVsLXJlcy9idWlsZC9xaW4tc2tpbi5qcyIsIi4uL3FpbnBlbC1yZXMvYnVpbGQvcWluLXNvdWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBxaW5wZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50LnFpbnBlbDtcbmNvbnN0IHFpbl9kZXNrXzEgPSByZXF1aXJlKFwiLi9xaW4tZGVza1wiKTtcbmlmIChxaW5wZWwubWFuYWdlci5uZWVkVG9Mb2coKSkge1xuICAgIHdpbmRvdy5mcmFtZUVsZW1lbnQuc3JjID0gXCIuL2xvZ2luLmh0bWxcIjtcbn1cbmVsc2Uge1xuICAgIG5ldyBxaW5fZGVza18xLlFpbkRlc2socWlucGVsLCBtYW5pZmVzdCA9PiAhbWFuaWZlc3QuZ3JvdXApLnB1dEluRG9jdW1lbnQoKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkRlc2sgPSB2b2lkIDA7XG5jb25zdCBxaW5wZWxfcmVzXzEgPSByZXF1aXJlKFwicWlucGVsLXJlc1wiKTtcbmNsYXNzIFFpbkRlc2sge1xuICAgIGNvbnN0cnVjdG9yKHFpbnBlbCwgcWluQWRkc0FwcCkge1xuICAgICAgICB0aGlzLmRpdk1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRpdkFwcHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRpdkNmZ3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnFpbnBlbCA9IHFpbnBlbDtcbiAgICAgICAgdGhpcy5xaW5BZGRzQXBwID0gcWluQWRkc0FwcDtcbiAgICAgICAgdGhpcy5pbml0TWFpbigpO1xuICAgICAgICB0aGlzLmluaXRBcHBzKCk7XG4gICAgICAgIHRoaXMuaW5pdENmZ3MoKTtcbiAgICB9XG4gICAgaW5pdE1haW4oKSB7XG4gICAgICAgIHRoaXMuZGl2TWFpbi5zdHlsZS5wYWRkaW5nID0gXCIzcHhcIjtcbiAgICAgICAgdGhpcy5kaXZNYWluLmFwcGVuZENoaWxkKHRoaXMuZGl2QXBwcyk7XG4gICAgICAgIHRoaXMuZGl2TWFpbi5hcHBlbmRDaGlsZCh0aGlzLmRpdkNmZ3MpO1xuICAgIH1cbiAgICBpbml0QXBwcygpIHtcbiAgICAgICAgdGhpcy5kaXZBcHBzLnN0eWxlLnBhZGRpbmcgPSBcIjlweFwiO1xuICAgICAgICB0aGlzLnFpbnBlbFxuICAgICAgICAgICAgLmdldChcIi9saXN0L2FwcHNcIilcbiAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgdGhpcy5saXN0QXBwcyhyZXMuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUFkZEFwcChuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyLnJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xaW5wZWwubWFuYWdlci5leGl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpdk1haW4uaW5uZXJUZXh0ID0gcWlucGVsX3Jlc18xLlFpblNvdWwuaGVhZC5nZXRFcnJvck1lc3NhZ2UoZXJyLCBcIntxaW5wZWwtYXBwfShFcnJDb2RlLTAwMDAwMilcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsaXN0QXBwcyhyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcWlucGVsX3Jlc18xLlFpblNvdWwuYm9keS5nZXRUZXh0TGluZXMocmVzcG9uc2UpO1xuICAgIH1cbiAgICB0cnlBZGRBcHAobmFtZSkge1xuICAgICAgICBpZiAobmFtZSAmJiBuYW1lICE9IFwicWlucGVsLWFwcFwiKSB7XG4gICAgICAgICAgICB0aGlzLnFpbnBlbFxuICAgICAgICAgICAgICAgIC5nZXQoXCIvYXBwL1wiICsgbmFtZSArIFwiL21hbmlmZXN0Lmpzb25cIilcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFuaWZlc3QgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5xaW5BZGRzQXBwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5xaW5BZGRzQXBwKG1hbmlmZXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gbWFuaWZlc3QudGl0bGU7XG4gICAgICAgICAgICAgICAgY29uc3QgaWNvbiA9IFwiLi4vXCIgKyBuYW1lICsgXCIvZmF2aWNvbi5pY29cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZE1lbnUodGhpcy5kaXZBcHBzLCB0aGlzLm5ld01lbnUodGl0bGUsIGljb24sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xaW5wZWwubWFuYWdlci5uZXdGcmFtZSh0aXRsZSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucWlucGVsLmZyYW1lLmhlYWRDbG9zZUFjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXZFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgZGl2RXJyb3IuaW5uZXJUZXh0ID0gcWlucGVsX3Jlc18xLlFpblNvdWwuaGVhZC5nZXRFcnJvck1lc3NhZ2UoZXJyLCBcIntxaW5wZWwtYXBwfShFcnJDb2RlLTAwMDAwMSlcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRNZW51KHRoaXMuZGl2QXBwcywgZGl2RXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5pdENmZ3MoKSB7XG4gICAgICAgIHRoaXMuZGl2Q2Zncy5zdHlsZS5wYWRkaW5nID0gXCI5cHhcIjtcbiAgICAgICAgaWYgKHFpbnBlbF9yZXNfMS5RaW5Tb3VsLmZvb3QuaXNMb2NhbEhvc3QoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGREZXZUb29scygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZERldlRvb2xzKCkge1xuICAgICAgICB0aGlzLmFkZE1lbnUodGhpcy5kaXZDZmdzLCB0aGlzLm5ld01lbnUoXCJEZXZUb29sc1wiLCBcIi4vYXNzZXRzL21lbnUtZGV2dG9vbHMuaWNvXCIsICgpID0+IHtcbiAgICAgICAgICAgIHFpbnBlbF9yZXNfMS5RaW5Tb3VsLmhlYWQudG9nZ2xlRGV2VG9vbHMoKTtcbiAgICAgICAgICAgIHRoaXMucWlucGVsLmZyYW1lLmhlYWRDbG9zZUFjdGlvbigpO1xuICAgICAgICB9KSk7XG4gICAgfVxuICAgIG5ld01lbnUodGl0bGUsIGljb24sIGFjdGlvbikge1xuICAgICAgICBjb25zdCBkaXZDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGl2Q29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIGRpdkNvbnRlbnQuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwiY29sdW1uXCI7XG4gICAgICAgIGRpdkNvbnRlbnQuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgIGNvbnN0IGltZ0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBpbWdJY29uLnN0eWxlLndpZHRoID0gXCI0OHB4XCI7XG4gICAgICAgIGltZ0ljb24uc3R5bGUuaGVpZ2h0ID0gXCI0OHB4XCI7XG4gICAgICAgIGltZ0ljb24uc3R5bGUubWFyZ2luID0gXCIzcHhcIjtcbiAgICAgICAgaW1nSWNvbi5zcmMgPSBpY29uO1xuICAgICAgICBjb25zdCBzcGFuVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgc3BhblRpdGxlLnN0eWxlLm1hcmdpbiA9IFwiM3B4XCI7XG4gICAgICAgIHNwYW5UaXRsZS5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgIHNwYW5UaXRsZS5pbm5lclRleHQgPSB0aXRsZTtcbiAgICAgICAgZGl2Q29udGVudC5hcHBlbmRDaGlsZChpbWdJY29uKTtcbiAgICAgICAgZGl2Q29udGVudC5hcHBlbmRDaGlsZChzcGFuVGl0bGUpO1xuICAgICAgICBxaW5wZWxfcmVzXzEuUWluU291bC5hcm0uYWRkQWN0aW9uKGRpdkNvbnRlbnQsIGFjdGlvbik7XG4gICAgICAgIHJldHVybiBkaXZDb250ZW50O1xuICAgIH1cbiAgICBhZGRNZW51KGRpdkNvbnRhaW5lciwgZGl2Q29udGVudCkge1xuICAgICAgICBjb25zdCBkaXZNZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGl2TWVudS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgICAgICAgZGl2TWVudS5zdHlsZS5tYXJnaW4gPSBcIjVweFwiO1xuICAgICAgICBkaXZNZW51LnN0eWxlLnBhZGRpbmcgPSBcIjVweFwiO1xuICAgICAgICBkaXZNZW51LnN0eWxlLm1heFdpZHRoID0gXCIxMzBweFwiO1xuICAgICAgICBkaXZNZW51LnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICBkaXZNZW51LmFwcGVuZENoaWxkKGRpdkNvbnRlbnQpO1xuICAgICAgICBkaXZDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2TWVudSk7XG4gICAgfVxuICAgIHB1dEluRG9jdW1lbnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kaXZNYWluKTtcbiAgICB9XG4gICAgZ2V0TWFpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2TWFpbjtcbiAgICB9XG59XG5leHBvcnRzLlFpbkRlc2sgPSBRaW5EZXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLWRlc2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkZvb3QgPSBleHBvcnRzLlFpbkZpbGVzRGVzY3JpcHRvciA9IGV4cG9ydHMuUWluRmlsZXNPcGVyYXRpb24gPSBleHBvcnRzLlFpbkZpbGVzTmF0dXJlID0gZXhwb3J0cy5RaW5Bcm0gPSBleHBvcnRzLlFpbkRyYWdDYWxscyA9IGV4cG9ydHMuUWluV2FpdGVycyA9IGV4cG9ydHMuUWluRXZlbnQgPSBleHBvcnRzLlFpblNvdWwgPSBleHBvcnRzLlFpbkJvZHkgPSBleHBvcnRzLlFpbkhlYWQgPSBleHBvcnRzLlFpbkdyYW5kZXVyID0gZXhwb3J0cy5RaW5Cb3VuZHMgPSBleHBvcnRzLlFpbkRpbWVuc2lvbiA9IGV4cG9ydHMuUWluUG9pbnQgPSBleHBvcnRzLlFpblNraW4gPSBleHBvcnRzLlFpblN0eWxlcyA9IHZvaWQgMDtcbnZhciBxaW5fc2tpbl8xID0gcmVxdWlyZShcIi4vcWluLXNraW5cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5TdHlsZXNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9za2luXzEuUWluU3R5bGVzOyB9IH0pO1xudmFyIHFpbl9za2luXzIgPSByZXF1aXJlKFwiLi9xaW4tc2tpblwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpblNraW5cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9za2luXzIuUWluU2tpbjsgfSB9KTtcbnZhciBxaW5faGVhZF8xID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Qb2ludFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2hlYWRfMS5RaW5Qb2ludDsgfSB9KTtcbnZhciBxaW5faGVhZF8yID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5EaW1lbnNpb25cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzIuUWluRGltZW5zaW9uOyB9IH0pO1xudmFyIHFpbl9oZWFkXzMgPSByZXF1aXJlKFwiLi9xaW4taGVhZFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkJvdW5kc1wiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2hlYWRfMy5RaW5Cb3VuZHM7IH0gfSk7XG52YXIgcWluX2hlYWRfNCA9IHJlcXVpcmUoXCIuL3Fpbi1oZWFkXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluR3JhbmRldXJcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9oZWFkXzQuUWluR3JhbmRldXI7IH0gfSk7XG52YXIgcWluX2hlYWRfNSA9IHJlcXVpcmUoXCIuL3Fpbi1oZWFkXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUWluSGVhZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2hlYWRfNS5RaW5IZWFkOyB9IH0pO1xudmFyIHFpbl9ib2R5XzEgPSByZXF1aXJlKFwiLi9xaW4tYm9keVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkJvZHlcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9ib2R5XzEuUWluQm9keTsgfSB9KTtcbnZhciBxaW5fc291bF8xID0gcmVxdWlyZShcIi4vcWluLXNvdWxcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5Tb3VsXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fc291bF8xLlFpblNvdWw7IH0gfSk7XG52YXIgcWluX2FybV8xID0gcmVxdWlyZShcIi4vcWluLWFybVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkV2ZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBxaW5fYXJtXzEuUWluRXZlbnQ7IH0gfSk7XG52YXIgcWluX2FybV8yID0gcmVxdWlyZShcIi4vcWluLWFybVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbldhaXRlcnNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9hcm1fMi5RaW5XYWl0ZXJzOyB9IH0pO1xudmFyIHFpbl9hcm1fMyA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5EcmFnQ2FsbHNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9hcm1fMy5RaW5EcmFnQ2FsbHM7IH0gfSk7XG52YXIgcWluX2FybV80ID0gcmVxdWlyZShcIi4vcWluLWFybVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkFybVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2FybV80LlFpbkFybTsgfSB9KTtcbnZhciBxaW5fZm9vdF8xID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5GaWxlc05hdHVyZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2Zvb3RfMS5RaW5GaWxlc05hdHVyZTsgfSB9KTtcbnZhciBxaW5fZm9vdF8yID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5GaWxlc09wZXJhdGlvblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcWluX2Zvb3RfMi5RaW5GaWxlc09wZXJhdGlvbjsgfSB9KTtcbnZhciBxaW5fZm9vdF8zID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJRaW5GaWxlc0Rlc2NyaXB0b3JcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9mb290XzMuUWluRmlsZXNEZXNjcmlwdG9yOyB9IH0pO1xudmFyIHFpbl9mb290XzQgPSByZXF1aXJlKFwiLi9xaW4tZm9vdFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlFpbkZvb3RcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHFpbl9mb290XzQuUWluRm9vdDsgfSB9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWluQXJtID0gZXhwb3J0cy5RaW5EcmFnQ2FsbHMgPSBleHBvcnRzLlFpbldhaXRlcnMgPSBleHBvcnRzLlFpbkV2ZW50ID0gdm9pZCAwO1xuY29uc3QgcWluX3NraW5fMSA9IHJlcXVpcmUoXCIuL3Fpbi1za2luXCIpO1xuY2xhc3MgUWluRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZyb21PcmlnaW4gPSBudWxsO1xuICAgICAgICB0aGlzLmZyb21UeXBpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mcm9tUG9pbnRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNBbHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNDdHJsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzU2hpZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNNZXRhID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNFbnRlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRXNjYXBlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRG91YmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNMb25nID0gZmFsc2U7XG4gICAgICAgIHRoaXMua2V5VHlwZWQgPSBcIlwiO1xuICAgICAgICB0aGlzLnBvaW50T25YID0gLTE7XG4gICAgICAgIHRoaXMucG9pbnRPblkgPSAtMTtcbiAgICAgICAgdGhpcy5pc0ZpcnN0QnV0dG9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNNaWRkbGVCdXR0b24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1NlY29uZEJ1dHRvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzT25lRmluZ2VyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNUd29GaW5nZXJzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNUaHJlZUZpbmdlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdG9wRXZlbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgc2V0RnJvbUtleWJvYXJkKGV2KSB7XG4gICAgICAgIHRoaXMuZnJvbU9yaWdpbiA9IGV2LnRhcmdldDtcbiAgICAgICAgdGhpcy5mcm9tVHlwaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNBbHQgPSBldi5hbHRLZXk7XG4gICAgICAgIHRoaXMuaGFzQ3RybCA9IGV2LmN0cmxLZXk7XG4gICAgICAgIHRoaXMuaGFzU2hpZnQgPSBldi5zaGlmdEtleTtcbiAgICAgICAgdGhpcy5oYXNNZXRhID0gZXYubWV0YUtleTtcbiAgICAgICAgdGhpcy5pc0VudGVyID0gaXNLZXlFbnRlcihldik7XG4gICAgICAgIHRoaXMuaXNFc2NhcGUgPSBpc0tleUVzY2FwZShldik7XG4gICAgICAgIHRoaXMuaXNTcGFjZSA9IGlzS2V5U3BhY2UoZXYpO1xuICAgICAgICB0aGlzLmtleVR5cGVkID0gZXYua2V5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0RnJvbU1vdXNlKGV2KSB7XG4gICAgICAgIHRoaXMuZnJvbU9yaWdpbiA9IGV2LnRhcmdldDtcbiAgICAgICAgdGhpcy5mcm9tUG9pbnRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmhhc0FsdCA9IGV2LmFsdEtleTtcbiAgICAgICAgdGhpcy5oYXNDdHJsID0gZXYuY3RybEtleTtcbiAgICAgICAgdGhpcy5oYXNTaGlmdCA9IGV2LnNoaWZ0S2V5O1xuICAgICAgICB0aGlzLmhhc01ldGEgPSBldi5tZXRhS2V5O1xuICAgICAgICB0aGlzLnBvaW50T25YID0gZXYuY2xpZW50WDtcbiAgICAgICAgdGhpcy5wb2ludE9uWSA9IGV2LmNsaWVudFk7XG4gICAgICAgIHRoaXMuaXNGaXJzdEJ1dHRvbiA9IGV2LmJ1dHRvbiA9PSAwO1xuICAgICAgICB0aGlzLmlzTWlkZGxlQnV0dG9uID0gZXYuYnV0dG9uID09IDE7XG4gICAgICAgIHRoaXMuaXNTZWNvbmRCdXR0b24gPSBldi5idXR0b24gPT0gMjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldEZyb21Ub3VjaChldikge1xuICAgICAgICB0aGlzLmZyb21PcmlnaW4gPSBldi50YXJnZXQ7XG4gICAgICAgIHRoaXMuZnJvbVBvaW50aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNBbHQgPSBldi5hbHRLZXk7XG4gICAgICAgIHRoaXMuaGFzQ3RybCA9IGV2LmN0cmxLZXk7XG4gICAgICAgIHRoaXMuaGFzU2hpZnQgPSBldi5zaGlmdEtleTtcbiAgICAgICAgdGhpcy5oYXNNZXRhID0gZXYubWV0YUtleTtcbiAgICAgICAgaWYgKGV2LnRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gKGV2LnRvdWNoZXMubGVuZ3RoIC8gMikgfCAwO1xuICAgICAgICAgICAgdGhpcy5wb2ludE9uWCA9IGV2LnRvdWNoZXNbaW5kZXhdLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLnBvaW50T25ZID0gZXYudG91Y2hlc1tpbmRleF0uY2xpZW50WTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzT25lRmluZ2VyID0gZXYudG91Y2hlcy5sZW5ndGggPT0gMTtcbiAgICAgICAgdGhpcy5pc1R3b0ZpbmdlcnMgPSBldi50b3VjaGVzLmxlbmd0aCA9PSAyO1xuICAgICAgICB0aGlzLmlzVGhyZWVGaW5nZXJzID0gZXYudG91Y2hlcy5sZW5ndGggPT0gMztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuc3RvcEV2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgaXNQcmltYXJ5KCkge1xuICAgICAgICBpZiAodGhpcy5mcm9tVHlwaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0VudGVyIHx8IHRoaXMuaXNTcGFjZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmZyb21Qb2ludGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNGaXJzdEJ1dHRvbiB8fCB0aGlzLmlzT25lRmluZ2VyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNBdXhpbGlhcnkoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyb21UeXBpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc0N0cmwgJiYgdGhpcy5oYXNBbHQgJiYgdGhpcy5pc1NwYWNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZnJvbVBvaW50aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc01pZGRsZUJ1dHRvbiB8fCB0aGlzLmlzVGhyZWVGaW5nZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNTZWNvbmRhcnkoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyb21UeXBpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc0N0cmwgJiYgIXRoaXMuaGFzQWx0ICYmIHRoaXMuaXNTcGFjZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmZyb21Qb2ludGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNTZWNvbmRCdXR0b24gfHwgdGhpcy5pc1R3b0ZpbmdlcnM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuUWluRXZlbnQgPSBRaW5FdmVudDtcbjtcbmNsYXNzIFFpbldhaXRlcnMge1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgdGhpcy53YWl0ZXJzID0gaW5pdGlhbCA/IGluaXRpYWwgOiBbXTtcbiAgICB9XG4gICAgYWRkV2FpdGVyKHdhaXRlcikge1xuICAgICAgICB0aGlzLndhaXRlcnMucHVzaCh3YWl0ZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaGFzV2FpdGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0ZXJzLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIHNlbmRXYWl0ZXJzKHJlc3VsdCkge1xuICAgICAgICBmb3IgKGNvbnN0IHdhaXRlciBvZiB0aGlzLndhaXRlcnMpIHtcbiAgICAgICAgICAgIHdhaXRlcihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5RaW5XYWl0ZXJzID0gUWluV2FpdGVycztcbmNsYXNzIFFpbkRyYWdDYWxscyB7XG59XG5leHBvcnRzLlFpbkRyYWdDYWxscyA9IFFpbkRyYWdDYWxscztcbmZ1bmN0aW9uIHN0b3BFdmVudChldmVudCkge1xuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbn1cbnZhciBsYXN0RXZlbnRQb2ludGVyID0gbnVsbDtcbmZ1bmN0aW9uIG1ha2VFdmVudFBvaW50ZXIoaXNEb3duLCBldikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgcG9zWDogMCxcbiAgICAgICAgcG9zWTogMCxcbiAgICB9O1xuICAgIGlmIChldiBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2LmNsaWVudFggfHwgZXYuY2xpZW50WSkge1xuICAgICAgICAgICAgcmVzdWx0LnBvc1ggPSBldi5jbGllbnRYO1xuICAgICAgICAgICAgcmVzdWx0LnBvc1kgPSBldi5jbGllbnRZO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGV2IGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgICBpZiAoZXYudG91Y2hlcyAmJlxuICAgICAgICAgICAgZXYudG91Y2hlc1swXSAmJlxuICAgICAgICAgICAgKGV2LnRvdWNoZXNbMF0uY2xpZW50WCB8fCBldi50b3VjaGVzWzBdLmNsaWVudFkpKSB7XG4gICAgICAgICAgICByZXN1bHQucG9zWCA9IGV2LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgIHJlc3VsdC5wb3NZID0gZXYudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc0Rvd24pIHtcbiAgICAgICAgbGFzdEV2ZW50UG9pbnRlciA9IGV2O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaXNFdmVudFBvaW50ZXJEb3VibGUoaXNEb3duLCBldikge1xuICAgIGlmICghaXNEb3duIHx8IGxhc3RFdmVudFBvaW50ZXIgPT0gbnVsbCB8fCBldiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGltZURpZiA9IGV2LnRpbWVTdGFtcCAtIGxhc3RFdmVudFBvaW50ZXIudGltZVN0YW1wO1xuICAgIHJldHVybiB0aW1lRGlmIDwgNDUwO1xufVxuZnVuY3Rpb24gaXNFdmVudFBvaW50ZXJMb25nKGlzRG93biwgZXYpIHtcbiAgICBpZiAoIWlzRG93biB8fCBsYXN0RXZlbnRQb2ludGVyID09IG51bGwgfHwgZXYgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVEaWYgPSBldi50aW1lU3RhbXAgLSBsYXN0RXZlbnRQb2ludGVyLnRpbWVTdGFtcDtcbiAgICByZXR1cm4gdGltZURpZiA+IDg0MDtcbn1cbmZ1bmN0aW9uIGlzS2V5SW5MaXN0KGV2LCBsaXN0KSB7XG4gICAgbGV0IGtleUxvd2VyID0gZXYua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGxpc3QuaW5kZXhPZihrZXlMb3dlcikgPiAtMTtcbn1cbmZ1bmN0aW9uIGlzS2V5RW50ZXIoZXYpIHtcbiAgICByZXR1cm4gaXNLZXlJbkxpc3QoZXYsIFtcImVudGVyXCIsIFwicmV0dXJuXCJdKSB8fCBldi5rZXlDb2RlID09PSAxMztcbn1cbmZ1bmN0aW9uIGlzS2V5RXNjYXBlKGV2KSB7XG4gICAgcmV0dXJuIGlzS2V5SW5MaXN0KGV2LCBbXCJlc2NcIiwgXCJlc2NhcGVcIl0pIHx8IGV2LmtleUNvZGUgPT09IDI3O1xufVxuZnVuY3Rpb24gaXNLZXlTcGFjZShldikge1xuICAgIHJldHVybiBpc0tleUluTGlzdChldiwgW1wiIFwiLCBcInNwYWNlXCIsIFwic3BhY2ViYXJcIl0pIHx8IGV2LmtleUNvZGUgPT09IDMyO1xufVxuZnVuY3Rpb24gYWRkQWN0aW9uKGVsZW1lbnQsIGFjdGlvbikge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgc3RvcEV2ZW50KTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBhY3Rpb25LZXlib2FyZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHN0b3BFdmVudCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBhY3Rpb25Nb3VzZSk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBzdG9wRXZlbnQpO1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGFjdGlvblRvdWNoKTtcbiAgICBmdW5jdGlvbiBhY3Rpb25LZXlib2FyZChldikge1xuICAgICAgICBsZXQgcWluRXZlbnQgPSBuZXcgUWluRXZlbnQoKS5zZXRGcm9tS2V5Ym9hcmQoZXYpO1xuICAgICAgICBhY3Rpb24ocWluRXZlbnQpO1xuICAgICAgICBpZiAocWluRXZlbnQuc3RvcEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFjdGlvbk1vdXNlKGV2KSB7XG4gICAgICAgIGxldCBxaW5FdmVudCA9IG5ldyBRaW5FdmVudCgpLnNldEZyb21Nb3VzZShldik7XG4gICAgICAgIGFjdGlvbihxaW5FdmVudCk7XG4gICAgICAgIGlmIChxaW5FdmVudC5zdG9wRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYWN0aW9uVG91Y2goZXYpIHtcbiAgICAgICAgbGV0IHFpbkV2ZW50ID0gbmV3IFFpbkV2ZW50KCkuc2V0RnJvbVRvdWNoKGV2KTtcbiAgICAgICAgYWN0aW9uKHFpbkV2ZW50KTtcbiAgICAgICAgaWYgKHFpbkV2ZW50LnN0b3BFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZEFjdGlvbkVudGVyKGVsZW1lbnQsIGFjdGlvbikge1xuICAgIGVsZW1lbnQub25rZXlkb3duID0gYWN0aW9uS2V5Ym9hcmQ7XG4gICAgZnVuY3Rpb24gYWN0aW9uS2V5Ym9hcmQoZXYpIHtcbiAgICAgICAgaWYgKGlzS2V5RW50ZXIoZXYpKSB7XG4gICAgICAgICAgICBhY3Rpb24obmV3IFFpbkV2ZW50KCkuc2V0RnJvbUtleWJvYXJkKGV2KSk7XG4gICAgICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHB1dEFjdGlvblByb3h5KGRlc3RpbnksIG9yaWdpbnMpIHtcbiAgICBmb3IgKGNvbnN0IG9yaWdpbiBvZiBvcmlnaW5zKSB7XG4gICAgICAgIG9yaWdpbi5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XG4gICAgICAgICAgICBkZXN0aW55Lm9ua2V5ZG93bihlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9yaWdpbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHtcbiAgICAgICAgICAgIGRlc3Rpbnkub25tb3VzZXVwKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgb3JpZ2luLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBlID0+IHtcbiAgICAgICAgICAgIGRlc3Rpbnkub250b3VjaGVuZChlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkTW92ZXIoc291cmNlcywgdGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRFdmVudFggPSAwO1xuICAgIHZhciBkcmFnSW5pdEV2ZW50WSA9IDA7XG4gICAgdmFyIGRyYWdJbml0UG9zWCA9IDA7XG4gICAgdmFyIGRyYWdJbml0UG9zWSA9IDA7XG4gICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLm9ubW91c2Vkb3duID0gb25Nb3ZlckluaXQ7XG4gICAgICAgIHNvdXJjZS5vbnRvdWNoc3RhcnQgPSBvbk1vdmVySW5pdDtcbiAgICAgICAgc291cmNlLm9uZHJhZ3N0YXJ0ID0gc3RvcEV2ZW50O1xuICAgIH1cbiAgICBmdW5jdGlvbiBvbk1vdmVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdEV2ZW50WCA9IHBvaW50ZXIucG9zWDtcbiAgICAgICAgZHJhZ0luaXRFdmVudFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdJbml0UG9zWCA9IHBhcnNlSW50KHRhcmdldC5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgIGRyYWdJbml0UG9zWSA9IHBhcnNlSW50KHRhcmdldC5zdHlsZS50b3AsIDEwKTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaG1vdmUgPSBvbk1vdmVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvbk1vdmVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG9uTW92ZXJDbG9zZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gb25Nb3ZlckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3Zlck1vdmUoZXYpIHtcbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIoZmFsc2UsIGV2KTtcbiAgICAgICAgdmFyIGRyYWdEaWZYID0gcG9pbnRlci5wb3NYIC0gZHJhZ0luaXRFdmVudFg7XG4gICAgICAgIHZhciBkcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0RXZlbnRZO1xuICAgICAgICB2YXIgZHJhZ0ZpbmFsWCA9IGRyYWdJbml0UG9zWCArIGRyYWdEaWZYO1xuICAgICAgICB2YXIgZHJhZ0ZpbmFsWSA9IGRyYWdJbml0UG9zWSArIGRyYWdEaWZZO1xuICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IChkcmFnRmluYWxYID4gMCA/IGRyYWdGaW5hbFggOiAwKSArIFwicHhcIjtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IChkcmFnRmluYWxZID4gMCA/IGRyYWdGaW5hbFkgOiAwKSArIFwicHhcIjtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25Nb3ZlKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW92ZXJDbG9zZShldikge1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNobW92ZSA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaGVuZCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGw7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5zaG93QWxsSUZyYW1lcygpO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25FbmQpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZFJlc2l6ZXIoc291cmNlcywgdGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRFdmVudFggPSAwO1xuICAgIHZhciBkcmFnSW5pdEV2ZW50WSA9IDA7XG4gICAgdmFyIGRyYWdJbml0V2lkdGggPSAwO1xuICAgIHZhciBkcmFnSW5pdEhlaWdodCA9IDA7XG4gICAgZm9yIChsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLm9ubW91c2Vkb3duID0gb25SZXNpemVySW5pdDtcbiAgICAgICAgc291cmNlLm9udG91Y2hzdGFydCA9IG9uUmVzaXplckluaXQ7XG4gICAgICAgIHNvdXJjZS5vbmRyYWdzdGFydCA9IHN0b3BFdmVudDtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25SZXNpemVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdEV2ZW50WCA9IHBvaW50ZXIucG9zWDtcbiAgICAgICAgZHJhZ0luaXRFdmVudFkgPSBwb2ludGVyLnBvc1k7XG4gICAgICAgIGRyYWdJbml0V2lkdGggPSBwYXJzZUludCh0YXJnZXQuc3R5bGUud2lkdGgsIDEwKTtcbiAgICAgICAgZHJhZ0luaXRIZWlnaHQgPSBwYXJzZUludCh0YXJnZXQuc3R5bGUuaGVpZ2h0LCAxMCk7XG4gICAgICAgIGRvY3VtZW50Lm9udG91Y2htb3ZlID0gb25SZXNpemVyTW92ZTtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBvblJlc2l6ZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gb25SZXNpemVyQ2xvc2U7XG4gICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG9uUmVzaXplckNsb3NlO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uaGlkZUFsbElGcmFtZXMoKTtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25TdGFydCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uU3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25SZXNpemVyTW92ZShldikge1xuICAgICAgICBjb25zdCBwb2ludGVyID0gbWFrZUV2ZW50UG9pbnRlcihmYWxzZSwgZXYpO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRGlmWCA9IHBvaW50ZXIucG9zWCAtIGRyYWdJbml0RXZlbnRYO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0RXZlbnRZO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRmluYWxXaWR0aCA9IGRyYWdJbml0V2lkdGggKyBmcmFtZURyYWdEaWZYO1xuICAgICAgICB2YXIgZnJhbWVEcmFnRmluYWxIZWlnaHQgPSBkcmFnSW5pdEhlaWdodCArIGZyYW1lRHJhZ0RpZlk7XG4gICAgICAgIHRhcmdldC5zdHlsZS53aWR0aCA9IChmcmFtZURyYWdGaW5hbFdpZHRoID4gMCA/IGZyYW1lRHJhZ0ZpbmFsV2lkdGggOiAwKSArIFwicHhcIjtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9XG4gICAgICAgICAgICAoZnJhbWVEcmFnRmluYWxIZWlnaHQgPiAwID8gZnJhbWVEcmFnRmluYWxIZWlnaHQgOiAwKSArIFwicHhcIjtcbiAgICAgICAgaWYgKGRyYWdDYWxscyAmJiBkcmFnQ2FsbHMub25Nb3ZlKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Nb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUmVzaXplckNsb3NlKGV2KSB7XG4gICAgICAgIGRvY3VtZW50Lm9udG91Y2htb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcbiAgICAgICAgcWluX3NraW5fMS5RaW5Ta2luLnNob3dBbGxJRnJhbWVzKCk7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkVuZCkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0b3BFdmVudChldik7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkU2Nyb2xsZXIodGFyZ2V0LCBkcmFnQ2FsbHMpIHtcbiAgICB2YXIgZHJhZ0luaXRYID0gMDtcbiAgICB2YXIgZHJhZ0luaXRZID0gMDtcbiAgICB2YXIgZHJhZ1Njcm9sbFggPSAwO1xuICAgIHZhciBkcmFnU2Nyb2xsWSA9IDA7XG4gICAgdGFyZ2V0Lm9uZHJhZ3N0YXJ0ID0gc3RvcEV2ZW50O1xuICAgIHRhcmdldC5vbnRvdWNoc3RhcnQgPSBvblNjcm9sbGVySW5pdDtcbiAgICB0YXJnZXQub25tb3VzZWRvd24gPSBvblNjcm9sbGVySW5pdDtcbiAgICBmdW5jdGlvbiBvblNjcm9sbGVySW5pdChldikge1xuICAgICAgICBpZiAoZG9jdW1lbnQub25tb3VzZW1vdmUgfHwgZG9jdW1lbnQub250b3VjaG1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vbkRvdWJsZSAmJiBpc0V2ZW50UG9pbnRlckRvdWJsZSh0cnVlLCBldikpIHtcbiAgICAgICAgICAgIGRyYWdDYWxscy5vbkRvdWJsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTG9uZyAmJiBpc0V2ZW50UG9pbnRlckxvbmcodHJ1ZSwgZXYpKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25Mb25nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9IG1ha2VFdmVudFBvaW50ZXIodHJ1ZSwgZXYpO1xuICAgICAgICBkcmFnSW5pdFggPSBwb2ludGVyLnBvc1g7XG4gICAgICAgIGRyYWdJbml0WSA9IHBvaW50ZXIucG9zWTtcbiAgICAgICAgZHJhZ1Njcm9sbFggPSB0YXJnZXQuc2Nyb2xsTGVmdDtcbiAgICAgICAgZHJhZ1Njcm9sbFkgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNobW92ZSA9IG9uU2Nyb2xsZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG9uU2Nyb2xsZXJNb3ZlO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gb25TY3JvbGxlckNsb3NlO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBvblNjcm9sbGVyQ2xvc2U7XG4gICAgICAgIHFpbl9za2luXzEuUWluU2tpbi5oaWRlQWxsSUZyYW1lcygpO1xuICAgICAgICBpZiAoZHJhZ0NhbGxzICYmIGRyYWdDYWxscy5vblN0YXJ0KSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25TdGFydCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblNjcm9sbGVyTW92ZShldikge1xuICAgICAgICBjb25zdCBwb2ludGVyID0gbWFrZUV2ZW50UG9pbnRlcihmYWxzZSwgZXYpO1xuICAgICAgICB2YXIgZHJhZ0RpZlggPSBwb2ludGVyLnBvc1ggLSBkcmFnSW5pdFg7XG4gICAgICAgIHZhciBkcmFnRGlmWSA9IHBvaW50ZXIucG9zWSAtIGRyYWdJbml0WTtcbiAgICAgICAgdmFyIGRyYWdOZXdYID0gZHJhZ1Njcm9sbFggLSBkcmFnRGlmWDtcbiAgICAgICAgdmFyIGRyYWdOZXdZID0gZHJhZ1Njcm9sbFkgLSBkcmFnRGlmWTtcbiAgICAgICAgdGFyZ2V0LnNjcm9sbFRvKGRyYWdOZXdYLCBkcmFnTmV3WSk7XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uTW92ZSkge1xuICAgICAgICAgICAgZHJhZ0NhbGxzLm9uTW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdG9wRXZlbnQoZXYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblNjcm9sbGVyQ2xvc2UoZXYpIHtcbiAgICAgICAgZG9jdW1lbnQub250b3VjaG1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbnRvdWNoZW5kID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgICBxaW5fc2tpbl8xLlFpblNraW4uc2hvd0FsbElGcmFtZXMoKTtcbiAgICAgICAgcWluX3NraW5fMS5RaW5Ta2luLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChkcmFnQ2FsbHMgJiYgZHJhZ0NhbGxzLm9uRW5kKSB7XG4gICAgICAgICAgICBkcmFnQ2FsbHMub25FbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcEV2ZW50KGV2KTtcbiAgICB9XG59XG5leHBvcnRzLlFpbkFybSA9IHtcbiAgICBzdG9wRXZlbnQsXG4gICAgbWFrZUV2ZW50UG9pbnRlcixcbiAgICBpc0V2ZW50UG9pbnRlckRvdWJsZSxcbiAgICBpc0V2ZW50UG9pbnRlckxvbmcsXG4gICAgaXNLZXlJbkxpc3QsXG4gICAgaXNLZXlFbnRlcixcbiAgICBpc0tleVNwYWNlLFxuICAgIGFkZEFjdGlvbixcbiAgICBhZGRBY3Rpb25FbnRlcixcbiAgICBwdXRBY3Rpb25Qcm94eSxcbiAgICBhZGRNb3ZlcixcbiAgICBhZGRSZXNpemVyLFxuICAgIGFkZFNjcm9sbGVyLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1hcm0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkJvZHkgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSwgb3JEZWZhdWx0KSB7XG4gICAgbGV0IGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoXCI7XCIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY29va2llUGFpciA9IGNvb2tpZXNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICBpZiAobmFtZSA9PSBkZWNvZGVVUklDb21wb25lbnQoY29va2llUGFpclswXSkudHJpbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVBhaXJbMV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvckRlZmF1bHQ7XG59XG5mdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgcGF0aDogXCIvXCIgfSwgb3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLmV4cGlyZXMpIHtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAxICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IGRhdGU7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmV4cGlyZXMgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBsZXQgdXBkYXRlZENvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICBmb3IgKGxldCBvcHRpb25LZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB1cGRhdGVkQ29va2llICs9IFwiOyBcIiArIG9wdGlvbktleTtcbiAgICAgICAgbGV0IG9wdGlvblZhbHVlID0gb3B0aW9uc1tvcHRpb25LZXldO1xuICAgICAgICBpZiAob3B0aW9uVmFsdWUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHVwZGF0ZWRDb29raWUgKz0gXCI9XCIgKyBvcHRpb25WYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSB1cGRhdGVkQ29va2llO1xufVxuZnVuY3Rpb24gZ2V0VGV4dExpbmVzKGZyb21UZXh0KSB7XG4gICAgcmV0dXJuIGZyb21UZXh0Lm1hdGNoKC9bXlxcclxcbl0rL2cpO1xufVxuZnVuY3Rpb24gZ2V0Q1NWUm93cyhmcm9tVGV4dCwgbmFtZXMpIHtcbiAgICB2YXIgbGluZXMgPSBnZXRUZXh0TGluZXMoZnJvbVRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICAgIGxldCByb3cgPSAhbmFtZXMgPyBbXSA6IHt9O1xuICAgICAgICBsZXQgaW5zaWRlX3F1b3RlcyA9IGZhbHNlO1xuICAgICAgICBsZXQgY29sdW1uX3ZhbHVlID0gXCJcIjtcbiAgICAgICAgbGV0IGNvbHVtbl9pbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGNoYXJfaW5kZXggPSAwOyBjaGFyX2luZGV4IDwgbGluZS5sZW5ndGg7IGNoYXJfaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGFjdHVhbCA9IGxpbmUuY2hhckF0KGNoYXJfaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGluc2lkZV9xdW90ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsID09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHQgPSBjaGFyX2luZGV4IDwgbGluZS5sZW5ndGggLSAxID8gbGluZS5jaGFyQXQoY2hhcl9pbmRleCArIDEpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT0gJ1wiJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uX3ZhbHVlICs9IGFjdHVhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJfaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2lkZV9xdW90ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX3ZhbHVlICs9IGFjdHVhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsID09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zaWRlX3F1b3RlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFjdHVhbCA9PSBcIixcIikge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fdmFsdWUgPSB1bm1hc2tTcGVjaWFsQ2hhcnMoY29sdW1uX3ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuYW1lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goY29sdW1uX3ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb2x1bW5fbmFtZSA9IFwiY29sX1wiICsgY29sdW1uX2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbl9uYW1lID0gbmFtZXNbY29sdW1uX2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tjb2x1bW5fbmFtZV0gPSBjb2x1bW5fdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX3ZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX2luZGV4Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fdmFsdWUgKz0gYWN0dWFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb2x1bW5fdmFsdWUgPSB1bm1hc2tTcGVjaWFsQ2hhcnMoY29sdW1uX3ZhbHVlKTtcbiAgICAgICAgaWYgKCFuYW1lcykge1xuICAgICAgICAgICAgcm93LnB1c2goY29sdW1uX3ZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uX25hbWUgPSBcImNvbF9cIiArIGNvbHVtbl9pbmRleDtcbiAgICAgICAgICAgIGlmIChjb2x1bW5faW5kZXggPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5fbmFtZSA9IG5hbWVzW2NvbHVtbl9pbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dbY29sdW1uX25hbWVdID0gY29sdW1uX3ZhbHVlO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocm93KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbWFza1NwZWNpYWxDaGFycyhmcm9tVGV4dCkge1xuICAgIHJldHVybiBmcm9tVGV4dFxuICAgICAgICAucmVwbGFjZShcIlxcXFxcIiwgXCJcXFxcXFxcXFwiKVxuICAgICAgICAucmVwbGFjZShcIlxcclwiLCBcIlxcXFxyXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiXFxuXCIsIFwiXFxcXG5cIilcbiAgICAgICAgLnJlcGxhY2UoXCJcXHRcIiwgXCJcXFxcdFwiKTtcbn1cbmZ1bmN0aW9uIHVubWFza1NwZWNpYWxDaGFycyhmcm9tVGV4dCkge1xuICAgIHJldHVybiBmcm9tVGV4dFxuICAgICAgICAucmVwbGFjZShcIlxcXFxcXFxcXCIsIFwiXFxcXFwiKVxuICAgICAgICAucmVwbGFjZShcIlxcXFxyXCIsIFwiXFxyXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiXFxcXG5cIiwgXCJcXG5cIilcbiAgICAgICAgLnJlcGxhY2UoXCJcXFxcdFwiLCBcIlxcdFwiKTtcbn1cbmZ1bmN0aW9uIHBhcnNlUGFyYW1ldGVycyhzb3VyY2UpIHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgbGV0IG9wZW4gPSBmYWxzZTtcbiAgICBsZXQgYWN0dWFsID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGxldHRlciBvZiBBcnJheS5mcm9tKHNvdXJjZSkpIHtcbiAgICAgICAgaWYgKG9wZW4pIHtcbiAgICAgICAgICAgIGlmIChsZXR0ZXIgPT0gJ1wiJykge1xuICAgICAgICAgICAgICAgIG9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0dWFsICs9IGxldHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsZXR0ZXIgPT0gJ1wiJykge1xuICAgICAgICAgICAgICAgIG9wZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChhY3R1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYWN0dWFsKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsZXR0ZXIgPT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0dWFsICs9IGxldHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5RaW5Cb2R5ID0ge1xuICAgIGdldENvb2tpZSxcbiAgICBzZXRDb29raWUsXG4gICAgZ2V0VGV4dExpbmVzLFxuICAgIGdldENTVlJvd3MsXG4gICAgbWFza1NwZWNpYWxDaGFycyxcbiAgICB1bm1hc2tTcGVjaWFsQ2hhcnMsXG4gICAgcGFyc2VQYXJhbWV0ZXJzLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXFpbi1ib2R5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RaW5Gb290ID0gZXhwb3J0cy5RaW5GaWxlc0Rlc2NyaXB0b3IgPSBleHBvcnRzLlFpbkZpbGVzT3BlcmF0aW9uID0gZXhwb3J0cy5RaW5GaWxlc05hdHVyZSA9IHZvaWQgMDtcbnZhciBRaW5GaWxlc05hdHVyZTtcbihmdW5jdGlvbiAoUWluRmlsZXNOYXR1cmUpIHtcbiAgICBRaW5GaWxlc05hdHVyZVtcIkJPVEhcIl0gPSBcImJvdGhcIjtcbiAgICBRaW5GaWxlc05hdHVyZVtcIkRJUkVDVE9SSUVTXCJdID0gXCJkaXJlY3Rvcmllc1wiO1xuICAgIFFpbkZpbGVzTmF0dXJlW1wiRklMRVNcIl0gPSBcImZpbGVzXCI7XG59KShRaW5GaWxlc05hdHVyZSA9IGV4cG9ydHMuUWluRmlsZXNOYXR1cmUgfHwgKGV4cG9ydHMuUWluRmlsZXNOYXR1cmUgPSB7fSkpO1xudmFyIFFpbkZpbGVzT3BlcmF0aW9uO1xuKGZ1bmN0aW9uIChRaW5GaWxlc09wZXJhdGlvbikge1xuICAgIFFpbkZpbGVzT3BlcmF0aW9uW1wiT1BFTlwiXSA9IFwib3BlblwiO1xuICAgIFFpbkZpbGVzT3BlcmF0aW9uW1wiU0FWRVwiXSA9IFwic2F2ZVwiO1xufSkoUWluRmlsZXNPcGVyYXRpb24gPSBleHBvcnRzLlFpbkZpbGVzT3BlcmF0aW9uIHx8IChleHBvcnRzLlFpbkZpbGVzT3BlcmF0aW9uID0ge30pKTtcbmNsYXNzIFFpbkZpbGVzRGVzY3JpcHRvciB7XG59XG5leHBvcnRzLlFpbkZpbGVzRGVzY3JpcHRvciA9IFFpbkZpbGVzRGVzY3JpcHRvcjtcbmZ1bmN0aW9uIGdldExvY2F0aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbn1cbmZ1bmN0aW9uIGlzTG9jYWxIb3N0KCkge1xuICAgIHZhciBsb2NhdGlvbiA9IGdldExvY2F0aW9uKCk7XG4gICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24uaW5kZXhPZihcIjovL1wiKTtcbiAgICBpZiAoc3RhcnQgPT0gLTEpIHtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhcnQgKz0gMztcbiAgICB9XG4gICAgbG9jYXRpb24gPSBsb2NhdGlvbi5zdWJzdHJpbmcoc3RhcnQpO1xuICAgIHJldHVybiBsb2NhdGlvbi5pbmRleE9mKFwibG9jYWxob3N0XCIpID09PSAwIHx8IGxvY2F0aW9uLmluZGV4T2YoXCIxMjcuMC4wLjFcIikgPT09IDA7XG59XG5mdW5jdGlvbiBnZXRTZXBhcmF0b3Iob2ZQYXRoKSB7XG4gICAgbGV0IHJlc3VsdCA9IFwiL1wiO1xuICAgIGlmIChvZlBhdGggJiYgb2ZQYXRoLmluZGV4T2YoXCJcXFxcXCIpID4gLTEpIHtcbiAgICAgICAgcmVzdWx0ID0gXCJcXFxcXCI7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBnZXRQYXRoSm9pbihwYXRoQSwgcGF0aEIpIHtcbiAgICBpZiAocGF0aEEgPT0gbnVsbCB8fCBwYXRoQSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGF0aEEgPSBcIlwiO1xuICAgIH1cbiAgICBpZiAocGF0aEIgPT0gbnVsbCB8fCBwYXRoQiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGF0aEIgPSBcIlwiO1xuICAgIH1cbiAgICBpZiAocGF0aEEubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIHBhdGhCO1xuICAgIH1cbiAgICBlbHNlIGlmIChwYXRoQi5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gcGF0aEE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgdW5pb24gPSBcIi9cIjtcbiAgICAgICAgaWYgKHBhdGhBLmluZGV4T2YoXCJcXFxcXCIpID4gLTEgfHwgcGF0aEIuaW5kZXhPZihcIlxcXFxcIikgPiAtMSkge1xuICAgICAgICAgICAgdW5pb24gPSBcIlxcXFxcIjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGF0aEFFbmQgPSBwYXRoQS5zdWJzdHJpbmcocGF0aEEubGVuZ3RoIC0gMSwgcGF0aEEubGVuZ3RoKTtcbiAgICAgICAgbGV0IHBhdGhCU3RhcnQgPSBwYXRoQi5zdWJzdHJpbmcoMCwgMSk7XG4gICAgICAgIGlmIChwYXRoQUVuZCA9PSB1bmlvbiB8fCBwYXRoQlN0YXJ0ID09IHVuaW9uKSB7XG4gICAgICAgICAgICB1bmlvbiA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGhBICsgdW5pb24gKyBwYXRoQjtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRSb290KHBhdGgpIHtcbiAgICBpZiAocGF0aCkge1xuICAgICAgICBsZXQgc2VwYXJhdG9yID0gZ2V0U2VwYXJhdG9yKHBhdGgpO1xuICAgICAgICBsZXQgbGFzdCA9IHBhdGgubGFzdEluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICAgICAgaWYgKGxhc3QgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3Vic3RyaW5nKDAsIGxhc3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufVxuZnVuY3Rpb24gZ2V0U3RlbShwYXRoKSB7XG4gICAgaWYgKHBhdGgpIHtcbiAgICAgICAgbGV0IHNlcGFyYXRvciA9IGdldFNlcGFyYXRvcihwYXRoKTtcbiAgICAgICAgbGV0IGxhc3QgPSBwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvcik7XG4gICAgICAgIGlmIChsYXN0ID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnN1YnN0cmluZyhsYXN0ICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59XG5mdW5jdGlvbiBnZXRGaWxlRXh0ZW5zaW9uKG5hbWUpIHtcbiAgICBsZXQgcG9zaXRpb24gPSBuYW1lLmxhc3RJbmRleE9mKFwiLlwiKTtcbiAgICBpZiAocG9zaXRpb24gPiAtMSkge1xuICAgICAgICByZXR1cm4gbmFtZS5zdWJzdHJpbmcocG9zaXRpb24gKyAxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbn1cbmNvbnN0IGFwcHNFeHRlbnNpb25zID0gW1xuICAgIFwiaHRtXCIsIFwiaHRtbFwiLCBcImNzc1wiLCBcImpzXCIsIFwianN4XCIsIFwidHNcIiwgXCJ0c3hcIiwgXCJwaHRtbFwiXG5dO1xuZnVuY3Rpb24gaXNGaWxlQXBwKGV4dGVuc2lvbikge1xuICAgIHJldHVybiBhcHBzRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmNvbnN0IGNtZHNFeHRlbnNpb25zID0gW1xuICAgIFwiaFwiLCBcImNcIiwgXCJocHBcIiwgXCJjcHBcIiwgXCJyc1wiLCBcImpsXCIsXG4gICAgXCJjc1wiLCBcImNzcHJvalwiLCBcImZzXCIsIFwibWxcIiwgXCJmc2lcIiwgXCJtbGlcIiwgXCJmc3hcIiwgXCJmc3NjcmlwdFwiLFxuICAgIFwiamF2YVwiLCBcImd5XCIsIFwiZ3Z5XCIsIFwiZ3Jvb3Z5XCIsIFwic2NcIiwgXCJzY2FsYVwiLCBcImNsalwiLFxuICAgIFwicHlcIiwgXCJydWJ5XCIsIFwicGhwXCIsIFwicGh0bWxcIixcbl07XG5mdW5jdGlvbiBpc0ZpbGVDbWQoZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIGNtZHNFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgZXhlY0V4dGVuc2lvbnMgPSBbXG4gICAgXCJleGVcIiwgXCJqYXJcIiwgXCJjb21cIiwgXCJiYXRcIiwgXCJzaFwiXG5dO1xuZnVuY3Rpb24gaXNGaWxlRXhlYyhleHRlbnNpb24pIHtcbiAgICByZXR1cm4gZXhlY0V4dGVuc2lvbnMuaW5kZXhPZihleHRlbnNpb24pID4gLTE7XG59XG5jb25zdCBpbWFnZUV4dGVuc2lvbnMgPSBbXG4gICAgXCJqcGdcIiwgXCJqcGVnXCIsIFwicG5nXCIsIFwiZ2lmXCIsIFwiYm1wXCJcbl07XG5mdW5jdGlvbiBpc0ZpbGVJbWFnZShleHRlbnNpb24pIHtcbiAgICByZXR1cm4gaW1hZ2VFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgdmVjdG9yRXh0ZW5zaW9ucyA9IFtcbiAgICBcInN2Z1wiXG5dO1xuZnVuY3Rpb24gaXNGaWxlVmVjdG9yKGV4dGVuc2lvbikge1xuICAgIHJldHVybiB2ZWN0b3JFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgbW92aWVFeHRlbnNpb25zID0gW1xuICAgIFwiYXZpXCIsIFwibXA0XCJcbl07XG5mdW5jdGlvbiBpc0ZpbGVNb3ZpZShleHRlbnNpb24pIHtcbiAgICByZXR1cm4gbW92aWVFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgbXVzaWNFeHRlbnNpb25zID0gW1xuICAgIFwid2F2XCIsIFwibXAzXCJcbl07XG5mdW5jdGlvbiBpc0ZpbGVNdXNpYyhleHRlbnNpb24pIHtcbiAgICByZXR1cm4gbXVzaWNFeHRlbnNpb25zLmluZGV4T2YoZXh0ZW5zaW9uKSA+IC0xO1xufVxuY29uc3QgemlwcGVkRXh0ZW5zaW9ucyA9IFtcbiAgICBcInppcFwiLCBcInJhclwiLCBcIjd6XCIsIFwidGFyXCIsIFwiZ3pcIlxuXTtcbmZ1bmN0aW9uIGlzRmlsZVppcHBlZChleHRlbnNpb24pIHtcbiAgICByZXR1cm4gemlwcGVkRXh0ZW5zaW9ucy5pbmRleE9mKGV4dGVuc2lvbikgPiAtMTtcbn1cbmV4cG9ydHMuUWluRm9vdCA9IHtcbiAgICBnZXRMb2NhdGlvbixcbiAgICBpc0xvY2FsSG9zdCxcbiAgICBnZXRTZXBhcmF0b3IsXG4gICAgZ2V0UGF0aEpvaW4sXG4gICAgZ2V0Um9vdCxcbiAgICBnZXRTdGVtLFxuICAgIGdldEZpbGVFeHRlbnNpb24sXG4gICAgaXNGaWxlQXBwLFxuICAgIGlzRmlsZUNtZCxcbiAgICBpc0ZpbGVFeGVjLFxuICAgIGlzRmlsZUltYWdlLFxuICAgIGlzRmlsZVZlY3RvcixcbiAgICBpc0ZpbGVNb3ZpZSxcbiAgICBpc0ZpbGVNdXNpYyxcbiAgICBpc0ZpbGVaaXBwZWQsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLWZvb3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpbkhlYWQgPSBleHBvcnRzLlFpbkdyYW5kZXVyID0gZXhwb3J0cy5RaW5Cb3VuZHMgPSBleHBvcnRzLlFpbkRpbWVuc2lvbiA9IGV4cG9ydHMuUWluUG9pbnQgPSB2b2lkIDA7XG5jbGFzcyBRaW5Qb2ludCB7XG59XG5leHBvcnRzLlFpblBvaW50ID0gUWluUG9pbnQ7XG47XG5jbGFzcyBRaW5EaW1lbnNpb24ge1xufVxuZXhwb3J0cy5RaW5EaW1lbnNpb24gPSBRaW5EaW1lbnNpb247XG47XG5jbGFzcyBRaW5Cb3VuZHMge1xufVxuZXhwb3J0cy5RaW5Cb3VuZHMgPSBRaW5Cb3VuZHM7XG47XG52YXIgUWluR3JhbmRldXI7XG4oZnVuY3Rpb24gKFFpbkdyYW5kZXVyKSB7XG4gICAgUWluR3JhbmRldXJbXCJTTUFMTFwiXSA9IFwic21hbGxcIjtcbiAgICBRaW5HcmFuZGV1cltcIk1FRElVTVwiXSA9IFwibWVkaXVtXCI7XG4gICAgUWluR3JhbmRldXJbXCJMQVJHRVwiXSA9IFwibGFyZ2VcIjtcbn0pKFFpbkdyYW5kZXVyID0gZXhwb3J0cy5RaW5HcmFuZGV1ciB8fCAoZXhwb3J0cy5RaW5HcmFuZGV1ciA9IHt9KSk7XG5mdW5jdGlvbiBnZXREZXNrQVBJKCkge1xuICAgIHZhciB3aW4gPSB3aW5kb3c7XG4gICAgaWYgKHdpbi5kZXNrQVBJKSB7XG4gICAgICAgIHJldHVybiB3aW4uZGVza0FQSTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbiA9IHdpbmRvdy5wYXJlbnQ7XG4gICAgfVxuICAgIGlmICh3aW4uZGVza0FQSSkge1xuICAgICAgICByZXR1cm4gd2luLmRlc2tBUEk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW4gPSB3aW5kb3cudG9wO1xuICAgIH1cbiAgICBpZiAod2luLmRlc2tBUEkpIHtcbiAgICAgICAgcmV0dXJuIHdpbi5kZXNrQVBJO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuY29uc3QgbG9nZ2VkID0gW107XG5mdW5jdGlvbiBnZXRMb2dnZWQoKSB7XG4gICAgcmV0dXJuIGxvZ2dlZDtcbn1cbmZ1bmN0aW9uIGxvZyhtZXNzYWdlKSB7XG4gICAgbG9nZ2VkLnB1c2gobWVzc2FnZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuICAgIGNhdGNoIChfKSB7IH1cbiAgICB0cnkge1xuICAgICAgICBnZXREZXNrQVBJKCkuc2VuZChcImxvZ09uTWFpblwiLCBtZXNzYWdlKTtcbiAgICB9XG4gICAgY2F0Y2ggKF8pIHsgfVxufVxuZnVuY3Rpb24gbG9nRXJyb3IoZXJyb3IsIG9yaWdpbikge1xuICAgIGxvZyhnZXRFcnJvck1lc3NhZ2UoZXJyb3IsIG9yaWdpbikpO1xufVxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGVycm9yLCBvcmlnaW4pIHtcbiAgICByZXR1cm4gZ2V0VHJlYXRNZXNzYWdlKFwiUHJvYmxlbSB3aXRoOlwiLCBlcnJvciwgb3JpZ2luKTtcbn1cbmZ1bmN0aW9uIGxvZ1dhcm5pbmcoZXJyb3IsIG9yaWdpbikge1xuICAgIGxvZyhnZXRXYXJuaW5nTWVzc2FnZShlcnJvciwgb3JpZ2luKSk7XG59XG5mdW5jdGlvbiBnZXRXYXJuaW5nTWVzc2FnZShlcnJvciwgb3JpZ2luKSB7XG4gICAgcmV0dXJuIGdldFRyZWF0TWVzc2FnZShcIkNoZWNrb3V0IHRoaXM6XCIsIGVycm9yLCBvcmlnaW4pO1xufVxuZnVuY3Rpb24gbG9nU3VwcG9ydChlcnJvciwgb3JpZ2luKSB7XG4gICAgbG9nKGdldFN1cHBvcnRNZXNzYWdlKGVycm9yLCBvcmlnaW4pKTtcbn1cbmZ1bmN0aW9uIGdldFN1cHBvcnRNZXNzYWdlKGVycm9yLCBvcmlnaW4pIHtcbiAgICByZXR1cm4gZ2V0VHJlYXRNZXNzYWdlKFwiTmVlZCBTdXBwb3J0IG9uOlwiLCBlcnJvciwgb3JpZ2luKTtcbn1cbmZ1bmN0aW9uIGdldFRyZWF0TWVzc2FnZShwcmVmaXgsIGVycm9yLCBvcmlnaW4pIHtcbiAgICB2YXIgcmVzdWx0ID0gcHJlZml4ICsgKGVycm9yID8gXCIgXCIgKyBlcnJvci50b1N0cmluZygpIDogXCJcIik7XG4gICAgaWYgKGVycm9yLnJlc3BvbnNlICYmIGVycm9yLnJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgdmFyIGVycm9yRGF0YSA9IGVycm9yLnJlc3BvbnNlLmRhdGE7XG4gICAgICAgIGlmICghKHR5cGVvZiBlcnJvckRhdGEgPT0gXCJzdHJpbmdcIiB8fCBlcnJvckRhdGEgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICBlcnJvckRhdGEgPSBKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBcIiAtIERhdGE6IFwiICsgZXJyb3JEYXRhO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCEodHlwZW9mIGVycm9yID09IFwic3RyaW5nXCIgfHwgZXJyb3IgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gXCIgLSBEYXRhOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAob3JpZ2luKSB7XG4gICAgICAgIHJlc3VsdCArPSBcIiAtIE9yaWdpbjogXCIgKyBvcmlnaW47XG4gICAgfVxuICAgIGNvbnN0IHN0YWNrID0gKG5ldyBFcnJvcihcIlwiKSkuc3RhY2s7XG4gICAgaWYgKHN0YWNrKSB7XG4gICAgICAgIHJlc3VsdCArPSBcIiAtIFN0YWNrOiBcIiArIHN0YWNrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gdG9nZ2xlRGV2VG9vbHMoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgZ2V0RGVza0FQSSgpLnNlbmQoXCJ0b2dnbGVEZXZUb29sc1wiKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nRXJyb3IoZSwgXCJ7cWlucGVsLXJlc30oRXJyQ29kZS0wMDAwMDEpXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuUWluSGVhZCA9IHtcbiAgICBnZXREZXNrQVBJLFxuICAgIGdldExvZ2dlZCxcbiAgICBsb2csXG4gICAgbG9nRXJyb3IsXG4gICAgZ2V0RXJyb3JNZXNzYWdlLFxuICAgIGxvZ1dhcm5pbmcsXG4gICAgZ2V0V2FybmluZ01lc3NhZ2UsXG4gICAgbG9nU3VwcG9ydCxcbiAgICBnZXRTdXBwb3J0TWVzc2FnZSxcbiAgICBnZXRUcmVhdE1lc3NhZ2UsXG4gICAgdG9nZ2xlRGV2VG9vbHMsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cWluLWhlYWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlFpblNraW4gPSBleHBvcnRzLlFpblN0eWxlcyA9IHZvaWQgMDtcbmNvbnN0IHFpbl9hcm1fMSA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5jb25zdCBxaW5faGVhZF8xID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5leHBvcnRzLlFpblN0eWxlcyA9IHtcbiAgICBDb2xvckZvcmVncm91bmQ6IFwiIzI3MDAzNlwiLFxuICAgIENvbG9yQmFja2dyb3VuZDogXCIjZmZmYWVmXCIsXG4gICAgQ29sb3JJbmFjdGl2ZTogXCIjZmFlZmZmXCIsXG4gICAgQ29sb3JBY3RpdmU6IFwiI2ZhY2RjZFwiLFxuICAgIEZvbnROYW1lOiBcIlNvdXJjZVNhbnNQcm9cIixcbiAgICBGb250U2l6ZTogXCIxNnB4XCIsXG59O1xuZnVuY3Rpb24gc3R5bGVBc0JvZHkoZWwpIHtcbiAgICBlbC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBlbC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgIGVsLnN0eWxlLnJpZ2h0ID0gXCIwcHhcIjtcbiAgICBlbC5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgIGVsLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgIGVsLnN0eWxlLnBhZGRpbmcgPSBcIjlweFwiO1xuICAgIGVsLnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCI7XG59XG5mdW5jdGlvbiBzdHlsZUFzRWRpdChlbCkge1xuICAgIGVsLnN0eWxlLm1hcmdpbiA9IFwiMXB4XCI7XG4gICAgZWwuc3R5bGUucGFkZGluZyA9IFwiM3B4XCI7XG4gICAgZWwuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xuICAgIGVsLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICMyNzAwMzZcIjtcbiAgICBlbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjNweFwiO1xuICAgIGVsLnN0eWxlLmNvbG9yID0gXCIjMjcwMDM2XCI7XG4gICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZmZmZmXCI7XG4gICAgZWwuc3R5bGUuZm9udEZhbWlseSA9IFwiU291cmNlU2Fuc1Byb1wiO1xuICAgIGVsLnN0eWxlLmZvbnRTaXplID0gXCIxNnB4XCI7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmYWVmZmZcIjtcbiAgICAgICAgZWwuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgI2FlMDAwMFwiO1xuICAgIH0pO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCAoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcbiAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZmZmZmXCI7XG4gICAgICAgIGVsLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICMyNzAwMzZcIjtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHN0eWxlTWF4U2l6ZUZvck5vdE92ZXJGbG93KGVsLCBwYXJlbnQpIHtcbiAgICBjb25zb2xlLmxvZyhcIkQxXCIpO1xuICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgIHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRDI6IFwiICsgcGFyZW50KTtcbiAgICB9XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICBsZXQgbWF4V2lkdGggPSAwO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgICAgICAgbGV0IGltZWRpYXRlID0gZWw7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gbWF4V2lkdGggKyBpbWVkaWF0ZS5jbGllbnRMZWZ0O1xuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gbWF4SGVpZ2h0ICsgaW1lZGlhdGUuY2xpZW50VG9wO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEMzogXCIgKyBtYXhXaWR0aCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkQ0OiBcIiArIG1heEhlaWdodCk7XG4gICAgICAgICAgICBpbWVkaWF0ZSA9IGltZWRpYXRlLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH0gd2hpbGUgKGltZWRpYXRlICE9IG51bGwgJiYgaW1lZGlhdGUgIT0gcGFyZW50KTtcbiAgICAgICAgbWF4V2lkdGggPSBwYXJlbnQuY2xpZW50V2lkdGggLSBtYXhXaWR0aDtcbiAgICAgICAgbWF4SGVpZ2h0ID0gcGFyZW50LmNsaWVudEhlaWdodCAtIG1heEhlaWdodDtcbiAgICAgICAgY29uc29sZS5sb2coXCJENTogXCIgKyBtYXhXaWR0aCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRDY6IFwiICsgbWF4SGVpZ2h0KTtcbiAgICAgICAgZWwuc3R5bGUubWF4V2lkdGggPSBtYXhXaWR0aCArIFwicHhcIjtcbiAgICAgICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gbWF4SGVpZ2h0ICsgXCJweFwiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN0eWxlU2l6ZShlbCwgc2l6ZSkge1xuICAgIGlmIChzaXplKSB7XG4gICAgICAgIGlmIChzaXplIGluc3RhbmNlb2YgcWluX2hlYWRfMS5RaW5EaW1lbnNpb24pIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLndpZHRoID0gc2l6ZS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsLnN0eWxlLmhlaWdodCA9IHNpemUuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGRpbSA9IGdldERpbWVuc2lvblNpemUoc2l6ZSk7XG4gICAgICAgICAgICBlbC5zdHlsZS53aWR0aCA9IGRpbS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsLnN0eWxlLmhlaWdodCA9IGRpbS5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzdHlsZUZsZXhNYXgoZWwpIHtcbiAgICBlbC5zdHlsZS5mbGV4ID0gXCIxXCI7XG59XG5mdW5jdGlvbiBzdHlsZUZsZXhNaW4oZWwpIHtcbiAgICBlbC5zdHlsZS5mbGV4ID0gXCIwXCI7XG59XG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0LFxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplU3R5bGUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSBnZXRXaW5kb3dTaXplKCkud2lkdGg7XG4gICAgaWYgKHdpZHRoIDwgNjAwKSB7XG4gICAgICAgIHJldHVybiBxaW5faGVhZF8xLlFpbkdyYW5kZXVyLlNNQUxMO1xuICAgIH1cbiAgICBlbHNlIGlmICh3aWR0aCA8IDEwMDApIHtcbiAgICAgICAgcmV0dXJuIHFpbl9oZWFkXzEuUWluR3JhbmRldXIuTUVESVVNO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHFpbl9oZWFkXzEuUWluR3JhbmRldXIuTEFSR0U7XG4gICAgfVxufVxuZnVuY3Rpb24gaGlkZUFsbElGcmFtZXMoKSB7XG4gICAgdmFyIGRvY19pZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpZnJhbWVcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb2NfaWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZG9jX2lmcmFtZSA9IGRvY19pZnJhbWVzW2ldO1xuICAgICAgICBkb2NfaWZyYW1lLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNob3dBbGxJRnJhbWVzKCkge1xuICAgIHZhciBkb2NfaWZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWZyYW1lXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jX2lmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGRvY19pZnJhbWUgPSBkb2NfaWZyYW1lc1tpXTtcbiAgICAgICAgZG9jX2lmcmFtZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgfVxufVxuZnVuY3Rpb24gZGlzYWJsZVNlbGVjdGlvbihlbGVtZW50KSB7XG4gICAgZWxlbWVudC5zdHlsZS51c2VyU2VsZWN0ID0gXCJub25lXCI7XG4gICAgZWxlbWVudC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gXCJub25lXCI7XG4gICAgZWxlbWVudC5vbnNlbGVjdHN0YXJ0ID0gcWluX2FybV8xLlFpbkFybS5zdG9wRXZlbnQ7XG59XG5mdW5jdGlvbiBjbGVhclNlbGVjdGlvbigpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH0sIDM2MCk7XG59XG5mdW5jdGlvbiBpc0VsZW1lbnRWaXNpYmxlSW5TY3JvbGwoZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0VG9wIDwgZWxlbWVudC5wYXJlbnRFbGVtZW50LnNjcm9sbFRvcCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldExlZnQgPCBlbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmNsaWVudFdpZHRoID5cbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAtXG4gICAgICAgICAgICAgICAgKGVsZW1lbnQub2Zmc2V0TGVmdCAtIGVsZW1lbnQucGFyZW50RWxlbWVudC5zY3JvbGxMZWZ0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmNsaWVudEhlaWdodCA+XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC1cbiAgICAgICAgICAgICAgICAoZWxlbWVudC5vZmZzZXRUb3AgLSBlbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gZ2V0RGltZW5zaW9uU2l6ZShzaXplKSB7XG4gICAgaWYgKHNpemUgPT0gcWluX2hlYWRfMS5RaW5HcmFuZGV1ci5MQVJHRSkge1xuICAgICAgICByZXR1cm4gZ2V0RGltZW5zaW9uTGFyZ2UoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2l6ZSA9PSBxaW5faGVhZF8xLlFpbkdyYW5kZXVyLk1FRElVTSkge1xuICAgICAgICByZXR1cm4gZ2V0RGltZW5zaW9uTWVkaXVtKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZ2V0RGltZW5zaW9uU21hbGwoKTtcbiAgICB9XG59XG5jb25zdCBkaW1lbnNpb25TbWFsbCA9IHtcbiAgICB3aWR0aDogMTYsXG4gICAgaGVpZ2h0OiAxNixcbn07XG5mdW5jdGlvbiBnZXREaW1lbnNpb25TbWFsbCgpIHtcbiAgICByZXR1cm4gZGltZW5zaW9uU21hbGw7XG59XG5jb25zdCBkaW1lbnNpb25NZWRpdW0gPSB7XG4gICAgd2lkdGg6IDMyLFxuICAgIGhlaWdodDogMzIsXG59O1xuZnVuY3Rpb24gZ2V0RGltZW5zaW9uTWVkaXVtKCkge1xuICAgIHJldHVybiBkaW1lbnNpb25NZWRpdW07XG59XG5jb25zdCBkaW1lbnNpb25MYXJnZSA9IHtcbiAgICB3aWR0aDogNjQsXG4gICAgaGVpZ2h0OiA2NCxcbn07XG5mdW5jdGlvbiBnZXREaW1lbnNpb25MYXJnZSgpIHtcbiAgICByZXR1cm4gZGltZW5zaW9uTGFyZ2U7XG59XG5leHBvcnRzLlFpblNraW4gPSB7XG4gICAgc3R5bGVzOiBleHBvcnRzLlFpblN0eWxlcyxcbiAgICBzdHlsZUFzQm9keSxcbiAgICBzdHlsZUFzRWRpdCxcbiAgICBzdHlsZU1heFNpemVGb3JOb3RPdmVyRmxvdyxcbiAgICBzdHlsZVNpemUsXG4gICAgc3R5bGVGbGV4TWF4LFxuICAgIHN0eWxlRmxleE1pbixcbiAgICBnZXRXaW5kb3dTaXplLFxuICAgIGdldFdpbmRvd1NpemVTdHlsZSxcbiAgICBoaWRlQWxsSUZyYW1lcyxcbiAgICBzaG93QWxsSUZyYW1lcyxcbiAgICBkaXNhYmxlU2VsZWN0aW9uLFxuICAgIGNsZWFyU2VsZWN0aW9uLFxuICAgIGlzRWxlbWVudFZpc2libGVJblNjcm9sbCxcbiAgICBnZXREaW1lbnNpb25TaXplLFxuICAgIGdldERpbWVuc2lvblNtYWxsLFxuICAgIGdldERpbWVuc2lvbk1lZGl1bSxcbiAgICBnZXREaW1lbnNpb25MYXJnZSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tc2tpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUWluU291bCA9IHZvaWQgMDtcbmNvbnN0IHFpbl9hcm1fMSA9IHJlcXVpcmUoXCIuL3Fpbi1hcm1cIik7XG5jb25zdCBxaW5fYm9keV8xID0gcmVxdWlyZShcIi4vcWluLWJvZHlcIik7XG5jb25zdCBxaW5fZm9vdF8xID0gcmVxdWlyZShcIi4vcWluLWZvb3RcIik7XG5jb25zdCBxaW5faGVhZF8xID0gcmVxdWlyZShcIi4vcWluLWhlYWRcIik7XG5jb25zdCBxaW5fc2tpbl8xID0gcmVxdWlyZShcIi4vcWluLXNraW5cIik7XG5leHBvcnRzLlFpblNvdWwgPSB7XG4gICAgYXJtOiBxaW5fYXJtXzEuUWluQXJtLFxuICAgIGJvZHk6IHFpbl9ib2R5XzEuUWluQm9keSxcbiAgICBmb290OiBxaW5fZm9vdF8xLlFpbkZvb3QsXG4gICAgaGVhZDogcWluX2hlYWRfMS5RaW5IZWFkLFxuICAgIHNraW46IHFpbl9za2luXzEuUWluU2tpbixcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xaW4tc291bC5qcy5tYXAiXX0=
