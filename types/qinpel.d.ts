import { Manager } from "./manager";
import { Frame } from "./frame";
import { AxiosResponse } from "axios";
export declare class Qinpel {
    manager: Manager;
    frame: Frame;
    utils: any;
    constructor(manager: Manager, frame: Frame);
    get(address: string, headers?: any): Promise<AxiosResponse<never>>;
    post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>>;
}
//# sourceMappingURL=qinpel.d.ts.map