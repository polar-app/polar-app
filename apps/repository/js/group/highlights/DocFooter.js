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
exports.DocFooter = void 0;
const React = __importStar(require("react"));
const GroupDocAddButton_1 = require("../GroupDocAddButton");
class DocFooter extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { props } = this;
        const { docAnnotationProfileRecord } = props;
        const { profile } = this.props.docAnnotationProfileRecord;
        const docAnnotation = docAnnotationProfileRecord.value;
        if (profile) {
            return (React.createElement("div", { style: { display: 'flex' }, className: "pt-1" },
                React.createElement("div", { className: "text-bold mt-auto mb-auto", style: { flexGrow: 1 } }, docAnnotation.docRef.title || ""),
                React.createElement("div", { className: "text-bold mt-auto mb-auto" },
                    React.createElement(GroupDocAddButton_1.GroupDocAddButton, { persistenceLayerProvider: this.props.persistenceLayerProvider, groupID: this.props.groupID, fingerprint: docAnnotation.docRef.fingerprint }))));
        }
        else {
            return (React.createElement("div", null));
        }
    }
}
exports.DocFooter = DocFooter;
//# sourceMappingURL=DocFooter.js.map