import { Qinpel } from "./qinpel";
import { QinAction, QinSoul } from "qinpel-res";

export class QinDesk {
  private divMain = document.createElement("div");
  private divApps = document.createElement("div");
  private divCfgs = document.createElement("div");

  private qinpel: Qinpel;
  private options: QinDeskOptions;

  public constructor(qinpel: Qinpel, options?: QinDeskOptions) {
    this.qinpel = qinpel;
    this.options = options;
    this.initMain();
    if (!(this.options?.showApps === false)) {
      this.initApps();
    }
    if (!(this.options?.showCfgs === false)) {
      this.initCfgs();
    }
  }

  private initMain() {
    styles.applyOnDivMain(this.divMain);
  }

  public initApps() {
    styles.applyOnDivLine(this.divApps);
    this.qinpel
      .get("/list/apps")
      .then((res) => {
        for (let name of this.listApps(res.data)) {
          this.tryAddApp(name);
        }
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          this.qinpel.manager.exit();
        }
        this.qinpel.frame.statusError(err, "{qinpel-app}(ErrCode-000002)");
      });
    this.divMain.appendChild(this.divApps);
  }

  private listApps(response: string) {
    return QinSoul.body.getTextLines(response);
  }

  private tryAddApp(name: string) {
    if (name && name != "qinpel-app") {
      this.qinpel
        .get("/app/" + name + "/manifest.json")
        .then((res) => {
          const manifest = res.data as QinManifest;
          if (this.options?.addsApps) {
            if (!this.options.addsApps(manifest)) {
              return;
            }
          }
          const title = manifest.title;
          const icon = "../" + name + "/favicon.ico";
          this.addMenu(
            this.divApps,
            this.newMenu(title, icon, (ev) => {
              if (ev.isPrimary) {
                this.qinpel.manager.newFrame(title, name);
                this.qinpel.frame.headCloseAction();
              }
            })
          );
        })
        .catch((err) => {
          this.qinpel.frame.statusError(err, "{qinpel-app}(ErrCode-000001)");
        });
    }
  }

  private initCfgs() {
    styles.applyOnDivLine(this.divCfgs);
    if (QinSoul.foot.isLocalHost()) {
      if (this.options?.addsCfgs) {
        if (
          !this.options.addsCfgs({
            title: "DevTools",
          })
        ) {
          return;
        }
      }
      this.addDevTools();
    }
    this.divMain.appendChild(this.divCfgs);
  }

  private addDevTools() {
    this.addMenu(
      this.divCfgs,
      this.newMenu(
        "DevTools",
        "/app/qinpel-app/assets/menu-devtools.ico",
        (ev) => {
          if (ev.isPrimary) {
            QinSoul.head.toggleDevTools();
            this.qinpel.frame.headCloseAction();
          }
        }
      )
    );
  }

  private newMenu(
    title: string,
    icon: string,
    action: QinAction
  ): HTMLDivElement {
    const menuBody = document.createElement("div");
    styles.applyOnMenuBody(menuBody);
    const menuIcon = document.createElement("img");
    styles.applyOnMenuIcon(menuIcon);
    menuIcon.src = icon;
    const menuText = document.createElement("span");
    styles.applyOnMenuText(menuText);
    menuText.innerText = title;
    menuBody.appendChild(menuIcon);
    menuBody.appendChild(menuText);
    QinSoul.arm.addAction(menuBody, action);
    return menuBody;
  }

  private addMenu(divContainer: HTMLDivElement, divContent: HTMLDivElement) {
    const divMenu = document.createElement("div");
    styles.applyOnDivMenu(divMenu);
    divMenu.appendChild(divContent);
    divContainer.appendChild(divMenu);
  }

  public putInDocument() {
    document.body.appendChild(this.divMain);
  }

  public getMain(): HTMLDivElement {
    return this.divMain;
  }
}

export type QinDeskOptions = {
  showApps?: boolean;
  addsApps?: QinAuthorize;
  showCfgs?: boolean;
  addsCfgs?: QinAuthorize;
};

export type QinAuthorize = (manifest: QinManifest) => boolean;

export type QinManifest = {
  title: string;
  group?: string;
};

const styles = {
  applyOnDivMain: (el: HTMLDivElement) => {
    el.style.padding = "18px 3px";
  },
  applyOnDivLine: (el: HTMLDivElement) => {
    el.style.padding = "3px";
    el.style.display = "flex";
    el.style.flexDirection = "row";
    el.style.flexWrap = "wrap";
  },
  applyOnDivMenu: (el: HTMLDivElement) => {
    el.style.margin = "3px";
    el.style.minWidth = "96px";
    el.style.maxWidth = "96px";
    el.style.cursor = "pointer";
  },
  applyOnMenuBody: (el: HTMLDivElement) => {
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.alignItems = "center";
  },
  applyOnMenuIcon: (el: HTMLImageElement) => {
    el.style.width = "48px";
    el.style.height = "48px";
    el.style.margin = "3px";
  },
  applyOnMenuText: (el: HTMLSpanElement) => {
    el.style.margin = "3px";
    el.style.fontWeight = "bold";
  },
};
