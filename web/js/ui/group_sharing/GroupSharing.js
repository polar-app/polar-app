"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSharing = void 0;
const react_1 = __importDefault(require("react"));
const Toaster_1 = require("../toaster/Toaster");
const Firebase_1 = require("../../firebase/Firebase");
const Groups_1 = require("../../datastore/sharing/db/Groups");
const EventListener_1 = require("../../reactor/EventListener");
const Logger_1 = require("polar-shared/src/logger/Logger");
const GroupSharingRecords_1 = require("./GroupSharingRecords");
const GroupSharingControl_1 = require("./GroupSharingControl");
const LoginRequired_1 = require("./LoginRequired");
const log = Logger_1.Logger.create();
class GroupSharing extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.releaser = new EventListener_1.Releaser();
        this.onConnectivity = this.onConnectivity.bind(this);
        this.state = {
            connectivity: 'unknown',
            contactProfiles: [],
            members: [],
            groups: [],
        };
    }
    componentDidMount() {
        const errorHandler = (err) => {
            const msg = "Unable to get group notifications: ";
            log.error(msg, err);
            Toaster_1.Toaster.error(msg, err.message);
        };
        const contactsHandler = (contactProfiles) => {
            if (this.releaser.released) {
                return;
            }
            this.setState(Object.assign(Object.assign({}, this.state), { contactProfiles }));
        };
        const membersHandler = (members) => {
            if (this.releaser.released) {
                return;
            }
            this.setState(Object.assign(Object.assign({}, this.state), { members }));
        };
        const groupsHandler = (groups) => {
            if (this.releaser.released) {
                return;
            }
            this.setState(Object.assign(Object.assign({}, this.state), { groups }));
        };
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            const user = Firebase_1.Firebase.currentUser();
            if (!user) {
                this.onConnectivity('unauthenticated');
                return;
            }
            this.onConnectivity('authenticated');
            const docMeta = this.props.doc.docMeta;
            const fingerprint = docMeta.docInfo.fingerprint;
            const uid = user.uid;
            const groupID = Groups_1.Groups.createIDForKey(uid, fingerprint);
            GroupSharingRecords_1.GroupSharingRecords.fetch(groupID, contacts => contactsHandler(contacts), members => membersHandler(members), groups => groupsHandler(groups), err => errorHandler(err));
        });
        doHandle().catch(err => errorHandler(err));
    }
    componentWillUnmount() {
        this.releaser.release();
    }
    render() {
        switch (this.state.connectivity) {
            case "unknown":
                return react_1.default.createElement("div", null);
            case "unauthenticated":
                return react_1.default.createElement(LoginRequired_1.LoginRequired, null);
            case "authenticated":
                return react_1.default.createElement(GroupSharingControl_1.GroupSharingControl, Object.assign({}, this.props, this.state));
        }
    }
    onConnectivity(connectivity) {
        this.setState(Object.assign(Object.assign({}, this.state), { connectivity }));
    }
}
exports.GroupSharing = GroupSharing;
//# sourceMappingURL=GroupSharing.js.map