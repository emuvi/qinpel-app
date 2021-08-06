const qpwModule = {
  newFrame: qpwNewFrame,
  version: qpwVersion,
};

function qinpel() {
  return qpwModule;
}

const qpwRefWindow = qpwInitWindow();

function qpwInitWindow() {
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
    document.body.append(divBody);
  }

  function initMenu() {
    divMenu.id = "QinpelMenuID0";
    divMenu.className = "QinpelWindowMenu";
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
        if (refWindow.refAppMenu == null) {
          refWindow.refAppMenu = qpwNewFrame("Qinpel", "./main.html");
        } else {
          qpwShowElement(refWindow.refAppMenu.elements.divFrame);
        }
      }
      return qpwStopEvent(e);
    }
  }

  function initBodyEvents() {
    var bodyDragInitX = 0;
    var bodyDragInitY = 0;
    var bodyDragScrollX = 0;
    var bodyDragScrollY = 0;

    divBody.ondragstart = qpwStopEvent;
    divBody.ontouchstart = onBodyPointerInit;
    divBody.onmousedown = onBodyPointerInit;

    function onBodyDblClick(e) {
      divBody.scrollTo(0, 0);
      qpwClearSelection();
      return qpwStopEvent(e);
    }

    function onBodyPointerInit(e) {
      if (qpwIsEventPointerDouble(e)) {
        onBodyDblClick(e);
      }
      const pointer = qpwGetEventPointer(e);
      bodyDragInitX = pointer.clientX;
      bodyDragInitY = pointer.clientY;
      bodyDragScrollX = divBody.scrollLeft;
      bodyDragScrollY = divBody.scrollTop;
      document.ontouchmove = onBodyPointerMove;
      document.onmousemove = onBodyPointerMove;
      document.ontouchend = onBodyPointerClose;
      document.onmouseup = onBodyPointerClose;
      qpwHideAllIFrames();
      return qpwCloseEventPointerInit(e);
    }

    function onBodyPointerMove(e) {
      const pointer = qpwGetEventPointer(e);
      var bodyDragDifX = pointer.clientX - bodyDragInitX;
      var bodyDragDifY = pointer.clientY - bodyDragInitY;
      var bodyDragNewX = bodyDragScrollX - bodyDragDifX;
      var bodyDragNewY = bodyDragScrollY - bodyDragDifY;
      divBody.scrollTo(bodyDragNewX, bodyDragNewY);
      return qpwStopEvent(e);
    }

    function onBodyPointerClose(e) {
      if (qpwIsEventPointerLong(e)) {
        onBodyPopMenu(e);
      }
      document.ontouchmove = null;
      document.ontouchend = null;
      document.onmousemove = null;
      document.onmouseup = null;
      qpwShowAllIFrames();
      qpwClearSelection();
      return qpwStopEvent(e);
    }
  }

  function initGlobalEvents() {
    window.onbeforeunload = () => "";
    document.oncontextmenu = onBodyPopMenu;
  }

  function onBodyPopMenu(e) {
    if (refWindow.refFrames.length > 0) {
      const items = [];
      refWindow.refFrames.map((refFrame) => {
        items.push({
          title: refFrame.elements.divTitle.innerText,
          onclick: (e) => {
            qpwShowElement(refFrame.elements.divFrame);
            return qpwStopEvent(e);
          },
        });
      });
      const pointer = qpwGetEventPointer(e);
      qpwNewPopMenu(
        e.target.scrollLeft + pointer.clientX,
        e.target.scrollTop + pointer.clientY,
        items
      );
    }
    return qpwStopEvent(e);
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

function qpwNewPopMenu(posX, posY, items) {
  qpwClosePopMenu();
  const divPopMenu = document.createElement("div");
  const divPopMenuItems = [];
  initDivPopMenu();
  initDivPopMenuItems();
  initRefPopMenu();
  qpwRefWindow.divBody.append(divPopMenu);
  qpwShowElement(divPopMenu);

  function initDivPopMenu() {
    divPopMenu.id = "QinpelPopMenuID1";
    divPopMenu.className = "QinpelWindowPopMenu";
    divPopMenu.style.left = posX + "px";
    divPopMenu.style.top = posY + "px";
    divPopMenu.style.width = qpwRefWindow.constants.POP_MENU_WIDTH + "px";
    divPopMenu.style.maxHeight = qpwRefWindow.constants.POP_MENU_MAX_HEIGHT + "px";
  }

  function initDivPopMenuItems() {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const divItem = document.createElement("div");
      divItem.className = "QinpelWindowPopItem";
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
    qpwRefWindow.refPopMenu = refPopMenu;
  }
}

function qpwClosePopMenu() {
  if (qpwRefWindow.refPopMenu != null) {
    qpwRefWindow.divBody.removeChild(qpwRefWindow.refPopMenu.elements.divPopMenu);
    qpwRefWindow.refPopMenu = null;
  }
}

function qpwNewFrame(title, address) {
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
  initDraggable();
  qpwRefWindow.refFrames.push(refFrame);
  qpwRefWindow.divBody.append(divFrame);
  qpwShowElement(divFrame);
  return refFrame;

  function initFrameTitle() {
    var result = title;
    var attempt = 1;
    while (true) {
      let isThereAnyTitleEqual = false;
      for (let i = 0; i < qpwRefWindow.refFrames.length; i++) {
        const refFrame = qpwRefWindow.refFrames[i];
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
    return qpwLoadFrameBounds(title);
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
    imgMenu.onclick = onHeadMenuClick;
    imgMenu.ontouchstart = onHeadMenuClick;
    imgMenu.onmousedown = qpwStopEvent;
    divHead.append(imgMenu);
    divTitle.className = "QinpelWindowFrameHeadTitle";
    divTitle.innerText = title;
    divHead.append(divTitle);
    imgMinimize.src = "./assets/minimize.png";
    imgMinimize.alt = "-";
    imgMinimize.onclick = onHeadMinimizeClick;
    imgMinimize.ontouchstart = onHeadMinimizeClick;
    imgMinimize.onmousedown = qpwStopEvent;
    divHead.append(imgMinimize);
    imgMaximize.src = "./assets/maximize.png";
    imgMaximize.alt = "+";
    imgMaximize.onclick = onHeadMaximizeClick;
    imgMaximize.ontouchstart = onHeadMaximizeClick;
    divHead.ondblclick = onHeadMaximizeClick;
    imgMaximize.onmousedown = qpwStopEvent;
    divHead.append(imgMaximize);
    imgClose.src = "./assets/close.png";
    imgClose.alt = "x";
    imgClose.onclick = onHeadCloseClick;
    imgClose.ontouchstart = onHeadCloseClick;
    imgClose.onmousedown = qpwStopEvent;
    divHead.append(imgClose);
    divFrame.append(divHead);

    function onHeadMenuClick(e) {
      qpwShowElement(qpwRefWindow.refMenu.elements.divMenu);
      qpwRefWindow.divBody.scrollTo(0, 0);
      return qpwStopEvent(e);
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
        divFrame.style.width = qpwRefWindow.constants.MINIMIZED_WIDTH + "px";
        divFrame.style.height = divHead.clientHeight + "px";
        refFrame.options.minimized = true;
      }
      qpwShowElement(divFrame);
      return qpwStopEvent(e);
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
        divFrame.style.width = qpwRefWindow.divBody.clientWidth - 4 + "px";
        divFrame.style.height = qpwRefWindow.divBody.clientHeight - 4 + "px";
        refFrame.options.maximized = true;
      }
      qpwShowElement(divFrame);
      return qpwStopEvent(e);
    }

    function onHeadCloseClick(e) {
      qpwCloseFrame(refFrame);
      return qpwStopEvent(e);
    }
  }

  function initIFrameBody() {
    iframeBody.id = "IID" + rndID;
    iframeBody.className = "QinpelWindowFrameBody";
    iframeBody.src = address;
    divFrame.append(iframeBody);
  }

  function initDivFoot() {
    divFoot.className = "QinpelWindowFrameFoot";
    divStatus.className = "QinpelWindowFrameFootStatus";
    divStatus.innerText = "Status.";
    divFoot.append(divStatus);
    imgResize.src = "./assets/resize.png";
    imgResize.alt = "/";
    divFoot.append(imgResize);
    divFrame.append(divFoot);
  }

  function initDraggable() {
    var frameDragInitEventX = 0;
    var frameDragInitEventY = 0;
    var frameDragInitPosX = 0;
    var frameDragInitPosY = 0;
    var frameDragInitWidth = 0;
    var frameDragInitHeight = 0;
    divHead.ondragstart = qpwStopEvent;
    divStatus.ondragstart = qpwStopEvent;
    imgResize.ondragstart = qpwStopEvent;
    divHead.ontouchstart = onFramePositionInit;
    divHead.onmousedown = onFramePositionInit;
    divStatus.ontouchstart = onFramePositionInit;
    divStatus.onmousedown = onFramePositionInit;
    imgResize.ontouchstart = onFrameResizeInit;
    imgResize.onmousedown = onFrameResizeInit;

    function onFramePositionInit(e) {
      const pointer = qpwGetEventPointer(e);
      frameDragInitEventX = pointer.clientX;
      frameDragInitEventY = pointer.clientY;
      frameDragInitPosX = parseInt(divFrame.style.left, 10);
      frameDragInitPosY = parseInt(divFrame.style.top, 10);
      document.ontouchmove = onFramePositionMove;
      document.onmousemove = onFramePositionMove;
      document.ontouchend = onFramePointerClose;
      document.onmouseup = onFramePointerClose;
      qpwHideAllIFrames();
      return qpwCloseEventPointerInit(e);
    }

    function onFrameResizeInit(e) {
      const pointer = qpwGetEventPointer(e);
      frameDragInitEventX = pointer.clientX;
      frameDragInitEventY = pointer.clientY;
      frameDragInitWidth = parseInt(divFrame.style.width, 10);
      frameDragInitHeight = parseInt(divFrame.style.height, 10);
      document.ontouchmove = onFrameResizeMove;
      document.onmousemove = onFrameResizeMove;
      document.ontouchend = onFramePointerClose;
      document.onmouseup = onFramePointerClose;
      qpwHideAllIFrames();
      return qpwCloseEventPointerInit(e);
    }

    function onFramePositionMove(e) {
      const pointer = qpwGetEventPointer(e);
      var frameDragDifX = pointer.clientX - frameDragInitEventX;
      var frameDragDifY = pointer.clientY - frameDragInitEventY;
      var frameDragFinalX = frameDragInitPosX + frameDragDifX;
      var frameDragFinalY = frameDragInitPosY + frameDragDifY;
      divFrame.style.left = (frameDragFinalX > 0 ? frameDragFinalX : 0) + "px";
      divFrame.style.top = (frameDragFinalY > 0 ? frameDragFinalY : 0) + "px";
      return qpwStopEvent(e);
    }

    function onFrameResizeMove(e) {
      const pointer = qpwGetEventPointer(e);
      var frameDragDifX = pointer.clientX - frameDragInitEventX;
      var frameDragDifY = pointer.clientY - frameDragInitEventY;
      var frameDragFinalWidth = frameDragInitWidth + frameDragDifX;
      var frameDragFinalHeight = frameDragInitHeight + frameDragDifY;
      divFrame.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
      divFrame.style.height =
        (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
      return qpwStopEvent(e);
    }

    function onFramePointerClose(e) {
      document.ontouchmove = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.onmouseup = null;
      qpwShowAllIFrames();
      qpwClearSelection();
      qpwShowElement(divFrame);
      return qpwStopEvent(e);
    }
  }
}

function qpwCloseFrame(refFrame) {
  qpwSaveFrameBounds(refFrame);
  const index = qpwRefWindow.refFrames.indexOf(refFrame);
  if (index > -1) {
    qpwRefWindow.refFrames.splice(index, 1);
  }
  qpwRefWindow.divBody.removeChild(refFrame.elements.divFrame);
  if (qpwRefWindow.refAppMenu == refFrame) {
    qpwRefWindow.refAppMenu = null;
  }
}

function qpwSaveFrameBounds(refFrame) {
  const frameStyleID = qpwGetFrameWindowStyleID(refFrame.elements.divTitle.innerText);
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

function qpwLoadFrameBounds(frameTitle) {
  const result = {
    posX: 64,
    posY: 64,
    width: 800,
    height: 600,
  };
  const frameStyleID = qpwGetFrameWindowStyleID(frameTitle);
  const frameBoundsSaved = window.localStorage.getItem(frameStyleID);
  if (frameBoundsSaved) {
    let parts = frameBoundsSaved.split(",");
    result.posX = parts[0];
    result.posY = parts[1];
    result.width = parts[2];
    result.height = parts[3];
  } else {
    windowSizeStyle = qpwGetWindowSizeStyle();
    if (windowSizeStyle === qpwWindowSizeStyles.SMALL) {
      result.posX = 0;
      result.posY = 0;
      const size = qpwGetWindowSize();
      result.width = size.width - 4;
      result.height = size.height - 4;
    } else if (windowSizeStyle === qpwWindowSizeStyles.MEDIUM) {
      result.posX = 48;
      result.posY = 48;
      result.width = 500;
      result.height = 375;
    }
  }
  return result;
}

function qpwGetFrameWindowStyleID(frameTitle) {
  return "window " + qpwGetWindowSizeStyle() + " size of: " + frameTitle;
}

function qpwGetWindowSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
}

const qpwWindowSizeStyles = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
};

function qpwGetWindowSizeStyle() {
  const width = qpwGetWindowSize().width;
  if (width < 600) {
    return qpwWindowSizeStyles.SMALL;
  } else if (width < 1000) {
    return qpwWindowSizeStyles.MEDIUM;
  } else {
    return qpwWindowSizeStyles.LARGE;
  }
}

function qpwGetEventPointer(e) {
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
    return qpwGetEventPointer(qpwRefWindow.options.lastPointerEvent);
  }
  return result;
}

function qpwIsEventPointerDouble(e) {
  if (qpwRefWindow.options.lastPointerEvent == null || e == null) {
    return false;
  }
  const timeDif = e.timeStamp - qpwRefWindow.options.lastPointerEvent.timeStamp;
  return timeDif < 450;
}

function qpwIsEventPointerLong(e) {
  if (qpwRefWindow.options.lastPointerEvent == null || e == null) {
    return false;
  }
  const timeDif = e.timeStamp - qpwRefWindow.options.lastPointerEvent.timeStamp;
  return timeDif > 720 && timeDif < 1800;
}

function qpwCloseEventPointerInit(e) {
  qpwRefWindow.options.lastPointerEvent = e;
  return qpwStopEvent(e);
}

function qpwHideAllIFrames() {
  var doc_frames = document.getElementsByTagName("iframe");
  for (let doc_frame of doc_frames) {
    doc_frame.style.visibility = "hidden";
  }
}

function qpwShowAllIFrames() {
  var doc_frames = document.getElementsByTagName("iframe");
  for (let doc_frame of doc_frames) {
    doc_frame.style.visibility = "visible";
  }
}

function qpwIsElementVisibleInScroll(element) {
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

function qpwShowElement(element) {
  if (element.id != "QinpelPopMenuID1") {
    qpwClosePopMenu();
  }
  element.style.zIndex = ++qpwRefWindow.options.framesTopZ;
  if (!qpwIsElementVisibleInScroll(element)) {
    element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
  }
  if (element.id.startsWith("QinpelFrameID")) {
    const index = qpwRefWindow.getRefFrameIndexFromFID(element.id);
    if (index > 0) {
      const refFrame = qpwRefWindow.refFrames[index];
      qpwRefWindow.refFrames.splice(index, 1);
      qpwRefWindow.refFrames.unshift(refFrame);
    }
  }
}

function qpwClearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  if (document.selection) {
    document.selection.empty();
  }
}

function qpwStopEvent(event) {
  if (event.preventDefault != undefined) {
    event.preventDefault();
  }
  if (event.stopPropagation != undefined) {
    event.stopPropagation();
  }
  event.cancelBubble = true;
  return false;
}

function qpwVersion() {
  return "0.1.0";
}
