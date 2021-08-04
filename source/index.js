function qinpel() {
  return qpModule;
}

const qpModule = {
  version: qpVersion,
  newFrame: qpNewFrame,
}

const qpRefMain = qpInit();

function qpVersion() {
  return "0.1.0";
}

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
    getRefFrameFromID,
    getRefFrameIndexFromID,
    options: {
      framesTopZ: 0,
    },
  };
  initBody();
  initMenu();
  initBodyEvents();
  initGlobalEvents();
  return refMain;

  function initConstants() {
    // TODO - to determine this constants programmatically
    const POP_MENU_WIDTH = 200;
    const MINIMIZED_WIDTH = 200;
    const result = { POP_MENU_WIDTH, MINIMIZED_WIDTH };
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

    divBody.ondblclick = onBodyDblClick;
    divBody.ondragstart = qpStopEvent;
    divBody.ontouchstart = onBodyTouchInit;
    divBody.onmousedown = onBodyMouseInit;

    function onBodyDblClick() {
      qpShowElement(divMenu);
      qpClearSelection();
    }

    function onBodyTouchInit(e) {
      qpStopEvent(e);
      bodyDragInitX = e.touches[0].clientX;
      bodyDragInitY = e.touches[0].clientY;
      bodyDragScrollX = divBody.scrollLeft;
      bodyDragScrollY = divBody.scrollTop;
      document.ontouchmove = onBodyTouchMove;
      document.ontouchend = onBodyTouchClose;
      qpIFramesHide();
    }

    function onBodyMouseInit(e) {
      qpStopEvent(e);
      bodyDragInitX = e.clientX;
      bodyDragInitY = e.clientY;
      bodyDragScrollX = divBody.scrollLeft;
      bodyDragScrollY = divBody.scrollTop;
      document.onmousemove = onBodyMouseMove;
      document.onmouseup = onBodyMouseClose;
      qpIFramesHide();
    }

    function onBodyTouchMove(e) {
      qpStopEvent(e);
      var bodyDragDifX = e.touches[0].clientX - bodyDragInitX;
      var bodyDragDifY = e.touches[0].clientY - bodyDragInitY;
      var bodyDragNewX = bodyDragScrollX - bodyDragDifX;
      var bodyDragNewY = bodyDragScrollY - bodyDragDifY;
      divBody.scrollTo(bodyDragNewX, bodyDragNewY);
    }

    function onBodyMouseMove(e) {
      qpStopEvent(e);
      var bodyDragDifX = e.clientX - bodyDragInitX;
      var bodyDragDifY = e.clientY - bodyDragInitY;
      var bodyDragNewX = bodyDragScrollX - bodyDragDifX;
      var bodyDragNewY = bodyDragScrollY - bodyDragDifY;
      divBody.scrollTo(bodyDragNewX, bodyDragNewY);
    }

    function onBodyTouchClose() {
      document.ontouchmove = null;
      document.ontouchend = null;
      qpIFramesShow();
      qpClearSelection();
    }

    function onBodyMouseClose() {
      document.onmousemove = null;
      document.onmouseup = null;
      qpIFramesShow();
      qpClearSelection();
    }
  }

  function initGlobalEvents() {
    window.onbeforeunload = () => "";
    document.oncontextmenu = onBodyPopMenu;

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
        qpNewPopMenu(e.clientX, e.clientY, items);
      }
      return qpStopEvent(e);
    }
  }

  function getRefFrameFromID(frameID) {
    for (let index = 0; index < refMain.refFrames.length; index++) {
      const refFrame = refMain.refFrames[index];
      if (refFrame.elements.divFrame.id === frameID) {
        return refFrame;
      }
    }
  }

  function getRefFrameIndexFromID(frameID) {
    for (let index = 0; index < refMain.refFrames.length; index++) {
      const refFrame = refMain.refFrames[index];
      if (refFrame.elements.divFrame.id === frameID) {
        return index;
      }
    }
  }
}

function qpNewPopMenu(posX, posY, items) {
  qpDelPopMenu();
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
  }

  function initDivPopMenuItems() {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const divItem = document.createElement("div");
      divItem.className = "QinpelPopItem";
      divItem.innerText = item.title;
      divItem.onclick = item.onclick;
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

function qpDelPopMenu() {
  if (qpRefMain.refPopMenu != null) {
    qpRefMain.divBody.removeChild(qpRefMain.refPopMenu.elements.divPopMenu);
    qpRefMain.refPopMenu = null;
  }
}

function qpNewFrame(title, address) {
  const frameInitBounds = getFrameInitBounds();
  const rndID = Math.floor(Math.random() * 1_000_000);
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
      lastPosX: frameInitBounds.posX,
      lastPosY: frameInitBounds.posY,
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

  function getFrameInitBounds() {
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
    imgMenu.onmousedown = qpStopEvent;
    divHead.append(imgMenu);
    divTitle.className = "QinpelFrameHeadTitle";
    divTitle.innerText = title;
    divHead.append(divTitle);
    imgMinimize.src = "./assets/minimize.png";
    imgMinimize.alt = "-";
    imgMinimize.onclick = onHeadMinimizeClick;
    imgMinimize.onmousedown = qpStopEvent;
    divHead.append(imgMinimize);
    imgMaximize.src = "./assets/maximize.png";
    imgMaximize.alt = "+";
    imgMaximize.onclick = onHeadMaximizeClick;
    divHead.ondblclick = onHeadMaximizeClick;
    imgMaximize.onmousedown = qpStopEvent;
    divHead.append(imgMaximize);
    imgClose.src = "./assets/close.png";
    imgClose.alt = "x";
    imgClose.onclick = onHeadCloseClick;
    imgClose.onmousedown = qpStopEvent;
    divHead.append(imgClose);
    divFrame.append(divHead);

    function onHeadMenuClick(e) {
      qpShowElement(qpRefMain.refMenu.elements.divMenu);
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
        // TODO - if it is maximized we have to deal with it
        refFrame.options.lastWidth = parseInt(divFrame.style.width, 10);
        refFrame.options.lastHeight = parseInt(divFrame.style.height, 10);
        iframeBody.style.display = "none";
        divFoot.style.display = "none";
        divFrame.style.width = qpRefMain.constants.MINIMIZED_WIDTH + "px";
        divFrame.style.height = divHead.clientHeight + "px";
        refFrame.options.minimized = true;
      }
      return qpStopEvent(e);
    }

    function onHeadMaximizeClick(e) {
      if (refFrame.options.maximized) {
        divFrame.style.left = refFrame.options.lastPosX + "px";
        divFrame.style.top = refFrame.options.lastPosY + "px";
        divFrame.style.width = refFrame.options.lastWidth + "px";
        divFrame.style.height = refFrame.options.lastHeight + "px";
        refFrame.options.maximized = false;
      } else {
        refFrame.options.lastPosX = parseInt(divFrame.style.left, 10);
        refFrame.options.lastPosY = parseInt(divFrame.style.top, 10);
        refFrame.options.lastWidth = parseInt(divFrame.style.width, 10);
        refFrame.options.lastHeight = parseInt(divFrame.style.height, 10);
        divFrame.style.left = qpRefMain.divBody.scrollLeft + "px";
        divFrame.style.top = qpRefMain.divBody.scrollTop + "px";
        divFrame.style.width = qpRefMain.divBody.clientWidth - 4 + "px";
        divFrame.style.height = qpRefMain.divBody.clientHeight - 4 + "px";
        refFrame.options.maximized = true;
      }
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
    divHead.ontouchstart = onTouchPositionInit;
    divStatus.ontouchstart = onTouchPositionInit;
    imgResize.ontouchstart = onTouchResizeInit;
    divHead.onmousedown = onMousePositionInit;
    divStatus.onmousedown = onMousePositionInit;
    imgResize.onmousedown = onMouseResizeInit;

    function onTouchPositionInit(e) {
      qpStopEvent(e);
      frameDragInitEventX = e.touches[0].clientX;
      frameDragInitEventY = e.touches[0].clientY;
      frameDragInitPosX = parseInt(divFrame.style.left, 10);
      frameDragInitPosY = parseInt(divFrame.style.top, 10);
      document.ontouchmove = onTouchPositionMove;
      document.ontouchend = onTouchDragClose;
      qpIFramesHide();
    }

    function onTouchPositionMove(e) {
      qpStopEvent(e);
      var frameDragDifX = e.touches[0].clientX - frameDragInitEventX;
      var frameDragDifY = e.touches[0].clientY - frameDragInitEventY;
      var frameDragFinalX = frameDragInitPosX + frameDragDifX;
      var frameDragFinalY = frameDragInitPosY + frameDragDifY;
      divFrame.style.left = (frameDragFinalX > 0 ? frameDragFinalX : 0) + "px";
      divFrame.style.top = (frameDragFinalY > 0 ? frameDragFinalY : 0) + "px";
    }

    function onTouchResizeInit(e) {
      qpStopEvent(e);
      frameDragInitEventX = e.touches[0].clientX;
      frameDragInitEventY = e.touches[0].clientY;
      frameDragInitWidth = parseInt(divFrame.style.width, 10);
      frameDragInitHeight = parseInt(divFrame.style.height, 10);
      document.ontouchmove = onTouchResizeMove;
      document.ontouchend = onTouchDragClose;
      qpIFramesHide();
    }

    function onTouchResizeMove(e) {
      qpStopEvent(e);
      var frameDragDifX = e.touches[0].clientX - frameDragInitEventX;
      var frameDragDifY = e.touches[0].clientY - frameDragInitEventY;
      var frameDragFinalWidth = frameDragInitWidth + frameDragDifX;
      var frameDragFinalHeight = frameDragInitHeight + frameDragDifY;
      divFrame.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
      divFrame.style.height =
        (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
    }

    function onMousePositionInit(e) {
      qpStopEvent(e);
      frameDragInitEventX = e.clientX;
      frameDragInitEventY = e.clientY;
      frameDragInitPosX = parseInt(divFrame.style.left, 10);
      frameDragInitPosY = parseInt(divFrame.style.top, 10);
      document.onmousemove = onMousePositionMove;
      document.onmouseup = onMouseDragClose;
      qpIFramesHide();
    }

    function onMousePositionMove(e) {
      qpStopEvent(e);
      var frameDragDifX = e.clientX - frameDragInitEventX;
      var frameDragDifY = e.clientY - frameDragInitEventY;
      var frameDragFinalX = frameDragInitPosX + frameDragDifX;
      var frameDragFinalY = frameDragInitPosY + frameDragDifY;
      divFrame.style.left = (frameDragFinalX > 0 ? frameDragFinalX : 0) + "px";
      divFrame.style.top = (frameDragFinalY > 0 ? frameDragFinalY : 0) + "px";
    }

    function onMouseResizeInit(e) {
      qpStopEvent(e);
      frameDragInitEventX = e.clientX;
      frameDragInitEventY = e.clientY;
      frameDragInitWidth = parseInt(divFrame.style.width, 10);
      frameDragInitHeight = parseInt(divFrame.style.height, 10);
      document.onmousemove = onMouseResizeMove;
      document.onmouseup = onMouseDragClose;
      qpIFramesHide();
    }

    function onMouseResizeMove(e) {
      qpStopEvent(e);
      var frameDragDifX = e.clientX - frameDragInitEventX;
      var frameDragDifY = e.clientY - frameDragInitEventY;
      var frameDragFinalWidth = frameDragInitWidth + frameDragDifX;
      var frameDragFinalHeight = frameDragInitHeight + frameDragDifY;
      divFrame.style.width = (frameDragFinalWidth > 0 ? frameDragFinalWidth : 0) + "px";
      divFrame.style.height =
        (frameDragFinalHeight > 0 ? frameDragFinalHeight : 0) + "px";
    }

    function onMouseDragClose() {
      document.onmousemove = null;
      document.onmouseup = null;
      qpIFramesShow();
      qpClearSelection();
      qpShowElement(divFrame);
    }

    function onTouchDragClose() {
      document.ontouchmove = null;
      document.ontouchend = null;
      qpIFramesShow();
      qpClearSelection();
      qpShowElement(divFrame);
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

function qpIFramesHide() {
  var doc_frames = document.getElementsByTagName("iframe");
  for (let doc_frame of doc_frames) {
    doc_frame.style.visibility = "hidden";
  }
}

function qpIFramesShow() {
  var doc_frames = document.getElementsByTagName("iframe");
  for (let doc_frame of doc_frames) {
    doc_frame.style.visibility = "visible";
  }
}

function qpShowElement(element) {
  if (element.id != "QinpelPopMenuID1") {
    qpDelPopMenu();
  }
  element.style.zIndex = ++qpRefMain.options.framesTopZ;
  qpRefMain.divBody.scrollTo(element.offsetLeft - 18, element.offsetTop - 18);
  if (element.id.startsWith("QinpelFrameID")) {
    const index = qpRefMain.getRefFrameIndexFromID(element.id);
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
    if (event.defaultPrevented) {
      event.preventDefault();
    }
  }
  if (event.stopPropagation != undefined) {
    event.stopPropagation();
  }
  event.cancelBubble = true;
  return false;
}
