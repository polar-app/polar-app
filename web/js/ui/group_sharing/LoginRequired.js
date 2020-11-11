"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequired = void 0;
const react_1 = __importDefault(require("react"));
class LoginRequired extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return react_1.default.createElement("div", { className: "text-md" },
            react_1.default.createElement("p", null,
                "Please login to ",
                react_1.default.createElement("b", null, "cloud sync"),
                " to use document sharing."));
    }
}
exports.LoginRequired = LoginRequired;
//# sourceMappingURL=LoginRequired.js.map