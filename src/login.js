"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser");
const inputPass = document.getElementById("loginPass");
const buttonEnter = document.getElementById("loginEnter");
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isPrimary()) {
        qinpel.manager.tryLogin(inputUser.value, inputPass.value);
    }
});
//# sourceMappingURL=login.js.map