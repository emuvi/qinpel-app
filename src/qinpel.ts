import { QinFrame } from "./qin-frame";
import { QinManager } from "./qin-manager";
import { QinTalker } from "./qin-talker";
import { QinUtils } from "./qin-utils";

export class Qinpel {
  private _manager: QinManager;
  private _frame: QinFrame;

  public constructor(manager: QinManager, frame: QinFrame) {
    this._manager = manager;
    this._frame = frame;
  }

  public get chief(): QinManager {
    return this._manager;
  }

  public get frame(): QinFrame {
    return this._frame;
  }

  public get talk(): QinTalker {
    return this._manager.talker;
  }

  public get util() {
    return QinUtils;
  }
}
