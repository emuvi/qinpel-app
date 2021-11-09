"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel_res_1 = require("qinpel-res");
const qinpel = window.frameElement.qinpel;
class Menu {
    constructor() {
        this.divBody = document.createElement("div");
        this.divApps = document.createElement("div");
        this.divConfigs = document.createElement("div");
        this.initBody();
        this.initApps();
        this.initCfgs();
    }
    initBody() {
        this.divBody.id = "QinpelMenuDivBody";
        this.divBody.appendChild(this.divApps);
        this.divBody.appendChild(this.divConfigs);
    }
    initApps() {
        qinpel.get("/list/app")
            .then(res => {
            for (let name of this.listApps(res.data)) {
                this.tryAddApp(name);
            }
            ;
        })
            .catch(err => {
            this.divBody.innerText = qinpel_res_1.QinSoul.head.getErrorMessage(err, "(ErrCode-000002)");
        });
    }
    listApps(response) {
        return qinpel_res_1.QinSoul.body.getTextLines(response);
    }
    tryAddApp(name) {
        if (name && name != "qinpel-app") {
            qinpel.get("/run/app/" + name + "/title.txt")
                .then(res => {
                const title = res.data;
                const icon = "../" + name + "/favicon.ico";
                this.addMenu(this.divApps, this.newMenu(title, icon, () => {
                    qinpel.manager.newFrame(title, "../" + name + "/index.html");
                    qinpel.frame.headCloseAction();
                }));
            })
                .catch(err => {
                const divError = document.createElement("div");
                divError.innerText = qinpel_res_1.QinSoul.head.getErrorMessage(err, "(ErrCode-000001)");
                this.addMenu(this.divApps, divError);
            });
        }
    }
    initCfgs() {
        if (qinpel_res_1.QinSoul.foot.isLocalHost()) {
            this.addDevTools();
        }
    }
    addDevTools() {
        this.addMenu(this.divConfigs, this.newMenu("DevTools", "./assets/menu-devtools.ico", () => {
            qinpel_res_1.QinSoul.head.toggleDevTools();
            qinpel.frame.headCloseAction();
        }));
    }
    newMenu(title, icon, action) {
        const divContent = document.createElement("div");
        divContent.className = "QinpelMenuDivMenuContent";
        const imgIcon = document.createElement("img");
        imgIcon.src = icon;
        const spanTitle = document.createElement("span");
        spanTitle.innerText = title;
        divContent.appendChild(imgIcon);
        divContent.appendChild(spanTitle);
        qinpel_res_1.QinSoul.arm.addAction(divContent, action);
        return divContent;
    }
    addMenu(divContainer, divContent) {
        const divMenu = document.createElement("div");
        divMenu.className = 'QinpelMenuDivMenu';
        divMenu.appendChild(divContent);
        divContainer.appendChild(divMenu);
    }
    putInDocument() {
        document.body.appendChild(this.divBody);
    }
}
if (qinpel.manager.needToLog()) {
    window.frameElement.src = "./login.html";
}
else {
    new Menu().putInDocument();
}
//# sourceMappingURL=menu.js.map