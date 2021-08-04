const qpModule = {
  version: qpVersion,
  newFrame: qpNewFrame,
};

function qinpel() {
  return qpModule;
}

const qpRefMain = qpInit();

function qpInit() {
  const constants = initConstants();
  const divBody = document.createElement("div");
  const divMenu = document.createElement("div");
  const imgMenu = document.createElement("img");
  const refMenu = {
    elements: { divMenu, imgMenu },
  };
  const refMain = {
    constants,
    divBody,
    refMenu,
    refPopMenu: null,
    refAppMenu: null,
    refFrames: [],
    getRefFrameFromFID,
    getRefFrameIndexFromFID: getRefFrameIndexFromFID,
    options: {
      framesTopZ: 1,
      lastPointerEvent: null,
    },
  };
  initBody();
  initMenu();
  initBodyEvents();
  initGlobalEvents();
  return refMain;

  function initConstants() {
    const POP_MENU_MAX_HEIGHT = 270;
    const POP_MENU_WIDTH = 180;
    const MINIMIZED_WIDTH = 180;
    const result = { POP_MENU_MAX_HEIGHT, POP_MENU_WIDTH, MINIMIZED_WIDTH };
    return result;
  }

  function initBody() {
    divBody.className = "QinpelBody";
    document.body.append(divBody);
  }

  function initMenu() {
    divMenu.id = "QinpelMenuID0";
    divMenu.className = "QinpelMenu";
    divMenu.onclick = onMenuClick;
    divMenu.ontouchstart = onMenuClick;

    imgMenu.src = "./assets/qinpel.png";
    imgMenu.alt = "Menu";
    divMenu.append(imgMenu);
    divBody.append(divMenu);

    function onMenuClick(e) {
      if (e.shiftKey) {
        document.body.requestFullscreen();
      } else {
        if (refMain.refAppMenu == null) {
          refMain.refAppMenu = qpNewFrame("Qinpel Menu", "./menu.html");
        } else {
          qpShowElement(refMain.refAppMenu.elements.divFrame);
        }
      }
      return qpStopEvent(e);
    }
  }

  function initBodyEvents() {
    var bodyDragInitX = 0;
    var bodyDragInitY = 0;
    var bodyDragScrollX = 0;
    var bodyDragScrollY = 0;

    divBody.ondragstart = qpStopEvent;
    divBody.ontouchstart = onBodyPointerInit;
    divBody.onmousedown = onBodyPointerInit;

    function onBodyDblClick(e) {
      divBody.scrollTo(0, 0);
      qpClearSelection();
      return qpStopEvent(e);
    }

    function onBodyPointerInit(e) {
      if (qpIsEventPointerDouble(e)) {
        onBodyDblClick(e);
      }
      const pointer = qpGetEventPointer(e);
      bodyDragInitX = pointer.clientX;
      bodyDragInitY = pointer.clientY;
      bodyDragScrollX = divBody.scrollLeft;
      bodyDragScrollY = divBody.scrollTop;
      document.ontouchmove = onBodyPointerMove;
      document.onmousemove = onBodyPointerMove;
      document.ontouchend = onBodyPointerClose;
      document.onmouseup = onBodyPointerClose;
      qpHideAllIFrames();
      return qpCloseEventPointerInit(e);
    }

    function onBodyPointerMove(e) {
      const pointer = qpGetEventPointer(e);
      var bodyDragDifX = pointer.clientX - bodyDragInitX;
      var bodyDragDifY = pointer.clientY - bodyDragInitY;
      var bodyDragNewX = bodyDragScrollX - bodyDragDifX;
      var bodyDragNewY = bodyDragScrollY - bodyDragDifY;
      divBody.scrollTo(bodyDragNewX, bodyDragNewY);
      return qpStopEvent(e);
    }

    function onBodyPointerClose(e) {
      if (qpIsEventPointerLong(e)) {
        onBodyPopMenu(e);
      }
      document.ontouchmove = null;
      document.ontouchend = null;
      document.onmousemove = null;
      document.onmouseup = null;
      qpShowAllIFrames();
      qpClearSelection();
      return qpStopEvent(e);
    }
  }

  function initGlobalEvents() {
    window.onbeforeunload = () => "";
    document.oncontextmenu = onBodyPopMenu;
  }

  function onBodyPopMenu(e) {
    if (refMain.refFrames.length > 0) {
      const items = [];
      refMain.refFrames.map((refFrame) => {
        items.push({
          title: refFrame.elements.divTitle.innerText,
          onclick: (e) => {
            qpShowElement(refFrame.elements.divFrame);
            return qpStopEvent(e);
          },
        });
      });
      const pointer = qpGetEventPointer(e);
      qpNewPopMenu(
        e.target.scrollLeft + pointer.clientX,
        e.target.scrollTop + pointer.clientY,
        items
      );
    }
    return qpStopEvent(e);
  }

  function getRefFrameFromFID(frameID) {
    for (let index = 0; index < refMain.refFrames.length; index++) {
      const refFrame = refMain.refFrames[index];
      if (refFrame.elements.divFrame.id === frameID) {
        return refFrame;
      }
    }
  }

  function getRefFrameIndexFromFID(frameID) {
    for (let index = 0; index < refMain.refFrames.length; index++) {
      const refFrame = refMain.refFrames[index];
      if (refFrame.elements.divFrame.id === frameID) {
        return index;
      }
    }
  }
}

function qpNewPopMenu(posX, posY, items) {
  qpClosePopMenu();
  const divPopMenu = document.createElement("div");
  const divPopMenuItems = [];
  initDivPopMenu();
  initDivPopMenuItems();
  initRefPopMenu();
  qpRefMain.divBody.append(divPopMenu);
  qpShowElement(divPopMenu);

  function initDivPopMenu() {
    divPopMenu.id = "QinpelPopMenuID1";
    divPopMenu.className = "QinpelPopMenu";
    divPopMenu.style.left = posX + "px";
    divPopMenu.style.top = posY + "px";
    divPopMenu.style.width = qpRefMain.constants.POP_MENU_WIDTH + "px";
    divPopMenu.style.maxHeight = qpRefMain.constants.POP_MENU_MAX_HEIGHT + "px";
  }

  function initDivPopMenuItems() {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const divItem = document.createElement("div");
      divItem.className = "QinpelPopItem";
      divItem.innerText = item.title;
      divItem.onclick = item.onclick;
      divItem.ontouchstart = item.onclick;
      divPopMenuItems.push(divItem);
      divPopMenu.append(divItem);
    }
  }

  function initRefPopMenu() {
    const refPopMenu = {
      elements: { divPopMenu, divPopMenuItems },
      options: { posX, posY, items },
    };
    qpRefMain.refPopMenu = refPopMenu;
  }
}

function qpClosePopMenu() {
  if (qpRefMain.refPopMenu != null) {
    qpRefMain.divBody.removeChild(qpRefMain.refPopMenu.elements.divPopMenu);
    qpRefMain.refPopMenu = null;
  }
}

function qpNewFrame(title, address) {
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
  };
  initDivFrame();
  initDivHead();
  initIFrameBody();
  initDivFoot();
  makeFrameDraggable();
  qpRefMain.refFrames.push(refFrame);
  qpRefMain.divBody.append(divFrame);
  qpShowElement(divFrame);
  return refFrame;

  function initFrameTitle() {
    var result = title;
    var attempt = 1;
    while (true) {
      let isThereAnyTitleEqual = false;
      for (let i = 0; i < qpRefMain.refFrames.length; i++) {
        const refFrame = qpRefMain.refFrames[i];
        if (refFrame.elements.divTitle.innerText === result) {
          isThereAnyTitleEqual = true;
          break;
        }
      }
      if (isThereAnyTitleEqual) {
        result = title + " (" + ++attempt + ")";
      } else {
        break;
      }
    }
    return result;
  }

  function initFrameBounds() {
    // TODO - load from local persistence the last frame bounds for the same qpWindowSizeStyles.
    const result = {
      posX: 64,
      posY: 64,
      width: 800,
      height: 600,
    };
    windowSizeStyle = qpGetWindowSizeStyle();
    if (windowSizeStyle === qpWindowSizeStyles.SMALL) {
      result.posX = 0;
      result.posY = 0;
      const size = qpGetWindowSize();
      result.width = size.width - 4;
      result.height = size.height - 4;
    } else if (windowSizeStyle === qpWindowSizeStyles.MEDIUM) {
      result.posX = 48;
      result.posY = 48;
      result.width = 500;
      result.height = 375;
    }
    return result;
  }

  function initDivFrame() {
    divFrame.id = "QinpelFrameID" + rndID;
    divFrame.className = "QinpelFrame";
    divFrame.style.left = frameInitBounds.posX + "px";
    divFrame.style.top = frameInitBounds.posY + "px";
    divFrame.style.width = frameInitBounds.width + "px";
    divFrame.style.height = frameInitBounds.height + "px";
  }

  function initDivHead() {
    divHead.className = "QinpelFrameHead";
    imgMenu.src = "./assets/menu.png";
    imgMenu.alt = "o";
    imgMenu.onclick = onHeadMenuClick;
    imgMenu.ontouchstart = onHeadMenuClick;
    imgMenu.onmousedown = qpStopEvent;
    divHead.append(imgMenu);
    divTitle.className = "QinpelFrameHeadTitle";
    divTitle.innerText = title;
    divHead.append(divTitle);
    imgMinimize.src = "./assets/minimize.png";
    imgMinimize.alt = "-";
    imgMinimize.onclick = onHeadMinimizeClick;
    imgMinimize.ontouchstart = onHeadMinimizeClick;
    imgMinimize.onmousedown = qpStopEvent;
    divHead.append(imgMinimize);
    imgMaximize.src = "./assets/maximize.png";
    imgMaximize.alt = "+";
    imgMaximize.onclick = onHeadMaximizeClick;
    imgMaximize.ontouchstart = onHeadMaximizeClick;
    divHead.ondblclick = onHeadMaximizeClick;
    imgMaximize.onmousedown = qpStopEvent;
    divHead.append(imgMaximize);
    imgClose.src = "./assets/close.png";
    imgClose.alt = "x";
    imgClose.onclick = onHeadCloseClick;
    imgClose.ontouchstart = onHeadCloseClick;
    imgClose.onmousedown = qpStopEvent;
    divHead.append(imgClose);
    divFrame.append(divHead);

    function onHeadMenuClick(e) {
      qpShowElement(qpRefMain.refMenu.elements.divMenu);
      qpRefMain.divBody.scrollTo(0, 0);
      return qpStopEvent(e);
    }

    function onHeadMinimizeClick(e) {
      if (refFrame.options.minimized) {
        divFrame.style.width = refFrame.options.lastWidth + "px";
        divFrame.style.height = refFrame.options.lastHeight + "px";
        iframeBody.style.display = "";
        divFoot.style.display = "";
        refFrame.options.minimized = false;
      } else {
        if (refFrame.options.maximized) {
          onHeadMaximizeClick(e);
        }
        refFrame.options.lastWidth = parseInt(divFrame.style.width, 10);
        refFrame.options.lastHeight = parseInt(divFrame.style.height, 10);
        iframeBody.style.display = "none";
        divFoot.style.display = "none";
        divFrame.style.width = qpRefMain.constants.MINIMIZED_WIDTH + "px";
        divFrame.style.height = divHead.clientHeight + "px";
        refFrame.options.minimized = true;
      }
      qpShowElement(divFrame);
      return qpStopEvent(e);
    }

    function onHeadMaximizeClick(e) {
      if (refFrame.options.maximized) {
        divFrame.style.width = refFrame.options.lastWidth + "px";
        divFrame.style.height = refFrame.options.lastHeight + "px";
        refFrame.options.maximized = false;
      } else {
        if (refFrame.options.minimized) {
          onHeadMinimizeClick(e);
        }
        refFrame.options.lastWidth = parseInt(divFrame.style.width, 10);
        refFrame.options.lastHeight = parseInt(divFrame.style.height, 10);
        divFrame.style.width = qpRefMain.divBody.clientWidth - 4 + "px";
        divFrame.style.height = qpRefMain.divBody.clientHeight - 4 + "px";
        refFrame.options.maximized = true;
      }
      qpShowElement(divFrame);
      return qpStopEvent(e);
    }

    function onHeadCloseClick(e) {
      // TODO - save on local persistence the actual frame bounds for the actual qpWindowSizeStyles.
      const index = qpRefMain.refFrames.indexOf(refFrame);
      if (index > -1) {
        qpRefMain.refFrames.splice(index, 1);
      }
      qpRefMain.divBody.removeChild(divFrame);
      if (qpRefMain.refAppMenu == refFrame) {
        qpRefMain.refAppMenu = null;
      }
      return qpStopEvent(e);
    }
  }

  function initIFrameBody() {
    iframeBody.id = "IID" + rndID;
    iframeBody.className = "QinpelFrameBody";
    iframeBody.src = address;
    divFrame.append(iframeBody);
  }

  function initDivFoot() {
    divFoot.className = "QinpelFrameFoot";
    divStatus.className = "QinpelFrameFootStatus";
    divStatus.innerText = "Status.";
    divFoot.append(divStatus);
    imgResize.src = "./assets/resize.png";
    imgResize.alt = "/";
    divFoot.append(imgResize);
    divFrame.append(divFoot);
  }

  function makeFrameDraggable() {
    var frameDragInitEventX = 0;
    var frameDragInitEventY = 0;
    var frameDragInitPosX = 0;
    var frameDragInitPosY = 0;
    var frameDragInitWidth = 0;
    var frameDragInitHeight = 0;
    divHead.ondragstart = qpStopEvent;
    divStatus.ondragstart = qpStopEvent;
    imgResize.ondragstart = qpStopEvent;
    divHead.ontouchstart = onFramePositionInit;
    divHead.onmousedown = onFramePositionInit;
    divStatus.ontouchstart = onFramePositionInit;
    divStatus.onmousedown = onFramePositionInit;
    imgResize.ontouchstart = onFrameResizeInit;
    imgResize.onmousedown = onFrameResizeInit;

    function onFramePositionInit(e) {
      const pointer = qpGetEventPointer(e);
      frameDragInitEventX = pointer.clientX;
      frameDragInitEventY = pointer.clientY;
      frameDragInitPosX = parseInt(divFrame.style.left, 10);
      frameDragInitPosY = parseInt(divFrame.style.top, 10);
      document.ontouchmove = onFramePositionMove;
      document.onmousemove = onFramePositionMove;
      document.ontouchend = onFramePointerClose;
      document.onmouseup = onFramePointerClose;
      qpHideAllIFrames();
      return qpCloseEventPointerInit(e);
    }

    function onFrameResizeInit(e) {
      const pointer = qpGetEventPointer(e);
      frameDragInitEventX = pointer.clientX;
      frameDragInitEventY = pointer.clientY;
      frameDragInitWidth = parseInt(divFrame.style.width, 10);
      frameDragInitHeight = parseInt(divFrame.style.height, 10);
      document.ontouchmove = onFrameResizeMove;
      document.onmousemove = onFrameResizeMove;
      document.ontouchend = onFramePointerClose;
      document.onmouseup = onFramePointerClose;
      qpHideAllIFrames();
      return qpCloseEventPointerInit(e);
    }

    function onFramePositionMove(e) {
      const pointer = qpGetEventPointer(e);
      var frameDragDifX = pointer.clientX - frameDragInitEventX;
      var frameDragDifY = pointer.clientY - frameDragInitEventY;
      var frameDragFinalX = frameDragInitPosX + frameDragDifX;
      var frameDragFinalY = frameDragInitPosY + frameDragDifY;
      divFrame.style.left = (frameDragFinalX > 0 ? frameDragFinalX : 0) + "px";
      divFrame.style.top = (frameDragFinalY > 0 ? frameDragFinalY : 0) + "px";
      return qpStopEvent(e);
    }

    function onFrameResizeMove(e) {
      const pointer = qpGetEventPointer(e);
      var frameDragDifX = pointer.clientX - frameDragInitEventX;
      var frameDragDifY = pointer.clientY - frameDragInitEventY;
      var frameDragFinalWidth = frameDragInitWidth + frameDragDifX;
      var frameDragFinalHeight = frameDragInitHeight + frameDragDifY;
      divFrame.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
      divFrame.style.height =
        (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
      return qpStopEvent(e);
    }

    function onFramePointerClose(e) {
      document.ontouchmove = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.onmouseup = null;
      qpShowAllIFrames();
      qpClearSelection();
      qpShowElement(divFrame);
      return qpStopEvent(e);
    }
  }
}

function qpGetWindowSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
}

const qpWindowSizeStyles = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
};

function qpGetWindowSizeStyle() {
  const width = qpGetWindowSize().width;
  if (width < 600) {
    return qpWindowSizeStyles.SMALL;
  } else if (width < 1000) {
    return qpWindowSizeStyles.MEDIUM;
  } else {
    return qpWindowSizeStyles.LARGE;
  }
}

function qpGetEventPointer(e) {
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
    return qpGetEventPointer(qpRefMain.options.lastPointerEvent);
  }
  return result;
}

function qpIsEventPointerDouble(e) {
  if (qpRefMain.options.lastPointerEvent == null || e == null) {
    return false;
  }
  const timeDif = e.timeStamp - qpRefMain.options.lastPointerEvent.timeStamp;
  return timeDif < 450;
}

function qpIsEventPointerLong(e) {
  if (qpRefMain.options.lastPointerEvent == null || e == null) {
    return false;
  }
  const timeDif = e.timeStamp - qpRefMain.options.lastPointerEvent.timeStamp;
  return timeDif > 720;
}

function qpCloseEventPointerInit(e) {
  qpRefMain.options.lastPointerEvent = e;
  return qpStopEvent(e);
}

function qpHideAllIFrames() {
  var doc_frames = document.getElementsByTagName("iframe");
  for (let doc_frame of doc_frames) {
    doc_frame.style.visibility = "hidden";
  }
}

function qpShowAllIFrames() {
  var doc_frames = document.getElementsByTagName("iframe");
  for (let doc_frame of doc_frames) {
    doc_frame.style.visibility = "visible";
  }
}

function qpIsElementVisibleInScroll(element) {
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

function qpShowElement(element) {
  if (element.id != "QinpelPopMenuID1") {
    qpClosePopMenu();
  }
  element.style.zIndex = ++qpRefMain.options.framesTopZ;
  if (!qpIsElementVisibleInScroll(element)) {
    element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
  }
  if (element.id.startsWith("QinpelFrameID")) {
    const index = qpRefMain.getRefFrameIndexFromFID(element.id);
    if (index > 0) {
      const refFrame = qpRefMain.refFrames[index];
      qpRefMain.refFrames.splice(index, 1);
      qpRefMain.refFrames.unshift(refFrame);
    }
  }
}

function qpClearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  if (document.selection) {
    document.selection.empty();
  }
}

function qpStopEvent(event) {
  if (event.preventDefault != undefined) {
    event.preventDefault();
  }
  if (event.stopPropagation != undefined) {
    event.stopPropagation();
  }
  event.cancelBubble = true;
  return false;
}

function qpVersion() {
  return "0.1.0";
}
