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
exports.InviteUsersContent = void 0;
const React = __importStar(require("react"));
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const GiftSVGIcon_1 = require("../../../../web/js/ui/svg_icons/GiftSVGIcon");
const SVGIcon_1 = require("../../../../web/js/ui/svg_icons/SVGIcon");
const FixedWidthIcons_1 = require("../../../../web/js/ui/icons/FixedWidthIcons");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class Styles {
}
Styles.icon = {
    fontSize: '120px',
    margin: '20px',
    color: '#007bff'
};
const DesktopMailBody = (props) => (React.createElement("div", null,
    React.createElement("p", { className: "text-muted" }, "Enter their emails below and we'll send them an invitation:"),
    React.createElement("div", { className: "mt-2" },
        React.createElement("textarea", { autoFocus: true, onChange: (element) => props.onInvitedUserText(element.currentTarget.value), style: { width: '100%', height: '100px' } })),
    React.createElement("div", { className: "text-center" },
        React.createElement(Button_1.default, { color: "primary", size: "large", variant: "contained", style: {
                width: '200px'
            }, onClick: () => props.onInvite() },
            React.createElement(FixedWidthIcons_1.EnvelopeIcon, null),
            "Invite"))));
const MailBody = (props) => (React.createElement(DeviceRouter_1.DeviceRouter, { desktop: React.createElement(DesktopMailBody, Object.assign({}, props)) }));
const CopyReferralCodeButton = () => (React.createElement("div", null));
exports.InviteUsersContent = (props) => (React.createElement("div", { className: "intro p-1" },
    React.createElement("div", { className: "text-center" },
        React.createElement("div", { className: "m-2" },
            React.createElement(SVGIcon_1.SVGIcon, { size: 150 },
                React.createElement(GiftSVGIcon_1.GiftSVGIcon, null))),
        React.createElement("h1", { className: "title" }, "Invite Your Friends to Polar")),
    React.createElement("p", { className: "subtitle", style: {} },
        "Get ",
        React.createElement("b", null, "one free month of premium"),
        " for every friend you invite!"),
    React.createElement(MailBody, Object.assign({}, props)),
    React.createElement("div", { className: "text-muted text-bold mt-4 border-top text-center" },
        React.createElement("h3", { className: "mt-2" }, "More ways to invite your friends")),
    React.createElement("div", { className: "m-4" },
        React.createElement("div", { style: { width: '500px' }, className: "ml-auto mr-auto" },
            React.createElement(CopyReferralCodeButton, null)))));
//# sourceMappingURL=InviteUsersContent.js.map