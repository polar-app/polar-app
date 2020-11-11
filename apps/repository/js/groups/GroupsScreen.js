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
exports.GroupsScreen = void 0;
const React = __importStar(require("react"));
const FixedNav_1 = require("../FixedNav");
const Groups_1 = require("../../../../web/js/datastore/sharing/db/Groups");
const Logger_1 = require("polar-shared/src/logger/Logger");
const GroupsTable_1 = require("./GroupsTable");
const CreateGroupButton_1 = require("./CreateGroupButton");
const VerticalAlign_1 = require("../../../../web/js/ui/util/VerticalAlign");
const log = Logger_1.Logger.create();
class GroupsScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    componentWillMount() {
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            const groups = yield Groups_1.Groups.topGroups();
            this.setState({ groups });
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
                            React.createElement("div", { className: "mt-4 mb-4 text-grey700" },
                                React.createElement("div", { className: "text-xl" }, "Groups allow you to share documents and highlights."),
                                React.createElement("div", { className: "mt-2" },
                                    "This is still a ",
                                    React.createElement("b", null, "beta"),
                                    " feature but we're actively working on making it production-ready.  You can add documents to groups, and see annotations and comments by other users.  We're going to be adding improved commenting and working on making it easy to share documents."),
                                React.createElement("div", { className: "mt-1" },
                                    "If you're interested in using group in your organization we'd love to ",
                                    React.createElement("a", { href: "https://kevinburton1.typeform.com/to/Ze4mqY" }, "get your feedback"),
                                    ".")),
                            React.createElement("div", { className: "mt-2 p-2 border-top border-left border-right bg-grey000" },
                                React.createElement("div", { style: { display: 'flex' }, className: "w-100" },
                                    React.createElement("div", { style: { flexGrow: 1 } },
                                        React.createElement("h3", null, "Groups")),
                                    React.createElement(VerticalAlign_1.VerticalAlign, null,
                                        React.createElement(CreateGroupButton_1.CreateGroupButton, null)))),
                            React.createElement(GroupsTable_1.GroupsTable, { persistenceLayerProvider: this.props.persistenceLayerProvider, groups: this.state.groups })))))));
    }
}
exports.GroupsScreen = GroupsScreen;
//# sourceMappingURL=GroupsScreen.js.map