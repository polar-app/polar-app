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
exports.GroupHighlightScreen = void 0;
const React = __importStar(require("react"));
const Groups_1 = require("../../../../../web/js/datastore/sharing/db/Groups");
const GroupDocAnnotations_1 = require("../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Toaster_1 = require("../../../../../web/js/ui/toaster/Toaster");
const FixedNav_1 = require("../../FixedNav");
const ProfileJoins_1 = require("../../../../../web/js/datastore/sharing/db/ProfileJoins");
const HighlightCard_1 = require("../highlights/HighlightCard");
const GroupHighlightURLs_1 = require("polar-webapp-links/src/groups/GroupHighlightURLs");
const log = Logger_1.Logger.create();
class GroupHighlightScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        const parsedURL = GroupHighlightURLs_1.GroupHighlightURLs.parse(document.location.href);
        this.state = Object.assign({}, parsedURL);
    }
    componentWillMount() {
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            const groupName = this.state.name;
            const group = yield Groups_1.Groups.getByName(groupName);
            if (!group) {
                Toaster_1.Toaster.error("No group named: " + groupName);
                return;
            }
            const docAnnotation = yield GroupDocAnnotations_1.GroupDocAnnotations.get(group.id, this.state.id);
            const docAnnotationProfileRecord = yield ProfileJoins_1.ProfileJoins.record(docAnnotation);
            this.setState(Object.assign(Object.assign({}, this.state), { groupHighlightData: {
                    id: group.id,
                    group,
                    docAnnotationProfileRecord,
                } }));
        });
        doHandle().catch(err => log.error("Unable to get groups: ", err));
    }
    render() {
        const { groupHighlightData } = this.state;
        if (!groupHighlightData) {
            return React.createElement("div", null);
        }
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            React.createElement("header", null),
            React.createElement(FixedNav_1.FixedNavBody, null,
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col" },
                            React.createElement("div", { className: "border-bottom mt-2" },
                                React.createElement(HighlightCard_1.HighlightCard, { persistenceLayerProvider: this.props.persistenceLayerProvider, groupID: groupHighlightData.group.id, groupName: groupHighlightData.group.name, docAnnotationProfileRecord: groupHighlightData.docAnnotationProfileRecord }))))))));
    }
}
exports.GroupHighlightScreen = GroupHighlightScreen;
//# sourceMappingURL=GroupHighlightScreen.js.map