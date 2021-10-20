export type Point = {
    posX: number,
    posY: number,
};

export type Dimension = {
    width: number,
    height: number,
};

export type Bounds = {
    posX: number,
    posY: number,
    width: number,
    height: number,
};

export enum WindowSizeStyle {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
};

export class QinpelEvent {
    alt: boolean;
    ctrl: boolean;
    shift: boolean;
    long: boolean;
    double: boolean;
    posX: number;
    posY: number;
    key: string;

    constructor() {
        this.alt = false;
        this.ctrl = false;
        this.shift = false;
        this.long = false;
        this.double = false;
        this.posX = -1;
        this.posY = -1;
        this.key = "";
    }

    setFromKeyboard(ev: KeyboardEvent): QinpelEvent {
        this.alt = ev.altKey;
        this.ctrl = ev.ctrlKey;
        this.shift = ev.shiftKey;
        return this;
    }

    setFromMouse(ev: MouseEvent): QinpelEvent {
        this.alt = ev.altKey;
        this.ctrl = ev.ctrlKey;
        this.shift = ev.shiftKey;
        return this;
    }

    setFromTouch(ev: TouchEvent): QinpelEvent {
        this.alt = ev.altKey;
        this.ctrl = ev.ctrlKey;
        this.shift = ev.shiftKey;
        return this;
    }
};

export type QinpelAction = (event: QinpelEvent) => void;

export type DragCalls = {
    onDouble?: CallableFunction,
    onLong?: CallableFunction,
    onStart?: CallableFunction,
    onMove?: CallableFunction,
    onEnd?: CallableFunction,
}

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

function getWindowSize(): Dimension {
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
    };
}

function getWindowSizeStyle(): WindowSizeStyle {
    const width = getWindowSize().width;
    if (width < 600) {
        return WindowSizeStyle.SMALL;
    } else if (width < 1000) {
        return WindowSizeStyle.MEDIUM;
    } else {
        return WindowSizeStyle.LARGE;
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

function makeEventPointer(isDown: boolean, ev: MouseEvent | TouchEvent): Point {
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

function isKeyReturn(ev: KeyboardEvent): boolean {
    return ev.key === "Enter" || ev.keyCode === 13;
}

function isKeyEscape(ev: KeyboardEvent): boolean {
    return ev.key === "Esc" || ev.key === "Escape" || ev.keyCode === 27;
}

function addKeyAction(element: HTMLElement, action: QinpelAction) {
    element.onkeydown = actionKeyboard;

    function actionKeyboard(ev: KeyboardEvent) {
        if (isKeyReturn(ev)) {
            action(new QinpelEvent().setFromKeyboard(ev));
            return stopEvent(ev);
        }
    }
}

function addAction(element: HTMLElement, action: QinpelAction) {
    element.onkeydown = actionKeyboard;
    element.onmousedown = actionMouse;
    element.ontouchstart = actionTouch;

    function actionKeyboard(ev: KeyboardEvent) {
        if (isKeyReturn(ev)) {
            action(new QinpelEvent().setFromKeyboard(ev));
            return stopEvent(ev);
        }
    }

    function actionMouse(ev: MouseEvent) {
        action(new QinpelEvent().setFromMouse(ev));
        return stopEvent(ev);
    }

    function actionTouch(ev: TouchEvent) {
        action(new QinpelEvent().setFromTouch(ev));
        return stopEvent(ev);
    }
}

function addMover(sources: HTMLElement[], target: HTMLElement,
    dragCalls?: DragCalls) {
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
    dragCalls?: DragCalls) {
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

function addScroller(target: HTMLElement, dragCalls?: DragCalls) {
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

function getFileExtension(name: string): string {
    let position = name.lastIndexOf(".");
    if (position > -1) {
        return name.substring(position + 1);
    } else {
        return "";
    }
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
    isKeyReturn,
    isKeyEscape,
    addAction,
    addKeyAction,
    addMover,
    addResizer,
    addScroller,
    getFileExtension,
    getTextLines,
    getCSVRows,
    maskSpecialChars,
    unmaskSpecialChars,
    getErrorMessage,
    toggleDevTools,
};

export default utils;