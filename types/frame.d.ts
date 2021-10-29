import { Manager } from "./manager";
export declare class Frame {
    private manager;
    private title;
    private address;
    private rndID;
    private divFrame;
    private divHead;
    private imgMenu;
    private divTitle;
    private imgMinimize;
    private imgMaximize;
    private imgClose;
    private iframeBody;
    private divFoot;
    private imgStatusType;
    private divStatusText;
    private imgResize;
    private minimized;
    private maximized;
    private lastWidth;
    private lastHeight;
    constructor(manager: Manager, title: string, address: string);
    private initFrameTitle;
    private initDivFrame;
    private loadFrameInitBounds;
    private getFrameWindowStyleID;
    private initDivHead;
    private initIFrameBody;
    private initDivFoot;
    private initDraggable;
    getTitle(): string;
    getID(): string;
    install(): void;
    headMenuAction(): void;
    headMinimizeAction(): void;
    headMaximizeAction(): void;
    headCloseAction(): void;
    statusInfo(message: string): void;
    statusError(error: any, origin: string): void;
    saveFrameBounds(): void;
    show(): void;
    close(): void;
    getDocIFrame(): Document;
    newDialog(title: string, divContent: HTMLDivElement): FrameDialog;
    newPopup(parent: HTMLElement, divContent: HTMLDivElement): FramePopup;
}
export declare class FrameDialog {
    private title;
    private docIFrame;
    private divContent;
    private divDialog;
    private divTop;
    private spanTitle;
    private spanClose;
    private imgClose;
    private divPack;
    private showing;
    private docNodes;
    constructor(title: string, docIFrame: Document, divContent: HTMLDivElement);
    private initDialog;
    private initTop;
    private initPack;
    show(): void;
    close(): void;
}
export declare class FramePopup {
    private parent;
    private docIFrame;
    private divContent;
    private divPopup;
    constructor(parent: HTMLElement, docIFrame: Document, divContent: HTMLDivElement);
    private initPopup;
    private addFocusOutCloseToAll;
    private onFocusOutClose;
    show(): void;
    close(): void;
}
//# sourceMappingURL=frame.d.ts.map