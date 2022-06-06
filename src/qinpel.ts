import { QinChief } from "./qin-chief";
import { QinJobber } from "./qin-jobber";
import { QinOurs } from "./qin-ours";
import { QinTalker } from "./qin-talker";

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

  public get our() {
    return QinOurs;
  }

  public tr(of: string): string {
    return this.our.tr(of);
  }
}
