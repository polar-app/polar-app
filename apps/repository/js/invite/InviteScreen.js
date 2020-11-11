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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteScreen = void 0;
const React = __importStar(require("react"));
const FixedNav_1 = require("../FixedNav");
const RepoFooter_1 = require("../repo_footer/RepoFooter");
const EmailAddressParser_1 = require("../../../../web/js/util/EmailAddressParser");
const InviteUsersContent_1 = require("./InviteUsersContent");
const Invitations_1 = require("../../../../web/js/datastore/Invitations");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class InviteScreen extends React.Component {
    constructor(props) {
        super(props);
        this.invitedUsersText = "";
        this.onInvite = this.onInvite.bind(this);
        this.onInvitedUserText = this.onInvitedUserText.bind(this);
    }
    render() {
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            React.createElement("header", null),
            React.createElement(FixedNav_1.FixedNavBody, { className: "container-fluid bg-grey100" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-lg-12 w-100 pt-4" },
                        React.createElement("div", { className: "border ml-auto mr-auto rounded p-4 bg-white", style: {
                                maxWidth: '800px',
                                flexGrow: 1
                            } },
                            React.createElement(InviteUsersContent_1.InviteUsersContent, { onInvite: () => this.onInvite(), onInvitedUserText: (invitedUsersText) => this.onInvitedUserText(invitedUsersText) }))))),
            React.createElement(RepoFooter_1.RepoFooter, null)));
    }
    onInvitedUserText(invitedUsersText) {
        this.invitedUsersText = invitedUsersText;
    }
    onInvite() {
        const emailAddresses = EmailAddressParser_1.EmailAddressParser.parse(this.invitedUsersText);
        const handleInvitedUsers = () => __awaiter(this, void 0, void 0, function* () {
            yield Invitations_1.Invitations.sendInvites(...emailAddresses);
        });
        handleInvitedUsers()
            .catch(err => log.error("Unable to invite users: ", err));
    }
}
exports.InviteScreen = InviteScreen;
//# sourceMappingURL=InviteScreen.js.map