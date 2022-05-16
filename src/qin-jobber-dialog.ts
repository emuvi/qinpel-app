import { QinSoul, QinStyles } from "qinpel-res";
import { QinJobber } from "./qin-jobber";

export class QinJobberDialog {
  private jobber: QinJobber;
  private title: string;
  private divContent: HTMLDivElement;
  private divDialog = document.createElement("div");
  private divTop = document.createElement("div");
  private spanTitle = document.createElement("span");
  private spanClose = document.createElement("span");
  private imgClose = document.createElement("img");
  private divPack = document.createElement("div");

  private showing = false;
  private docNodes: ChildNode[] = [];

  public constructor(jobber: QinJobber, title: string, divContent: HTMLDivElement) {
    this.jobber = jobber;
    this.title = title;
    this.divContent = divContent;
    this.initDialog();
    this.initTop();
    this.initPack();
  }

  private initDialog() {
    styles.applyOnDialog(this.divDialog);
  }

  private initTop() {
    styles.applyOnDialogTop(this.divTop);
    this.divDialog.appendChild(this.divTop);
    styles.applyOnDialogTitle(this.spanTitle);
    this.spanTitle.innerText = this.title;
    this.divTop.appendChild(this.spanTitle);
    styles.applyOnDialogClose(this.spanClose);
    this.divTop.appendChild(this.spanClose);
    styles.applyOnDialogImage(this.imgClose);
    this.imgClose.src = "/app/qinpel-app/assets/jobber-close.png";
    this.spanClose.appendChild(this.imgClose);
    QinSoul.arm.addAction(this.spanClose, (_) => {
      this.close();
    });
  }

  private initPack() {
    this.divDialog.appendChild(this.divPack);
    styles.applyOnDialogPack(this.divPack);
    this.divPack.appendChild(this.divContent);
  }

  public show() {
    if (this.showing) {
      return;
    }
    this.docNodes = [];
    for (let i = 0; i < this.jobber.getIFrameDoc().body.childNodes.length; i++) {
      const child = this.jobber.getIFrameDoc().body.childNodes[i];
      this.docNodes.push(child);
    }
    for (const child of this.docNodes) {
      this.jobber.getIFrameDoc().body.removeChild(child);
    }
    this.jobber.getIFrameDoc().body.appendChild(this.divDialog);
    this.showing = true;
  }

  public close() {
    if (!this.showing) {
      return;
    }
    this.jobber.getIFrameDoc().body.removeChild(this.divDialog);
    for (const child of this.docNodes) {
      this.jobber.getIFrameDoc().body.appendChild(child);
    }
    this.docNodes = [];
    this.showing = false;
  }
}

const styles = {
  applyOnDialog: (el: HTMLDivElement) => {
    el.style.position = "absolute";
    el.style.top = "0px";
    el.style.right = "0px";
    el.style.bottom = "0px";
    el.style.left = "0px";
    el.style.display = "flex";
    el.style.flexDirection = "column";
  },
  applyOnDialogTop: (el: HTMLDivElement) => {
    el.style.flex = "0";
    el.style.padding = "3px";
    el.style.margin = "0px";
    el.style.border = "0px";
    el.style.display = "flex";
    el.style.flexDirection = "row";
    el.style.flexWrap = "wrap";
    el.style.alignItems = "center";
    el.style.backgroundColor = QinStyles.ColorForeground;
    el.style.color = QinStyles.ColorBackground;
  },
  applyOnDialogPack: (el: HTMLDivElement) => {
    el.style.flex = "1";
    el.style.overflow = "auto";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.padding = "0px";
    el.style.margin = "0px";
    el.style.border = "0px";
  },
  applyOnDialogTitle: (el: HTMLSpanElement) => {
    el.style.flex = "1";
    el.style.textAlign = "center";
    el.style.fontWeight = "bold";
  },
  applyOnDialogClose: (el: HTMLSpanElement) => {
    el.style.flex = "0";
    el.style.padding = "0px";
    el.style.margin = "0px";
    el.style.border = "0px";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
  },
  applyOnDialogImage: (el: HTMLImageElement) => {
    el.style.padding = "0px";
    el.style.margin = "0px";
    el.style.border = "0px";
  },
};
