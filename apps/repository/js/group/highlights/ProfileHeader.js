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
exports.ProfileHeader = void 0;
const React = __importStar(require("react"));
const RelativeMoment_1 = require("../../../../../web/js/ui/util/RelativeMoment");
const react_router_dom_1 = require("react-router-dom");
class ProfileHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { props } = this;
        const { docAnnotationProfileRecord } = props;
        const { profile } = this.props.docAnnotationProfileRecord;
        const docAnnotation = docAnnotationProfileRecord.value;
        if (profile) {
            return (React.createElement("div", { style: { display: 'flex' } },
                React.createElement("div", null, profile.name || profile.handle),
                React.createElement("div", { className: "text-grey200 ml-1" },
                    React.createElement(react_router_dom_1.Link, { to: { pathname: `/group/${this.props.groupName}/highlight/${docAnnotation.id}` } },
                        React.createElement(RelativeMoment_1.RelativeMoment, { datetime: docAnnotation.lastUpdated || docAnnotation.created })))));
        }
        else {
            return (React.createElement("div", null));
        }
    }
}
exports.ProfileHeader = ProfileHeader;
//# sourceMappingURL=ProfileHeader.js.map