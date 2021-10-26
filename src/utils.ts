export class QinPoint {
    posX: number;
    posY: number;
};

export class QinDimension {
    width: number;
    height: number;
};

export class QinBounds {
    posX: number;
    posY: number;
    width: number;
    height: number;
};

export enum QinGrandeur {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
}

export enum QinStyles {
    ColorBack = "#fff9ef",
    ColorFont = "#270036",
    FontName = "Poppins",
    FontSize = "12px",
}

export enum QinFilesNature {
    DIRECTORIES = "directories",
    FILES = "files",
    BOTH = "both",
}

export enum QinFilesOperation {
    OPEN = "open",
    SAVE = "save",
}

export class QinFilesDescriptor {
    public description: string;
    public extensions: string[];
}

export class QinDragCalls {
    onDouble?: CallableFunction;
    onLong?: CallableFunction;
    onStart?: CallableFunction;
    onMove?: CallableFunction;
    onEnd?: CallableFunction;
}

export class QinEvent {

    public fromTyping: boolean;
    public fromPointing: boolean;
    public hasAlt: boolean;
    public hasCtrl: boolean;
    public hasShift: boolean;
    public hasMeta: boolean;
    public isEnter: boolean;
    public isEscape: boolean;
    public isSpace: boolean;
    public isDouble: boolean; // TODO
    public isLong: boolean;   // TODO
    public keyTyped: string;
    public pointOnX: number;
    public pointOnY: number;
    public stopEvent: boolean;

    constructor() {
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

    setFromKeyboard(ev: KeyboardEvent): QinEvent {
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

    setFromMouse(ev: MouseEvent): QinEvent {
        this.fromPointing = true;
        this.hasAlt = ev.altKey;
        this.hasCtrl = ev.ctrlKey;
        this.hasShift = ev.shiftKey;
        this.hasMeta = ev.metaKey;
        this.pointOnX = ev.clientX;
        this.pointOnY = ev.clientY;
        return this;
    }

    setFromTouch(ev: TouchEvent): QinEvent {
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
    }

    public stop() {
        this.stopEvent = true;
    }
};

export type QinAction = (event: QinEvent) => void;

function log(message) {
    // @ts-ignore
    if (window.deskAPI) {
        // @ts-ignore
        window.deskAPI.send("logOnMain", message);
    } else {
        console.log(message);
    }
}

function getLocation() {
    return window.location.href;
}

function isLocalHost() {
    var location = getLocation();
    var start = location.indexOf("://");
    if (start == -1) { start = 0; }
    else { start += 3 }
    location = location.substring(start);
    return location.indexOf("localhost") === 0 || location.indexOf("127.0.0.1") === 0
}

function getWindowSize(): QinDimension {
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
    };
}

function getWindowSizeStyle(): QinGrandeur {
    const width = getWindowSize().width;
    if (width < 600) {
        return QinGrandeur.SMALL;
    } else if (width < 1000) {
        return QinGrandeur.MEDIUM;
    } else {
        return QinGrandeur.LARGE;
    }
}

function stopEvent(event: any) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    event.cancelBubble = true;
    return false;
}

var lastEventPointer: MouseEvent | TouchEvent = null;

function makeEventPointer(isDown: boolean, ev: MouseEvent | TouchEvent): QinPoint {
    const result = {
        posX: 0,
        posY: 0,
    };
    if (ev instanceof MouseEvent) {
        if (ev.clientX || ev.clientY) {
            result.posX = ev.clientX;
            result.posY = ev.clientY;
        }
    } else if (ev instanceof TouchEvent) {
        if (
            ev.touches &&
            ev.touches[0] &&
            (ev.touches[0].clientX || ev.touches[0].clientY)
        ) {
            result.posX = ev.touches[0].clientX;
            result.posY = ev.touches[0].clientY;
        }
    }
    if (isDown) {
        lastEventPointer = ev;
    }
    return result;
}

function isEventPointerDouble(isDown: boolean, ev: MouseEvent | TouchEvent): boolean {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif < 450;
}

function isEventPointerLong(isDown: boolean, ev: MouseEvent | TouchEvent): boolean {
    if (!isDown || lastEventPointer == null || ev == null) {
        return false;
    }
    const timeDif = ev.timeStamp - lastEventPointer.timeStamp;
    return timeDif > 840;
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

function disableSelection(element: HTMLElement) {
    element.style.userSelect = "none";
    element.style.webkitUserSelect = "none";
    element.onselectstart = stopEvent;
}

function clearSelection() {
    setTimeout(() => {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }, 360);
}

function isElementVisibleInScroll(element: HTMLElement) {
    if (element.offsetTop < element.parentElement.scrollTop) {
        return false;
    }
    if (element.offsetLeft < element.parentElement.scrollLeft) {
        return false;
    }
    if (
        element.clientWidth >
        element.parentElement.clientWidth -
        (element.offsetLeft - element.parentElement.scrollLeft)
    ) {
        return false;
    }
    if (
        element.clientHeight >
        element.parentElement.clientHeight -
        (element.offsetTop - element.parentElement.scrollTop)
    ) {
        return false;
    }
    return true;
}

function isKeyInList(ev: KeyboardEvent, list: string[]): boolean {
    let keyLower = ev.key.toLowerCase();
    return list.indexOf(keyLower) > -1;
}

function isKeyEnter(ev: KeyboardEvent): boolean {
    return isKeyInList(ev, ["enter", "return"]) || ev.keyCode === 13;
}

function isKeyEscape(ev: KeyboardEvent): boolean {
    return isKeyInList(ev, ["esc", "escape"]) || ev.keyCode === 27;
}

function isKeySpace(ev: KeyboardEvent): boolean {
    return isKeyInList(ev, [" ", "space", "spacebar"]) || ev.keyCode === 32;
}

function addKeyAction(element: HTMLElement, action: QinAction) {
    element.onkeydown = actionKeyboard;

    function actionKeyboard(ev: KeyboardEvent) {
        if (isKeyEnter(ev)) {
            action(new QinEvent().setFromKeyboard(ev));
            return stopEvent(ev);
        }
    }
}

function addAction(element: HTMLElement, action: QinAction) {
    element.onkeydown = actionKeyboard;
    element.onmousedown = actionMouse;
    element.ontouchstart = actionTouch;

    function actionKeyboard(ev: KeyboardEvent) {
        let qinEvent = new QinEvent().setFromKeyboard(ev);
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        } else {
            return true;
        }
    }

    function actionMouse(ev: MouseEvent) {
        let qinEvent = new QinEvent().setFromMouse(ev)
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        } else {
            return true;
        }
    }

    function actionTouch(ev: TouchEvent) {
        let qinEvent = new QinEvent().setFromTouch(ev)
        action(qinEvent);
        if (qinEvent.stopEvent) {
            return stopEvent(ev);
        } else {
            return true;
        }
    }
}

function addMover(sources: HTMLElement[], target: HTMLElement,
    dragCalls?: QinDragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitPosX = 0;
    var dragInitPosY = 0;

    for (let source of sources) {
        source.onmousedown = onMoverInit;
        source.ontouchstart = onMoverInit;
        source.ondragstart = stopEvent;
    }

    function onMoverInit(ev: MouseEvent | TouchEvent) {
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
        hideAllIFrames();
        if (dragCalls && dragCalls.onStart) { dragCalls.onStart(); }
        return stopEvent(ev);
    }

    function onMoverMove(ev: MouseEvent | TouchEvent) {
        const pointer = makeEventPointer(false, ev);
        var dragDifX = pointer.posX - dragInitEventX;
        var dragDifY = pointer.posY - dragInitEventY;
        var dragFinalX = dragInitPosX + dragDifX;
        var dragFinalY = dragInitPosY + dragDifY;
        target.style.left = (dragFinalX > 0 ? dragFinalX : 0) + "px";
        target.style.top = (dragFinalY > 0 ? dragFinalY : 0) + "px";
        if (dragCalls && dragCalls.onMove) { dragCalls.onMove(); }
        return stopEvent(ev);
    }

    function onMoverClose(ev: MouseEvent | TouchEvent) {
        document.ontouchmove = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.onmouseup = null;
        showAllIFrames();
        clearSelection();
        if (dragCalls && dragCalls.onEnd) { dragCalls.onEnd(); }
        return stopEvent(ev);
    }

}

function addResizer(sources: HTMLElement[], target: HTMLElement,
    dragCalls?: QinDragCalls) {
    var dragInitEventX = 0;
    var dragInitEventY = 0;
    var dragInitWidth = 0;
    var dragInitHeight = 0;

    for (let source of sources) {
        source.onmousedown = onResizerInit;
        source.ontouchstart = onResizerInit;
        source.ondragstart = stopEvent;
    }

    function onResizerInit(ev: MouseEvent | TouchEvent) {
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
        hideAllIFrames();
        if (dragCalls && dragCalls.onStart) { dragCalls.onStart(); }
        return stopEvent(ev);
    }

    function onResizerMove(ev: MouseEvent | TouchEvent) {
        const pointer = makeEventPointer(false, ev);
        var frameDragDifX = pointer.posX - dragInitEventX;
        var frameDragDifY = pointer.posY - dragInitEventY;
        var frameDragFinalWidth = dragInitWidth + frameDragDifX;
        var frameDragFinalHeight = dragInitHeight + frameDragDifY;
        target.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
        target.style.height =
            (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
        if (dragCalls && dragCalls.onMove) { dragCalls.onMove(); }
        return stopEvent(ev);
    }

    function onResizerClose(ev: MouseEvent | TouchEvent) {
        document.ontouchmove = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.onmouseup = null;
        showAllIFrames();
        clearSelection();
        if (dragCalls && dragCalls.onEnd) { dragCalls.onEnd(); }
        return stopEvent(ev);
    }
}

function addScroller(target: HTMLElement, dragCalls?: QinDragCalls) {
    var dragInitX = 0;
    var dragInitY = 0;
    var dragScrollX = 0;
    var dragScrollY = 0;

    target.ondragstart = stopEvent;
    target.ontouchstart = onScrollerInit;
    target.onmousedown = onScrollerInit;

    function onScrollerInit(ev: MouseEvent | TouchEvent) {
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
        hideAllIFrames();
        if (dragCalls && dragCalls.onStart) { dragCalls.onStart(); }
        return stopEvent(ev);
    }

    function onScrollerMove(ev: MouseEvent | TouchEvent) {
        const pointer = makeEventPointer(false, ev);
        var dragDifX = pointer.posX - dragInitX;
        var dragDifY = pointer.posY - dragInitY;
        var dragNewX = dragScrollX - dragDifX;
        var dragNewY = dragScrollY - dragDifY;
        target.scrollTo(dragNewX, dragNewY);
        if (dragCalls && dragCalls.onMove) { dragCalls.onMove(); }
        return stopEvent(ev);
    }

    function onScrollerClose(ev: MouseEvent | TouchEvent) {
        document.ontouchmove = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
        showAllIFrames();
        clearSelection();
        if (dragCalls && dragCalls.onEnd) { dragCalls.onEnd(); }
        return stopEvent(ev);
    }

}

function applyStyleAsBody(el: HTMLDivElement) {
    el.style.position = "absolute";
    el.style.top = "0px";
    el.style.right = "0px";
    el.style.bottom = "0px";
    el.style.left = "0px";
    el.style.overflow = "auto";
}

const iconSmall: QinDimension = {
    width: 16,
    height: 16,
};

function getIconDimension(size: QinGrandeur): QinDimension {
    if (size == QinGrandeur.LARGE) {
        return getIconLarge();
    } else if (size == QinGrandeur.MEDIUM) {
        return getIconMedium();
    } else {
        return getIconSmall();
    }
}

function getIconSmall(): QinDimension {
    return iconSmall;
}

const iconMedium: QinDimension = {
    width: 32,
    height: 32,
};

function getIconMedium(): QinDimension {
    return iconMedium;
}

const iconLarge: QinDimension = {
    width: 64,
    height: 64,
};

function getIconLarge(): QinDimension {
    return iconLarge;
}

function getPathJoin(pathA: string, pathB: string): string {
    if (pathA == null || pathA == undefined) {
        pathA = "";
    }
    if (pathB == null || pathB == undefined) {
        pathB = "";
    }
    if (pathA.length == 0) {
        return pathB;
    } else if (pathB.length == 0) {
        return pathA;
    } else {
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

function getFileExtension(name: string): string {
    let position = name.lastIndexOf(".");
    if (position > -1) {
        return name.substring(position + 1);
    } else {
        return "";
    }
}

const appsExtensions = ["htm", "html", "css", "js", "jsx", "ts", "tsx", "phtml"];
const cmdsExtensions = [
    "h", "c", "hpp", "cpp", "rs", "jl",
    "cs", "csproj", "fs", "ml", "fsi", "mli", "fsx", "fsscript",
    "java", "gy", "gvy", "groovy", "sc", "scala", "clj",
    "py", "ruby", "php", "phtml",
];
const execExtensions = ["exe", "jar", "com", "bat", "sh"];
const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
const vectorExtensions = ["svg"];
const movieExtensions = ["avi", "mp4"];
const musicExtensions = ["wav", "mp3"];
const zippedExtensions = ["zip", "rar", "7z", "tar", "gz"];

function isFileApp(extension: string): boolean {
    return appsExtensions.indexOf(extension) > -1;
}

function isFileCmd(extension: string): boolean {
    return cmdsExtensions.indexOf(extension) > -1;
}

function isFileExec(extension: string): boolean {
    return execExtensions.indexOf(extension) > -1;
}

function isFileImage(extension: string): boolean {
    return imageExtensions.indexOf(extension) > -1;
}

function isFileVector(extension: string): boolean {
    return vectorExtensions.indexOf(extension) > -1;
}

function isFileMovie(extension: string): boolean {
    return movieExtensions.indexOf(extension) > -1;
}

function isFileMusic(extension: string): boolean {
    return musicExtensions.indexOf(extension) > -1;
}

function isFileZipped(extension: string): boolean {
    return zippedExtensions.indexOf(extension) > -1;
}

function getTextLines(fromText: string): string[] {
    return fromText.match(/[^\r\n]+/g);
}

function getCSVRows(fromText: string, names?: string[]): string[][] | object[] {
    var lines = getTextLines(fromText);
    var result: string[][] | object[] = [];
    for (let line of lines) {
        let row: string[] | object = (!names) ? [] : {};
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
                    } else {
                        inside_quotes = false;
                    }
                } else {
                    column_value += actual;
                }
            } else {
                if (actual == '"') {
                    inside_quotes = true;
                } else if (actual == ',') {
                    column_value = unmaskSpecialChars(column_value);
                    if (!names) {
                        (row as string[]).push(column_value);
                    } else {
                        let column_name = "col_" + column_index;
                        if (column_index < names.length) {
                            column_name = names[column_index];
                        }
                        (row as object)[column_name] = column_value;
                    }
                    column_value = "";
                    column_index++;
                } else {
                    column_value += actual;
                }
            }
        }
        column_value = unmaskSpecialChars(column_value);
        if (!names) {
            (row as string[]).push(column_value);
            (result as string[][]).push(row as string[]);
        } else {
            let column_name = "col_" + column_index;
            if (column_index < names.length) {
                column_name = names[column_index];
            }
            (row as object)[column_name] = column_value;
            (result as object[]).push(row as object);
        }
    }
    return result;
}

function maskSpecialChars(fromText: string): string {
    return fromText
        .replace("\\", "\\\\")
        .replace("\r", "\\r")
        .replace("\n", "\\n")
        .replace("\t", "\\t");
}

function unmaskSpecialChars(fromText: string): string {
    return fromText
        .replace("\\\\", "\\")
        .replace("\\r", "\r")
        .replace("\\n", "\n")
        .replace("\\t", "\t");
}

function getErrorMessage(error: any, origin?: string) {
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
    // @ts-ignore
    if (window.deskAPI) {
        // @ts-ignore
        window.deskAPI.send("toggleDevTools");
    } else {
        log("Can not toggle DevTools without the deskAPI.");
    }
}

const utils = {
    log,
    getLocation,
    isLocalHost,
    getWindowSize,
    getWindowSizeStyle,
    stopEvent,
    makeEventPointer,
    hideAllIFrames,
    showAllIFrames,
    disableSelection,
    clearSelection,
    isElementVisibleInScroll,
    isKeyInList,
    isKeyEnter,
    isKeyEscape,
    addAction,
    addKeyAction,
    addMover,
    addResizer,
    addScroller,
    applyStyleAsBody,
    getIconDimension,
    getIconSmall,
    getIconMedium,
    getIconLarge,
    getPathJoin,
    getFileExtension,
    isFileApp,
    isFileCmd,
    isFileExec,
    isFileImage,
    isFileVector,
    isFileMusic,
    isFileMovie,
    isFileZipped,
    getTextLines,
    getCSVRows,
    maskSpecialChars,
    unmaskSpecialChars,
    getErrorMessage,
    toggleDevTools,
};

export default utils;