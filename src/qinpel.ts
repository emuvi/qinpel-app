import { QinChief } from "./qin-chief";
import { QinJobber } from "./qin-jobber";
import { QinTalker } from "./qin-talker";
import { QinUtils } from "./qin-utils";

export class Qinpel {
  private _chief: QinChief;
  private _jobbed: QinJobber;

  public constructor(chief: QinChief, jobbed: QinJobber) {
    this._chief = chief;
    this._jobbed = jobbed;
  }

  public get chief(): QinChief {
    return this._chief;
  }

  public get jobbed(): QinJobber {
    return this._jobbed;
  }

  public get talk(): QinTalker {
    return this._chief.talk;
  }

  public get util() {
    return QinUtils;
  }
}
