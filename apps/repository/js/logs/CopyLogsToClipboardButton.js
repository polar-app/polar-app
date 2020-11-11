"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const MemoryLogger_1 = require("../../../../web/js/logger/MemoryLogger");
const Clipboards_1 = require("../../../../web/js/util/system/clipboard/Clipboards");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class CopyLogsToClipboardButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement(Button_1.default, { variant: "contained", onClick: () => this.onClick() }, "Copy to Clipboard"));
    }
    onClick() {
        const messages = MemoryLogger_1.MemoryLogger.toView();
        const text = messages.map(current => {
            if (current.args && current.args.length > 0) {
                const args = JSON.stringify(current.args, null, "  ");
                return `${current.timestamp}: ${current.msg}: ${args}`;
            }
            else {
                return `${current.timestamp}: ${current.msg}`;
            }
        }).join("\n");
        Clipboards_1.Clipboards.getInstance().writeText(text);
    }
}
exports.default = CopyLogsToClipboardButton;
//# sourceMappingURL=CopyLogsToClipboardButton.js.map