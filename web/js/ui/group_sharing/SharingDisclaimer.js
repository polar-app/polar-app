"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharingDisclaimer = void 0;
const react_1 = __importDefault(require("react"));
class SharingDisclaimer extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return react_1.default.createElement("div", { className: "text-grey700 text-sm mt-1" },
            react_1.default.createElement("p", null, "Sharing a document grants full access to the document but you may revoke their permissions to view your annotations at any time."),
            react_1.default.createElement("p", null,
                react_1.default.createElement("b", null, "Please only share documents for which you have a license and for which the copyright license allows sharing.")));
    }
}
exports.SharingDisclaimer = SharingDisclaimer;
//# sourceMappingURL=SharingDisclaimer.js.map