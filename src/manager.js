"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const frame_1 = require("./frame");
const axios_1 = require("axios");
const qinpel_res_1 = require("qinpel-res");
class Manager {
    constructor() {
        this.divBody = document.createElement("div");
        this.divMenu = document.createElement("div");
        this.imgMenu = document.createElement("img");
        this.frames = [];
        this.framesTopZ = 1;
        this.token = "";
        this.userLang = "";
        this.initBody();
        this.initMenu();
        this.initDraggable();
    }
    initBody() {
        this.divBody.className = "QinpelWindowBody";
    }
    initMenu() {
        this.divMenu.id = "QinpelMenuID0";
        this.divMenu.className = "QinpelWindowMenu";
        this.imgMenu.src = "./assets/qinpel.png";
        this.imgMenu.alt = "Menu";
        this.divMenu.appendChild(this.imgMenu);
        this.divBody.appendChild(this.divMenu);
        qinpel_res_1.QinSoul.arm.addAction(this.divMenu, (event) => {
            if (event.hasShift) {
                document.body.requestFullscreen();
            }
            else {
                this.newFrame("Qinpel", "./menu.html");
            }
            return false;
        });
    }
    initDraggable() {
        qinpel_res_1.QinSoul.arm.addScroller(this.divBody, {
            onDouble: () => {
                this.divBody.scrollTo(0, 0);
                qinpel_res_1.QinSoul.skin.clearSelection();
            },
            onEnd: () => {
                qinpel_res_1.QinSoul.skin.clearSelection();
            }
        });
    }
    putInDocument() {
        document.body.appendChild(this.divBody);
        qinpel_res_1.QinSoul.skin.disableSelection(document.body);
    }
    newFrame(title, address) {
        let frame = new frame_1.Frame(this, title, address);
        frame.install();
        this.frames.push(frame);
    }
    getFrame(fromTitle) {
        for (const frame of this.frames) {
            if (frame.getTitle() === fromTitle) {
                return frame;
            }
        }
        return null;
    }
    addChild(child) {
        this.divBody.appendChild(child);
    }
    delChild(child) {
        this.divBody.removeChild(child);
    }
    getFrameFromID(fromID) {
        for (const frame of this.frames) {
            if (frame.getID() === fromID) {
                return frame;
            }
        }
        return null;
    }
    getFrameIndexFromID(fromID) {
        for (let i = 0; i < this.frames.length; i++) {
            if (this.frames[i].getID() === fromID) {
                return i;
            }
        }
        return -1;
    }
    delFrame(frame) {
        const index = this.frames.indexOf(frame);
        if (index > -1) {
            this.frames.splice(index, 1);
        }
    }
    showMenu() {
        this.divBody.scrollTo(0, 0);
        this.showElement(this.divMenu);
    }
    showElement(element) {
        setTimeout(() => {
            if (element.id != "QinpelPopMenuID1") {
                this.popMenuClose();
            }
            element.style.zIndex = String(++this.framesTopZ);
            if (!qinpel_res_1.QinSoul.skin.isElementVisibleInScroll(element)) {
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
    popMenuAdd(title, action) {
    }
    popMenuClear() {
    }
    popMenuShow() {
    }
    popMenuClose() {
    }
    getBodyWidth() {
        return this.divBody.clientWidth;
    }
    getBodyHeight() {
        return this.divBody.clientHeight;
    }
    hasLogged() {
        return this.token != "";
    }
    needToLog() {
        return !qinpel_res_1.QinSoul.foot.isLocalHost() && !this.hasLogged();
    }
    getAxiosConfig(headers) {
        if (!headers) {
            headers = {};
        }
        headers['Qinpel-Token'] = this.token;
        if (!headers['Accept-Language']) {
            if (this.userLang) {
                headers['Accept-Language'] = this.userLang;
            }
            else if (navigator.language) {
                headers['Accept-Language'] = navigator.language;
            }
        }
        let configs = {
            headers
        };
        return configs;
    }
    get(address, headers) {
        let configs = this.getAxiosConfig(headers);
        return axios_1.default.get(address, configs);
    }
    post(address, data, headers) {
        let configs = this.getAxiosConfig(headers);
        if (!configs.headers['Content-Type']) {
            if (typeof data === 'string' || data instanceof String) {
                configs.headers['Content-Type'] = "text/plain";
            }
            else if (data instanceof FormData) {
                configs.headers['Content-Type'] = "multipart/form-data";
            }
            else {
                configs.headers['Content-Type'] = "application/json";
            }
        }
        return axios_1.default.post(address, data, configs);
    }
    tryLogin(name, pass) {
        this.post("/login", { name, pass })
            .then(res => qinpel_res_1.QinSoul.head.log(res.data))
            .catch(err => qinpel_res_1.QinSoul.head.logError(err));
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map