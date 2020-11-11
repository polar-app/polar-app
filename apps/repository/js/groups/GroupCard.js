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
exports.GroupCard = void 0;
const React = __importStar(require("react"));
const VerticalAlign_1 = require("../../../../web/js/ui/util/VerticalAlign");
const LeftRightSplit_1 = require("../../../../web/js/ui/left_right_split/LeftRightSplit");
const GroupJoinButton_1 = require("./GroupJoinButton");
const react_router_dom_1 = require("react-router-dom");
class GroupCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { group } = this.props;
        return (React.createElement("div", { className: "border-top border-left border-right p-2" },
            React.createElement(LeftRightSplit_1.LeftRightSplit, { left: React.createElement("div", { style: { display: 'flex' } },
                    React.createElement(VerticalAlign_1.VerticalAlign, null,
                        React.createElement(react_router_dom_1.Link, { className: "text-lg", to: { pathname: '/group/' + group.name } }, group.name))), right: React.createElement(GroupJoinButton_1.GroupJoinButton, { name: group.name }) }),
            React.createElement("p", null, group.description),
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement(VerticalAlign_1.VerticalAlign, null,
                    React.createElement("i", { className: "fa fa-users mr-1 text-muted", "aria-hidden": "true" })),
                React.createElement(VerticalAlign_1.VerticalAlign, null,
                    group.nrMembers,
                    " members"))));
    }
}
exports.GroupCard = GroupCard;
//# sourceMappingURL=GroupCard.js.map