import { Qinpel } from "./qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser") as HTMLInputElement;
const inputPass = document.getElementById("loginPass") as HTMLInputElement;
const buttonEnter = document.getElementById("loginEnter") as HTMLButtonElement;
qinpel.utils.arm.putDefault(buttonEnter, [inputUser, inputPass]);
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isPrimary()) {
        const user = inputUser.value;
        qinpel.manager.tryLogin(user, inputPass.value)
            .then(res => {
                console.log("Ok: " + res)
                qinpel.frame.statusInfo("Successful entry of " + user)
                qinpel.frame.navigate("./menu.html");
            })
            .catch(err => {
                console.log("Error: " + err)
            })
    }
});