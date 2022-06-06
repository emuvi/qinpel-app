import { QinArms, QinHead, QinSkin } from "qinpel-res";
import { QinDesk, QinDeskSet } from "./qin-desk";
import { QinJobber } from "./qin-jobber";
import { QinOurs } from "./qin-ours";
import { QinTalker } from "./qin-talker";
import { Qinpel } from "./qinpel";

export class QinChief {
  private _divBody = document.createElement("div");
  private _divMenu = document.createElement("div");
  private _imgMenu = document.createElement("img");
  private _jobbers: QinJobber[] = [];
  private _framesTopZ = 1;

  private _serverLang = "";
  private _userLang = "";
  private _userToken = "";

  private _talker = new QinTalker(this);

  public constructor() {
    this.initBody();
    this.initMenu();
    this.initScroll();
    this.initServerLang();
  }

  private initBody() {
    this._divBody.className = "QinpelWindowBody";
    this._divBody.style.backgroundImage = "url('./assets/background-normal.png')";
    this._divBody.style.backgroundAttachment = "local";
    this._divBody.style.fontWeight = "bold";
    this._divBody.style.fontSize = "12px";
    this._divBody.style.position = "relative";
    this._divBody.style.width = "100%";
    this._divBody.style.height = "100vh";
    this._divBody.style.overflow = "scroll";
    this._divBody.style.touchAction = "none";
  }

  private initMenu() {
    this._divMenu.id = "QinpelMenuID0";
    this._divMenu.style.backgroundColor = "#180027";
    this._divMenu.style.border = "2px solid #180027";
    this._divMenu.style.borderRadius = "4px";
    this._divMenu.style.position = "absolute";
    this._divMenu.style.overflow = "hidden";
    this._divMenu.style.top = "18px";
    this._divMenu.style.left = "18px";
    this._divMenu.style.width = "48px";
    this._divMenu.style.height = "48px";
    this._imgMenu.src = "./assets/qinpel.png";
    this._imgMenu.style.width = "48px";
    this._imgMenu.style.height = "48px";
    this._imgMenu.alt = "Menu";
    this._divMenu.appendChild(this._imgMenu);
    this._divBody.appendChild(this._divMenu);
    QinArms.addAction(this._divMenu, (event) => {
      if (event.isMain) {
        if (event.hasShift) {
          document.body.requestFullscreen();
        } else {
          this.newJobber("Qinpel", "/app/qinpel-app/desk.html");
        }
      }
      return false;
    });
  }

  private initScroll() {
    QinArms.addScroller(this._divBody, {
      onDouble: () => {
        this._divBody.scrollTo(0, 0);
        QinSkin.clearSelection();
      },
      onEnd: () => {
        QinSkin.clearSelection();
      },
    });
  }

  private initServerLang() {
    this._serverLang = "en";
    this.talk
      .get("/lang")
      .then((res) => {
        this._serverLang = res.data;
      })
      .catch((err) => {
        console.log("Could not get the server language because: " + err);
      });
  }

  public putInDocument() {
    document.body.appendChild(this._divBody);
    QinSkin.disableSelection(document.body);
  }

  public addChild(child: HTMLElement) {
    this._divBody.appendChild(child);
  }

  public delChild(child: HTMLElement) {
    this._divBody.removeChild(child);
  }

  public newDesk(qinpel: Qinpel, options?: QinDeskSet): QinDesk {
    return new QinDesk(qinpel, options);
  }

  public newJobber(title: string, appNameOrAddress: string, options?: any): QinJobber {
    let result = new QinJobber(this, title, appNameOrAddress, options);
    result.install();
    this._jobbers.push(result);
    this.loadTranslations(result.appName);
    return result;
  }

  public getJobber(fromTitle: string): QinJobber {
    for (const jobber of this._jobbers) {
      if (jobber.title === fromTitle) {
        return jobber;
      }
    }
    return null;
  }

  public getJobberFromID(fromID: string): QinJobber {
    for (const jobber of this._jobbers) {
      if (jobber.getMainID() === fromID) {
        return jobber;
      }
    }
    return null;
  }

  public getJobberIndexFromID(fromID: string): number {
    for (let i = 0; i < this._jobbers.length; i++) {
      if (this._jobbers[i].getMainID() === fromID) {
        return i;
      }
    }
    return -1;
  }

  public delJobber(jobber: QinJobber) {
    const index = this._jobbers.indexOf(jobber);
    if (index > -1) {
      this._jobbers.splice(index, 1);
    }
  }

  public showElement(element: HTMLElement) {
    setTimeout(() => {
      if (element.id != "QinpelMenuAppsID1") {
        this.closeMenuApps();
      }
      element.style.zIndex = String(++this._framesTopZ);
      if (!QinSkin.isElementVisibleInScroll(element)) {
        element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
      }
      if (element.id.indexOf("QinpelFrameID") === 0) {
        const index = this.getJobberIndexFromID(element.id);
        if (index > 0) {
          const jobber = this._jobbers[index];
          this._jobbers.splice(index, 1);
          this._jobbers.unshift(jobber);
        }
      }
    }, 360);
  }

  public showMenu() {
    this._divBody.scrollTo(0, 0);
    this.showElement(this._divMenu);
  }

  public showMenuApps() {
    // [ TODO ] - Show PopupMenu
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
    // [ TODO ] - Close PopupMenu
    // if (qinpelRefWindow.refPopMenu != null) {
    //     qinpelRefWindow.divBody.removeChild(qinpelRefWindow.refPopMenu.elements.divPopMenu);
    //     qinpelRefWindow.refPopMenu = null;
    // }
  }

  public getBodyWidth() {
    return this._divBody.clientWidth;
  }

  public getBodyHeight() {
    return this._divBody.clientHeight;
  }

  public hasToken() {
    return !!this._userToken;
  }

  public async needToEnter(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.talk
        .get("/logged")
        .then((response) => {
          if (response.status === 200) {
            if (response.data === "<!-- No user is logged. -->") {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(true);
          }
        })
        .catch((_) => {
          resolve(true);
        });
    });
  }

  public getAxiosConfig(headers: any) {
    if (!headers) {
      headers = {};
    }
    headers["Qinpel-Token"] = this._userToken;
    if (!headers["Accept-Language"]) {
      if (this._userLang) {
        headers["Accept-Language"] = this._userLang;
      } else if (navigator.language) {
        headers["Accept-Language"] = navigator.language;
      }
    }
    let configs = {
      headers,
    };
    return configs;
  }

  public saveConfig(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }

  public loadConfig(key: string, orDefault?: string): string {
    return window.localStorage.getItem(key) || orDefault;
  }

  public get talk(): QinTalker {
    return this._talker;
  }

  public tryEnter(name: string, pass: string): Promise<string> {
    pass = QinOurs.crypto.sha1(pass);
    return new Promise((resolve, reject) => {
      this._talker
        .post("/enter", { name, pass })
        .then((res) => {
          this._userLang = res.data.lang;
          this._userToken = res.data.token;
          this.loadTranslations("qinpel-app");
          resolve(this._userLang);
        })
        .catch((err) => reject(err));
    });
  }

  private loadedTranslations: Map<string, Array<string>> = new Map<string, Array<string>>();

  public loadTranslations(ofApplication): Promise<void> {
    return new Promise<void>((resolve, _) => {
      let lang = this._userLang || this._serverLang;
      if (!lang || lang == "en") return;
      let appsLoaded = this.loadedTranslations.get(lang);
      if (appsLoaded && appsLoaded.indexOf(ofApplication) > -1) return;
      if (appsLoaded) {
        appsLoaded.push(ofApplication);
      } else {
        appsLoaded = [ofApplication];
        this.loadedTranslations.set(lang, appsLoaded);
      }
      let address = "/app/" + ofApplication + "/dics/" + lang + ".txt";
      this._talker
        .get(address)
        .then((res) => {
          let dictionary = res.data;
          QinHead.translations(dictionary);
          resolve();
        })
        .catch((_) => {});
    });
  }

  public exit() {
    this._userLang = "";
    this._userToken = "";
    QinHead.delCookie("Qinpel-Lang");
    QinHead.delCookie("Qinpel-Token");
  }
}
