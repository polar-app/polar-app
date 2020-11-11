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
exports.TopTagsChart = void 0;
const React = __importStar(require("react"));
const DocInfoStatistics_1 = require("../../../../web/js/metadata/DocInfoStatistics");
const pie_1 = require("@nivo/pie");
const StatTitle_1 = __importDefault(require("./StatTitle"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const NivoHooks_1 = require("./NivoHooks");
exports.TopTagsChart = React.memo((props) => {
    const theme = useTheme_1.default();
    const nivoTheme = NivoHooks_1.useNivoTheme();
    const topTags = DocInfoStatistics_1.DocInfoStatistics.computeTopTags(props.docInfos, 10);
    const data = topTags.map(current => {
        return {
            id: current.key,
            label: current.key,
            value: current.value
        };
    });
    return (React.createElement("div", { id: "top-tags-chart", className: "p-1" },
        React.createElement(StatTitle_1.default, null, "Top Tags"),
        React.createElement("div", { style: { height: '600px', width: '100%' } },
            React.createElement(pie_1.ResponsivePie, { data: data, margin: { top: 40, right: 80, bottom: 80, left: 80 }, innerRadius: 0.5, padAngle: 0.7, cornerRadius: 3, colors: { scheme: 'nivo' }, borderWidth: 1, borderColor: { from: 'color', modifiers: [['darker', 0.2]] }, radialLabelsSkipAngle: 10, radialLabelsTextXOffset: 6, radialLabelsTextColor: theme.palette.text.secondary, radialLabelsLinkDiagonalLength: 16, radialLabelsLinkHorizontalLength: 24, radialLabelsLinkStrokeWidth: 1, radialLabelsLinkColor: { from: 'color' }, slicesLabelsSkipAngle: 10, slicesLabelsTextColor: theme.palette.text.secondary, animate: true, motionStiffness: 90, motionDamping: 15, theme: nivoTheme }))));
}, react_fast_compare_1.default);
//# sourceMappingURL=TopTagsChart.js.map