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
exports.GroupsTable = void 0;
const React = __importStar(require("react"));
const GroupCard_1 = require("./GroupCard");
const LoadingProgress_1 = require("../../../../web/js/ui/LoadingProgress");
class GroupsTable extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { groups } = this.props;
        if (!groups) {
            return React.createElement(LoadingProgress_1.LoadingProgress, null);
        }
        return (React.createElement("div", { className: "border-bottom" }, groups.map(group => React.createElement(GroupCard_1.GroupCard, { key: group.id, group: group }))));
    }
}
exports.GroupsTable = GroupsTable;
//# sourceMappingURL=GroupsTable.js.map