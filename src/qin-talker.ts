import axios, { AxiosResponse } from "axios";
import { QinChief } from "./qin-chief";

export class QinTalker {
  private _chief: QinChief;

  public constructor(chief: QinChief) {
    this._chief = chief;
  }

  public get(address: string, headers?: any): Promise<AxiosResponse<never>> {
    let configs = this._chief.getAxiosConfig(headers);
    return axios.get(address, configs);
  }

  public post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>> {
    let configs = this._chief.getAxiosConfig(headers);
    if (!configs.headers["Content-Type"]) {
      if (typeof data === "string" || data instanceof String) {
        configs.headers["Content-Type"] = "text/plain";
      } else if (data instanceof FormData) {
        configs.headers["Content-Type"] = "multipart/form-data";
      } else {
        configs.headers["Content-Type"] = "application/json";
      }
    }
    return axios.post(address, data, configs);
  }
}
