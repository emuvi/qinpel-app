import { QinArm, QinBounds, QinSoul } from "qinpel-res";
import { QinJobber } from "./qin-jobber";

export class QinJobberPopup {
  private _jobber: QinJobber;
  private _divContent: HTMLDivElement;
  private _divMain: HTMLDivElement = document.createElement("div");

  private _posX: number = 18;
  private _posY: number = 18;
  private _maxWidth: number;
  private _maxHeight: number;

  private _onShow: Array<Function> = null;
  private _onClose: Array<Function> = null;

  public constructor(jobber: QinJobber, divContent: HTMLDivElement) {
    this._jobber = jobber;
    this._divContent = divContent;
    this.initMain();
  }

  private initMain() {
    this._divMain.appendChild(this._divContent);
    QinSoul.skin.styleAsEditable(this._divMain);
    this._divMain.style.position = "absolute";
    this._divMain.style.padding = "3px";
    this._divMain.style.overflow = "auto";
    this._divMain.tabIndex = 0;
    this._divMain.addEventListener("focusout", (ev) => this.onFocusOutClose(ev));
  }

  private onFocusOutClose(ev: FocusEvent) {
    setTimeout(() => {
      if (!this._divMain.contains(this._jobber.getIFrameDoc().activeElement)) {
        this.close();
      }
    }, 360);
    return QinArm.stopEvent(ev);
  }

  public addOnShow(func: Function) {
    if (!this._onShow) {
      this._onShow = [];
    }
    this._onShow.push(func);
  }

  public delOnShow(func: Function) {
    if (this._onShow) {
      let index = this._onShow.indexOf(func);
      if (index > -1) {
        this._onShow.splice(index, 1);
      }
    }
  }

  public addOnClose(func: Function) {
    if (!this._onClose) {
      this._onClose = [];
    }
    this._onClose.push(func);
  }

  public delOnClose(func: Function) {
    if (this._onClose) {
      let index = this._onClose.indexOf(func);
      if (index > -1) {
        this._onClose.splice(index, 1);
      }
    }
  }

  public show() {
    this.close();
    const iframeBody = this._jobber.getIFrameDoc().body;
    iframeBody.appendChild(this._divMain);
    this._posX = 18;
    this._posY = 18;
    this._maxWidth = this._jobber.getIFrame().clientWidth - (this._posY + 9);
    this._maxHeight = this._jobber.getIFrame().clientHeight - (this._posY + 9);
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this._divMain.style.maxWidth = this._maxWidth + "px";
    this._divMain.style.maxHeight = this._maxHeight + "px";
    this._posX = this._jobber.getIFrame().clientWidth / 2 - this._divMain.clientWidth / 2;
    this._posY =
      this._jobber.getIFrame().clientHeight / 2 - this._divMain.clientHeight / 2;
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this.didShow();
  }

  public showOnParent(parent: HTMLElement) {
    this.close();
    this._jobber.getIFrameDoc().body.appendChild(this._divMain);
    let bounds = parent.getBoundingClientRect();
    this._posX = bounds.left;
    this._posY = bounds.top + bounds.height;
    this._maxWidth = this._jobber.getIFrame().clientWidth - (this._posX + 9);
    this._maxHeight = this._jobber.getIFrame().clientHeight - (this._posY + 9);
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this._divMain.style.maxWidth = this._maxWidth + "px";
    this._divMain.style.maxHeight = this._maxHeight + "px";
    this.didShow();
  }

  public showOnBounds(bounds: QinBounds) {
    this.close();
    this._jobber.getIFrameDoc().body.appendChild(this._divMain);
    this._posX = bounds.posX;
    this._posY = bounds.posY;
    this._maxWidth = bounds.width;
    this._maxHeight = bounds.height;
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this._divMain.style.maxWidth = this._maxWidth + "px";
    this._divMain.style.maxHeight = this._maxHeight + "px";
    this.didShow();
  }

  private didShow() {
    this._divMain.focus();
    if (this._onShow) {
      this._onShow.forEach((func) => func());
    }
  }

  public close() {
    if (this._jobber.getIFrameDoc().body.contains(this._divMain)) {
      this._divMain.focus();
      this._jobber.getIFrameDoc().body.removeChild(this._divMain);
      if (this._onClose) {
        this._onClose.forEach((func) => func());
      }
    }
  }

  public toggle() {
    if (this._jobber.getIFrameDoc().body.contains(this._divMain)) {
      this.close();
    } else {
      this.show();
    }
  }

  public get jobber(): QinJobber {
    return this._jobber;
  }

  public get divContent(): HTMLDivElement {
    return this._divContent;
  }

  public get divMain(): HTMLDivElement {
    return this._divMain;
  }

  public get posX(): number {
    return this._posX;
  }

  public get posY(): number {
    return this._posY;
  }

  public get maxWidth(): number {
    return this._maxWidth;
  }

  public get maxHeight(): number {
    return this._maxHeight;
  }
}
