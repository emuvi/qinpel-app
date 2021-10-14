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
    private imgStatusUp;
    private imgStatusDown;
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
    private initInsideFrameBody;
    private initDivFoot;
    private initDraggable;
    getTitle(): string;
    getDiv(): HTMLDivElement;
    getIFrame(): any;
    getID(): string;
    show(): void;
    headMenuAction(): void;
    headMinimizeAction(): void;
    headMaximizeAction(): void;
    headCloseAction(): void;
    statusInfo(message: string): void;
    statusError(error: any, origin: string): void;
    saveFrameBounds(): void;
}
//# sourceMappingURL=frame.d.ts.map