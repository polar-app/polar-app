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
exports.LogsContent = void 0;
const React = __importStar(require("react"));
const MemoryLogger_1 = require("../../../../web/js/logger/MemoryLogger");
const react_json_view_1 = __importDefault(require("react-json-view"));
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
class Styles {
}
Styles.LogMessage = {
    display: 'flex',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
};
Styles.LogFieldTimestamp = {
    fontWeight: 'bold',
    fontFamily: 'Courier New, monospace',
    marginRight: '5px',
    whiteSpace: 'nowrap',
};
Styles.LogFieldMsg = {
    fontFamily: 'Courier New, monospace',
    whiteSpace: 'nowrap',
    overflow: 'none'
};
Styles.LogFieldArgs = {
    marginLeft: '5px'
};
exports.LogsContent = () => {
    const messages = MemoryLogger_1.MemoryLogger.toView();
    ReactLifecycleHooks_1.useComponentDidMount(() => {
    });
    const argsRenderable = (args) => {
        if (args) {
            if (Array.isArray(args)) {
                if (args.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    const siblings = [...messages].reverse()
        .map(current => {
        let className = "";
        if (current.level === 'warn') {
            className = 'alert-warning';
        }
        if (current.level === 'error') {
            className = 'alert-danger';
        }
        const RenderJSON = () => {
            if (argsRenderable(current.args)) {
                return (React.createElement("div", { style: Styles.LogFieldArgs },
                    React.createElement(react_json_view_1.default, { src: current.args, name: 'args', shouldCollapse: () => true })));
            }
            return (React.createElement("div", null));
        };
        return React.createElement("div", { style: Styles.LogMessage, className: className, key: current.idx },
            React.createElement("div", { style: Styles.LogFieldTimestamp }, current.timestamp),
            React.createElement("div", { style: Styles.LogFieldMsg }, current.msg),
            React.createElement(RenderJSON, null));
    });
    return (React.createElement(React.Fragment, null, siblings));
};
//# sourceMappingURL=LogsContent.js.map