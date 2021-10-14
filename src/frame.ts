import { Manager } from "./manager";
import utils, { Bounds, WindowSizeStyle } from "./utils";
import param from "./param";

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
    private imgStatusUp = document.createElement("img");
    private imgStatusDown = document.createElement("img");
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
        this.initInsideFrameBody();
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

    private loadFrameInitBounds(): Bounds {
        const result = {
            posX: 64,
            posY: 64,
            width: 800,
            height: 600,
        };
        let windowSizeStyle = utils.getWindowSizeStyle();
        const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        const frameBoundsSaved = window.localStorage.getItem(frameStyleID);
        if (frameBoundsSaved) {
            let parts = frameBoundsSaved.split(",");
            result.posX = Number(parts[0]);
            result.posY = Number(parts[1]);
            result.width = Number(parts[2]);
            result.height = Number(parts[3]);
        } else {
            if (windowSizeStyle === WindowSizeStyle.SMALL) {
                result.posX = 0;
                result.posY = 0;
                const size = utils.getWindowSize();
                result.width = size.width - 4;
                result.height = size.height - 4;
            } else if (windowSizeStyle === WindowSizeStyle.MEDIUM) {
                result.posX = 48;
                result.posY = 48;
                result.width = 500;
                result.height = 375;
            }
        }
        return result;
    }

    private getFrameWindowStyleID(windowSizeStyle: WindowSizeStyle): string {
        return "window " + windowSizeStyle + " size of: " + this.title;
    }

    private initDivHead() {
        this.divHead.className = "QinpelWindowFrameHead";
        this.imgMenu.src = "./assets/menu.png";
        this.imgMenu.alt = "o";
        utils.addAction(this.imgMenu, () => this.headMenuAction());
        this.divHead.appendChild(this.imgMenu);
        this.divTitle.className = "QinpelWindowFrameHeadTitle";
        this.divTitle.innerText = this.title;
        this.divHead.appendChild(this.divTitle);
        this.imgMinimize.src = "./assets/minimize.png";
        this.imgMinimize.alt = "-";
        utils.addAction(this.imgMinimize, () => this.headMinimizeAction());
        this.divHead.appendChild(this.imgMinimize);
        this.imgMaximize.src = "./assets/maximize.png";
        this.imgMaximize.alt = "+";
        utils.addAction(this.imgMaximize, () => this.headMaximizeAction());
        this.divHead.appendChild(this.imgMaximize);
        this.imgClose.src = "./assets/close.png";
        this.imgClose.alt = "x";
        utils.addAction(this.imgClose, () => this.headCloseAction());
        this.divHead.appendChild(this.imgClose);
        this.divFrame.appendChild(this.divHead);
    }

    private initInsideFrameBody() {
        this.iframeBody.id = "QinpelInsideFrameID" + this.rndID;
        this.iframeBody.className = "QinpelWindowFrameBody";
        this.iframeBody.src = this.address;
        this.divFrame.appendChild(this.iframeBody);
    }

    private initDivFoot() {
        this.divFoot.className = "QinpelWindowFrameFoot";
        this.imgStatusUp.src = "./assets/status-up.png";
        this.divFoot.appendChild(this.imgStatusUp);
        this.imgStatusDown.src = "./assets/status-down.png";
        this.divFoot.appendChild(this.imgStatusDown);
        this.imgStatusType.src = "./assets/status-info.png";
        this.divFoot.appendChild(this.imgStatusType);
        this.divStatusText.className = "QinpelWindowFrameFootStatus";
        this.divStatusText.innerText = "StatusBar";
        this.divFoot.appendChild(this.divStatusText);
        this.imgResize.src = "./assets/resize.png";
        this.imgResize.alt = "/";
        this.divFoot.appendChild(this.imgResize);
        this.divFrame.appendChild(this.divFoot);
    }

    private initDraggable() {
        utils.addMover([this.divHead, this.divStatusText], this.divFrame,
            {
                onDouble: () => this.headMaximizeAction(),
                onEnd: () => {
                    this.manager.showElement(this.divFrame);
                    utils.clearSelection();
                }
            });
        utils.addResizer([this.imgResize], this.divFrame,
            {
                onDouble: () => this.headMaximizeAction(),
                onEnd: () => {
                    this.maximized = false;
                    this.lastWidth = parseInt(this.divFrame.style.width, 10);
                    this.lastHeight = parseInt(this.divFrame.style.height, 10);
                    this.manager.showElement(this.divFrame);
                    utils.clearSelection();
                }
            });
    }

    public getTitle(): string {
        return this.title;
    }

    public getDiv(): HTMLDivElement {
        return this.divFrame;
    }

    public getIFrame(): any {
        return this.iframeBody;
    }

    public getID(): string {
        return this.divFrame.id;
    }

    public show() {
        this.manager.showElement(this.divFrame);
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
        this.manager.closeFrame(this);
    }

    public statusInfo(message: string) {
        this.divStatusText.innerText = message;
    }

    public statusError(error: any, origin: string) {
        this.imgStatusType.src = "./assets/status-error.png";
        this.divStatusText.innerText = utils.getErrorMessage(error, origin);
    }

    public saveFrameBounds() {
        let windowSizeStyle = utils.getWindowSizeStyle();
        const frameStyleID = this.getFrameWindowStyleID(windowSizeStyle);
        const frameBounds =
            parseInt(this.divFrame.style.left, 10) + "," +
            parseInt(this.divFrame.style.top, 10) + "," +
            parseInt(this.divFrame.style.width, 10) + "," +
            parseInt(this.divFrame.style.height, 10);
        window.localStorage.setItem(frameStyleID, frameBounds);
    }

}