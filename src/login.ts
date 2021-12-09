import { Qinpel } from "./qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser") as HTMLInputElement;
const inputPass = document.getElementById("loginPass") as HTMLInputElement;
const buttonEnter = document.getElementById("loginEnter") as HTMLButtonElement;
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isPrimary()) {
        const user = inputUser.value;
        qinpel.manager.tryEnter(user, inputPass.value)
            .then(_ => {
                qinpel.frame.statusInfo("Successful entry of " + user)
                qinpel.frame.navigate("./menu.html");
            })
            .catch(err => {
                qinpel.manager.showAlert("Problem on enter: " + err);
            })
    }
});
qinpel.utils.arm.putActionProxy(buttonEnter, [inputUser, inputPass]);