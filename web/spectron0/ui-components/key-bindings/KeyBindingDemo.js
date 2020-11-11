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
exports.KeyBindingDemo = void 0;
const react_hotkeys_1 = require("react-hotkeys");
const React = __importStar(require("react"));
const Input_1 = __importDefault(require("@material-ui/core/Input"));
const globalKeyMap = {
    FIND: "f",
};
const DocumentRow = (props) => {
    const keyMap = {
        DELETE: "backspace",
    };
    const handlers = {
        DELETE: React.useCallback(() => {
            console.log("Got delete for " + props.id);
        }, [])
    };
    return (React.createElement(react_hotkeys_1.HotKeys, { keyMap: keyMap, handlers: handlers },
        React.createElement("div", { style: { display: "flex" } },
            React.createElement("div", { className: "p-1" }, props.title),
            React.createElement("div", { className: "p-1" }, props.author))));
};
const DocumentTable = (props) => (React.createElement("div", null, props.children));
const DocumentFilter = () => {
    let ref;
    const doSelect = React.useCallback(() => {
        if (ref) {
            ref.focus();
        }
    }, []);
    const handlers = {
        FIND: doSelect
    };
    return (React.createElement(react_hotkeys_1.GlobalHotKeys, { handlers: handlers },
        React.createElement("div", { className: "mt-1 mb-1" },
            React.createElement(Input_1.default, { placeholder: "search for a book", innerRef: _ref => ref = _ref }))));
};
const FindToolbar = () => {
    const doFind = () => {
        console.log("doFind");
    };
    const doCancel = () => {
        console.log("doCancel");
    };
    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        switch (event.key) {
            case 'Enter':
                doFind();
                break;
            case 'Escape':
                doFind();
                break;
            default:
                break;
        }
    };
    return (React.createElement("div", null));
};
exports.KeyBindingDemo = () => {
    return (React.createElement("div", null,
        React.createElement(react_hotkeys_1.GlobalHotKeys, { keyMap: globalKeyMap },
            "This is a react key binding demo",
            React.createElement(FindToolbar, null),
            React.createElement(DocumentFilter, null),
            React.createElement(DocumentTable, null,
                React.createElement(DocumentRow, { id: "1", title: "Book 1", author: "Alice" }),
                React.createElement(DocumentRow, { id: "2", title: "Book 2", author: "Bob" })))));
};
//# sourceMappingURL=KeyBindingDemo.js.map