"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qinpel = exports.QinEvent = exports.QinDragCalls = exports.QinFilesDescriptor = exports.QinFilesOperation = exports.QinFilesNature = exports.QinStyles = exports.QinGrandeur = exports.QinBounds = exports.QinDimension = exports.QinPoint = void 0;
var utils_1 = require("./utils");
var utils_2 = require("./utils");
Object.defineProperty(exports, "QinPoint", { enumerable: true, get: function () { return utils_2.QinPoint; } });
Object.defineProperty(exports, "QinDimension", { enumerable: true, get: function () { return utils_2.QinDimension; } });
Object.defineProperty(exports, "QinBounds", { enumerable: true, get: function () { return utils_2.QinBounds; } });
Object.defineProperty(exports, "QinGrandeur", { enumerable: true, get: function () { return utils_2.QinGrandeur; } });
Object.defineProperty(exports, "QinStyles", { enumerable: true, get: function () { return utils_2.QinStyles; } });
Object.defineProperty(exports, "QinFilesNature", { enumerable: true, get: function () { return utils_2.QinFilesNature; } });
Object.defineProperty(exports, "QinFilesOperation", { enumerable: true, get: function () { return utils_2.QinFilesOperation; } });
Object.defineProperty(exports, "QinFilesDescriptor", { enumerable: true, get: function () { return utils_2.QinFilesDescriptor; } });
Object.defineProperty(exports, "QinDragCalls", { enumerable: true, get: function () { return utils_2.QinDragCalls; } });
Object.defineProperty(exports, "QinEvent", { enumerable: true, get: function () { return utils_2.QinEvent; } });
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