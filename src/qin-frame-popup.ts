import { QinSoul } from "qinpel-res";
import { QinFrame } from "./qin-frame"

export class QinFramePopup {

    private _frame: QinFrame;
    private _divContent: HTMLDivElement;
    private _divMain: HTMLDivElement = document.createElement("div");

    private _posLeft: number = 18;
    private _posTop: number = 18;
    private _maxWidth: number;
    private _maxHeight: number;

    public constructor(frame: QinFrame, divContent: HTMLDivElement) {
        this._frame = frame;
        this._divContent = divContent;
        this.initMain();
    }

    private initMain() {
        this._divMain.appendChild(this._divContent);
        QinSoul.skin.styleAsEdit(this._divMain);
        this._divMain.style.position = "absolute";
        this._divMain.style.padding = "5px";
        this._divMain.style.overflow = "auto";
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
            if (!this._divMain.contains(this._frame.getIFrameDocument().activeElement)) {
                this.close();
            }
        }, 360);
        return QinSoul.arm.stopEvent(ev);
    }

    public show() {
        this.close();
        this._frame.getIFrameDocument().body.appendChild(this._divMain);
        this._maxWidth = this._frame.getIFrame().clientWidth - (this._posLeft * 3);
        this._maxHeight = this._frame.getIFrame().clientHeight - (this._posTop * 3);
        this._divMain.style.left = this._posLeft + "px";
        this._divMain.style.top = this._posTop + "px";
        this._divMain.style.maxWidth = this._maxWidth + "px";
        this._divMain.style.maxHeight = this._maxHeight + "px";
        this._divMain.tabIndex = 0;
        this._divMain.focus();
    }

    public close() {
        if (this._frame.getIFrameDocument().body.contains(this._divMain)) {
            this._frame.getIFrameDocument().body.removeChild(this._divMain);
        }
    }

    public toggle() {
        if (this._frame.getIFrameDocument().body.contains(this._divMain)) {
            this.close();
        } else {
            this.show();
        }
    }

    public get frame(): QinFrame {
		return this._frame;
	}

    public get divContent(): HTMLDivElement {
		return this._divContent;
	}

    public get divMain(): HTMLDivElement  {
		return this._divMain;
	}

    public get posLeft(): number {
		return this._posLeft;
	}

    public get posTop(): number {
		return this._posTop;
	}

    public get maxWidth(): number {
		return this._maxWidth;
	}

    public get maxHeight(): number {
		return this._maxHeight;
	}

}