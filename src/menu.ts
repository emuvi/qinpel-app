import { Qinpel } from "./qinpel";

// @ts-ignore
const qinpel = window.frameElement.qinpel as Qinpel;

class Menu {
    private divBody = document.createElement("div");
    private divApps = document.createElement("div");
    private divConfigs = document.createElement("div");

    public constructor() {
        this.initBody();
        this.initApps();
        this.initCfgs();
    }

    private initBody() {
        this.divBody.id = "QinpelMenuDivBody";
        this.divBody.appendChild(this.divApps);
        this.divBody.appendChild(this.divConfigs);
    }

    public initApps() {
        qinpel.get("/list/app")
            .then(res => {
                for (let name of this.listApps(res.data)) {
                    this.tryAddApp(name);
                };
            })
            .catch(err => {
                this.divBody.innerText = qinpel.util.getErrorMessage(err,
                    "(ErrCode-000002)");
            });
    }

    private listApps(response: string) {
        return qinpel.util.getTextLines(response);
    }

    private tryAddApp(name: string) {
        if (name && name != "qinpel-app") {
            qinpel.get("/run/app/" + name + "/title.txt")
                .then(res => {
                    const title = res.data;
                    const icon = "../" + name + "/favicon.ico";
                    this.addMenu(this.divApps,
                        this.newMenu(title, icon, () => {
                            qinpel.manager.newFrame(title, "../" + name + "/index.html");
                            qinpel.frame.headCloseAction();
                        })
                    );
                })
                .catch(err => {
                    const divError = document.createElement("div");
                    divError.innerText = qinpel.util.getErrorMessage(err, "(ErrCode-000001)");
                    this.addMenu(this.divApps, divError);
                });
        }
    }

    private initCfgs() {
        if (qinpel.util.isLocalHost()) {
            this.addDevTools();
        }
    }

    private addDevTools() {
        this.addMenu(this.divConfigs,
            this.newMenu("DevTools", "./assets/menu-devtools.ico", () => {
                qinpel.util.toggleDevTools();
            })
        );
    }

    private newMenu(title: string, icon: string, action: any): HTMLDivElement {
        const divContent = document.createElement("div");
        divContent.className = "QinpelMenuDivMenuContent";
        const imgIcon = document.createElement("img");
        imgIcon.src = icon;
        const spanTitle = document.createElement("span");
        spanTitle.innerText = title;
        divContent.appendChild(imgIcon);
        divContent.appendChild(spanTitle);
        qinpel.util.addAction(divContent, action);
        return divContent;
    }

    private addMenu(divContainer: HTMLDivElement, divContent: HTMLDivElement) {
        const divMenu = document.createElement("div");
        divMenu.className = 'QinpelMenuDivMenu';
        divMenu.appendChild(divContent);
        divContainer.appendChild(divMenu);
    }

    public putInDocument() {
        document.body.appendChild(this.divBody);
    }

}

if (qinpel.manager.needToLog()) {
    // @ts-ignore
    window.frameElement.src = "./login.html";
} else {
    new Menu().putInDocument();
}