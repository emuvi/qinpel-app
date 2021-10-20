export declare type Point = {
    posX: number;
    posY: number;
};
export declare type Dimension = {
    width: number;
    height: number;
};
export declare type Bounds = {
    posX: number;
    posY: number;
    width: number;
    height: number;
};
export declare enum WindowSizeStyle {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}
export declare class QinpelEvent {
    alt: boolean;
    ctrl: boolean;
    shift: boolean;
    long: boolean;
    double: boolean;
    posX: number;
    posY: number;
    key: string;
    constructor();
    setFromKeyboard(ev: KeyboardEvent): QinpelEvent;
    setFromMouse(ev: MouseEvent): QinpelEvent;
    setFromTouch(ev: TouchEvent): QinpelEvent;
}
export declare type QinpelAction = (event: QinpelEvent) => void;
export declare type DragCalls = {
    onDouble?: CallableFunction;
    onLong?: CallableFunction;
    onStart?: CallableFunction;
    onMove?: CallableFunction;
    onEnd?: CallableFunction;
};
declare function log(message: any): void;
declare function getLocation(): string;
declare function isLocalHost(): boolean;
declare function getWindowSize(): Dimension;
declare function getWindowSizeStyle(): WindowSizeStyle;
declare function stopEvent(event: any): boolean;
declare function makeEventPointer(isDown: boolean, ev: MouseEvent | TouchEvent): Point;
declare function hideAllIFrames(): void;
declare function showAllIFrames(): void;
declare function disableSelection(element: HTMLElement): void;
declare function clearSelection(): void;
declare function isElementVisibleInScroll(element: HTMLElement): boolean;
declare function isKeyReturn(ev: KeyboardEvent): boolean;
declare function isKeyEscape(ev: KeyboardEvent): boolean;
declare function addKeyAction(element: HTMLElement, action: QinpelAction): void;
declare function addAction(element: HTMLElement, action: QinpelAction): void;
declare function addMover(sources: HTMLElement[], target: HTMLElement, dragCalls?: DragCalls): void;
declare function addResizer(sources: HTMLElement[], target: HTMLElement, dragCalls?: DragCalls): void;
declare function addScroller(target: HTMLElement, dragCalls?: DragCalls): void;
declare function getFileExtension(name: string): string;
declare function getTextLines(fromText: string): string[];
declare function getCSVRows(fromText: string, names?: string[]): string[][] | object[];
declare function maskSpecialChars(fromText: string): string;
declare function unmaskSpecialChars(fromText: string): string;
declare function getErrorMessage(error: any, origin?: string): string;
declare function toggleDevTools(): void;
declare const utils: {
    log: typeof log;
    getLocation: typeof getLocation;
    isLocalHost: typeof isLocalHost;
    getWindowSize: typeof getWindowSize;
    getWindowSizeStyle: typeof getWindowSizeStyle;
    stopEvent: typeof stopEvent;
    makeEventPointer: typeof makeEventPointer;
    hideAllIFrames: typeof hideAllIFrames;
    showAllIFrames: typeof showAllIFrames;
    disableSelection: typeof disableSelection;
    clearSelection: typeof clearSelection;
    isElementVisibleInScroll: typeof isElementVisibleInScroll;
    isKeyReturn: typeof isKeyReturn;
    isKeyEscape: typeof isKeyEscape;
    addAction: typeof addAction;
    addKeyAction: typeof addKeyAction;
    addMover: typeof addMover;
    addResizer: typeof addResizer;
    addScroller: typeof addScroller;
    getFileExtension: typeof getFileExtension;
    getTextLines: typeof getTextLines;
    getCSVRows: typeof getCSVRows;
    maskSpecialChars: typeof maskSpecialChars;
    unmaskSpecialChars: typeof unmaskSpecialChars;
    getErrorMessage: typeof getErrorMessage;
    toggleDevTools: typeof toggleDevTools;
};
export default utils;
//# sourceMappingURL=utils.d.ts.map