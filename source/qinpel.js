qpInit();

function qpInit() {
  document.qpBody = null;
  document.qpMenu = null;
  document.qpFrames = [];
  document.qpFramesTopZ = 0;
  document.oncontextmenu = qpStopEvent;
  var divBody, divMenu, imgMenu;
  initBody();
  initMenu();
  initBodyEvents();

  function initBody() {
    divBody = document.createElement("div");
    divBody.className = "QinpelBody";
    document.qpBody = divBody;
    document.body.append(divBody);
  }

  function initMenu() {
    divMenu = document.createElement("div");
    divMenu.className = "QinpelMenu";
    divMenu.onclick = onMenuClick;

    // TODO - Put FullScreen feature on a menu item.
    divMenu.ondblclick = onMenuDblClick;
    
    imgMenu = document.createElement("img");
    imgMenu.src = "./assets/qinpel.png";
    imgMenu.alt = "Menu";
    divMenu.append(imgMenu);
    divBody.append(divMenu);
    const refMenu = { divMenu, imgMenu };
    document.qpMenu = refMenu;

    function onMenuClick() {
      qpShowElement(divMenu);
      qpNewFrame("Título", "./frame.html");
    }

    // TODO - Put FullScreen feature on a menu item.
    function onMenuDblClick() {
      document.body.requestFullscreen();
    }
  }

  function initBodyEvents() {
    var bodyDragInitX = 0;
    var bodyDragInitY = 0;
    var bodyDragScrollX = 0;
    var bodyDragScrollY = 0;

    divBody.onmousedown = onBodyDragInit;
    divBody.ondblclick = onBodyDblClick;

    function onBodyDblClick() {
      qpShowElement(divMenu);
      qpClearSelection();
    }

    function onBodyDragInit(e) {
      e = e || window.event;
      qpStopEvent(e);
      bodyDragInitX = e.clientX;
      bodyDragInitY = e.clientY;
      bodyDragScrollX = divBody.scrollLeft;
      bodyDragScrollY = divBody.scrollTop;
      document.onmousemove = onBodyDragMove;
      document.onmouseup = onBodyDragClose;
      qpIFramesHide();
    }

    function onBodyDragMove(e) {
      e = e || window.event;
      qpStopEvent(e);
      var bodyDragDifX = e.clientX - bodyDragInitX;
      var bodyDragDifY = e.clientY - bodyDragInitY;
      var bodyDragNewX = bodyDragScrollX - bodyDragDifX;
      var bodyDragNewY = bodyDragScrollY - bodyDragDifY;
      divBody.scrollTo(bodyDragNewX, bodyDragNewY);
    }

    function onBodyDragClose() {
      document.onmouseup = null;
      document.onmousemove = null;
      qpIFramesShow();
    }
  }
}

function qpNewFrame(title, address) {
  var divFrame = document.createElement("div");
  divFrame.id = newFrameID();
  divFrame.className = "QinpelFrame";
  var divHead, imgMenu, divTitle, imgMinimize, imgMaximize, imgClose;
  createDivHead();
  divFrame.append(divHead);
  var iframeBody;
  createIFrameBody();
  divFrame.append(iframeBody);
  var divFoot, divStatus, imgResize;
  createDivFoot();
  divFrame.append(divFoot);
  makeFrameDrag();
  const refFrame = {
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
  };
  document.qpFrames.push(refFrame);
  document.qpBody.append(divFrame);
  qpShowElement(divFrame);

  function newFrameID() {
    return "QinpelFrameID" + Math.floor(Math.random() * 1_000_000_000);
  }

  function createDivHead() {
    divHead = document.createElement("div");
    divHead.className = "QinpelFrameHead";
    imgMenu = document.createElement("img");
    imgMenu.src = "./assets/menu.png";
    imgMenu.alt = "o";
    imgMenu.onclick = onHeadMenuClick;
    imgMenu.onmousedown = qpStopEvent;
    divHead.append(imgMenu);
    divTitle = document.createElement("div");
    divTitle.className = "QinpelFrameHeadTitle";
    divTitle.innerText = title;
    divHead.append(divTitle);
    imgMinimize = document.createElement("img");
    imgMinimize.src = "./assets/minimize.png";
    imgMinimize.alt = "-";
    imgMinimize.onclick = onHeadMinimizeClick;
    imgMinimize.onmousedown = qpStopEvent;
    divHead.append(imgMinimize);
    imgMaximize = document.createElement("img");
    imgMaximize.src = "./assets/maximize.png";
    imgMaximize.alt = "+";
    imgMaximize.onclick = onHeadMaximizeClick;
    imgMaximize.onmousedown = qpStopEvent;
    divHead.append(imgMaximize);
    imgClose = document.createElement("img");
    imgClose.src = "./assets/close.png";
    imgClose.alt = "x";
    imgClose.onclick = onHeadCloseClick;
    imgClose.onmousedown = qpStopEvent;
    divHead.append(imgClose);

    function onHeadMenuClick(e) {
      qpStopEvent(e);
      qpShowElement(document.qpMenu.divMenu);
    }

    function onHeadMinimizeClick(e) {
      qpStopEvent(e);
      console.log("minimize");
    }

    function onHeadMaximizeClick(e) {
      qpStopEvent(e);
      console.log("maximize");
    }

    function onHeadCloseClick(e) {
      qpStopEvent(e);
      console.log("close");
    }
  }

  function createIFrameBody() {
    iframeBody = document.createElement("iframe");
    iframeBody.className = "QinpelFrameBody";
    iframeBody.src = address;
  }

  function createDivFoot() {
    divFoot = document.createElement("div");
    divFoot.className = "QinpelFrameFoot";
    divStatus = document.createElement("div");
    divStatus.className = "QinpelFrameFootStatus";
    divStatus.innerText = "Status.";
    divFoot.append(divStatus);
    imgResize = document.createElement("img");
    imgResize.src = "./assets/resize.png";
    imgResize.alt = "/";
    divFoot.append(imgResize);
  }

  function makeFrameDrag() {
    var frameDragDifX = 0;
    var frameDragDifY = 0;
    var frameDragPosX = 0;
    var frameDragPosY = 0;
    divHead.onmousedown = onFramePositionInit;
    divStatus.onmousedown = onFramePositionInit;
    imgResize.onmousedown = onFrameResizeInit;

    function onFramePositionInit(e) {
      e = e || window.event;
      qpStopEvent(e);
      frameDragPosX = e.clientX;
      frameDragPosY = e.clientY;
      document.onmousemove = onFramePositionMove;
      document.onmouseup = onFrameDragClose;
      qpIFramesHide();
    }

    function onFramePositionMove(e) {
      e = e || window.event;
      qpStopEvent(e);
      frameDragDifX = frameDragPosX - e.clientX;
      frameDragDifY = frameDragPosY - e.clientY;
      frameDragPosX = e.clientX;
      frameDragPosY = e.clientY;
      var newTop = divFrame.offsetTop - frameDragDifY;
      var newLeft = divFrame.offsetLeft - frameDragDifX;
      divFrame.style.top = (newTop > 0 ? newTop : 0) + "px";
      divFrame.style.left = (newLeft > 0 ? newLeft : 0) + "px";
    }

    function onFrameResizeInit(e) {
      e = e || window.event;
      qpStopEvent(e);
      frameDragPosX = e.clientX;
      frameDragPosY = e.clientY;
      document.onmousemove = onFrameResizeMove;
      document.onmouseup = onFrameDragClose;
      qpIFramesHide();
    }

    function onFrameResizeMove(e) {
      e = e || window.event;
      qpStopEvent(e);
      frameDragDifX = frameDragPosX - e.clientX;
      frameDragDifY = frameDragPosY - e.clientY;
      frameDragPosX = e.clientX;
      frameDragPosY = e.clientY;
      divFrame.style.height = divFrame.clientHeight - frameDragDifY + "px";
      divFrame.style.width = divFrame.clientWidth - frameDragDifX + "px";
    }

    function onFrameDragClose() {
      document.onmouseup = null;
      document.onmousemove = null;
      qpIFramesShow();
      qpShowElement(divFrame);
    }
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
  element.style.zIndex = ++document.qpFramesTopZ;
  document.qpBody.scrollTo(element.offsetLeft - 18, element.offsetTop - 18);
}

function qpClearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

function qpStopEvent(event) {
  if (event.preventDefault != undefined) event.preventDefault();
  if (event.stopPropagation != undefined) event.stopPropagation();
}
