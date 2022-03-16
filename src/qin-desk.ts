import { Qinpel } from "./qinpel";
import { QinSoul } from "qinpel-res";

export class QinDesk {
  private divMain = document.createElement("div");
  private divApps = document.createElement("div");
  private divCfgs = document.createElement("div");

  private qinpel: Qinpel;
  private qinAddsApp: QinAddsApp;

  public constructor(qinpel: Qinpel, qinAddsApp?: QinAddsApp) {
    this.qinpel = qinpel;
    this.qinAddsApp = qinAddsApp;
    this.initMain();
    this.initApps();
    this.initCfgs();
  }

  private initMain() {
    this.divMain.style.padding = "3px";
    this.divMain.appendChild(this.divApps);
    this.divMain.appendChild(this.divCfgs);
  }

  public initApps() {
    this.divApps.style.padding = "9px";  
    this.qinpel
      .get("/list/apps")
      .then((res) => {
        for (let name of this.listApps(res.data)) {
          this.tryAddApp(name);
        }
      })
      .catch((err) => {
        if (err.response!.status === 403) {
          this.qinpel.manager.exit();
        }
        this.divMain.innerText = QinSoul.head.getErrorMessage(
          err,
          "{qinpel-app}(ErrCode-000002)"
        );
      });
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
          if (this.qinAddsApp) {
            if (!this.qinAddsApp(manifest)) {
              return;
            }
          }
          const title = manifest.title;
          const icon = "../" + name + "/favicon.ico";
          this.addMenu(
            this.divApps,
            this.newMenu(title, icon, () => {
              this.qinpel.manager.newFrame(title, name);
              this.qinpel.frame.headCloseAction();
            })
          );
        })
        .catch((err) => {
          const divError = document.createElement("div");
          divError.innerText = QinSoul.head.getErrorMessage(
            err,
            "{qinpel-app}(ErrCode-000001)"
          );
          this.addMenu(this.divApps, divError);
        });
    }
  }

  private initCfgs() {
    this.divCfgs.style.padding = "9px";
    if (QinSoul.foot.isLocalHost()) {
      this.addDevTools();
    }
  }

  private addDevTools() {
    
    this.addMenu(
      this.divCfgs,
      this.newMenu("DevTools", "./assets/menu-devtools.ico", () => {
        QinSoul.head.toggleDevTools();
        this.qinpel.frame.headCloseAction();
      })
    );
  }

  private newMenu(title: string, icon: string, action: any): HTMLDivElement {
    const divContent = document.createElement("div");
    divContent.style.display = "flex";
    divContent.style.flexDirection = "column";
    divContent.style.alignItems = "center";
    const imgIcon = document.createElement("img");
    imgIcon.style.width = "48px";
    imgIcon.style.height = "48px";
    imgIcon.style.margin = "3px";
    imgIcon.src = icon;
    const spanTitle = document.createElement("span");
    spanTitle.style.margin = "3px";
    spanTitle.style.fontWeight = "bold";
    spanTitle.innerText = title;
    divContent.appendChild(imgIcon);
    divContent.appendChild(spanTitle);
    QinSoul.arm.addAction(divContent, action);
    return divContent;
  }

  private addMenu(divContainer: HTMLDivElement, divContent: HTMLDivElement) {
    const divMenu = document.createElement("div");
    divMenu.style.display = "inline-block";
    divMenu.style.margin = "5px";
    divMenu.style.padding = "5px";
    divMenu.style.maxWidth = "130px";
    divMenu.style.cursor = "pointer";
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

export type QinManifest = {
  title: string;
  group?: string;
};

export type QinAddsApp = (manifest: QinManifest) => boolean;
