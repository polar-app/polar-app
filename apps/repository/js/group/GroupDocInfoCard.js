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
exports.GroupDocInfoCard = void 0;
const React = __importStar(require("react"));
const GroupDocAddButton_1 = require("./GroupDocAddButton");
const react_moment_1 = __importDefault(require("react-moment"));
const LinkHost_1 = require("./LinkHost");
class GroupDocInfoCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", { className: "border-top border-left border-right p-2" },
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement("div", { style: { flexGrow: 1 }, className: "mt-auto mb-auto text-lg" }, this.props.title),
                React.createElement("div", null,
                    React.createElement(GroupDocAddButton_1.GroupDocAddButton, { persistenceLayerProvider: this.props.persistenceLayerProvider, groupID: this.props.groupID, fingerprint: this.props.fingerprint }))),
            React.createElement("div", null, this.props.description),
            React.createElement("div", { style: { display: 'flex' }, className: "mt-2" },
                React.createElement("div", { style: { flexGrow: 1 }, className: "text-grey600" },
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement(LinkHost_1.LinkHost, { url: this.props.url }),
                        React.createElement("div", null,
                            React.createElement("b", null, this.props.nrPages),
                            " pages"))),
                React.createElement("div", { className: "text-grey600" },
                    React.createElement(react_moment_1.default, { withTitle: true, titleFormat: "D MMM YYYY hh:MM A", format: "MMM DD YYYY HH:mm A", ago: true, filter: (value) => value.replace(/^an? /g, '1 ') }, this.props.published)))));
    }
}
exports.GroupDocInfoCard = GroupDocInfoCard;
//# sourceMappingURL=GroupDocInfoCard.js.map