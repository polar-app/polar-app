"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTrackedLink = void 0;
const react_1 = __importDefault(require("react"));
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Analytics_1 = require("../../../../../../web/js/analytics/Analytics");
class EventTrackedLink extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const className = Optional_1.Optional.of(this.props.className)
            .getOrElse("btn btn-success btn-lg");
        return (react_1.default.createElement("a", { className: className, href: this.props.href, onClick: () => this.onClick(), role: "button" }, this.props.children));
    }
    onClick() {
        Analytics_1.Analytics.event({ category: this.props.eventCategory, action: this.props.eventAction });
    }
}
exports.EventTrackedLink = EventTrackedLink;
//# sourceMappingURL=EventTrackedLink.js.map