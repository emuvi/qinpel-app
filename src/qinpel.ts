import { QinFrame } from "./qin-frame";
import { QinManager } from "./qin-manager";
import { QinTalker } from "./qin-talker";
import { QinUtils } from "./qin-utils";

export class Qinpel {
  private _chief: QinManager;
  private _frame: QinFrame;

  public constructor(chief: QinManager, frame: QinFrame) {
    this._chief = chief;
    this._frame = frame;
  }

  public get chief(): QinManager {
    return this._chief;
  }

  public get frame(): QinFrame {
    return this._frame;
  }

  public get talk(): QinTalker {
    return this._chief.talk;
  }

  public get util() {
    return QinUtils;
  }
}
