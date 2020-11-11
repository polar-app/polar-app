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
exports.GroupTable = void 0;
const React = __importStar(require("react"));
const GroupDocInfoCard_1 = require("./GroupDocInfoCard");
const LoadingProgress_1 = require("../../../../web/js/ui/LoadingProgress");
const Pagination_1 = require("../../../../web/js/ui/Pagination");
class GroupTable extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { groupData } = this.props;
        if (!groupData) {
            return React.createElement(LoadingProgress_1.LoadingProgress, null);
        }
        return (React.createElement(Pagination_1.Pagination, { results: groupData.groupDocInfos },
            React.createElement("div", { className: "border-bottom" }, groupData.groupDocInfos.map(groupDocInfo => React.createElement(GroupDocInfoCard_1.GroupDocInfoCard, Object.assign({ persistenceLayerProvider: this.props.persistenceLayerProvider, key: groupDocInfo.fingerprint }, groupDocInfo))))));
    }
}
exports.GroupTable = GroupTable;
//# sourceMappingURL=GroupTable.js.map