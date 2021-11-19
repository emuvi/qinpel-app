import axios, { AxiosResponse } from "axios";
import { QinAction, QinSoul } from "qinpel-res";

import { QinFrame } from "./qin-frame";

export class QinManager {

    private divBody = document.createElement("div");
    private divMenu = document.createElement("div");
    private imgMenu = document.createElement("img");
    private frames: QinFrame[] = [];
    private framesTopZ = 1;

    private token = "";
    private userLang = "";

    public constructor() {
        this.initBody();
        this.initMenu();
        this.initDraggable();
    }

    private initBody() {
        this.divBody.className = "QinpelWindowBody";
    }

    private initMenu() {
        this.divMenu.id = "QinpelMenuID0";
        this.divMenu.className = "QinpelWindowMenu";
        this.imgMenu.src = "./assets/qinpel.png";
        this.imgMenu.alt = "Menu";
        this.divMenu.appendChild(this.imgMenu);
        this.divBody.appendChild(this.divMenu);
        QinSoul.arm.addAction(this.divMenu, (event) => {
            if (event.hasShift) {
                document.body.requestFullscreen();
            } else {
                this.newFrame("Qinpel", "./menu.html");
            }
            return false;
        });
    }

    private initDraggable() {
        QinSoul.arm.addScroller(this.divBody, {
            onDouble: () => {
                this.divBody.scrollTo(0, 0);
                QinSoul.skin.clearSelection();
            },
            onEnd: () => {
                QinSoul.skin.clearSelection();
            }
        });
    }

    public putInDocument() {
        document.body.appendChild(this.divBody);
        QinSoul.skin.disableSelection(document.body);
    }

    public newFrame(title: string, address: string) {
        let frame = new QinFrame(this, title, address);
        frame.install();
        this.frames.push(frame);
    }

    public getFrame(fromTitle: string): QinFrame {
        for (const frame of this.frames) {
            if (frame.getTitle() === fromTitle) {
                return frame;
            }
        }
        return null;
    }

    public addChild(child: HTMLElement) {
        this.divBody.appendChild(child);
    }

    public delChild(child: HTMLElement) {
        this.divBody.removeChild(child);
    }

    public getFrameFromID(fromID: string): QinFrame {
        for (const frame of this.frames) {
            if (frame.getID() === fromID) {
                return frame;
            }
        }
        return null;
    }

    public getFrameIndexFromID(fromID: string): number {
        for (let i = 0; i < this.frames.length; i++) {
            if (this.frames[i].getID() === fromID) {
                return i;
            }
        }
        return -1;
    }

    public delFrame(frame: QinFrame) {
        const index = this.frames.indexOf(frame);
        if (index > -1) {
            this.frames.splice(index, 1);
        }
    }

    public showMenu() {
        this.divBody.scrollTo(0, 0);
        this.showElement(this.divMenu);
    }

    public showElement(element: HTMLElement) {
        setTimeout(() => {
            if (element.id != "QinpelPopMenuID1") {
                this.popMenuClose();
            }
            element.style.zIndex = String(++this.framesTopZ);
            if (!QinSoul.skin.isElementVisibleInScroll(element)) {
                element.parentElement.scrollTo(element.offsetLeft, element.offsetTop);
            }
            if (element.id.indexOf("QinpelFrameID") === 0) {
                const index = this.getFrameIndexFromID(element.id);
                if (index > 0) {
                    const frame = this.frames[index];
                    this.frames.splice(index, 1);
                    this.frames.unshift(frame);
                }
            }
        }, 360);
    }

    public popMenuAdd(title: string, action: QinAction) {

    }

    public popMenuClear() {

    }

    public popMenuShow() {

    }

    public popMenuClose() {
        // TODO - Get the PopMenu from the olds
        // if (qinpelRefWindow.refPopMenu != null) {
        //     qinpelRefWindow.divBody.removeChild(qinpelRefWindow.refPopMenu.elements.divPopMenu);
        //     qinpelRefWindow.refPopMenu = null;
        // }
    }

    public getBodyWidth() {
        return this.divBody.clientWidth;
    }

    public getBodyHeight() {
        return this.divBody.clientHeight;
    }

    public hasLogged() {
        return this.token != "";
    }

    public needToLog() {
        return !QinSoul.foot.isLocalHost() && !this.hasLogged();
    }

    private getAxiosConfig(headers: any) {
        if (!headers) {
            headers = {};
        }
        headers['Qinpel-Token'] = this.token;
        if (!headers['Accept-Language']) {
            if (this.userLang) {
                headers['Accept-Language'] = this.userLang;
            } else if (navigator.language) {
                headers['Accept-Language'] = navigator.language;
            }
        }
        let configs = {
            headers
        }
        return configs;
    }

    public get(address: string, headers?: any): Promise<AxiosResponse<never>> {
        let configs = this.getAxiosConfig(headers);
        return axios.get(address, configs);
    }

    public post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>> {
        let configs = this.getAxiosConfig(headers);
        if (!configs.headers['Content-Type']) {
            if (typeof data === 'string' || data instanceof String) {
                configs.headers['Content-Type'] = "text/plain";
            } else if (data instanceof FormData) {
                configs.headers['Content-Type'] = "multipart/form-data";
            } else {
                configs.headers['Content-Type'] = "application/json";
            }
        }
        return axios.post(address, data, configs);
    }

    public tryLogin(name: string, pass: string) {
        this.post("/login", { name, pass })
            .then(res => QinSoul.head.log(res.data))
            .catch(err => QinSoul.head.logError(err, "{qinpel-app}(ErrCode-000001)"));
    }

}