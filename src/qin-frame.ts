import { QinBounds, QinGrandeur, QinSoul, QinHead, QinWaiter } from "qinpel-res";
import { QinFrameDialog } from "./qin-frame-dialog";
import { QinFramePopup } from "./qin-frame-popup";
import { QinManager } from "./qin-manager";
import { Qinpel } from "./qinpel";

export { QinFrameDialog } from "./qin-frame-dialog";
export { QinFramePopup } from "./qin-frame-popup";

export class QinFrame {
  private manager: QinManager;
  private title: string;
  private appName: string;
  private options: any;
  private waiters: QinWaiter[] = [];
  private rndID = Math.floor(Math.random() * 1000000);
  private divFrame = document.createElement("div");
  private divHead = document.createElement("div");
  private imgMenu = document.createElement("img");
  private divTitle = document.createElement("div");
  private imgMinimize = document.createElement("img");
  private imgMaximize = document.createElement("img");
  private imgClose = document.createElement("img");
  private divBody = document.createElement("div");
  private iframeBody = document.createElement("iframe");
  private statusBody = document.createElement("div");
  private divFoot = document.createElement("div");
  private footStatusType = document.createElement("img");
  private footStatusText = document.createElement("div");
  private footResize = document.createElement("img");

  private seeStatus = false;
  private minimized = false;
  private maximized = false;
  private lastWidth = -1;
  private lastHeight = -1;

  public constructor(
    manager: QinManager,
    title: string,
    appName: string,
    options?: any
  ) {
    this.manager = manager;
    this.title = this.initFrameTitle(title);
    this.appName = appName;
    this.options = options ? options : {};
    this.initDivFrame();
    this.initDivHead();
    this.initDivBody();
    this.initIFrameBody();
    this.initStatusBody();
    this.initDivFoot();
    this.initDraggable();
  }

  private initFrameTitle(title: string): string {
    var result = title;
    var attempt = 1;
    while (true) {
      if (this.manager.getFrame(result) != null) {
        result = title + " (" + ++attempt + ")";
      } else {
        break;
      }
    }
    return result;
  }

  private initDivFrame() {
    this.divFrame.id = "QinpelFrameID" + this.rndID;
    styles.applyOnDivFrame(this.divFrame);
    const frameInitBounds = this.loadFrameInitBounds();
    this.divFrame.style.left = frameInitBounds.posX + "px";
    this.divFrame.style.top = frameInitBounds.posY + "px";
    this.divFrame.style.width = frameInitBounds.width + "px";
    this.divFrame.style.height = frameInitBounds.height + "px";
    this.lastWidth = frameInitBounds.width;
    this.lastHeight = frameInitBounds.height;
  }

  private loadFrameInitBounds(): QinBounds {
    const result = {
      posX: 64,
      posY: 64,
      width: 800,
      height: 600,
    };
    let windowSizeStyle = QinSoul.skin.getWindowSizeStyle();
    const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
    const frameBoundsSaved = window.localStorage.getItem(frameStyleID);
    if (frameBoundsSaved) {
      let parts = frameBoundsSaved.split(",");
      result.posX = Number(parts[0]);
      result.posY = Number(parts[1]);
      result.width = Number(parts[2]);
      result.height = Number(parts[3]);
    } else {
      if (windowSizeStyle === QinGrandeur.SMALL) {
        result.posX = 0;
        result.posY = 0;
        const size = QinSoul.skin.getWindowSize();
        result.width = size.width - 4;
        result.height = size.height - 4;
      } else if (windowSizeStyle === QinGrandeur.MEDIUM) {
        result.posX = 48;
        result.posY = 48;
        result.width = 500;
        result.height = 375;
      }
    }
    return result;
  }

  private getFrameWindowStyleID(windowSizeStyle: QinGrandeur): string {
    return "window " + windowSizeStyle + " size of: " + this.title;
  }

  private initDivHead() {
    styles.applyOnDivHead(this.divHead);
    this.imgMenu.src = "./assets/frame-menu.png";
    this.imgMenu.alt = "o";
    QinSoul.arm.addAction(this.imgMenu, () => this.headMenuAction());
    this.divHead.appendChild(this.imgMenu);
    this.divTitle.style.flex = "1";
    this.divTitle.style.fontSize = "14px";
    this.divTitle.innerText = this.title;
    this.divHead.appendChild(this.divTitle);
    this.imgMinimize.src = "./assets/frame-minimize.png";
    this.imgMinimize.alt = "-";
    QinSoul.arm.addAction(this.imgMinimize, () => this.headMinimizeAction());
    this.divHead.appendChild(this.imgMinimize);
    this.imgMaximize.src = "./assets/frame-maximize.png";
    this.imgMaximize.alt = "+";
    QinSoul.arm.addAction(this.imgMaximize, () => this.headMaximizeAction());
    this.divHead.appendChild(this.imgMaximize);
    this.imgClose.src = "./assets/frame-close.png";
    this.imgClose.alt = "x";
    QinSoul.arm.addAction(this.imgClose, () => this.headCloseAction());
    this.divHead.appendChild(this.imgClose);
    this.divFrame.appendChild(this.divHead);
  }

  private initDivBody() {
    this.divBody.id = "QinpelDivBodyID" + this.rndID;
    styles.applyOnDivBody(this.divBody);
    this.divFrame.appendChild(this.divBody);
  }

  private initIFrameBody() {
    this.iframeBody.id = "QinpelIFrameBodyID" + this.rndID;
    styles.applyOnIFrameBody(this.iframeBody);
    this.iframeBody.style.display = "initial";
    let address = this.appName;
    if (!address.startsWith("/app/")) {
      address = "/app/" + address + "/index.html";
    }
    this.iframeBody.src = address;
    this.iframeBody.onload = (_) => {
      styles.applyOnIFrameLoad(this.iframeBody);
    };
    this.divBody.appendChild(this.iframeBody);
  }

  private initStatusBody() {
    this.statusBody.id = "QinpelStatusBodyID" + this.rndID;
    styles.applyOnStatusBody(this.statusBody);
    this.statusBody.style.display = "none";
    this.divBody.appendChild(this.statusBody);
  }

  private initDivFoot() {
    styles.applyOnDivFoot(this.divFoot);
    this.footStatusType.src = "./assets/frame-status-info.png";
    QinSoul.arm.addAction(this.footStatusType, (ev) => {
      if (ev.isPrimary) {
        this.switchStatus();
      }
    });
    this.divFoot.appendChild(this.footStatusType);
    styles.applyOnStatusText(this.footStatusText);
    this.footStatusText.innerText = "StatusBar";
    this.divFoot.appendChild(this.footStatusText);
    this.footResize.src = "./assets/frame-resize.png";
    this.footResize.alt = "/";
    this.divFoot.appendChild(this.footResize);
    this.divFrame.appendChild(this.divFoot);
  }

  private initDraggable() {
    QinSoul.arm.addMover([this.divHead, this.footStatusText], this.divFrame, {
      onDouble: () => this.headMaximizeAction(),
      onEnd: () => {
        this.manager.showElement(this.divFrame);
        QinSoul.skin.clearSelection();
      },
    });
    QinSoul.arm.addResizer([this.footResize], this.divFrame, {
      onDouble: () => this.headMaximizeAction(),
      onEnd: () => {
        this.maximized = false;
        this.lastWidth = parseInt(this.divFrame.style.width, 10);
        this.lastHeight = parseInt(this.divFrame.style.height, 10);
        this.manager.showElement(this.divFrame);
        QinSoul.skin.clearSelection();
      },
    });
  }

  private switchStatus() {
    if (this.seeStatus) {
      this.statusBody.style.display = "none";
      this.iframeBody.style.display = "initial";
      this.seeStatus = false;
    } else {
      this.iframeBody.style.display = "none";
      this.statusBody.style.display = "initial";
      this.statusBody.scrollTop = this.statusBody.scrollHeight;
      this.seeStatus = true;
    }
  }

  public getManager(): QinManager {
    return this.manager;
  }

  public getTitle(): string {
    return this.title;
  }

  public getAppName(): string {
    return this.appName;
  }

  public getOption(name: string): any {
    return this.options[name];
  }

  public setOption(name: string, value: any) {
    this.options[name] = value;
  }

  public putOptions(options: any) {
    if (options) {
      Object.assign(this.options, options);
    }
  }

  public cleanOptions() {
    this.options = {};
  }

  public addWaiter(waiter: QinWaiter) {
    this.waiters.push(waiter);
  }

  public hasWaiters(): boolean {
    return this.waiters.length > 0;
  }

  public sendWaiters(withResult: any) {
    for (const waiter of this.waiters) {
      waiter(withResult);
    }
  }

  public cleanWaiters() {
    this.waiters = [];
  }

  public getID(): string {
    return this.divFrame.id;
  }

  public install() {
    //@ts-ignore
    this.iframeBody.qinpel = new Qinpel(this.manager, this);
    this.manager.addChild(this.divFrame);
    this.show();
  }

  public headMenuAction() {
    this.manager.showMenu();
  }

  public headMinimizeAction() {
    this.minimize();
  }

  public headMaximizeAction() {
    this.maximize();
  }

  public headCloseAction() {
    this.close();
  }

  public statusInfo(message: string) {
    this.footStatusText.innerText = this.getDisplayStatusMessage(message);
    let divInfo = document.createElement("div");
    divInfo.innerText = message;
    styles.applyOnStatusBodyItem(divInfo);
    divInfo.style.backgroundColor = "#0f9d5827"
    this.statusBody.appendChild(divInfo);
  }

  public statusError(error: any, origin: string) {
    let message = QinHead.getErrorMessage(error, origin);
    this.footStatusText.innerText = this.getDisplayStatusMessage(message);
    this.footStatusType.src = "./assets/frame-status-error.png";
    let divError = document.createElement("div");
    divError.innerText = message;
    styles.applyOnStatusBodyItem(divError);
    divError.style.backgroundColor = "#e5091427"
    this.statusBody.appendChild(divError);
  }

  private getDisplayStatusMessage(message: string): string {
    if (message.length > FrameConfigs.STATUS_MESSAGE_MAX_LENGTH) {
      return message.substring(0, FrameConfigs.STATUS_MESSAGE_MAX_LENGTH);
    } else {
      return message;
    }
  }

  public saveFrameBounds() {
    let windowSizeStyle = QinSoul.skin.getWindowSizeStyle();
    const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
    const frameBounds =
      parseInt(this.divFrame.style.left, 10) +
      "," +
      parseInt(this.divFrame.style.top, 10) +
      "," +
      parseInt(this.divFrame.style.width, 10) +
      "," +
      parseInt(this.divFrame.style.height, 10);
    window.localStorage.setItem(frameStyleID, frameBounds);
  }

  public show() {
    this.manager.showElement(this.divFrame);
  }

  public minimize() {
    if (this.minimized) {
      this.divFrame.style.width = this.lastWidth + "px";
      this.divFrame.style.height = this.lastHeight + "px";
      this.iframeBody.style.display = "";
      this.divFoot.style.display = "";
      this.minimized = false;
    } else {
      if (this.maximized) {
        this.headMaximizeAction();
      }
      this.lastWidth = parseInt(this.divFrame.style.width, 10);
      this.lastHeight = parseInt(this.divFrame.style.height, 10);
      this.iframeBody.style.display = "none";
      this.divFoot.style.display = "none";
      this.divFrame.style.width = FrameConfigs.MINIMIZED_WIDTH + "px";
      this.divFrame.style.height = this.divHead.clientHeight + "px";
      this.minimized = true;
    }
    this.manager.showElement(this.divFrame);
  }

  public maximize() {
    if (this.maximized) {
      this.divFrame.style.width = this.lastWidth + "px";
      this.divFrame.style.height = this.lastHeight + "px";
      this.maximized = false;
    } else {
      if (this.minimized) {
        this.headMinimizeAction();
      }
      this.lastWidth = parseInt(this.divFrame.style.width, 10);
      this.lastHeight = parseInt(this.divFrame.style.height, 10);
      this.divFrame.style.width = this.manager.getBodyWidth() - 4 + "px";
      this.divFrame.style.height = this.manager.getBodyHeight() - 4 + "px";
      this.maximized = true;
    }
    this.manager.showElement(this.divFrame);
  }

  public close() {
    this.saveFrameBounds();
    this.manager.delChild(this.divFrame);
    this.manager.delFrame(this);
  }

  public getIFrame(): HTMLIFrameElement {
    return this.iframeBody;
  }

  public getIFrameDocument(): Document {
    return this.iframeBody.contentWindow.document;
  }

  public newDialog(title: string, divContent: HTMLDivElement): QinFrameDialog {
    return new QinFrameDialog(this, title, divContent);
  }

  public newPopup(divContent: HTMLDivElement): QinFramePopup {
    return new QinFramePopup(this, divContent);
  }

  public navigate(url: string) {
    this.iframeBody.src = url;
  }
}

const FrameConfigs = {
  POP_MENU_MAX_HEIGHT: 270,
  POP_MENU_WIDTH: 180,
  MINIMIZED_WIDTH: 180,
  STATUS_MESSAGE_MAX_LENGTH: 180,
};

const styles = {
  applyOnDivFrame: (el: HTMLDivElement) => {
    el.style.backgroundColor = "#878787";
    el.style.border = "2px solid #6c6c6c";
    el.style.borderStyle = "outset";
    el.style.borderRadius = "4px";
    el.style.position = "absolute";
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.overflow = "hidden";
  },
  applyOnDivHead: (el: HTMLDivElement) => {
    el.style.padding = "3px";
    el.style.backgroundColor = "#545454";
    el.style.color = "white";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.flexWrap = "wrap";
    el.style.cursor = "default";
  },
  applyOnDivBody: (el: HTMLDivElement) => {
    el.style.flex = "1";
    el.style.display = "flex";
    el.style.backgroundColor = "#f1f1f1";
    el.style.minWidth = "10px";
    el.style.minHeight = "10px";
  },
  applyOnIFrameBody: (el: HTMLIFrameElement) => {
    el.style.flex = "1";
    el.style.backgroundColor = "#f1f1f1";
  },
  applyOnStatusBody: (el: HTMLDivElement) => {
    el.style.flex = "1";
    el.style.backgroundColor = "#3b599827";
    el.style.padding = "9px";
    el.style.fontSize = "16px";
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.overflow = "scroll";
  },
  applyOnStatusBodyItem: (el: HTMLDivElement) => {
    el.style.margin = "9px";
    el.style.padding = "9px";
    el.style.borderRadius = "7px";
  },
  applyOnIFrameLoad: (el: HTMLIFrameElement) => {
    const head = el.contentWindow.document.head;
    const defaultCSS = document.createElement("link");
    defaultCSS.id = "QinpelIFrameDefaultCSS";
    defaultCSS.rel = "stylesheet";
    defaultCSS.type = "text/css";
    defaultCSS.href = "/app/qinpel-app/default.css";
    defaultCSS.media = "all";
    head.appendChild(defaultCSS);
  },
  applyOnDivFoot: (el: HTMLDivElement) => {
    el.style.padding = "3px";
    el.style.backgroundColor = "#545454";
    el.style.color = "#cfcfcf";
    el.style.display = "flex";
    el.style.alignItems = "flex-end";
    el.style.flexWrap = "wrap";
    el.style.cursor = "default";
  },
  applyOnStatusText: (el: HTMLDivElement) => {
    el.style.flex = "1";
    el.style.whiteSpace = "nowrap";
    el.style.overflow = "hidden";
    el.style.fontSize = "14px";
  },
};
