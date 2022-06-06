import {
  QinArms,
  QinBody,
  QinBounds,
  QinGrandeur,
  QinHead,
  QinLegs,
  QinSkin,
  QinSoul,
  QinWaiter,
} from "qinpel-res";
import { QinChief } from "./qin-chief";
import { QinJobberDialog } from "./qin-jobber-dialog";
import { QinJobberPopup } from "./qin-jobber-popup";
import { Qinpel } from "./qinpel";

export { QinJobberDialog } from "./qin-jobber-dialog";
export { QinJobberPopup } from "./qin-jobber-popup";

export class QinJobber {
  private _chief: QinChief;
  private _title: string;
  private _appNameOrAddress: string;
  private _appName: string;
  private _options: any;
  private _waiters: QinWaiter[] = [];
  private _rndID = Math.floor(Math.random() * 1000000);
  private _divFrame = document.createElement("div");
  private _divHead = document.createElement("div");
  private _imgMenu = document.createElement("img");
  private _divTitle = document.createElement("div");
  private _imgMinimize = document.createElement("img");
  private _imgMaximize = document.createElement("img");
  private _imgClose = document.createElement("img");
  private _divBody = document.createElement("div");
  private _iframeBody = document.createElement("iframe");
  private _statusBody = document.createElement("div");
  private _divFoot = document.createElement("div");
  private _footStatusType = document.createElement("img");
  private _footStatusText = document.createElement("div");
  private _footResize = document.createElement("img");

  private _seeStatus = false;
  private _minimized = false;
  private _maximized = false;
  private _lastWidth = -1;
  private _lastHeight = -1;

  public constructor(chief: QinChief, title: string, appNameOrAddress: string, options?: any) {
    this._chief = chief;
    this._title = this.initFrameTitle(title);
    this._appNameOrAddress = appNameOrAddress;
    this._options = options ? options : {};
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
      if (this._chief.getJobber(result) != null) {
        result = title + " (" + ++attempt + ")";
      } else {
        break;
      }
    }
    return result;
  }

  private initDivFrame() {
    this._divFrame.id = "QinpelFrameID" + this._rndID;
    styles.applyOnDivFrame(this._divFrame);
    const frameInitBounds = this.loadFrameInitBounds();
    this._divFrame.style.left = frameInitBounds.posX + "px";
    this._divFrame.style.top = frameInitBounds.posY + "px";
    this._divFrame.style.width = frameInitBounds.width + "px";
    this._divFrame.style.height = frameInitBounds.height + "px";
    this._lastWidth = frameInitBounds.width;
    this._lastHeight = frameInitBounds.height;
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
    const frameBoundsSaved = this._chief.loadConfig(frameStyleID);
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
    return "window " + windowSizeStyle + " size of: " + this._title;
  }

  private initDivHead() {
    styles.applyOnDivHead(this._divHead);
    this._imgMenu.src = "./assets/jobber-menu.png";
    styles.applyOnDivEdgeIcon(this._imgMenu);
    this._imgMenu.alt = "o";
    QinArms.addActionMain(this._imgMenu, () => this.showChiefMenu());
    this._divHead.appendChild(this._imgMenu);
    styles.applyOnDivHeadTitle(this._divTitle);
    this._divTitle.innerText = this._title;
    this._divHead.appendChild(this._divTitle);
    this._imgMinimize.src = "./assets/jobber-minimize.png";
    styles.applyOnDivEdgeIcon(this._imgMinimize);
    this._imgMinimize.alt = "-";
    QinArms.addActionMain(this._imgMinimize, () => this.minimize());
    this._divHead.appendChild(this._imgMinimize);
    this._imgMaximize.src = "./assets/jobber-maximize.png";
    styles.applyOnDivEdgeIcon(this._imgMaximize);
    this._imgMaximize.alt = "+";
    QinArms.addActionMain(this._imgMaximize, () => this.maximize());
    this._divHead.appendChild(this._imgMaximize);
    this._imgClose.src = "./assets/jobber-close.png";
    styles.applyOnDivEdgeIcon(this._imgClose);
    this._imgClose.alt = "x";
    QinArms.addActionMain(this._imgClose, () => this.close());
    this._divHead.appendChild(this._imgClose);
    this._divFrame.appendChild(this._divHead);
  }

  private initDivBody() {
    this._divBody.id = "QinpelDivBodyID" + this._rndID;
    styles.applyOnDivBody(this._divBody);
    this._divFrame.appendChild(this._divBody);
  }

  private initIFrameBody() {
    this._iframeBody.id = "QinpelIFrameBodyID" + this._rndID;
    styles.applyOnIFrameBody(this._iframeBody);
    this._iframeBody.style.display = "initial";
    let address = this._appNameOrAddress;
    if (!address.startsWith("/app/")) {
      this._appName = address;
      address = "/app/" + address + "/index.html";
    } else {
      this._appName = address.substring(5);
      let nextSlash = this._appName.indexOf("/");
      if (nextSlash > 0) {
        this._appName = this._appName.substring(0, nextSlash);
      }
    }
    this._iframeBody.src = address;
    this._iframeBody.onload = (_) => {
      styles.applyOnIFrameLoad(this._iframeBody);
    };
    this._divBody.appendChild(this._iframeBody);
  }

  private initStatusBody() {
    this._statusBody.id = "QinpelStatusBodyID" + this._rndID;
    styles.applyOnStatusBody(this._statusBody);
    this._statusBody.style.display = "none";
    this._divBody.appendChild(this._statusBody);
  }

  private initDivFoot() {
    styles.applyOnDivFoot(this._divFoot);
    this._footStatusType.src = "./assets/jobber-status-info.png";
    styles.applyOnDivEdgeIcon(this._footStatusType);
    QinSoul.arms.addAction(this._footStatusType, (ev) => {
      if (ev.isMain) {
        this.switchStatus();
      }
    });
    this._divFoot.appendChild(this._footStatusType);
    styles.applyOnStatusText(this._footStatusText);
    this._footStatusText.innerText = "StatusBar";
    this._divFoot.appendChild(this._footStatusText);
    this._footResize.src = "./assets/jobber-resize.png";
    styles.applyOnDivEdgeIcon(this._footResize);
    this._footResize.alt = "/";
    this._divFoot.appendChild(this._footResize);
    this._divFrame.appendChild(this._divFoot);
  }

  private initDraggable() {
    QinSoul.arms.addMover([this._divTitle, this._footStatusText], this._divFrame, {
      onDouble: () => this.maximize(),
      onEnd: () => {
        this._chief.showElement(this._divFrame);
        QinSoul.skin.clearSelection();
      },
    });
    QinSoul.arms.addResizer([this._footResize], this._divFrame, {
      onDouble: () => this.maximize(),
      onEnd: () => {
        this._maximized = false;
        this._lastWidth = parseInt(this._divFrame.style.width, 10);
        this._lastHeight = parseInt(this._divFrame.style.height, 10);
        this._chief.showElement(this._divFrame);
        QinSoul.skin.clearSelection();
      },
    });
  }

  private switchStatus() {
    if (this._seeStatus) {
      this._statusBody.style.display = "none";
      this._iframeBody.style.display = "initial";
      this._seeStatus = false;
    } else {
      this._iframeBody.style.display = "none";
      this._statusBody.style.display = "initial";
      this._statusBody.scrollTop = this._statusBody.scrollHeight;
      this._seeStatus = true;
    }
  }

  public get chief(): QinChief {
    return this._chief;
  }

  public get title(): string {
    return this._title;
  }

  public get appName(): string {
    return this._appName;
  }

  public getOption(name: string): any {
    return this._options[name];
  }

  public setOption(name: string, value: any) {
    this._options[name] = value;
  }

  public putOptions(options: any) {
    if (options) {
      Object.assign(this._options, options);
    }
  }

  public cleanOptions() {
    this._options = {};
  }

  public addWaiter(waiter: QinWaiter) {
    this._waiters.push(waiter);
  }

  public hasWaiters(): boolean {
    return this._waiters.length > 0;
  }

  public sendWaiters(withResult: any) {
    for (const waiter of this._waiters) {
      waiter(withResult);
    }
  }

  public cleanWaiters() {
    this._waiters = [];
  }

  public getMainID(): string {
    return this._divFrame.id;
  }

  public install() {
    //@ts-ignore
    this._iframeBody.qinpel = new Qinpel(this._chief, this);
    this._chief.addChild(this._divFrame);
    this.show();
  }

  public statusInfo(info: any, origin: string) {
    let message = QinHead.getInfoMessage(info, origin);
    this._footStatusText.innerText = this.getDisplayStatusMessage(message);
    let divInfo = document.createElement("div");
    divInfo.innerText = message;
    styles.applyOnStatusBodyItem(divInfo);
    divInfo.style.backgroundColor = "#0f9d5827";
    this._statusBody.appendChild(divInfo);
  }

  public statusError(error: any, origin: string) {
    let message = QinHead.getErrorMessage(error, origin);
    this._footStatusText.innerText = this.getDisplayStatusMessage(message);
    this._footStatusType.src = "./assets/jobber-status-error.png";
    let divError = document.createElement("div");
    divError.innerText = message;
    styles.applyOnStatusBodyItem(divError);
    divError.style.backgroundColor = "#e5091427";
    this._statusBody.appendChild(divError);
  }

  private getDisplayStatusMessage(message: string): string {
    let firstBreak = message.indexOf("\n");
    if (firstBreak > -1) {
      return message.substring(0, firstBreak);
    } else {
      return message;
    }
  }

  public saveFrameBounds() {
    let windowSizeStyle = QinSoul.skin.getWindowSizeStyle();
    const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
    const frameBounds =
      parseInt(this._divFrame.style.left, 10) +
      "," +
      parseInt(this._divFrame.style.top, 10) +
      "," +
      parseInt(this._divFrame.style.width, 10) +
      "," +
      parseInt(this._divFrame.style.height, 10);
    this._chief.saveConfig(frameStyleID, frameBounds);
  }

  public show() {
    this._chief.showElement(this._divFrame);
  }

  public showChiefMenu() {
    this._chief.showMenu();
  }

  public minimize() {
    if (this._minimized) {
      this._divFrame.style.width = this._lastWidth + "px";
      this._divFrame.style.height = this._lastHeight + "px";
      this._iframeBody.style.display = "initial";
      this._divFoot.style.display = "initial";
      this._minimized = false;
    } else {
      if (this._maximized) {
        this.maximize();
      }
      this._lastWidth = parseInt(this._divFrame.style.width, 10);
      this._lastHeight = parseInt(this._divFrame.style.height, 10);
      this._iframeBody.style.display = "none";
      this._divFoot.style.display = "none";
      this._divFrame.style.width = JobberSetup.MINIMIZED_WIDTH + "px";
      this._divFrame.style.height = this._divHead.clientHeight + "px";
      this._minimized = true;
    }
    this._chief.showElement(this._divFrame);
  }

  public maximize() {
    if (this._maximized) {
      this._divFrame.style.width = this._lastWidth + "px";
      this._divFrame.style.height = this._lastHeight + "px";
      this._maximized = false;
    } else {
      if (this._minimized) {
        this.minimize();
      }
      this._lastWidth = parseInt(this._divFrame.style.width, 10);
      this._lastHeight = parseInt(this._divFrame.style.height, 10);
      this._divFrame.style.width = this._chief.getBodyWidth() - 4 + "px";
      this._divFrame.style.height = this._chief.getBodyHeight() - 4 + "px";
      this._maximized = true;
    }
    this._chief.showElement(this._divFrame);
  }

  public getIFrame(): HTMLIFrameElement {
    return this._iframeBody;
  }

  public getIFrameDoc(): Document {
    return this._iframeBody.contentWindow.document;
  }

  public newDialog(title: string, divContent: HTMLDivElement): QinJobberDialog {
    return new QinJobberDialog(this, title, divContent);
  }

  public newPopup(divContent: HTMLDivElement): QinJobberPopup {
    return new QinJobberPopup(this, divContent);
  }

  public showAlert(message: string) {
    const divBody = document.createElement("div");
    const popup = this.newPopup(divBody);
    divBody.style.display = "flex";
    divBody.style.flexDirection = "column";
    divBody.style.padding = "12px";
    const divMessage = this.newMessageLines(message);
    divBody.appendChild(divMessage);
    const divButton = document.createElement("div");
    divBody.appendChild(divButton);
    divButton.style.display = "flex";
    divButton.style.justifyContent = "center";
    divButton.style.marginTop = "6px";
    const button = document.createElement("button");
    divButton.appendChild(button);
    QinSkin.styleAsEditable(button);
    button.innerText = "Ok";
    button.onclick = () => {
      popup.close();
    };
    popup.show();
  }

  public showDialog(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const divBody = document.createElement("div");
      const popup = this.newPopup(divBody);
      divBody.style.display = "flex";
      divBody.style.flexDirection = "column";
      divBody.style.padding = "12px";
      const divMessage = this.newMessageLines(message);
      divBody.appendChild(divMessage);
      const divButton = document.createElement("div");
      divBody.appendChild(divButton);
      divButton.style.display = "flex";
      divButton.style.justifyContent = "center";
      divButton.style.marginTop = "6px";
      const btnOk = document.createElement("button");
      divButton.appendChild(btnOk);
      QinSkin.styleAsEditable(btnOk);
      btnOk.innerText = "Ok";
      var confirmed = false;
      btnOk.onclick = () => {
        confirmed = true;
        popup.close();
      };
      const btnCancel = document.createElement("button");
      divButton.appendChild(btnCancel);
      QinSkin.styleAsEditable(btnCancel);
      btnCancel.innerText = "Cancel";
      btnCancel.onclick = () => {
        popup.close();
      };
      popup.addOnClose(() => {
        resolve(confirmed);
      });
      popup.show();
    });
  }

  public showInfo(info: any, origin: string) {
    const divBody = document.createElement("div");
    const popup = this.newPopup(divBody);
    divBody.style.display = "flex";
    divBody.style.flexDirection = "column";
    divBody.style.padding = "12px";
    const divIcon = document.createElement("div");
    divBody.appendChild(divIcon);
    divIcon.style.display = "flex";
    divIcon.style.justifyContent = "center";
    divIcon.style.marginBottom = "6px";
    const icon = document.createElement("img");
    icon.src = "/app/qinpel-app/assets/jobber-status-info.png";
    icon.style.width = "24px";
    icon.style.height = "24px";
    divIcon.appendChild(icon);
    const divMessage = this.newMessageLines(QinHead.getInfoMessage(info, origin));
    divBody.appendChild(divMessage);
    const divButton = document.createElement("div");
    divBody.appendChild(divButton);
    divButton.style.display = "flex";
    divButton.style.justifyContent = "center";
    divButton.style.marginTop = "6px";
    const button = document.createElement("button");
    divButton.appendChild(button);
    QinSkin.styleAsEditable(button);
    button.innerText = "Ok";
    button.onclick = () => {
      popup.close();
    };
    popup.show();
  }

  public showError(error: any, origin: string) {
    const divBody = document.createElement("div");
    const popup = this.newPopup(divBody);
    divBody.style.display = "flex";
    divBody.style.flexDirection = "column";
    divBody.style.padding = "12px";
    const divIcon = document.createElement("div");
    divBody.appendChild(divIcon);
    divIcon.style.display = "flex";
    divIcon.style.justifyContent = "center";
    divIcon.style.marginBottom = "6px";
    const icon = document.createElement("img");
    icon.src = "/app/qinpel-app/assets/jobber-status-error.png";
    icon.style.width = "24px";
    icon.style.height = "24px";
    divIcon.appendChild(icon);
    const divMessage = this.newMessageLines(QinHead.getErrorMessage(error, origin));
    divBody.appendChild(divMessage);
    const divButton = document.createElement("div");
    divBody.appendChild(divButton);
    divButton.style.display = "flex";
    divButton.style.justifyContent = "center";
    divButton.style.marginTop = "6px";
    const button = document.createElement("button");
    divButton.appendChild(button);
    QinSkin.styleAsEditable(button);
    button.innerText = "Ok";
    button.onclick = () => {
      popup.close();
    };
    popup.show();
  }

  private newMessageLines(message: string): HTMLDivElement {
    return QinLegs.newColumn(
      QinBody.getTextLines(message).map((line) => QinLegs.newSpan(line))
    );
  }

  public navigate(url: string) {
    this._iframeBody.src = url;
  }

  public close() {
    this.saveFrameBounds();
    this._chief.delChild(this._divFrame);
    this._chief.delJobber(this);
  }
}

const JobberSetup = {
  POP_MENU_MAX_HEIGHT: 270,
  POP_MENU_WIDTH: 180,
  MINIMIZED_WIDTH: 180,
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
  applyOnDivHeadTitle: (el: HTMLSpanElement) => {
    el.style.flex = "1";
    el.style.fontSize = "16px";
  },
  applyOnDivEdgeIcon: (el: HTMLImageElement) => {
    el.style.width = "15px";
    el.style.height = "15px";
    el.style.margin = "4px";
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
    el.style.fontSize = "15px";
  },
};
