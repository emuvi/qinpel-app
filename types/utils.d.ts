export declare class QinPoint {
    posX: number;
    posY: number;
}
export declare class QinDimension {
    width: number;
    height: number;
}
export declare class QinBounds {
    posX: number;
    posY: number;
    width: number;
    height: number;
}
export declare enum QinGrandeur {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}
export declare enum QinStyles {
    ColorBack = "#fff9ef",
    ColorFont = "#270036",
    FontName = "Poppins",
    FontSize = "12px"
}
export declare enum QinFilesNature {
    DIRECTORIES = "directories",
    FILES = "files",
    BOTH = "both"
}
export declare enum QinFilesOperation {
    OPEN = "open",
    SAVE = "save"
}
export declare class QinFilesDescriptor {
    description: string;
    extensions: string[];
}
export declare class QinDragCalls {
    onDouble?: CallableFunction;
    onLong?: CallableFunction;
    onStart?: CallableFunction;
    onMove?: CallableFunction;
    onEnd?: CallableFunction;
}
export declare class QinEvent {
    fromTyping: boolean;
    fromPointing: boolean;
    hasAlt: boolean;
    hasCtrl: boolean;
    hasShift: boolean;
    hasMeta: boolean;
    isEnter: boolean;
    isEscape: boolean;
    isSpace: boolean;
    isDouble: boolean;
    isLong: boolean;
    keyTyped: string;
    pointOnX: number;
    pointOnY: number;
    stopEvent: boolean;
    constructor();
    setFromKeyboard(ev: KeyboardEvent): QinEvent;
    setFromMouse(ev: MouseEvent): QinEvent;
    setFromTouch(ev: TouchEvent): QinEvent;
    stop(): void;
}
export declare type QinAction = (event: QinEvent) => void;
declare function log(message: any): void;
declare function getLocation(): string;
declare function isLocalHost(): boolean;
declare function getWindowSize(): QinDimension;
declare function getWindowSizeStyle(): QinGrandeur;
declare function stopEvent(event: any): boolean;
declare function makeEventPointer(isDown: boolean, ev: MouseEvent | TouchEvent): QinPoint;
declare function hideAllIFrames(): void;
declare function showAllIFrames(): void;
declare function disableSelection(element: HTMLElement): void;
declare function clearSelection(): void;
declare function isElementVisibleInScroll(element: HTMLElement): boolean;
declare function isKeyInList(ev: KeyboardEvent, list: string[]): boolean;
declare function isKeyEnter(ev: KeyboardEvent): boolean;
declare function isKeyEscape(ev: KeyboardEvent): boolean;
declare function addKeyAction(element: HTMLElement, action: QinAction): void;
declare function addAction(element: HTMLElement, action: QinAction): void;
declare function addMover(sources: HTMLElement[], target: HTMLElement, dragCalls?: QinDragCalls): void;
declare function addResizer(sources: HTMLElement[], target: HTMLElement, dragCalls?: QinDragCalls): void;
declare function addScroller(target: HTMLElement, dragCalls?: QinDragCalls): void;
declare function applyStyleAsBody(el: HTMLDivElement): void;
declare function getIconDimension(size: QinGrandeur): QinDimension;
declare function getIconSmall(): QinDimension;
declare function getIconMedium(): QinDimension;
declare function getIconLarge(): QinDimension;
declare function getPathJoin(pathA: string, pathB: string): string;
declare function getFileExtension(name: string): string;
declare function isFileApp(extension: string): boolean;
declare function isFileCmd(extension: string): boolean;
declare function isFileExec(extension: string): boolean;
declare function isFileImage(extension: string): boolean;
declare function isFileVector(extension: string): boolean;
declare function isFileMovie(extension: string): boolean;
declare function isFileMusic(extension: string): boolean;
declare function isFileZipped(extension: string): boolean;
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
    isKeyInList: typeof isKeyInList;
    isKeyEnter: typeof isKeyEnter;
    isKeyEscape: typeof isKeyEscape;
    addAction: typeof addAction;
    addKeyAction: typeof addKeyAction;
    addMover: typeof addMover;
    addResizer: typeof addResizer;
    addScroller: typeof addScroller;
    applyStyleAsBody: typeof applyStyleAsBody;
    getIconDimension: typeof getIconDimension;
    getIconSmall: typeof getIconSmall;
    getIconMedium: typeof getIconMedium;
    getIconLarge: typeof getIconLarge;
    getPathJoin: typeof getPathJoin;
    getFileExtension: typeof getFileExtension;
    isFileApp: typeof isFileApp;
    isFileCmd: typeof isFileCmd;
    isFileExec: typeof isFileExec;
    isFileImage: typeof isFileImage;
    isFileVector: typeof isFileVector;
    isFileMusic: typeof isFileMusic;
    isFileMovie: typeof isFileMovie;
    isFileZipped: typeof isFileZipped;
    getTextLines: typeof getTextLines;
    getCSVRows: typeof getCSVRows;
    maskSpecialChars: typeof maskSpecialChars;
    unmaskSpecialChars: typeof unmaskSpecialChars;
    getErrorMessage: typeof getErrorMessage;
    toggleDevTools: typeof toggleDevTools;
};
export default utils;
//# sourceMappingURL=utils.d.ts.map