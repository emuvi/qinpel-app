import axios, { AxiosResponse } from "axios";
import { QinArm, QinHead, QinSkin } from "qinpel-res";
import { QinDesk, QinDeskSet } from "./qin-desk";
import { QinFrame } from "./qin-frame";
import { QinUtils } from "./qin-utils";
import { Qinpel } from "./qinpel";

export class QinManager {
  private divBody = document.createElement("div");
  private divMenu = document.createElement("div");
  private imgMenu = document.createElement("img");
  private frames: QinFrame[] = [];
  private framesTopZ = 1;

  private userLang = "";
  private userToken = "";

  public constructor() {
    this.initUser();
    this.initBody();
    this.initMenu();
    this.initScroll();
  }

  private initUser() {
    this.userLang = QinHead.getCookie("Qinpel-Lang", "");
    this.userToken = QinHead.getCookie("Qinpel-Token", "");
  }

  private initBody() {
    this.divBody.className = "QinpelWindowBody";
    this.divBody.style.backgroundImage = "url('./assets/background-normal.png')";
    this.divBody.style.backgroundAttachment = "local";
    this.divBody.style.fontWeight = "bold";
    this.divBody.style.fontSize = "12px";
    this.divBody.style.position = "relative";
    this.divBody.style.width = "100%";
    this.divBody.style.height = "100vh";
    this.divBody.style.overflow = "scroll";
    this.divBody.style.touchAction = "none";
  }

  private initMenu() {
    this.divMenu.id = "QinpelMenuID0";
    this.divMenu.style.backgroundColor = "#180027";
    this.divMenu.style.border = "2px solid #180027";
    this.divMenu.style.borderRadius = "4px";
    this.divMenu.style.position = "absolute";
    this.divMenu.style.overflow = "hidden";
    this.divMenu.style.top = "18px";
    this.divMenu.style.left = "18px";
    this.divMenu.style.width = "48px";
    this.divMenu.style.height = "48px";
    this.imgMenu.src = "./assets/qinpel-48.png";
    this.imgMenu.alt = "Menu";
    this.divMenu.appendChild(this.imgMenu);
    this.divBody.appendChild(this.divMenu);
    QinArm.addAction(this.divMenu, (event) => {
      if (event.isMain) {
        if (event.hasShift) {
          document.body.requestFullscreen();
        } else {
          this.newFrame("Qinpel", "/app/qinpel-app/desk.html");
        }
      }
      return false;
    });
  }

  private initScroll() {
    QinArm.addScroller(this.divBody, {
      onDouble: () => {
        this.divBody.scrollTo(0, 0);
        QinSkin.clearSelection();
      },
      onEnd: () => {
        QinSkin.clearSelection();
      },
    });
  }

  public putInDocument() {
    document.body.appendChild(this.divBody);
    QinSkin.disableSelection(document.body);
  }

  public newDesk(qinpel: Qinpel, options?: QinDeskSet): QinDesk {
    return new QinDesk(qinpel, options);
  }

  public newFrame(title: string, appName: string, options?: any): QinFrame {
    let result = new QinFrame(this, title, appName, options);
    result.install();
    this.frames.push(result);
    return result;
  }

  public getFrame(fromTitle: string): QinFrame {
    for (const frame of this.frames) {
      if (frame.getTitle() === fromTitle) {
        return frame;
      }
    }
    return null;
  }

  public addChild(child: HTMLElement) {
    this.divBody.appendChild(child);
  }

  public delChild(child: HTMLElement) {
    this.divBody.removeChild(child);
  }

  public getFrameFromID(fromID: string): QinFrame {
    for (const frame of this.frames) {
      if (frame.getID() === fromID) {
        return frame;
      }
    }
    return null;
  }

  public getFrameIndexFromID(fromID: string): number {
    for (let i = 0; i < this.frames.length; i++) {
      if (this.frames[i].getID() === fromID) {
        return i;
      }
    }
    return -1;
  }

  public delFrame(frame: QinFrame) {
    const index = this.frames.indexOf(frame);
    if (index > -1) {
      this.frames.splice(index, 1);
    }
  }

  public showElement(element: HTMLElement) {
    setTimeout(() => {
      if (element.id != "QinpelMenuAppsID1") {
        this.closeMenuApps();
      }
      element.style.zIndex = String(++this.framesTopZ);
      if (!QinSkin.isElementVisibleInScroll(element)) {
        element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
      }
      if (element.id.indexOf("QinpelFrameID") === 0) {
        const index = this.getFrameIndexFromID(element.id);
        if (index > 0) {
          const frame = this.frames[index];
          this.frames.splice(index, 1);
          this.frames.unshift(frame);
        }
      }
    }, 360);
  }

  public showMenu() {
    this.divBody.scrollTo(0, 0);
    this.showElement(this.divMenu);
  }

  public showMenuApps() {
    // [TODO] - Show PopupMenu
    let divMenu = document.createElement("div");
    divMenu.style.backgroundColor = "#878787";
    divMenu.style.border = "2px solid #6c6c6c";
    divMenu.style.borderStyle = "outset";
    divMenu.style.borderRadius = "4px";
    divMenu.style.position = "absolute";
    divMenu.style.display = "flex";
    divMenu.style.flexDirection = "column";
    divMenu.style.overflowX = "hidden";
    divMenu.style.overflowY = "auto";
    let divMenuItem = document.createElement("div");
    divMenuItem.style.borderBottom = "2px solid #b4b4b6";
    divMenuItem.style.backgroundColor = "#eaeaea";
    divMenuItem.style.color = "#242424";
    divMenuItem.style.cursor = "pointer";
    divMenuItem.style.padding = "4px";
  }

  private closeMenuApps() {
    // [TODO] - Close PopupMenu
    // if (qinpelRefWindow.refPopMenu != null) {
    //     qinpelRefWindow.divBody.removeChild(qinpelRefWindow.refPopMenu.elements.divPopMenu);
    //     qinpelRefWindow.refPopMenu = null;
    // }
  }

  public showAlert(message: string) {
    alert(message);
    // [ TODO ] - Show Better Alert
  }

  public getBodyWidth() {
    return this.divBody.clientWidth;
  }

  public getBodyHeight() {
    return this.divBody.clientHeight;
  }

  public hasToken() {
    return !!this.userToken;
  }

  public needToEnter() {
    return !this.hasToken();
  }

  private getAxiosConfig(headers: any) {
    if (!headers) {
      headers = {};
    }
    headers["Qinpel-Token"] = this.userToken;
    if (!headers["Accept-Language"]) {
      if (this.userLang) {
        headers["Accept-Language"] = this.userLang;
      } else if (navigator.language) {
        headers["Accept-Language"] = navigator.language;
      }
    }
    let configs = {
      headers,
    };
    return configs;
  }

  public get(address: string, headers?: any): Promise<AxiosResponse<never>> {
    let configs = this.getAxiosConfig(headers);
    return axios.get(address, configs);
  }

  public post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>> {
    let configs = this.getAxiosConfig(headers);
    if (!configs.headers["Content-Type"]) {
      if (typeof data === "string" || data instanceof String) {
        configs.headers["Content-Type"] = "text/plain";
      } else if (data instanceof FormData) {
        configs.headers["Content-Type"] = "multipart/form-data";
      } else {
        configs.headers["Content-Type"] = "application/json";
      }
    }
    return axios.post(address, data, configs);
  }

  public tryEnter(name: string, pass: string): Promise<string> {
    pass = QinUtils.crypto.sha1(pass);
    return new Promise((resolve, reject) => {
      this.post("/enter", { name, pass })
        .then((res) => {
          this.userLang = res.data.lang;
          this.userToken = res.data.token;
          QinHead.setCookie("Qinpel-Lang", this.userLang);
          QinHead.setCookie("Qinpel-Token", this.userToken);
          resolve(this.userLang);
        })
        .catch((err) => reject(err));
    });
  }

  public exit() {
    this.userLang = "";
    this.userToken = "";
    QinHead.delCookie("Qinpel-Lang");
    QinHead.delCookie("Qinpel-Token");
  }
}
