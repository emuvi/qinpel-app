import { QinAction, QinSoul, QinWaiter } from "qinpel-res";
import { QinNames } from "./qin-names";
import { Qinpel } from "./qinpel";

export class QinDesk {
  private divMain = document.createElement("div");
  private divApps: HTMLDivElement = null;
  private divCfgs: HTMLDivElement = null;

  private qinpel: Qinpel;
  private options: QinDeskSet;

  public constructor(qinpel: Qinpel, options?: QinDeskSet) {
    this.qinpel = qinpel;
    this.options = options || {};
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
    this.divApps = document.createElement("div");
    this.divMain.appendChild(this.divApps);
    styles.applyOnDivLine(this.divApps);
    this.qinpel.talk
      .get("/list/apps")
      .then((res) => {
        for (let name of this.listApps(res.data)) {
          this.tryAddApp(name);
        }
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          this.qinpel.chief.exit();
        }
        this.qinpel.jobbed.statusError(err, "{qinpel-app}(ErrCode-000002)");
      });
  }

  private listApps(response: string) {
    return QinSoul.body.getTextLines(response);
  }

  private tryAddApp(name: string) {
    if (name && name !== "qinpel-app") {
      this.qinpel.talk
        .get("/app/" + name + "/manifest.json")
        .then((res) => {
          const manifest = res.data as QinManifest;
          if (!shouldAdd(this.options.addsApps, manifest)) {
            return;
          }
          const title = manifest.title;
          const icon = "../" + name + "/favicon.ico";
          this.addMenu(
            this.divApps,
            this.newMenu(title, icon, (ev) => {
              if (ev.isMain) {
                this.qinpel.chief.newJobber(title, name);
                this.qinpel.jobbed.close();
              }
            })
          );
        })
        .catch((err) => {
          this.qinpel.jobbed.statusError(err, "{qinpel-app}(ErrCode-000001)");
        });
    }
  }

  private initCfgs() {
    this.divCfgs = document.createElement("div");
    this.divMain.appendChild(this.divCfgs);
    styles.applyOnDivLine(this.divCfgs);
    if (QinSoul.foot.isLocalHost()) {
      if (shouldAdd(this.options.addsCfgs, { title: "DevTools" })) {
        this.addDevTools();
      }
    }
    if (shouldAdd(this.options.addsCfgs, { title: "QinBases" })) {
      this.qinpel.talk.get("/list/bases").then((res) => {
        let data = res.data;
        let bases = this.qinpel.our.soul.body.getTextLines(res.data);
        this.addQinBases(bases);
      });
    }
  }

  private addDevTools() {
    this.addMenu(
      this.divCfgs,
      this.newMenu(
        QinNames.DevTools,
        "/app/qinpel-app/assets/menu-devtools.ico",
        (ev) => {
          if (ev.isMain) {
            QinSoul.head.toggleDevTools();
            this.qinpel.jobbed.close();
          }
        }
      )
    );
  }

  private addQinBases(bases: string[]) {
    if (!bases || bases.length === 0) {
      return;
    }
    let actual = this.qinpel.chief.loadConfig(QinNames.QinBaseSelected);
    if (!actual) {
      actual = bases[0];
      this.qinpel.chief.saveConfig(QinNames.QinBaseSelected, actual);
    }
    let items = new Array<ComboItem>();
    for (let base of bases) {
      items.push({
        title: base,
        selected: base === actual,
      });
    }
    this.addMenu(
      this.divCfgs,
      this.newCombo(QinNames.QinBases, items, (base) => {
        this.qinpel.chief.saveConfig(QinNames.QinBaseSelected, base);
      })
    );
  }

  private newMenu(title: string, icon: string, action: QinAction): HTMLDivElement {
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

  private newCombo(title: string, items: ComboItem[], action: QinWaiter): HTMLDivElement {
    const menuBody = document.createElement("div");
    styles.applyOnMenuBody(menuBody);
    const menuText = document.createElement("span");
    styles.applyOnMenuText(menuText);
    menuText.innerText = title;
    menuBody.appendChild(menuText);
    const menuCombo = document.createElement("select");
    styles.applyOnMenuCombo(menuCombo);
    for (const item of items) {
      const menuComboItem = document.createElement("option");
      menuComboItem.value = item.title;
      menuComboItem.innerText = item.title;
      menuComboItem.selected = item.selected;
      menuCombo.appendChild(menuComboItem);
    }
    menuBody.appendChild(menuCombo);
    if (action) {
      menuBody.onchange = () => {
        action(menuCombo.value);
      };
    }
    return menuBody;
  }

  private addMenu(divContainer: HTMLDivElement, divContent: HTMLDivElement) {
    const divMenu = document.createElement("div");
    styles.applyOnDivMenu(divMenu);
    divMenu.appendChild(divContent);
    divContainer.appendChild(divMenu);
  }

  public putInDocBody() {
    document.body.appendChild(this.divMain);
  }

  public getMain(): HTMLDivElement {
    return this.divMain;
  }
}

export type QinDeskSet = {
  showApps?: boolean;
  addsApps?: QinAuthorize;
  showCfgs?: boolean;
  addsCfgs?: QinAuthorize;
};

function shouldAdd(authorizer: QinAuthorize, manifest: QinManifest): boolean {
  if (!authorizer) {
    return true;
  }
  return authorizer(manifest);
}

export type QinAuthorize = (manifest: QinManifest) => boolean;

export type QinManifest = {
  title: string;
  group?: string;
};

type ComboItem = {
  title: string;
  selected: boolean;
};

const styles = {
  applyOnDivMain: (el: HTMLDivElement) => {
    el.style.margin = "18px 3px";
    styles.applyOnDivColumn(el);
  },
  applyOnDivColumn: (el: HTMLDivElement) => {
    el.style.padding = "0px";
    el.style.display = "flex";
    el.style.flexDirection = "column";
    el.style.flexWrap = "nowrap";
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
  applyOnMenuCombo: (el: HTMLSelectElement) => {
    QinSoul.skin.styleAsEditable(el);
    el.style.margin = "3px";
  },
  applyOnMenuText: (el: HTMLSpanElement) => {
    el.style.margin = "3px";
    el.style.fontWeight = "bold";
  },
};
