import { Qinpel } from "./qinpel";
const qinpel = (window.frameElement as any).qinpel as Qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser") as HTMLInputElement;
const inputPass = document.getElementById("loginPass") as HTMLInputElement;
const buttonEnter = document.getElementById("loginEnter") as HTMLButtonElement;
qinpel.utils.arm.addActions([inputUser, inputPass, buttonEnter], (qinEvent) => {
  function isActionTrigger(): boolean {
    if (qinEvent.fromOrigin == inputUser || qinEvent.fromOrigin == inputPass) {
      return qinEvent.isMainKey;
    } else {
      return qinEvent.isMain;
    }
  }
  if (isActionTrigger()) {
    const user = inputUser.value;
    const pass = inputPass.value;
    qinpel.manager
      .tryEnter(user, pass)
      .then((_) => {
        qinpel.frame.statusInfo("Successful entry with user " + user);
        qinpel.frame.navigate("./desk.html");
      })
      .catch((err) => {
        qinpel.manager.showAlert("Problem on enter: " + err);
      });
  }
});
