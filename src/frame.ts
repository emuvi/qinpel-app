import { Manager } from "./manager";
import { QinSoul, QinBounds, QinGrandeur, QinStyles } from "qinpel-res";
import param from "./param";
import { Qinpel } from "./qinpel";
import styles from "./styles/frame-styles"

export class Frame {
    private manager: Manager;
    private title: string;
    private address: string;
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

    public constructor(manager: Manager, title: string, address: string) {
        this.manager = manager;
        this.title = this.initFrameTitle(title);
        this.address = address;
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
        this.iframeBody.src = this.address;
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

    public getTitle(): string {
        return this.title;
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
            this.divFrame.style.width = param.MINIMIZED_WIDTH + "px";
            this.divFrame.style.height = this.divHead.clientHeight + "px";
            this.minimized = true;
        }
        this.manager.showElement(this.divFrame);
    }

    public headMaximizeAction() {
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

    public headCloseAction() {
        this.close();
    }

    public statusInfo(message: string) {
        this.divStatusText.innerText = message;
    }

    public statusError(error: any, origin: string) {
        this.imgStatusType.src = "./assets/frame-status-error.png";
        this.divStatusText.innerText = QinSoul.head.getErrorMessage(error, origin);
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

    public close() {
        this.saveFrameBounds();
        this.manager.delChild(this.divFrame);
        this.manager.delFrame(this);
    }

    public getDocIFrame(): Document {
        return this.iframeBody.contentWindow.document;
    }

    public newDialog(title: string, divContent: HTMLDivElement): FrameDialog {
        return new FrameDialog(title, this.getDocIFrame(), divContent);
    }

    public newPopup(parent: HTMLElement, divContent: HTMLDivElement): FramePopup {
        return new FramePopup(parent, this.getDocIFrame(), divContent);
    }

}

export class FrameDialog {

    private title: string;
    private docIFrame: Document;
    private divContent: HTMLDivElement;
    private divDialog = document.createElement("div");
    private divTop = document.createElement("div");
    private spanTitle = document.createElement("span");
    private spanClose = document.createElement("span");
    private imgClose = document.createElement("img");
    private divPack = document.createElement("div");

    private showing = false;
    private docNodes: ChildNode[] = [];

    public constructor(title: string, docIFrame: Document, divContent: HTMLDivElement) {
        this.title = title;
        this.docIFrame = docIFrame;
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
        for (let i = 0; i < this.docIFrame.body.childNodes.length; i++) {
            const child = this.docIFrame.body.childNodes[i];
            this.docNodes.push(child);
        }
        for (const child of this.docNodes) {
            this.docIFrame.body.removeChild(child);
        }
        this.docIFrame.body.appendChild(this.divDialog);
        this.showing = true;
    }

    public close() {
        if (!this.showing) {
            return;
        }
        this.docIFrame.body.removeChild(this.divDialog);
        for (const child of this.docNodes) {
            this.docIFrame.body.appendChild(child);
        }
        this.docNodes = [];
        this.showing = false;
    }

}

export class FramePopup {

    private parent: HTMLElement;
    private docIFrame: Document;
    private divContent: HTMLDivElement;
    private divPopup = document.createElement("div");

    public constructor(parent: HTMLElement, docIFrame: Document, divContent: HTMLDivElement) {
        this.parent = parent;
        this.docIFrame = docIFrame;
        this.divContent = divContent;
        this.initPopup();
    }

    private initPopup() {
        this.divPopup.appendChild(this.divContent);
        QinSoul.skin.styleAsEdit(this.divPopup);
        this.divPopup.style.position = "absolute";
        this.divPopup.style.padding = "5px";
        this.addFocusOutCloseToAll(this.divPopup);
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
        const divCheck = this.divPopup;
        setTimeout(() => {
            if (!divCheck.contains(this.docIFrame.activeElement)) {
                this.close();
            }
        }, 360);
        return QinSoul.arm.stopEvent(ev);
    }

    public show() {
        this.close();
        this.docIFrame.body.appendChild(this.divPopup);
        const parentBounds = this.parent.getBoundingClientRect();
        this.divPopup.style.left = parentBounds.x + "px";
        if (this.parent instanceof HTMLDivElement) {
            this.divPopup.style.top = parentBounds.y + "px";
        } else {
            this.divPopup.style.top = (parentBounds.y + parentBounds.height) + "px";
        }
        this.divPopup.tabIndex = 0;
        this.divPopup.focus();
    }

    public close() {
        if (this.docIFrame.body.contains(this.divPopup)) {
            this.docIFrame.body.removeChild(this.divPopup);
        }
    }

    public toggle() {
        if (this.docIFrame.body.contains(this.divPopup)) {
            this.close();
        } else {
            this.show();
        }
    }

}