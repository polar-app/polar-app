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
exports.TaskBody = void 0;
const React = __importStar(require("react"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
class TaskBody extends React.Component {
    render() {
        return this.props.children;
    }
}
exports.TaskBody = TaskBody;
TaskBody.Main = class extends React.Component {
    render() {
        return (React.createElement("div", { className: "p-1", style: {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            } },
            React.createElement("div", { style: {
                    flexGrow: 1,
                    display: 'flex'
                } }, this.props.children)));
    }
};
TaskBody.Footer = class extends React.Component {
    render() {
        return React.createElement("div", null,
            React.createElement(Divider_1.default, null),
            React.createElement("div", { className: "mt-1 pl-1 pr-1" },
                React.createElement("b", null, "stage: "),
                " ",
                this.props.taskRep.stage),
            React.createElement("div", { className: "text-center p-1" }, this.props.children));
    }
};
//# sourceMappingURL=TaskBody.js.map