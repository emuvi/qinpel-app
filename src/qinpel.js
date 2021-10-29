"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qinpel = void 0;
var qinpel_res_1 = require("qinpel-res");
var Qinpel = (function () {
    function Qinpel(manager, frame) {
        this.utils = qinpel_res_1.QinSoul;
        this.manager = manager;
        this.frame = frame;
    }
    Qinpel.prototype.get = function (address, headers) {
        return this.manager.get(address, headers);
    };
    Qinpel.prototype.post = function (address, data, headers) {
        return this.manager.post(address, data, headers);
    };
    return Qinpel;
}());
exports.Qinpel = Qinpel;
//# sourceMappingURL=qinpel.js.map