"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
exports.default = {
    applyOnIFrame: function (el) {
        var head = el.contentWindow.document.head;
        var defaultCSS = document.createElement('link');
        defaultCSS.id = "QinpelIFrameDefaultCSS";
        defaultCSS.rel = "stylesheet";
        defaultCSS.type = "text/css";
        defaultCSS.href = "/run/app/qinpel-app/default.css";
        defaultCSS.media = "all";
        head.appendChild(defaultCSS);
    },
    applyOnDialog: function (el) {
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.right = "0px";
        el.style.bottom = "0px";
        el.style.left = "0px";
        el.style.display = "flex";
        el.style.flexDirection = "column";
    },
    applyOnDialogTop: function (el) {
        el.style.flex = "0";
        el.style.padding = "3px";
        el.style.margin = "0px";
        el.style.border = "0px";
        el.style.display = "flex";
        el.style.flexDirection = "row";
        el.style.flexWrap = "wrap";
        el.style.alignItems = "center";
        el.style.backgroundColor = utils_1.QinStyles.ColorFont;
        el.style.color = utils_1.QinStyles.ColorBack;
    },
    applyOnDialogPack: function (el) {
        el.style.flex = "1";
        el.style.overflow = "auto";
        el.style.display = "flex";
        el.style.justifyContent = "center";
        el.style.alignItems = "center";
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
    },
    applyOnDialogTitle: function (el) {
        el.style.flex = "1";
        el.style.textAlign = "center";
        el.style.fontWeight = "bold";
    },
    applyOnDialogClose: function (el) {
        el.style.flex = "0";
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
        el.style.display = "flex";
        el.style.justifyContent = "center";
        el.style.alignItems = "center";
    },
    applyOnDialogImage: function (el) {
        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.border = "0px";
    },
};
//# sourceMappingURL=frame-styles.js.map