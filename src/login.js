"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qinpel = window.frameElement.qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
var buttonEnter = document.getElementById("loginEnter");
qinpel.utils.arm.addAction(buttonEnter, function (qinEvent) {
    if (qinEvent.isEnterOrSpaceOrPointer()) {
        qinpel.frame.statusInfo("OI neginho!");
    }
});
//# sourceMappingURL=login.js.map