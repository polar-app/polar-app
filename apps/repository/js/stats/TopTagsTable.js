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
exports.TopTagsTable = void 0;
const React = __importStar(require("react"));
const DocInfoStatistics_1 = require("../../../../web/js/metadata/DocInfoStatistics");
const StatTitle_1 = __importDefault(require("./StatTitle"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
exports.TopTagsTable = React.memo((props) => {
    const topTags = DocInfoStatistics_1.DocInfoStatistics.computeTopTags(props.docInfos, 20);
    return React.createElement("div", { id: "top-tags-table" },
        React.createElement(StatTitle_1.default, null, "Top Tags"),
        React.createElement("table", null,
            React.createElement("tbody", null, topTags.map(topTag => React.createElement("tr", { key: topTag.key },
                React.createElement("td", { className: "pt-1 pb-1" }, topTag.key),
                React.createElement("td", { className: "pt-1 pb-1" }, topTag.value))))));
}, react_fast_compare_1.default);
//# sourceMappingURL=TopTagsTable.js.map