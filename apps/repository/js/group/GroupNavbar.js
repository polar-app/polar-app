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
exports.GroupNavbar = void 0;
const React = __importStar(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const SimpleTabs_1 = require("../../../../web/js/ui/simple_tab/SimpleTabs");
const SimpleTab_1 = require("../../../../web/js/ui/simple_tab/SimpleTab");
const log = Logger_1.Logger.create();
class GroupNavbar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { style: { display: 'flex' }, className: "w-100 ml-1" },
                React.createElement("div", { style: { flexGrow: 1 } },
                    React.createElement("h3", null, this.props.groupName))),
            React.createElement(SimpleTabs_1.SimpleTabs, null,
                React.createElement(SimpleTab_1.SimpleTab, { id: "group-nav-highlights", target: { pathname: `/group/${this.props.groupName}` }, text: "Highlights" }),
                React.createElement(SimpleTab_1.SimpleTab, { id: "group-nav-documents", target: { pathname: `/group/${this.props.groupName}/docs` }, text: "Documents" }))));
    }
}
exports.GroupNavbar = GroupNavbar;
//# sourceMappingURL=GroupNavbar.js.map