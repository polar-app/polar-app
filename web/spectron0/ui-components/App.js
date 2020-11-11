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
exports.App = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const RightSidebar_1 = require("../../js/ui/motion/RightSidebar");
const SchoolSelectDemo_1 = require("./SchoolSelectDemo");
const ScrollAutoLoaderDemo_1 = require("./ScrollAutoLoaderDemo");
const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};
const Folders = () => {
    return React.createElement("div", { style: { backgroundColor: 'red', overflow: 'auto' } }, "these are the folders");
};
const Preview = () => {
    return React.createElement("div", { style: { backgroundColor: 'orange', overflow: 'auto' } }, "This is the preview");
};
const Main = () => {
    return React.createElement("div", { style: { backgroundColor: 'blue' } }, "this is the right");
};
const ThirdPage = () => (React.createElement("div", null, "this is the third page just inside a basic div"));
const RightSidebarPage = () => (React.createElement(RightSidebar_1.RightSidebar, { style: { backgroundColor: 'red' }, onClose: Functions_1.NULL_FUNCTION },
    React.createElement("div", null, "this is the left sidebar")));
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement(ScrollAutoLoaderDemo_1.ScrollAutoLoaderDemo, null));
        const animation = {
            initial: { opacity: 0 },
            active: {
                opacity: 1,
                transition: {
                    delay: 0.3,
                    when: 'beforeChildren',
                    staggerChildren: 0.1,
                },
            },
            exit: { opacity: 0, y: 200 },
        };
        return (React.createElement("div", { className: "m-2" },
            React.createElement(SchoolSelectDemo_1.SchoolSelectDemo, null)));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map