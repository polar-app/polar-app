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
const Logger_1 = require("polar-shared/src/logger/Logger");
const LogsContent_1 = require("./LogsContent");
const CopyLogsToClipboardButton_1 = __importDefault(require("./CopyLogsToClipboardButton"));
const ClearLogsButton_1 = __importDefault(require("./ClearLogsButton"));
const FixedNav_1 = require("../FixedNav");
const log = Logger_1.Logger.create();
class LogsScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            React.createElement("header", null,
                React.createElement("div", { style: { display: 'flex' }, className: "p-1" },
                    React.createElement("div", { className: "mb-1" },
                        React.createElement(CopyLogsToClipboardButton_1.default, null)),
                    React.createElement("div", { className: "ml-1 mb-1" },
                        React.createElement(ClearLogsButton_1.default, null)))),
            React.createElement(FixedNav_1.FixedNavBody, { className: "container-fluid" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-lg-12" },
                        React.createElement("div", { className: "mb-2 p-1" },
                            React.createElement(LogsContent_1.LogsContent, null)))))));
    }
}
exports.default = LogsScreen;
//# sourceMappingURL=LogsScreen.js.map