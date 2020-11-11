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
exports.HighlightsTable = void 0;
const React = __importStar(require("react"));
const HighlightCard_1 = require("./HighlightCard");
const LoadingProgress_1 = require("../../../../../web/js/ui/LoadingProgress");
const Pagination_1 = require("../../../../../web/js/ui/Pagination");
class HighlightsTable extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { groupHighlightsData } = this.props;
        if (!groupHighlightsData) {
            return React.createElement(LoadingProgress_1.LoadingProgress, null);
        }
        return (React.createElement(Pagination_1.Pagination, { results: groupHighlightsData.docAnnotationProfileRecords },
            React.createElement("div", { className: "border-bottom" }, groupHighlightsData.docAnnotationProfileRecords.map(docAnnotationProfileRecord => React.createElement(HighlightCard_1.HighlightCard, { persistenceLayerProvider: this.props.persistenceLayerProvider, key: docAnnotationProfileRecord.value.id, groupID: groupHighlightsData.group.id, groupName: groupHighlightsData.group.name, docAnnotationProfileRecord: docAnnotationProfileRecord })))));
    }
}
exports.HighlightsTable = HighlightsTable;
//# sourceMappingURL=HighlightsTable.js.map