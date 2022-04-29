import { QinDesk } from "./qin-desk";
import { Qinpel } from "./qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;

if (qinpel.chief.needToEnter()) {
  (window.frameElement as HTMLIFrameElement).src = "./login.html";
} else {
  new QinDesk(qinpel, {
    addsApps: (manifest) => !manifest.group,
  }).putInDocument();
}
