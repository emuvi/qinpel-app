import { Frame } from "./frame";
import { AxiosResponse } from "axios";
export declare class Manager {
    private divBody;
    private divMenu;
    private imgMenu;
    private frames;
    private framesTopZ;
    private token;
    private userLang;
    constructor();
    private initBody;
    private initMenu;
    private initDraggable;
    putInDocument(): void;
    newFrame(title: string, address: string): void;
    getFrame(fromTitle: string): Frame;
    addChild(child: HTMLElement): void;
    delChild(child: HTMLElement): void;
    getFrameFromID(fromID: string): Frame;
    getFrameIndexFromID(fromID: string): number;
    delFrame(frame: Frame): void;
    showMenu(): void;
    showElement(element: HTMLElement): void;
    closePopMenu(): void;
    getBodyWidth(): number;
    getBodyHeight(): number;
    hasLogged(): boolean;
    needToLog(): boolean;
    get(address: string, headers?: any): Promise<AxiosResponse<never>>;
    post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>>;
    private getAxiosConfig;
}
//# sourceMappingURL=manager.d.ts.map