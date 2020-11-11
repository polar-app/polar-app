"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMemberEntry = void 0;
const react_1 = __importDefault(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class GroupMemberEntry extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }
    render() {
        const { member } = this.props;
        return react_1.default.createElement("div", { style: { display: 'flex' } },
            react_1.default.createElement("div", { className: "mt-auto mb-auto", style: {
                    flexGrow: 1,
                } },
                react_1.default.createElement("div", { className: "mt-auto mb-auto" }, member.label)),
            react_1.default.createElement("div", { className: "mt-auto mb-auto" },
                react_1.default.createElement("div", { className: "mt-auto mb-auto", style: {
                        display: 'flex'
                    } },
                    react_1.default.createElement("div", { className: "mt-auto mb-auto" }, member.type),
                    react_1.default.createElement("div", { className: "mt-auto mb-auto ml-1" },
                        react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => this.onDelete(member), className: "pl-2 pr-2" },
                            react_1.default.createElement("i", { className: "fas fa-trash" }))))));
    }
    onDelete(member) {
        const opts = {
            title: 'Delete group member?',
            subtitle: 'Are you sure you want to delete this group member?',
            type: 'warning',
            onConfirm: () => this.props.onDelete(member),
            onCancel: Functions_1.NULL_FUNCTION
        };
    }
}
exports.GroupMemberEntry = GroupMemberEntry;
//# sourceMappingURL=GroupMemberEntry.js.map