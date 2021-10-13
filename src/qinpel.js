"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qinpel = void 0;
var utils_1 = require("./utils");
var Qinpel = (function () {
    function Qinpel(manager, frame) {
        this.util = utils_1.default;
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