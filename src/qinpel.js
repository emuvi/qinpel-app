"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qinpel = void 0;
const qinpel_res_1 = require("qinpel-res");
class Qinpel {
    constructor(manager, frame) {
        this.utils = qinpel_res_1.QinSoul;
        this.manager = manager;
        this.frame = frame;
    }
    get(address, headers) {
        return this.manager.get(address, headers);
    }
    post(address, data, headers) {
        return this.manager.post(address, data, headers);
    }
}
exports.Qinpel = Qinpel;
//# sourceMappingURL=qinpel.js.map