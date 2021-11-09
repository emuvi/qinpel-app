import { Qinpel } from "./qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser") as HTMLInputElement;
const inputPass = document.getElementById("loginPass") as HTMLInputElement;
const buttonEnter = document.getElementById("loginEnter") as HTMLButtonElement;
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isPrimary()) {
        qinpel.manager.tryLogin(inputUser.value, inputPass.value);
    }
});