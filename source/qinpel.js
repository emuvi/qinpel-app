const qpState = qpInit();

function qpInit() {
  const divBody = document.createElement("div");
  const divMenu = document.createElement("div");
  const imgMenu = document.createElement("img");
  const refMenu = {
    elements: { divMenu, imgMenu },
  };
  const constants = initConstants();
  const result = {
    divBody,
    refMenu,
    constants,
    frames: [],
    options: {
      framesTopZ: 0,
    },
  };
  initBody();
  initMenu();
  initBodyEvents();
  initDocEvents();
  return result;

  function initConstants() {
    // TODO - to determine programmatically the MINIMIZED_WIDTH
    const MINIMIZED_WIDTH = 200;
    const result = { MINIMIZED_WIDTH };
    return result;
  }

  function initBody() {
    divBody.className = "QinpelBody";
    document.body.append(divBody);
  }

  function initMenu() {
    divMenu.className = "QinpelMenu";
    divMenu.onclick = onMenuClick;

    // TODO - put fullscreen feature on a menu item.
    divMenu.ondblclick = onMenuDblClick;

    imgMenu.src = "./assets/qinpel.png";
    imgMenu.alt = "Menu";
    divMenu.append(imgMenu);
    divBody.append(divMenu);

    function onMenuClick() {
      qpShowElement(divMenu);
      qpNewFrame("Título", "./frame.html");
    }

    // TODO - put fullscreen feature on a menu item.
    function onMenuDblClick() {
      document.body.requestFullscreen();
    }
  }

  function initBodyEvents() {
    var bodyDragInitX = 0;
    var bodyDragInitY = 0;
    var bodyDragScrollX = 0;
    var bodyDragScrollY = 0;

    divBody.ondblclick = onBodyDblClick;
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

  function initDocEvents() {
    // TODO - create a menu list of opened frames to switch between them.
    document.oncontextmenu = qpStopEvent;
  }
}

function qpNewFrame(title, address) {
  const frameInitBounds = getFrameInitBounds();
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
  qpState.frames.push(refFrame);
  qpState.divBody.append(divFrame);
  qpShowElement(divFrame);

  function newFrameID() {
    return "QinpelFrameID" + Math.floor(Math.random() * 1_000_000);
  }

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
    divFrame.id = newFrameID();
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
      qpStopEvent(e);
      qpShowElement(qpState.refMenu.elements.divMenu);
    }

    function onHeadMinimizeClick(e) {
      qpStopEvent(e);
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
        divFrame.style.width = qpState.constants.MINIMIZED_WIDTH + "px";
        divFrame.style.height = divHead.clientHeight + "px";
        refFrame.options.minimized = true;
      }
    }

    function onHeadMaximizeClick(e) {
      qpStopEvent(e);
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
        divFrame.style.left = qpState.divBody.scrollLeft + "px";
        divFrame.style.top = qpState.divBody.scrollTop + "px";
        divFrame.style.width = qpState.divBody.clientWidth - 4 + "px";
        divFrame.style.height = qpState.divBody.clientHeight - 4 + "px";
        refFrame.options.maximized = true;
      }
    }

    function onHeadCloseClick(e) {
      qpStopEvent(e);
      // TODO - save on local persistence the actual frame bounds for the actual qpWindowSizeStyles.
      const index = qpState.frames.indexOf(refFrame);
      if (index > -1) {
        qpState.frames.splice(index, 1);
      }
      qpState.divBody.removeChild(divFrame);
    }
  }

  function initIFrameBody() {
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
  element.style.zIndex = ++qpState.options.framesTopZ;
  qpState.divBody.scrollTo(element.offsetLeft - 18, element.offsetTop - 18);
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
