"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSharingControl = void 0;
const react_1 = __importDefault(require("react"));
const ContactsSelector_1 = require("./ContactsSelector");
const Logger_1 = require("polar-shared/src/logger/Logger");
const GroupMembersList_1 = require("./GroupMembersList");
const ContactOptions_1 = require("./ContactOptions");
const GroupsSelector_1 = require("./GroupsSelector");
const GroupOptions_1 = require("./GroupOptions");
const Input_1 = __importDefault(require("@material-ui/core/Input"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const log = Logger_1.Logger.create();
class GroupSharingControl extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.contactSelections = [];
        this.groupSelections = [];
        this.message = "";
        this.onChangeContacts = this.onChangeContacts.bind(this);
        this.onChangeGroups = this.onChangeGroups.bind(this);
        this.state = {
            contacts: [],
            members: []
        };
    }
    render() {
        const contactProfiles = this.props.contactProfiles || [];
        const contactOptions = ContactOptions_1.ContactOptions.toContactOptions(contactProfiles);
        return react_1.default.createElement("div", { className: "text-md" },
            react_1.default.createElement("div", { className: "mb-1" },
                react_1.default.createElement("div", { className: "font-weight-bold mb-1" }, "Share with users:"),
                react_1.default.createElement(ContactsSelector_1.ContactsSelector, { options: contactOptions, onChange: contactSelections => this.onChangeContacts(contactSelections) })),
            react_1.default.createElement("div", { className: "mb-1" },
                react_1.default.createElement("div", { className: "font-weight-bold mb-1" }, "Share with groups:"),
                react_1.default.createElement(GroupsSelector_1.GroupsSelector, { options: GroupOptions_1.GroupOptions.toGroupOptions(this.props.groups), onChange: groupSelections => this.onChangeGroups(groupSelections) })),
            react_1.default.createElement("div", { className: "mt-2" },
                react_1.default.createElement(Input_1.default, { type: "textarea", name: "message", className: "p-2 text-md", placeholder: "Message to send with the invitation ...", style: {
                        width: '100%',
                        height: '5em'
                    }, onChange: event => this.message = event.target.value })),
            react_1.default.createElement(GroupMembersList_1.GroupMembersList, { members: this.props.members, onDelete: this.props.onDelete }),
            react_1.default.createElement("div", { className: "mt-2 text-right" },
                react_1.default.createElement(Button_1.default, { color: "secondary", variant: "contained", onClick: () => this.props.onCancel(), className: "ml-1" }, "Cancel"),
                react_1.default.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.props.onDone({
                        contactSelections: this.contactSelections,
                        message: this.message
                    }, this.groupSelections), className: "ml-1" }, "Done")));
    }
    onChangeContacts(contactSelections) {
        console.log("contacts changed: ", contactSelections);
        this.contactSelections = contactSelections;
    }
    onChangeGroups(groupSelections) {
        console.log("groups changed: ", groupSelections);
        this.groupSelections = groupSelections;
    }
}
exports.GroupSharingControl = GroupSharingControl;
//# sourceMappingURL=GroupSharingControl.js.map