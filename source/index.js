const qinpelModule = {
    log: qinpelLog,
    location: qinpelLocation,
    isLocalHost: qinpelIsLocalHost,
    token: "",
    userLang: "",
    get: qinpelGet,
    post: qinpelPost,
    hasLogged: qinpelHasLogged,
    newFrame: qinpelNewFrame,
    stopEvent: qinpelStopEvent,
    version: qinpelVersion,
};

function qinpelApp() {
    return qinpelModule;
}

function qinpelLog(message) {
    if (window.nodeAPI) {
        window.nodeAPI.send("logOnMain", message);
    } else {
        console.log(message);
    }
}

function qinpelLocation() {
    return window.location.href;
}

function qinpelIsLocalHost() {
    var location = qinpelLocation();
    var start = location.indexOf("://");
    if (start == -1) { start = 0; }
    else { start += 3 }
    location = location.substr(start);
    return location.startsWith("localhost") || location.startsWith("127.0.0.1")
}

function qinpelHasLogged() {
    return qinpelModule.token != "";
}

function qinpelGet(address, headers) {
    return axios.get(address, qinpelAxiosConfig(headers));
}

function qinpelPost(address, data, headers) {
    return axios.post(address, data, qinpelAxiosConfig(headers));
}

function qinpelAxiosConfig(headers) {
    if (!headers) {
        headers = {};
    }
    headers['Qinpel-Token'] = qinpelModule.token;
    if (!headers['Accept-Language']) {
        if (qinpelModule.userLang) {
            headers['Accept-Language'] = qinpelModule.userLang;
        } else {
            let browserLang = navigator.language || navigator.userLanguage;
            if (browserLang) {
                headers['Accept-Language'] = browserLang;
            }
        }
    }
    if (!headers['Content-Type']) {
        headers['Content-Type'] = "application/json";
    }
    return {
        headers
    };
}

const qinpelRefWindow = qinpelInitWindow();

function qinpelInitWindow() {
    const constants = initConstants();
    const divBody = document.createElement("div");
    const divMenu = document.createElement("div");
    const imgMenu = document.createElement("img");
    const refMenu = {
        elements: { divMenu, imgMenu },
    };
    const refWindow = {
        constants,
        divBody,
        refMenu,
        refPopMenu: null,
        refAppMenu: null,
        refFrames: [],
        getRefFrameFromFID,
        getRefFrameIndexFromFID,
        options: {
            framesTopZ: 1,
            lastPointerEvent: null,
        },
    };
    initBody();
    initMenu();
    initBodyEvents();
    initGlobalEvents();
    return refWindow;

    function initConstants() {
        const POP_MENU_MAX_HEIGHT = 270;
        const POP_MENU_WIDTH = 180;
        const MINIMIZED_WIDTH = 180;
        const result = { POP_MENU_MAX_HEIGHT, POP_MENU_WIDTH, MINIMIZED_WIDTH };
        return result;
    }

    function initBody() {
        divBody.className = "QinpelWindowBody";
        document.body.appendChild(divBody);
    }

    function initMenu() {
        divMenu.id = "QinpelMenuID0";
        divMenu.className = "QinpelWindowMenu";
        divMenu.onclick = onMenuClick;
        divMenu.ontouchstart = onMenuClick;

        imgMenu.src = "./assets/qinpel.png";
        imgMenu.alt = "Menu";
        divMenu.appendChild(imgMenu);
        divBody.appendChild(divMenu);

        function onMenuClick(e) {
            if (e.shiftKey) {
                document.body.requestFullscreen();
            } else {
                if (refWindow.refAppMenu == null) {
                    refWindow.refAppMenu = qinpelNewFrame("Qinpel", "./main.html");
                } else {
                    qinpelShowElement(refWindow.refAppMenu.elements.divFrame);
                }
            }
            return qinpelStopEvent(e);
        }
    }

    function initBodyEvents() {
        var bodyDragInitX = 0;
        var bodyDragInitY = 0;
        var bodyDragScrollX = 0;
        var bodyDragScrollY = 0;

        divBody.ondragstart = qinpelStopEvent;
        divBody.ontouchstart = onBodyPointerInit;
        divBody.onmousedown = onBodyPointerInit;

        function onBodyDblClick(e) {
            divBody.scrollTo(0, 0);
            qinpelClearSelection();
            return qinpelStopEvent(e);
        }

        function onBodyPointerInit(e) {
            if (qinpelIsEventPointerDouble(e)) {
                onBodyDblClick(e);
            }
            const pointer = qinpelGetEventPointer(e);
            bodyDragInitX = pointer.clientX;
            bodyDragInitY = pointer.clientY;
            bodyDragScrollX = divBody.scrollLeft;
            bodyDragScrollY = divBody.scrollTop;
            document.ontouchmove = onBodyPointerMove;
            document.onmousemove = onBodyPointerMove;
            document.ontouchend = onBodyPointerClose;
            document.onmouseup = onBodyPointerClose;
            qinpelClosePopMenu();
            qinpelHideAllIFrames();
            return qinpelCloseEventPointerInit(e);
        }

        function onBodyPointerMove(e) {
            const pointer = qinpelGetEventPointer(e);
            var bodyDragDifX = pointer.clientX - bodyDragInitX;
            var bodyDragDifY = pointer.clientY - bodyDragInitY;
            var bodyDragNewX = bodyDragScrollX - bodyDragDifX;
            var bodyDragNewY = bodyDragScrollY - bodyDragDifY;
            divBody.scrollTo(bodyDragNewX, bodyDragNewY);
            return qinpelStopEvent(e);
        }

        function onBodyPointerClose(e) {
            if (qinpelIsEventPointerLong(e)) {
                onBodyPopMenu(e);
            }
            document.ontouchmove = null;
            document.ontouchend = null;
            document.onmousemove = null;
            document.onmouseup = null;
            qinpelShowAllIFrames();
            qinpelClearSelection();
            return qinpelStopEvent(e);
        }
    }

    function initGlobalEvents() {
        document.oncontextmenu = onBodyPopMenu;
    }

    function onBodyPopMenu(e) {
        if (refWindow.refFrames.length > 0) {
            const items = [];
            refWindow.refFrames.map((refFrame) => {
                items.push({
                    title: refFrame.elements.divTitle.innerText,
                    onclick: (e) => {
                        qinpelShowElement(refFrame.elements.divFrame);
                        return qinpelStopEvent(e);
                    },
                });
            });
            const pointer = qinpelGetEventPointer(e);
            qinpelNewPopMenu(
                e.target.scrollLeft + pointer.clientX,
                e.target.scrollTop + pointer.clientY,
                items
            );
        }
        return qinpelStopEvent(e);
    }

    function getRefFrameFromFID(frameID) {
        for (let index = 0; index < refWindow.refFrames.length; index++) {
            const refFrame = refWindow.refFrames[index];
            if (refFrame.elements.divFrame.id === frameID) {
                return refFrame;
            }
        }
    }

    function getRefFrameIndexFromFID(frameID) {
        for (let index = 0; index < refWindow.refFrames.length; index++) {
            const refFrame = refWindow.refFrames[index];
            if (refFrame.elements.divFrame.id === frameID) {
                return index;
            }
        }
    }
}

function qinpelNewPopMenu(posX, posY, items) {
    qinpelClosePopMenu();
    const divPopMenu = document.createElement("div");
    initDivPopMenu();
    initDivPopMenuItems();
    setRefPopMenu();
    qinpelRefWindow.divBody.appendChild(divPopMenu);
    qinpelShowElement(divPopMenu);

    function initDivPopMenu() {
        divPopMenu.id = "QinpelPopMenuID1";
        divPopMenu.className = "QinpelWindowPopMenu";
        divPopMenu.style.left = posX + "px";
        divPopMenu.style.top = posY + "px";
        divPopMenu.style.width = qinpelRefWindow.constants.POP_MENU_WIDTH + "px";
        divPopMenu.style.maxHeight = qinpelRefWindow.constants.POP_MENU_MAX_HEIGHT + "px";
    }

    function initDivPopMenuItems() {
        for (const item of items) {
            const divItem = document.createElement("div");
            divItem.className = "QinpelWindowPopItem";
            divItem.innerText = item.title;
            divItem.onclick = item.onclick;
            divItem.onmousedown = item.onclick;
            divItem.ontouchstart = item.onclick;
            divPopMenu.appendChild(divItem);
        }
    }

    function setRefPopMenu() {
        const refPopMenu = {
            elements: { divPopMenu },
            options: { posX, posY, items },
        };
        qinpelRefWindow.refPopMenu = refPopMenu;
    }
}

function qinpelClosePopMenu() {
    if (qinpelRefWindow.refPopMenu != null) {
        qinpelRefWindow.divBody.removeChild(qinpelRefWindow.refPopMenu.elements.divPopMenu);
        qinpelRefWindow.refPopMenu = null;
    }
}

function qinpelNewFrame(title, address, toReturn, params) {
    title = initFrameTitle();
    const frameInitBounds = initFrameBounds();
    const rndID = Math.floor(Math.random() * 1000000);
    const divFrame = document.createElement("div");
    const divHead = document.createElement("div");
    const imgMenu = document.createElement("img");
    const divTitle = document.createElement("div");
    const imgMinimize = document.createElement("img");
    const imgMaximize = document.createElement("img");
    const imgClose = document.createElement("img");
    const iframeBody = document.createElement("iframe");
    const divFoot = document.createElement("div");
    const divStatus = document.createElement("div");
    const imgResize = document.createElement("img");
    const refFrame = {
        elements: {
            rndID,
            divFrame,
            divHead,
            imgMenu,
            divTitle,
            imgMinimize,
            imgMaximize,
            imgClose,
            iframeBody,
            divFoot,
            divStatus,
            imgResize,
        },
        options: {
            minimized: false,
            maximized: false,
            lastWidth: frameInitBounds.width,
            lastHeight: frameInitBounds.height,
        },
        headMenu: callHeadMenuClick,
        headMinimize: callHeadMinimizeClick,
        headMaximize: callHeadMaximizeClick,
        headClose: callHeadCloseClick,
        footStatus: callFootStatus,
        toReturn,
        params,
    };
    initDivFrame();
    initDivHead();
    initInsideFrameBody();
    initDivFoot();
    initDraggable();
    qinpelRefWindow.refFrames.push(refFrame);
    qinpelRefWindow.divBody.appendChild(divFrame);
    qinpelShowElement(divFrame);
    iframeBody.qinpelRefSelf = refFrame;
    return refFrame;

    function initFrameTitle() {
        var result = title;
        var attempt = 1;
        while (true) {
            let isThereAnyTitleEqual = false;
            for (let i = 0; i < qinpelRefWindow.refFrames.length; i++) {
                const refFrame = qinpelRefWindow.refFrames[i];
                if (refFrame.elements.divTitle.innerText === result) {
                    isThereAnyTitleEqual = true;
                    break;
                }
            }
            if (isThereAnyTitleEqual) {
                result = title + " (" + (++attempt) + ")";
            } else {
                break;
            }
        }
        return result;
    }

    function initFrameBounds() {
        return qinpelLoadFrameBounds(title);
    }

    function initDivFrame() {
        divFrame.id = "QinpelFrameID" + rndID;
        divFrame.className = "QinpelWindowFrame";
        divFrame.style.left = frameInitBounds.posX + "px";
        divFrame.style.top = frameInitBounds.posY + "px";
        divFrame.style.width = frameInitBounds.width + "px";
        divFrame.style.height = frameInitBounds.height + "px";
    }

    function initDivHead() {
        divHead.className = "QinpelWindowFrameHead";
        imgMenu.src = "./assets/menu.png";
        imgMenu.alt = "o";
        imgMenu.onclick = callHeadMenuClick;
        imgMenu.ontouchstart = callHeadMenuClick;
        imgMenu.onmousedown = qinpelStopEvent;
        divHead.appendChild(imgMenu);
        divTitle.className = "QinpelWindowFrameHeadTitle";
        divTitle.innerText = title;
        divHead.appendChild(divTitle);
        imgMinimize.src = "./assets/minimize.png";
        imgMinimize.alt = "-";
        imgMinimize.onclick = callHeadMinimizeClick;
        imgMinimize.ontouchstart = callHeadMinimizeClick;
        imgMinimize.onmousedown = qinpelStopEvent;
        divHead.appendChild(imgMinimize);
        imgMaximize.src = "./assets/maximize.png";
        imgMaximize.alt = "+";
        imgMaximize.onclick = callHeadMaximizeClick;
        imgMaximize.ontouchstart = callHeadMaximizeClick;
        divHead.ondblclick = callHeadMaximizeClick;
        imgMaximize.onmousedown = qinpelStopEvent;
        divHead.appendChild(imgMaximize);
        imgClose.src = "./assets/close.png";
        imgClose.alt = "x";
        imgClose.onclick = callHeadCloseClick;
        imgClose.ontouchstart = callHeadCloseClick;
        imgClose.onmousedown = qinpelStopEvent;
        divHead.appendChild(imgClose);
        divFrame.appendChild(divHead);
    }

    function callHeadMenuClick(event) {
        qinpelShowElement(qinpelRefWindow.refMenu.elements.divMenu);
        qinpelRefWindow.divBody.scrollTo(0, 0);
        return qinpelStopEvent(event);
    }

    function callHeadMinimizeClick(event) {
        if (refFrame.options.minimized) {
            divFrame.style.width = refFrame.options.lastWidth + "px";
            divFrame.style.height = refFrame.options.lastHeight + "px";
            iframeBody.style.display = "";
            divFoot.style.display = "";
            refFrame.options.minimized = false;
        } else {
            if (refFrame.options.maximized) {
                callHeadMaximizeClick(event);
            }
            refFrame.options.lastWidth = parseInt(divFrame.style.width, 10);
            refFrame.options.lastHeight = parseInt(divFrame.style.height, 10);
            iframeBody.style.display = "none";
            divFoot.style.display = "none";
            divFrame.style.width = qinpelRefWindow.constants.MINIMIZED_WIDTH + "px";
            divFrame.style.height = divHead.clientHeight + "px";
            refFrame.options.minimized = true;
        }
        qinpelShowElement(divFrame);
        return qinpelStopEvent(event);
    }

    function callHeadMaximizeClick(event) {
        if (refFrame.options.maximized) {
            divFrame.style.width = refFrame.options.lastWidth + "px";
            divFrame.style.height = refFrame.options.lastHeight + "px";
            refFrame.options.maximized = false;
        } else {
            if (refFrame.options.minimized) {
                callHeadMinimizeClick(event);
            }
            refFrame.options.lastWidth = parseInt(divFrame.style.width, 10);
            refFrame.options.lastHeight = parseInt(divFrame.style.height, 10);
            divFrame.style.width = qinpelRefWindow.divBody.clientWidth - 4 + "px";
            divFrame.style.height = qinpelRefWindow.divBody.clientHeight - 4 + "px";
            refFrame.options.maximized = true;
        }
        qinpelShowElement(divFrame);
        return qinpelStopEvent(event);
    }

    function callHeadCloseClick(event) {
        qinpelCloseFrame(refFrame);
        return qinpelStopEvent(event);
    }

    function initInsideFrameBody() {
        iframeBody.id = "QinpelInsideFrameID" + rndID;
        iframeBody.className = "QinpelWindowFrameBody";
        iframeBody.src = address;
        divFrame.appendChild(iframeBody);
    }

    function initDivFoot() {
        divFoot.className = "QinpelWindowFrameFoot";
        divStatus.className = "QinpelWindowFrameFootStatus";
        divStatus.innerText = "Status.";
        divFoot.appendChild(divStatus);
        imgResize.src = "./assets/resize.png";
        imgResize.alt = "/";
        divFoot.appendChild(imgResize);
        divFrame.appendChild(divFoot);
    }

    function callFootStatus(message) {
        divStatus.innerText = message;
    }

    function initDraggable() {
        var frameDragInitEventX = 0;
        var frameDragInitEventY = 0;
        var frameDragInitPosX = 0;
        var frameDragInitPosY = 0;
        var frameDragInitWidth = 0;
        var frameDragInitHeight = 0;
        divHead.ondragstart = qinpelStopEvent;
        divStatus.ondragstart = qinpelStopEvent;
        imgResize.ondragstart = qinpelStopEvent;
        divHead.ontouchstart = onFramePositionInit;
        divHead.onmousedown = onFramePositionInit;
        divStatus.ontouchstart = onFramePositionInit;
        divStatus.onmousedown = onFramePositionInit;
        imgResize.ontouchstart = onFrameResizeInit;
        imgResize.onmousedown = onFrameResizeInit;

        function onFramePositionInit(e) {
            const pointer = qinpelGetEventPointer(e);
            frameDragInitEventX = pointer.clientX;
            frameDragInitEventY = pointer.clientY;
            frameDragInitPosX = parseInt(divFrame.style.left, 10);
            frameDragInitPosY = parseInt(divFrame.style.top, 10);
            document.ontouchmove = onFramePositionMove;
            document.onmousemove = onFramePositionMove;
            document.ontouchend = onFramePointerClose;
            document.onmouseup = onFramePointerClose;
            qinpelHideAllIFrames();
            return qinpelCloseEventPointerInit(e);
        }

        function onFrameResizeInit(e) {
            const pointer = qinpelGetEventPointer(e);
            frameDragInitEventX = pointer.clientX;
            frameDragInitEventY = pointer.clientY;
            frameDragInitWidth = parseInt(divFrame.style.width, 10);
            frameDragInitHeight = parseInt(divFrame.style.height, 10);
            document.ontouchmove = onFrameResizeMove;
            document.onmousemove = onFrameResizeMove;
            document.ontouchend = onFramePointerClose;
            document.onmouseup = onFramePointerClose;
            qinpelHideAllIFrames();
            return qinpelCloseEventPointerInit(e);
        }

        function onFramePositionMove(e) {
            const pointer = qinpelGetEventPointer(e);
            var frameDragDifX = pointer.clientX - frameDragInitEventX;
            var frameDragDifY = pointer.clientY - frameDragInitEventY;
            var frameDragFinalX = frameDragInitPosX + frameDragDifX;
            var frameDragFinalY = frameDragInitPosY + frameDragDifY;
            divFrame.style.left = (frameDragFinalX > 0 ? frameDragFinalX : 0) + "px";
            divFrame.style.top = (frameDragFinalY > 0 ? frameDragFinalY : 0) + "px";
            return qinpelStopEvent(e);
        }

        function onFrameResizeMove(e) {
            const pointer = qinpelGetEventPointer(e);
            var frameDragDifX = pointer.clientX - frameDragInitEventX;
            var frameDragDifY = pointer.clientY - frameDragInitEventY;
            var frameDragFinalWidth = frameDragInitWidth + frameDragDifX;
            var frameDragFinalHeight = frameDragInitHeight + frameDragDifY;
            divFrame.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
            divFrame.style.height =
                (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
            return qinpelStopEvent(e);
        }

        function onFramePointerClose(e) {
            document.ontouchmove = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.onmouseup = null;
            qinpelShowAllIFrames();
            qinpelClearSelection();
            qinpelShowElement(divFrame);
            return qinpelStopEvent(e);
        }
    }
}

function qinpelCloseFrame(refFrame) {
    qinpelSaveFrameBounds(refFrame);
    const index = qinpelRefWindow.refFrames.indexOf(refFrame);
    if (index > -1) {
        qinpelRefWindow.refFrames.splice(index, 1);
    }
    qinpelRefWindow.divBody.removeChild(refFrame.elements.divFrame);
    if (qinpelRefWindow.refAppMenu == refFrame) {
        qinpelRefWindow.refAppMenu = null;
    }
}

function qinpelSaveFrameBounds(refFrame) {
    const frameStyleID = qinpelGetFrameWindowStyleID(refFrame.elements.divTitle.innerText);
    const frameBounds =
        parseInt(refFrame.elements.divFrame.style.left, 10) +
        "," +
        parseInt(refFrame.elements.divFrame.style.top, 10) +
        "," +
        parseInt(refFrame.elements.divFrame.style.width, 10) +
        "," +
        parseInt(refFrame.elements.divFrame.style.height, 10);
    window.localStorage.setItem(frameStyleID, frameBounds);
}

function qinpelLoadFrameBounds(frameTitle) {
    const result = {
        posX: 64,
        posY: 64,
        width: 800,
        height: 600,
    };
    const frameStyleID = qinpelGetFrameWindowStyleID(frameTitle);
    const frameBoundsSaved = window.localStorage.getItem(frameStyleID);
    if (frameBoundsSaved) {
        let parts = frameBoundsSaved.split(",");
        result.posX = parts[0];
        result.posY = parts[1];
        result.width = parts[2];
        result.height = parts[3];
    } else {
        windowSizeStyle = qinpelGetWindowSizeStyle();
        if (windowSizeStyle === qinpelWindowSizeStyles.SMALL) {
            result.posX = 0;
            result.posY = 0;
            const size = qinpelGetWindowSize();
            result.width = size.width - 4;
            result.height = size.height - 4;
        } else if (windowSizeStyle === qinpelWindowSizeStyles.MEDIUM) {
            result.posX = 48;
            result.posY = 48;
            result.width = 500;
            result.height = 375;
        }
    }
    return result;
}

function qinpelGetFrameWindowStyleID(frameTitle) {
    return "window " + qinpelGetWindowSizeStyle() + " size of: " + frameTitle;
}

function qinpelGetWindowSize() {
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
    };
}

const qinpelWindowSizeStyles = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
};

function qinpelGetWindowSizeStyle() {
    const width = qinpelGetWindowSize().width;
    if (width < 600) {
        return qinpelWindowSizeStyles.SMALL;
    } else if (width < 1000) {
        return qinpelWindowSizeStyles.MEDIUM;
    } else {
        return qinpelWindowSizeStyles.LARGE;
    }
}

function qinpelGetEventPointer(e) {
    const result = {
        clientX: 0,
        clientY: 0,
    };
    if (e.clientX || e.clientY) {
        result.clientX = e.clientX;
        result.clientY = e.clientY;
    } else if (
        e.touches &&
        e.touches[0] &&
        (e.touches[0].clientX || e.touches[0].clientY)
    ) {
        result.clientX = e.touches[0].clientX;
        result.clientY = e.touches[0].clientY;
    } else {
        return qinpelGetEventPointer(qinpelRefWindow.options.lastPointerEvent);
    }
    return result;
}

function qinpelIsEventPointerDouble(e) {
    if (qinpelRefWindow.options.lastPointerEvent == null || e == null) {
        return false;
    }
    const timeDif = e.timeStamp - qinpelRefWindow.options.lastPointerEvent.timeStamp;
    return timeDif < 450;
}

function qinpelIsEventPointerLong(e) {
    if (qinpelRefWindow.options.lastPointerEvent == null || e == null) {
        return false;
    }
    const timeDif = e.timeStamp - qinpelRefWindow.options.lastPointerEvent.timeStamp;
    return timeDif > 720 && timeDif < 1800;
}

function qinpelCloseEventPointerInit(e) {
    qinpelRefWindow.options.lastPointerEvent = e;
    return qinpelStopEvent(e);
}

function qinpelHideAllIFrames() {
    var doc_frames = document.getElementsByTagName("iframe");
    for (let doc_frame of doc_frames) {
        doc_frame.style.visibility = "hidden";
    }
}

function qinpelShowAllIFrames() {
    var doc_frames = document.getElementsByTagName("iframe");
    for (let doc_frame of doc_frames) {
        doc_frame.style.visibility = "visible";
    }
}

function qinpelIsElementVisibleInScroll(element) {
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

function qinpelShowElement(element) {
    if (element.id != "QinpelPopMenuID1") {
        qinpelClosePopMenu();
    }
    element.style.zIndex = ++qinpelRefWindow.options.framesTopZ;
    if (!qinpelIsElementVisibleInScroll(element)) {
        element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
    }
    if (element.id.startsWith("QinpelFrameID")) {
        const index = qinpelRefWindow.getRefFrameIndexFromFID(element.id);
        if (index > 0) {
            const refFrame = qinpelRefWindow.refFrames[index];
            qinpelRefWindow.refFrames.splice(index, 1);
            qinpelRefWindow.refFrames.unshift(refFrame);
        }
    }
}

function qinpelClearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    if (document.selection) {
        document.selection.empty();
    }
}

function qinpelStopEvent(event) {
    if (event.preventDefault != undefined) {
        event.preventDefault();
    }
    if (event.stopPropagation != undefined) {
        event.stopPropagation();
    }
    event.cancelBubble = true;
    return false;
}

function qinpelVersion() {
    return "0.1.3";
}
