import { Manager } from "./manager";
import { Frame } from "./frame";
import { AxiosResponse } from "axios";
export { QinPoint, QinDimension, QinBounds, QinGrandeur, QinStyles, QinFilesNature, QinFilesOperation, QinFilesDescriptor, QinDragCalls, QinEvent, QinAction, } from "./utils";
export declare class Qinpel {
    manager: Manager;
    frame: Frame;
    util: {
        log: (message: any) => void;
        getLocation: () => string;
        isLocalHost: () => boolean;
        getWindowSize: () => import("./utils").QinDimension;
        getWindowSizeStyle: () => import("./utils").QinGrandeur;
        stopEvent: (event: any) => boolean;
        makeEventPointer: (isDown: boolean, ev: MouseEvent | TouchEvent) => import("./utils").QinPoint;
        hideAllIFrames: () => void;
        showAllIFrames: () => void;
        disableSelection: (element: HTMLElement) => void;
        clearSelection: () => void;
        isElementVisibleInScroll: (element: HTMLElement) => boolean;
        isKeyInList: (ev: KeyboardEvent, list: string[]) => boolean;
        isKeyEnter: (ev: KeyboardEvent) => boolean;
        isKeyEscape: (ev: KeyboardEvent) => boolean;
        addAction: (element: HTMLElement, action: import("./utils").QinAction) => void;
        addKeyAction: (element: HTMLElement, action: import("./utils").QinAction) => void;
        addMover: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("./utils").QinDragCalls) => void;
        addResizer: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("./utils").QinDragCalls) => void;
        addScroller: (target: HTMLElement, dragCalls?: import("./utils").QinDragCalls) => void;
        applyStyleAsBody: (el: HTMLDivElement) => void;
        getIconDimension: (size: import("./utils").QinGrandeur) => import("./utils").QinDimension;
        getIconSmall: () => import("./utils").QinDimension;
        getIconMedium: () => import("./utils").QinDimension;
        getIconLarge: () => import("./utils").QinDimension;
        getPathJoin: (pathA: string, pathB: string) => string;
        getFileExtension: (name: string) => string;
        isFileApp: (extension: string) => boolean;
        isFileCmd: (extension: string) => boolean;
        isFileExec: (extension: string) => boolean;
        isFileImage: (extension: string) => boolean;
        isFileVector: (extension: string) => boolean;
        isFileMusic: (extension: string) => boolean;
        isFileMovie: (extension: string) => boolean;
        isFileZipped: (extension: string) => boolean;
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