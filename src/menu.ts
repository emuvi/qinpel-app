import { Qinpel } from "./qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;

import { QinDesk } from "./qin-desk";

if (qinpel.manager.needToLog()) {
  (window.frameElement as HTMLIFrameElement).src = "./login.html";
} else {
  new QinDesk(qinpel, manifest => !manifest.group).putInDocument();
}
