import { AxiosResponse } from "axios";
import { QinSoul } from "qinpel-res";
import { QinFrame } from "./qin-frame";
import { QinManager } from "./qin-manager";
import { QinUtils } from "./qin-utils";

export class Qinpel {
  public manager: QinManager;
  public frame: QinFrame;
  public utils = { ...QinSoul, ...QinUtils };

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
