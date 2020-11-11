"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsSelector = void 0;
const react_1 = __importDefault(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const EmailAddresses_1 = require("../../util/EmailAddresses");
const ContactOptions_1 = require("./ContactOptions");
class ContactsSelector extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.state = {
            selectedOptions: this.props.selectedOptions || []
        };
    }
    render() {
        const options = [...this.props.options || []];
        const selectedOptions = [...this.state.selectedOptions];
        return react_1.default.createElement("div", { onPaste: event => this.onPaste(event) });
    }
    onPaste(event) {
        event.preventDefault();
        const text = event.clipboardData.getData('text/plain');
        const emailAddresses = EmailAddresses_1.EmailAddresses.parseList(text);
        const newContacts = emailAddresses.map(current => {
            return {
                value: current.address,
                label: EmailAddresses_1.EmailAddresses.format(current)
            };
        });
        this.setState(Object.assign(Object.assign({}, this.state), { selectedOptions: [...this.state.selectedOptions, ...newContacts] }));
    }
    handleChange(selectedOptions) {
        this.setState(Object.assign(Object.assign({}, this.state), { selectedOptions }));
        const onChange = this.props.onChange || Functions_1.NULL_FUNCTION;
        onChange(ContactOptions_1.ContactOptions.toUserRefs(selectedOptions));
    }
}
exports.ContactsSelector = ContactsSelector;
//# sourceMappingURL=ContactsSelector.js.map