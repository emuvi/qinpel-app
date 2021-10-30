import { Qinpel } from "../types/qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const buttonEnter = document.getElementById("loginEnter") as HTMLButtonElement;
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isEnterOrSpaceOrPointer()) {
        
    }
});