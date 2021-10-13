import { Manager } from "./manager";
import { Frame } from "./frame";
import utils from "./utils";
import { AxiosResponse } from "axios";

export class Qinpel {

    public manager: Manager;
    public frame: Frame;
    public util = utils;

    public constructor(manager: Manager, frame: Frame) {
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