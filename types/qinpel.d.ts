import { Manager } from "./manager";
import { Frame } from "./frame";
import { AxiosResponse } from "axios";
export declare class Qinpel {
    manager: Manager;
    frame: Frame;
    util: {
        log: (message: any) => void;
        getLocation: () => string;
        isLocalHost: () => boolean;
        getWindowSize: () => import("./utils").Dimension;
        getWindowSizeStyle: () => import("./utils").WindowSizeStyle;
        stopEvent: (event: any) => boolean;
        makeEventPointer: (isDown: boolean, ev: MouseEvent | TouchEvent) => import("./utils").Point;
        hideAllIFrames: () => void;
        showAllIFrames: () => void;
        disableSelection: (element: HTMLElement) => void;
        clearSelection: () => void;
        isElementVisibleInScroll: (element: HTMLElement) => boolean;
        isKeyReturn: (ev: KeyboardEvent) => boolean;
        isKeyEscape: (ev: KeyboardEvent) => boolean;
        addAction: (element: HTMLElement, action: import("./utils").QinpelAction) => void;
        addKeyAction: (element: HTMLElement, action: import("./utils").QinpelAction) => void;
        addMover: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("./utils").DragCalls) => void;
        addResizer: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("./utils").DragCalls) => void;
        addScroller: (target: HTMLElement, dragCalls?: import("./utils").DragCalls) => void;
        getFileExtension: (name: string) => string;
        getTextLines: (fromText: string) => string[];
        getCSVRows: (fromText: string, names?: string[]) => string[][] | object[];
        maskSpecialChars: (fromText: string) => string;
        unmaskSpecialChars: (fromText: string) => string;
        getErrorMessage: (error: any, origin?: string) => string;
        toggleDevTools: () => void;
    };
    constructor(manager: Manager, frame: Frame);
    get(address: string, headers?: any): Promise<AxiosResponse<never>>;
    post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>>;
}
//# sourceMappingURL=qinpel.d.ts.map