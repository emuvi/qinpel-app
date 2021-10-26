"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinEvent = exports.QinDragCalls = exports.QinFilesDescriptor = exports.QinFilesOperation = exports.QinFilesNature = exports.QinStyles = exports.QinGrandeur = exports.QinBounds = exports.QinDimension = exports.QinPoint = void 0;
var QinPoint = (function () {
    function QinPoint() {
    }
    return QinPoint;
}());
exports.QinPoint = QinPoint;
;
var QinDimension = (function () {
    function QinDimension() {
    }
    return QinDimension;
}());
exports.QinDimension = QinDimension;
;
var QinBounds = (function () {
    function QinBounds() {
    }
    return QinBounds;
}());
exports.QinBounds = QinBounds;
;
var QinGrandeur;
(function (QinGrandeur) {
    QinGrandeur["SMALL"] = "small";
    QinGrandeur["MEDIUM"] = "medium";
    QinGrandeur["LARGE"] = "large";
})(QinGrandeur = exports.QinGrandeur || (exports.QinGrandeur = {}));
var QinStyles;
(function (QinStyles) {
    QinStyles["ColorBack"] = "#fff9ef";
    QinStyles["ColorFont"] = "#270036";
    QinStyles["FontName"] = "Poppins";
    QinStyles["FontSize"] = "12px";
})(QinStyles = exports.QinStyles || (exports.QinStyles = {}));
var QinFilesNature;
(function (QinFilesNature) {
    QinFilesNature["DIRECTORIES"] = "directories";
    QinFilesNature["FILES"] = "files";
    QinFilesNature["BOTH"] = "both";
})(QinFilesNature = exports.QinFilesNature || (exports.QinFilesNature = {}));
var QinFilesOperation;
(function (QinFilesOperation) {
    QinFilesOperation["OPEN"] = "open";
    QinFilesOperation["SAVE"] = "save";
})(QinFilesOperation = exports.QinFilesOperation || (exports.QinFilesOperation = {}));
var QinFilesDescriptor = (function () {
    function QinFilesDescriptor() {
    }
    return QinFilesDescriptor;
}());
exports.QinFilesDescriptor = QinFilesDescriptor;
var QinDragCalls = (function () {
    function QinDragCalls() {
    }
    return QinDragCalls;
}());
exports.QinDragCalls = QinDragCalls;
var QinEvent = (function () {
    function QinEvent() {
        this.fromTyping = false;
        this.fromPointing = false;
        this.hasAlt = false;
        this.hasCtrl = false;
        this.hasShift = false;
        this.hasMeta = false;
        this.isEnter = false;
        this.isEscape = false;
        this.isDouble = false;
        this.isLong = false;
        this.keyTyped = "";
        this.pointOnX = -1;
        this.pointOnY = -1;
        this.stopEvent = false;
    }
    QinEvent.prototype.setFromKeyboard = function (ev) {
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
    };
    QinEvent.prototype.setFromMouse = function (ev) {
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        this.pointOnX = ev.clientX;
        this.pointOnY = ev.clientY;
        return this;
    };
    QinEvent.prototype.setFromTouch = function (ev) {
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        if (ev.touches.length > 0) {
            this.pointOnX = ev.touches[0].clientX;
            this.pointOnY = ev.touches[0].clientY;
        }
        return this;
    };
    QinEvent.prototype.stop = function () {
        this.stopEvent = true;
    };
    return QinEvent;
}());
exports.QinEvent = QinEvent;
;
function log(message) {
    if (window.deskAPI) {
        window.deskAPI.send("logOnMain", message);
    }
    else {
        console.log(message);
    }
}
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
function getWindowSize() {
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
    };
}
function getWindowSizeStyle() {
    var width = getWindowSize().width;
    if (width < 600) {
        return QinGrandeur.SMALL;
    }
    else if (width < 1000) {
        return QinGrandeur.MEDIUM;
    }
    else {
        return QinGrandeur.LARGE;
    }
}
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
    var result = {
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
    var timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif < 450;
}
function isEventPointerLong(isDown, ev) {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    var timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif > 840;
}
function hideAllIFrames() {
    var doc_iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < doc_iframes.length; i++) {
        var doc_iframe = doc_iframes[i];
        doc_iframe.style.visibility = "hidden";
    }
}
function showAllIFrames() {
    var doc_iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < doc_iframes.length; i++) {
        var doc_iframe = doc_iframes[i];
        doc_iframe.style.visibility = "visible";
    }
}
function disableSelection(element) {
    element.style.userSelect = "none";
    element.style.webkitUserSelect = "none";
    element.onselectstart = stopEvent;
}
function clearSelection() {
    setTimeout(function () {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }, 360);
}
function isElementVisibleInScroll(element) {
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
    return true;
}
function isKeyInList(ev, list) {
    var keyLower = ev.key.toLowerCase();
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
function addKeyAction(element, action) {
    element.onkeydown = actionKeyboard;
    function actionKeyboard(ev) {
        if (isKeyEnter(ev)) {
            action(new QinEvent().setFromKeyboard(ev));
            return stopEvent(ev);
        }
    }
}
function addAction(element, action) {
    element.onkeydown = actionKeyboard;
    element.onmousedown = actionMouse;
    element.ontouchstart = actionTouch;
    function actionKeyboard(ev) {
        var qinEvent = new QinEvent().setFromKeyboard(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actionMouse(ev) {
        var qinEvent = new QinEvent().setFromMouse(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
    function actionTouch(ev) {
        var qinEvent = new QinEvent().setFromTouch(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        }
        else {
            return true;
        }
    }
}
function addMover(sources, target, dragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitPosX = 0;
    var dragInitPosY = 0;
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
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
        var pointer = makeEventPointer(true, ev);
        dragInitEventX = pointer.posX;
        dragInitEventY = pointer.posY;
        dragInitPosX = parseInt(target.style.left, 10);
        dragInitPosY = parseInt(target.style.top, 10);
        document.ontouchmove = onMoverMove;
        document.onmousemove = onMoverMove;
        document.ontouchend = onMoverClose;
        document.onmouseup = onMoverClose;
        hideAllIFrames();
        if (dragCalls && dragCalls.onStart) {
            dragCalls.onStart();
        }
        return stopEvent(ev);
    }
    function onMoverMove(ev) {
        var pointer = makeEventPointer(false, ev);
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
        showAllIFrames();
        clearSelection();
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
    for (var _i = 0, sources_2 = sources; _i < sources_2.length; _i++) {
        var source = sources_2[_i];
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
        var pointer = makeEventPointer(true, ev);
        dragInitEventX = pointer.posX;
        dragInitEventY = pointer.posY;
        dragInitWidth = parseInt(target.style.width, 10);
        dragInitHeight = parseInt(target.style.height, 10);
        document.ontouchmove = onResizerMove;
        document.onmousemove = onResizerMove;
        document.ontouchend = onResizerClose;
        document.onmouseup = onResizerClose;
        hideAllIFrames();
        if (dragCalls && dragCalls.onStart) {
            dragCalls.onStart();
        }
        return stopEvent(ev);
    }
    function onResizerMove(ev) {
        var pointer = makeEventPointer(false, ev);
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
        showAllIFrames();
        clearSelection();
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
        var pointer = makeEventPointer(true, ev);
        dragInitX = pointer.posX;
        dragInitY = pointer.posY;
        dragScrollX = target.scrollLeft;
        dragScrollY = target.scrollTop;
        document.ontouchmove = onScrollerMove;
        document.onmousemove = onScrollerMove;
        document.ontouchend = onScrollerClose;
        document.onmouseup = onScrollerClose;
        hideAllIFrames();
        if (dragCalls && dragCalls.onStart) {
            dragCalls.onStart();
        }
        return stopEvent(ev);
    }
    function onScrollerMove(ev) {
        var pointer = makeEventPointer(false, ev);
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
        showAllIFrames();
        clearSelection();
        if (dragCalls && dragCalls.onEnd) {
            dragCalls.onEnd();
        }
        return stopEvent(ev);
    }
}
function applyStyleAsBody(el) {
    el.style.position = "absolute";
    el.style.top = "0px";
    el.style.right = "0px";
    el.style.bottom = "0px";
    el.style.left = "0px";
    el.style.overflow = "auto";
}
var iconSmall = {
    width: 16,
    height: 16,
};
function getIconDimension(size) {
    if (size == QinGrandeur.LARGE) {
        return getIconLarge();
    }
    else if (size == QinGrandeur.MEDIUM) {
        return getIconMedium();
    }
    else {
        return getIconSmall();
    }
}
function getIconSmall() {
    return iconSmall;
}
var iconMedium = {
    width: 32,
    height: 32,
};
function getIconMedium() {
    return iconMedium;
}
var iconLarge = {
    width: 64,
    height: 64,
};
function getIconLarge() {
    return iconLarge;
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
        var union = "/";
        if (pathA.indexOf("\\") > -1 || pathB.indexOf("\\") > -1) {
            union = "\\";
        }
        var pathAEnd = pathA.substring(pathA.length - 1, pathA.length);
        var pathBStart = pathB.substring(0, 1);
        if (pathAEnd == union || pathBStart == union) {
            union = "";
        }
        return pathA + union + pathB;
    }
}
function getFileExtension(name) {
    var position = name.lastIndexOf(".");
    if (position > -1) {
        return name.substring(position + 1);
    }
    else {
        return "";
    }
}
var appsExtensions = ["htm", "html", "css", "js", "jsx", "ts", "tsx", "phtml"];
var cmdsExtensions = [
    "h", "c", "hpp", "cpp", "rs", "jl",
    "cs", "csproj", "fs", "ml", "fsi", "mli", "fsx", "fsscript",
    "java", "gy", "gvy", "groovy", "sc", "scala", "clj",
    "py", "ruby", "php", "phtml",
];
var execExtensions = ["exe", "jar", "com", "bat", "sh"];
var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
var vectorExtensions = ["svg"];
var movieExtensions = ["avi", "mp4"];
var musicExtensions = ["wav", "mp3"];
var zippedExtensions = ["zip", "rar", "7z", "tar", "gz"];
function isFileApp(extension) {
    return appsExtensions.indexOf(extension) > -1;
}
function isFileCmd(extension) {
    return cmdsExtensions.indexOf(extension) > -1;
}
function isFileExec(extension) {
    return execExtensions.indexOf(extension) > -1;
}
function isFileImage(extension) {
    return imageExtensions.indexOf(extension) > -1;
}
function isFileVector(extension) {
    return vectorExtensions.indexOf(extension) > -1;
}
function isFileMovie(extension) {
    return movieExtensions.indexOf(extension) > -1;
}
function isFileMusic(extension) {
    return musicExtensions.indexOf(extension) > -1;
}
function isFileZipped(extension) {
    return zippedExtensions.indexOf(extension) > -1;
}
function getTextLines(fromText) {
    return fromText.match(/[^\r\n]+/g);
}
function getCSVRows(fromText, names) {
    var lines = getTextLines(fromText);
    var result = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var row = (!names) ? [] : {};
        var inside_quotes = false;
        var column_value = "";
        var column_index = 0;
        for (var char_index = 0; char_index < line.length; char_index++) {
            var actual = line.charAt(char_index);
            if (inside_quotes) {
                if (actual == '"') {
                    var next = char_index < line.length - 1 ? line.charAt(char_index + 1) : "";
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
                        var column_name = "col_" + column_index;
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
            var column_name = "col_" + column_index;
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
function getErrorMessage(error, origin) {
    var result = "Problem with " + error;
    if (error.response && error.response.data) {
        result += " - Data: " + error.response.data;
    }
    if (origin) {
        result += " - Origin: " + origin;
    }
    return result;
}
function toggleDevTools() {
    if (window.deskAPI) {
        window.deskAPI.send("toggleDevTools");
    }
    else {
        log("Can not toggle DevTools without the deskAPI.");
    }
}
var utils = {
    log: log,
    getLocation: getLocation,
    isLocalHost: isLocalHost,
    getWindowSize: getWindowSize,
    getWindowSizeStyle: getWindowSizeStyle,
    stopEvent: stopEvent,
    makeEventPointer: makeEventPointer,
    hideAllIFrames: hideAllIFrames,
    showAllIFrames: showAllIFrames,
    disableSelection: disableSelection,
    clearSelection: clearSelection,
    isElementVisibleInScroll: isElementVisibleInScroll,
    isKeyInList: isKeyInList,
    isKeyEnter: isKeyEnter,
    isKeyEscape: isKeyEscape,
    addAction: addAction,
    addKeyAction: addKeyAction,
    addMover: addMover,
    addResizer: addResizer,
    addScroller: addScroller,
    applyStyleAsBody: applyStyleAsBody,
    getIconDimension: getIconDimension,
    getIconSmall: getIconSmall,
    getIconMedium: getIconMedium,
    getIconLarge: getIconLarge,
    getPathJoin: getPathJoin,
    getFileExtension: getFileExtension,
    isFileApp: isFileApp,
    isFileCmd: isFileCmd,
    isFileExec: isFileExec,
    isFileImage: isFileImage,
    isFileVector: isFileVector,
    isFileMusic: isFileMusic,
    isFileMovie: isFileMovie,
    isFileZipped: isFileZipped,
    getTextLines: getTextLines,
    getCSVRows: getCSVRows,
    maskSpecialChars: maskSpecialChars,
    unmaskSpecialChars: unmaskSpecialChars,
    getErrorMessage: getErrorMessage,
    toggleDevTools: toggleDevTools,
};
exports.default = utils;
//# sourceMappingURL=utils.js.map