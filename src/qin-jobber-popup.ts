import { QinBounds, QinSoul } from "qinpel-res";
import { QinJobber } from "./qin-jobber";

export class QinJobberPopup {
  private _jobber: QinJobber;
  private _divContent: HTMLDivElement;
  private _divMain: HTMLDivElement = document.createElement("div");

  private _posX: number = 18;
  private _posY: number = 18;
  private _maxWidth: number;
  private _maxHeight: number;

  public constructor(jobber: QinJobber, divContent: HTMLDivElement) {
    this._jobber = jobber;
    this._divContent = divContent;
    this.initMain();
  }

  private initMain() {
    this._divMain.appendChild(this._divContent);
    QinSoul.skin.styleAsEdit(this._divMain);
    this._divMain.style.position = "absolute";
    this._divMain.style.padding = "3px";
    this._divMain.style.overflow = "auto";
    this._divMain.tabIndex = 0;
    this.addFocusOutCloseToAll(this._divMain);
  }

  private addFocusOutCloseToAll(el: HTMLElement) {
    el.addEventListener("focusout", (ev) => this.onFocusOutClose(ev));
    for (let index = 0; index < el.children.length; index++) {
      const child = el.children.item(index);
      if (child instanceof HTMLElement) {
        this.addFocusOutCloseToAll(child);
      }
    }
  }

  private onFocusOutClose(ev: FocusEvent) {
    setTimeout(() => {
      if (!this._divMain.contains(this._jobber.getBodyDoc().activeElement)) {
        this.close();
      }
    }, 360);
    return QinSoul.arm.stopEvent(ev);
  }

  public show() {
    this.close();
    this._jobber.getBodyDoc().body.appendChild(this._divMain);
    this._posX = 18;
    this._posY = 18;
    this._maxWidth = this._jobber.getBody().clientWidth - (this._posY + 9);
    this._maxHeight = this._jobber.getBody().clientHeight - (this._posY + 9);
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this._divMain.style.maxWidth = this._maxWidth + "px";
    this._divMain.style.maxHeight = this._maxHeight + "px";
    this._divMain.focus();
  }

  public showOnParent(parent: HTMLElement) {
    this.close();
    this._jobber.getBodyDoc().body.appendChild(this._divMain);
    let bounds = parent.getBoundingClientRect();
    this._posX = bounds.left;
    this._posY = bounds.top + bounds.height;
    this._maxWidth = this._jobber.getBody().clientWidth - (this._posX + 9);
    this._maxHeight = this._jobber.getBody().clientHeight - (this._posY + 9);
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this._divMain.style.maxWidth = this._maxWidth + "px";
    this._divMain.style.maxHeight = this._maxHeight + "px";
    this._divMain.focus();
  }

  public showOnBounds(bounds: QinBounds) {
    this.close();
    this._jobber.getBodyDoc().body.appendChild(this._divMain);
    this._posX = bounds.posX;
    this._posY = bounds.posY;
    this._maxWidth = bounds.width;
    this._maxHeight = bounds.height;
    this._divMain.style.left = this._posX + "px";
    this._divMain.style.top = this._posY + "px";
    this._divMain.style.maxWidth = this._maxWidth + "px";
    this._divMain.style.maxHeight = this._maxHeight + "px";
    this._divMain.focus();
  }

  public close() {
    if (this._jobber.getBodyDoc().body.contains(this._divMain)) {
      this._divMain.focus();
      this._jobber.getBodyDoc().body.removeChild(this._divMain);
    }
  }

  public toggle() {
    if (this._jobber.getBodyDoc().body.contains(this._divMain)) {
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
