"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMembersList = void 0;
const react_1 = __importDefault(require("react"));
const GroupMemberEntry_1 = require("./GroupMemberEntry");
const NullCollapse_1 = require("../null_collapse/NullCollapse");
class GroupMembersList extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const members = this.props.members || [];
        return react_1.default.createElement("div", null,
            react_1.default.createElement(NullCollapse_1.NullCollapse, { open: members.length > 0 },
                react_1.default.createElement("div", { className: "font-weight-bold mt-1 mb-1" }, "Currently shared with:")),
            members.map(item => react_1.default.createElement(GroupMemberEntry_1.GroupMemberEntry, { key: item.id, member: item, onDelete: this.props.onDelete })));
    }
}
exports.GroupMembersList = GroupMembersList;
//# sourceMappingURL=GroupMembersList.js.map