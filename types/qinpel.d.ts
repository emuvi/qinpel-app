import { Manager } from "./manager";
import { Frame } from "./frame";
import { AxiosResponse } from "axios";
export declare class Qinpel {
    manager: Manager;
    frame: Frame;
    utils: {
        arm: {
            stopEvent: (event: any) => boolean;
            makeEventPointer: (isDown: boolean, ev: MouseEvent | TouchEvent) => import("qinpel-res").QinPoint;
            isEventPointerDouble: (isDown: boolean, ev: MouseEvent | TouchEvent) => boolean;
            isEventPointerLong: (isDown: boolean, ev: MouseEvent | TouchEvent) => boolean;
            isKeyInList: (ev: KeyboardEvent, list: string[]) => boolean;
            isKeyEnter: (ev: KeyboardEvent) => boolean;
            isKeySpace: (ev: KeyboardEvent) => boolean;
            addKeyAction: (element: HTMLElement, action: import("qinpel-res").QinAction) => void;
            addAction: (element: HTMLElement, action: import("qinpel-res").QinAction) => void;
            addMover: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("qinpel-res").QinDragCalls) => void;
            addResizer: (sources: HTMLElement[], target: HTMLElement, dragCalls?: import("qinpel-res").QinDragCalls) => void;
            addScroller: (target: HTMLElement, dragCalls?: import("qinpel-res").QinDragCalls) => void;
        };
        body: {
            getTextLines: (fromText: string) => string[];
            getCSVRows: (fromText: string, names?: string[]) => string[][] | object[];
            maskSpecialChars: (fromText: string) => string;
            unmaskSpecialChars: (fromText: string) => string;
        };
        foot: {
            getLocation: () => string;
            isLocalHost: () => boolean;
            getPathJoin: (pathA: string, pathB: string) => string;
            getFileExtension: (name: string) => string;
            isFileApp: (extension: string) => boolean;
            isFileCmd: (extension: string) => boolean;
            isFileExec: (extension: string) => boolean;
            isFileImage: (extension: string) => boolean;
            isFileVector: (extension: string) => boolean;
            isFileMovie: (extension: string) => boolean;
            isFileMusic: (extension: string) => boolean;
            isFileZipped: (extension: string) => boolean;
        };
        head: {
            getDeskAPI: () => any;
            log: (message: string) => void;
            getErrorMessage: (error: any, origin?: string) => string;
            toggleDevTools: () => void;
        };
        skin: {
            styles: {
                ColorBack: string;
                ColorMenu: string;
                ColorFont: string;
                FontName: string;
                FontSize: string;
            };
            styleAsBody: (el: HTMLDivElement) => void;
            styleSize: (el: HTMLElement, size?: import("qinpel-res").QinDimension | import("qinpel-res").QinGrandeur) => void;
            styleFlexMax: (el: HTMLElement) => void;
            styleFlexMin: (el: HTMLElement) => void;
            getWindowSize: () => import("qinpel-res").QinDimension;
            getWindowSizeStyle: () => import("qinpel-res").QinGrandeur;
            hideAllIFrames: () => void;
            showAllIFrames: () => void;
            disableSelection: (element: HTMLElement) => void;
            clearSelection: () => void;
            isElementVisibleInScroll: (element: HTMLElement) => boolean;
            getDimensionSize: (size: import("qinpel-res").QinGrandeur) => import("qinpel-res").QinDimension;
            getDimensionSmall: () => import("qinpel-res").QinDimension;
            getDimensionMedium: () => import("qinpel-res").QinDimension;
            getDimensionLarge: () => import("qinpel-res").QinDimension;
        };
    };
    constructor(manager: Manager, frame: Frame);
    get(address: string, headers?: any): Promise<AxiosResponse<never>>;
    post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>>;
}
//# sourceMappingURL=qinpel.d.ts.map