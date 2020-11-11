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
exports.GroupScreen = void 0;
const React = __importStar(require("react"));
const FixedNav_1 = require("../FixedNav");
const Groups_1 = require("../../../../web/js/datastore/sharing/db/Groups");
const Logger_1 = require("polar-shared/src/logger/Logger");
const GroupTable_1 = require("./GroupTable");
const GroupDocInfos_1 = require("../../../../web/js/datastore/sharing/GroupDocInfos");
const Toaster_1 = require("../../../../web/js/ui/toaster/Toaster");
const VerticalAlign_1 = require("../../../../web/js/ui/util/VerticalAlign");
const UserGroups_1 = require("../../../../web/js/datastore/sharing/db/UserGroups");
const GroupDeleteButton_1 = require("./GroupDeleteButton");
const GroupNavbar_1 = require("./GroupNavbar");
const GroupURLs_1 = require("polar-webapp-links/src/groups/GroupURLs");
const log = Logger_1.Logger.create();
class GroupScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        const groupURL = GroupURLs_1.GroupURLs.parse(document.location.href);
        this.state = {
            name: groupURL.name
        };
    }
    componentWillMount() {
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            const groupName = this.state.name;
            if (!groupName) {
                Toaster_1.Toaster.error("No group name");
                return;
            }
            const group = yield Groups_1.Groups.getByName(groupName);
            if (!group) {
                Toaster_1.Toaster.error("No group named: " + groupName);
                return;
            }
            const groupDocInfos = yield GroupDocInfos_1.GroupDocInfos.list(group.id);
            const userGroup = yield UserGroups_1.UserGroups.get();
            this.setState(Object.assign(Object.assign({}, this.state), { groupData: {
                    id: group.id,
                    group,
                    groupDocInfos,
                    userGroup
                } }));
        });
        doHandle().catch(err => log.error("Unable to get groups: ", err));
    }
    render() {
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            React.createElement("header", null),
            React.createElement(FixedNav_1.FixedNavBody, null,
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col" },
                            React.createElement("div", { className: "mt-2 p-2 border-top border-left border-right bg-grey000" },
                                React.createElement("div", null,
                                    React.createElement(GroupNavbar_1.GroupNavbar, { groupName: this.state.name },
                                        React.createElement(VerticalAlign_1.VerticalAlign, null,
                                            React.createElement(GroupDeleteButton_1.GroupDeleteButton, { groupData: this.state.groupData }))))),
                            React.createElement(GroupTable_1.GroupTable, { persistenceLayerProvider: this.props.persistenceLayerProvider, groupData: this.state.groupData })))))));
    }
}
exports.GroupScreen = GroupScreen;
//# sourceMappingURL=GroupScreen.js.map