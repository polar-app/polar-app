"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartForUpdateButtons = void 0;
const ReactInjector_1 = require("../ui/util/ReactInjector");
const RestartForUpdateButton_1 = require("./RestartForUpdateButton");
const react_1 = __importDefault(require("react"));
class RestartForUpdateButtons {
    static create() {
        ReactInjector_1.ReactInjector.inject(react_1.default.createElement(RestartForUpdateButton_1.RestartForUpdateButton, null), { id: 'restart-for-update' });
    }
}
exports.RestartForUpdateButtons = RestartForUpdateButtons;
//# sourceMappingURL=RestartForUpdateButtons.js.map