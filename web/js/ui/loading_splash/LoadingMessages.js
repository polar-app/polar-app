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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingMessages = void 0;
const React = __importStar(require("react"));
const IndeterminateProgressBar_1 = require("../progress_bar/IndeterminateProgressBar");
const VerticalCenterBox_1 = require("./VerticalCenterBox");
class LoadingMessages extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const MessagesBody = () => {
            var _a;
            const messages = ((_a = this.props.logData) === null || _a === void 0 ? void 0 : _a.messages) || [];
            return messages.map(message => React.createElement("div", { key: message.id }, message.msg));
        };
        return (React.createElement(VerticalCenterBox_1.VerticalCenterBox, { paddingTop: "110px" },
            React.createElement("div", { style: {
                    width: '350px'
                }, className: "ml-auto mr-auto text-muted" },
                React.createElement("div", { className: "mt-0" },
                    React.createElement(IndeterminateProgressBar_1.IndeterminateProgressBar, null)),
                React.createElement("div", { className: "mt-3" },
                    React.createElement(MessagesBody, null)))));
    }
}
exports.LoadingMessages = LoadingMessages;
//# sourceMappingURL=LoadingMessages.js.map