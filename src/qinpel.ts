import { QinManager } from "./qin-manager";
import { QinFrame } from "./qin-frame";
import { AxiosResponse } from "axios";
import { QinSoul } from "qinpel-res";

export class Qinpel {

    public manager: QinManager;
    public frame: QinFrame;
    public utils = QinSoul;

    public constructor(manager: QinManager, frame: QinFrame) {
        this.manager = manager;
        this.frame = frame;
    }

    public get(address: string, headers?: any): Promise<AxiosResponse<never>> {
        return this.manager.get(address, headers);
    }

    public post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>> {
        return this.manager.post(address, data, headers);
    }

}