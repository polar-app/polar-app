"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallToActionLink = void 0;
const react_1 = __importDefault(require("react"));
const EventTrackedLink_1 = require("./EventTrackedLink");
class CallToActionLink extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (react_1.default.createElement(EventTrackedLink_1.EventTrackedLink, { href: this.props.href, eventCategory: this.props.eventCategory, eventAction: 'clicked' }, this.props.children));
    }
}
exports.CallToActionLink = CallToActionLink;
//# sourceMappingURL=CallToActionLink.js.map