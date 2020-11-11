"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = void 0;
const react_1 = __importDefault(require("react"));
const GroupMemberInvitations_1 = require("../../datastore/sharing/db/GroupMemberInvitations");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Devices_1 = require("polar-shared/src/util/Devices");
const log = Logger_1.Logger.create();
class Notifications extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            invitations: []
        };
        GroupMemberInvitations_1.GroupMemberInvitations.onSnapshot(invitations => {
            console.log("Got invitations: ", invitations);
            this.setState({ invitations });
        }).catch(err => {
            const msg = "Unable to get group notifications: ";
            log.error(msg, err);
        });
    }
    render() {
        if (!Devices_1.Devices.isDesktop()) {
            return null;
        }
        return null;
    }
}
exports.Notifications = Notifications;
//# sourceMappingURL=Notifications.js.map