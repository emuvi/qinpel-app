import { QinWaiter } from "qinpel-res";
import { QinSoul, QinBounds, QinGrandeur, QinStyles } from "qinpel-res";

import { QinManager } from "./qin-manager";
import { Qinpel } from "./qinpel";

export class QinFrame {
    private manager: QinManager;
    private title: string;
    private appName: string;
    private options: any;
    private waiters: QinWaiter[] = [];
    private rndID = Math.floor(Math.random() * 1000000);
    private divFrame = document.createElement("div");
    private divHead = document.createElement("div");
    private imgMenu = document.createElement("img");
    private divTitle = document.createElement("div");
    private imgMinimize = document.createElement("img");
    private imgMaximize = document.createElement("img");
    private imgClose = document.createElement("img");
    private iframeBody = document.createElement("iframe");
    private divFoot = document.createElement("div");
    private imgStatusType = document.createElement("img");
    private divStatusText = document.createElement("div");
    private imgResize = document.createElement("img");

    private minimized = false;
    private maximized = false;
    private lastWidth = -1;
    private lastHeight = -1;

    private statusRecords: StatusRecord[] = [];

    public constructor(manager: QinManager, title: string, appName: string, options?: any) {
        this.manager = manager;
        this.title = this.initFrameTitle(title);
        this.appName = appName;
        this.options = options ? options : {};
        this.initDivFrame();
        this.initDivHead();
        this.initIFrameBody();
        this.initDivFoot();
        this.initDraggable();
    }

    private initFrameTitle(title: string): string {
        var result = title;
        var attempt = 1;
        while (true) {
            if (this.manager.getFrame(result) != null) {
                result = title + " (" + (++attempt) + ")";
            } else {
                break;
            }
        }
        return result;
    }

    private initDivFrame() {
        this.divFrame.id = "QinpelFrameID" + this.rndID;
        this.divFrame.className = "QinpelWindowFrame";
        const frameInitBounds = this.loadFrameInitBounds();
        this.divFrame.style.left = frameInitBounds.posX + "px";
        this.divFrame.style.top = frameInitBounds.posY + "px";
        this.divFrame.style.width = frameInitBounds.width + "px";
        this.divFrame.style.height = frameInitBounds.height + "px";
        this.lastWidth = frameInitBounds.width;
        this.lastHeight = frameInitBounds.height;
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
        const frameBoundsSaved = window.localStorage.getItem(frameStyleID);
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
        return "window " + windowSizeStyle + " size of: " + this.title;
    }

    private initDivHead() {
        this.divHead.className = "QinpelWindowFrameHead";
        this.imgMenu.src = "./assets/frame-menu.png";
        this.imgMenu.alt = "o";
        QinSoul.arm.addAction(this.imgMenu, () => this.headMenuAction());
        this.divHead.appendChild(this.imgMenu);
        this.divTitle.className = "QinpelWindowFrameHeadTitle";
        this.divTitle.innerText = this.title;
        this.divHead.appendChild(this.divTitle);
        this.imgMinimize.src = "./assets/frame-minimize.png";
        this.imgMinimize.alt = "-";
        QinSoul.arm.addAction(this.imgMinimize, () => this.headMinimizeAction());
        this.divHead.appendChild(this.imgMinimize);
        this.imgMaximize.src = "./assets/frame-maximize.png";
        this.imgMaximize.alt = "+";
        QinSoul.arm.addAction(this.imgMaximize, () => this.headMaximizeAction());
        this.divHead.appendChild(this.imgMaximize);
        this.imgClose.src = "./assets/frame-close.png";
        this.imgClose.alt = "x";
        QinSoul.arm.addAction(this.imgClose, () => this.headCloseAction());
        this.divHead.appendChild(this.imgClose);
        this.divFrame.appendChild(this.divHead);
    }

    private initIFrameBody() {
        this.iframeBody.id = "QinpelInsideFrameID" + this.rndID;
        this.iframeBody.className = "QinpelWindowFrameBody";
        let address = this.appName;
        if (!address.startsWith("/run/app/")) {
            address = "/run/app/" + address + "/index.html";
        }
        this.iframeBody.src = address;
        this.iframeBody.onload = (_) => {
            styles.applyOnIFrame(this.iframeBody);
        }
        this.divFrame.appendChild(this.iframeBody);
    }

    private initDivFoot() {
        this.divFoot.className = "QinpelWindowFrameFoot";
        this.imgStatusType.src = "./assets/frame-status-info.png";
        this.divFoot.appendChild(this.imgStatusType);
        this.divStatusText.className = "QinpelWindowFrameFootStatus";
        this.divStatusText.innerText = "StatusBar";
        this.divFoot.appendChild(this.divStatusText);
        this.imgResize.src = "./assets/frame-resize.png";
        this.imgResize.alt = "/";
        this.divFoot.appendChild(this.imgResize);
        this.divFrame.appendChild(this.divFoot);
    }

    private initDraggable() {
        QinSoul.arm.addMover([this.divHead, this.divStatusText], this.divFrame,
            {
                onDouble: () => this.headMaximizeAction(),
                onEnd: () => {
                    this.manager.showElement(this.divFrame);
                    QinSoul.skin.clearSelection();
                }
            });
        QinSoul.arm.addResizer([this.imgResize], this.divFrame,
            {
                onDouble: () => this.headMaximizeAction(),
                onEnd: () => {
                    this.maximized = false;
                    this.lastWidth = parseInt(this.divFrame.style.width, 10);
                    this.lastHeight = parseInt(this.divFrame.style.height, 10);
                    this.manager.showElement(this.divFrame);
                    QinSoul.skin.clearSelection();
                }
            });
    }

    public getManager(): QinManager {
        return this.manager;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAppName(): string {
        return this.appName;
    }

    public getOption(name: string): any {
        return this.options[name];
    }

    public setOption(name: string, value: any) {
        this.options[name] = value;
    }

    public putOptions(options: any) {
        if (options) {
            Object.assign(this.options, options);
        }
    }

    public cleanOptions() {
        this.options = {};
    }

    public addWaiter(waiter: QinWaiter) {
        this.waiters.push(waiter);
    }

    public hasWaiters(): boolean {
        return this.waiters.length > 0;
    }

    public sendWaiters(withResult: any) {
        for (const waiter of this.waiters) {
            waiter(withResult);
        }
    }

    public cleanWaiters() {
        this.waiters = [];
    }

    public getID(): string {
        return this.divFrame.id;
    }

    public install() {
        //@ts-ignore
        this.iframeBody.qinpel = new Qinpel(this.manager, this);
        this.manager.addChild(this.divFrame);
        this.show();
    }

    public headMenuAction() {
        this.manager.showMenu();
    }

    public headMinimizeAction() {
        this.minimize();
    }

    public headMaximizeAction() {
        this.maximize();
    }

    public headCloseAction() {
        this.close();
    }

    public statusInfo(message: string) {
        let rec = {
            kind: StatusKind.INFO,
            message: message
        }
        this.statusRecords.push(rec);
        this.divStatusText.innerText = this.getDisplayStatusMessage(message);
    }

    public statusError(error: any, origin: string) {
        let message = QinSoul.head.getErrorMessage(error, origin);
        let rec = {
            kind: StatusKind.ERROR,
            message: message
        }
        this.statusRecords.push(rec);
        this.imgStatusType.src = "./assets/frame-status-error.png";
        this.divStatusText.innerText = this.getDisplayStatusMessage(message);
    }

    private getDisplayStatusMessage(message: string): string {  
        if (message.length > FaceConfigs.STATUS_MESSAGE_MAX_LENGTH) {
            return message.substring(0, FaceConfigs.STATUS_MESSAGE_MAX_LENGTH);
        } else {
            return message;
        }
    }

    public saveFrameBounds() {
        let windowSizeStyle = QinSoul.skin.getWindowSizeStyle();
        const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        const frameBounds =
            parseInt(this.divFrame.style.left, 10) + "," +
            parseInt(this.divFrame.style.top, 10) + "," +
            parseInt(this.divFrame.style.width, 10) + "," +
            parseInt(this.divFrame.style.height, 10);
        window.localStorage.setItem(frameStyleID, frameBounds);
    }

    public show() {
        this.manager.showElement(this.divFrame);
    }

    public minimize() {
        if (this.minimized) {
            this.divFrame.style.width = this.lastWidth + "px";
            this.divFrame.style.height = this.lastHeight + "px";
            this.iframeBody.style.display = "";
            this.divFoot.style.display = "";
            this.minimized = false;
        } else {
            if (this.maximized) {
                this.headMaximizeAction();
            }
            this.lastWidth = parseInt(this.divFrame.style.width, 10);
            this.lastHeight = parseInt(this.divFrame.style.height, 10);
            this.iframeBody.style.display = "none";
            this.divFoot.style.display = "none";
            this.divFrame.style.width = FaceConfigs.MINIMIZED_WIDTH + "px";
            this.divFrame.style.height = this.divHead.clientHeight + "px";
            this.minimized = true;
        }
        this.manager.showElement(this.divFrame);
    }

    public maximize() {
        if (this.maximized) {
            this.divFrame.style.width = this.lastWidth + "px";
            this.divFrame.style.height = this.lastHeight + "px";
            this.maximized = false;
        } else {
            if (this.minimized) {
                this.headMinimizeAction();
            }
            this.lastWidth = parseInt(this.divFrame.style.width, 10);
            this.lastHeight = parseInt(this.divFrame.style.height, 10);
            this.divFrame.style.width = this.manager.getBodyWidth() - 4 + "px";
            this.divFrame.style.height = this.manager.getBodyHeight() - 4 + "px";
            this.maximized = true;
        }
        this.manager.showElement(this.divFrame);
    }

    public close() {
        this.saveFrameBounds();
        this.manager.delChild(this.divFrame);
        this.manager.delFrame(this);
    }

    public getIFrame(): HTMLIFrameElement {
        return this.iframeBody;
    }

    public getIFrameDocument(): Document {
        return this.iframeBody.contentWindow.document;
    }

    public newDialog(title: string, divContent: HTMLDivElement): QinFrameDialog {
        return new QinFrameDialog(this, title, divContent);
    }

    public newPopup(divContent: HTMLDivElement): QinFramePopup {
        return new QinFramePopup(this, divContent);
    }

    public navigate(url: string) {
        this.iframeBody.src = url;
    }

}

export class QinFrameDialog {

    private frame: QinFrame;
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

    public constructor(frame: QinFrame, title: string, divContent: HTMLDivElement) {
        this.frame = frame;
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
        this.imgClose.src = "/run/app/qinpel-app/assets/frame-close.png";
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
        for (let i = 0; i < this.frame.getIFrameDocument().body.childNodes.length; i++) {
            const child = this.frame.getIFrameDocument().body.childNodes[i];
            this.docNodes.push(child);
        }
        for (const child of this.docNodes) {
            this.frame.getIFrameDocument().body.removeChild(child);
        }
        this.frame.getIFrameDocument().body.appendChild(this.divDialog);
        this.showing = true;
    }

    public close() {
        if (!this.showing) {
            return;
        }
        this.frame.getIFrameDocument().body.removeChild(this.divDialog);
        for (const child of this.docNodes) {
            this.frame.getIFrameDocument().body.appendChild(child);
        }
        this.docNodes = [];
        this.showing = false;
    }

}

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

    /**
     * Getter frame
     * @return {QinFrame}
     */
	public get frame(): QinFrame {
		return this._frame;
	}

    /**
     * Getter divContent
     * @return {HTMLDivElement}
     */
	public get divContent(): HTMLDivElement {
		return this._divContent;
	}

    /**
     * Getter divMain
     * @return {HTMLDivElement }
     */
	public get divMain(): HTMLDivElement  {
		return this._divMain;
	}

    /**
     * Getter posLeft
     * @return {number}
     */
	public get posLeft(): number {
		return this._posLeft;
	}

    /**
     * Getter posTop
     * @return {number}
     */
	public get posTop(): number {
		return this._posTop;
	}

    /**
     * Getter maxWidth
     * @return {number}
     */
	public get maxWidth(): number {
		return this._maxWidth;
	}

    /**
     * Getter maxHeight
     * @return {number}
     */
	public get maxHeight(): number {
		return this._maxHeight;
	}

}

const styles = {
    applyOnIFrame: (el: HTMLIFrameElement) => {
        const head = el.contentWindow.document.head;
        const defaultCSS  = document.createElement('link');
        defaultCSS.id   = "QinpelIFrameDefaultCSS";
        defaultCSS.rel  = "stylesheet";
        defaultCSS.type = "text/css";
        defaultCSS.href = "/run/app/qinpel-app/default.css";
        defaultCSS.media = "all";
        head.appendChild(defaultCSS);
    },
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
}

enum StatusKind {
    INFO, ERROR
}

type StatusRecord = {
    kind: StatusKind,
    message: string,
}

const FaceConfigs = {
    POP_MENU_MAX_HEIGHT: 270,
    POP_MENU_WIDTH: 180,
    MINIMIZED_WIDTH: 180,
    STATUS_MESSAGE_MAX_LENGTH: 180,
};