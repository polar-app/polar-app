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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightCard = void 0;
const React = __importStar(require("react"));
const DocAnnotationComponent_1 = require("./annotations/DocAnnotationComponent");
const ProfileHeader_1 = require("./ProfileHeader");
const DocFooter_1 = require("./DocFooter");
const LoadingProgress_1 = require("../../../../../web/js/ui/LoadingProgress");
class HighlightCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { docAnnotationProfileRecord } = this.props;
        if (!docAnnotationProfileRecord) {
            return React.createElement(LoadingProgress_1.LoadingProgress, null);
        }
        return (React.createElement("div", { className: "border-top border-left border-right p-2" },
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement("div", { style: { flexGrow: 1 }, className: "mt-auto mb-auto" },
                    React.createElement(ProfileHeader_1.ProfileHeader, { groupName: this.props.groupName, docAnnotationProfileRecord: docAnnotationProfileRecord }))),
            React.createElement("div", null),
            React.createElement("div", { style: { display: 'flex' }, className: "mt-2" },
                React.createElement("div", { className: "text-grey600" },
                    React.createElement(DocAnnotationComponent_1.DocAnnotationComponent, { persistenceLayerProvider: this.props.persistenceLayerProvider, docAnnotationProfileRecord: docAnnotationProfileRecord }))),
            React.createElement("div", null,
                React.createElement(DocFooter_1.DocFooter, { persistenceLayerProvider: this.props.persistenceLayerProvider, groupID: this.props.groupID, docAnnotationProfileRecord: docAnnotationProfileRecord }))));
    }
}
exports.HighlightCard = HighlightCard;
//# sourceMappingURL=HighlightCard.js.map