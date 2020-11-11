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
const React = __importStar(require("react"));
const DocInfoStatistics_1 = require("../../../../web/js/metadata/DocInfoStatistics");
const StatTitle_1 = __importDefault(require("./StatTitle"));
const bar_1 = require("@nivo/bar");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const StatBox_1 = require("./StatBox");
class NewDocumentRateChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        const dateStats = DocInfoStatistics_1.DocInfoStatistics.computeDocumentsAddedRate(this.props.docInfos);
        const labels = dateStats.map(current => current.date);
        const ticks = Arrays_1.Arrays.sample(labels, 10);
        const data = dateStats.map(current => {
            return {
                date: current.date,
                value: current.value
            };
        });
        return (React.createElement("div", { id: "new-documents-per-day-chart", className: "p-1" },
            React.createElement(StatBox_1.StatBox, { style: { height: '325px', width: '100%' } },
                React.createElement(React.Fragment, null,
                    React.createElement(StatTitle_1.default, null, "New Documents Per Day"),
                    React.createElement(bar_1.ResponsiveBar, { data: data, keys: [
                            "value",
                        ], indexBy: "date", margin: {
                            top: 10,
                            right: 10,
                            bottom: 50,
                            left: 40
                        }, padding: 0.3, colors: "nivo", defs: [
                            {
                                "id": "dots",
                                "type": "patternDots",
                                "background": "inherit",
                                "color": "#38bcb2",
                                "size": 4,
                                "padding": 1,
                                "stagger": true
                            },
                            {
                                "id": "lines",
                                "type": "patternLines",
                                "background": "inherit",
                                "color": "#eed312",
                                "rotation": -45,
                                "lineWidth": 6,
                                "spacing": 10
                            }
                        ], fill: [
                            {
                                "match": {
                                    "id": "fries"
                                },
                                "id": "dots"
                            },
                            {
                                "match": {
                                    "id": "sandwich"
                                },
                                "id": "lines"
                            }
                        ], axisBottom: {
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legendOffset: 32,
                            tickValues: ticks,
                        }, labelSkipWidth: 12, labelSkipHeight: 12, labelTextColor: "inherit:darker(1.6)", animate: true, motionStiffness: 90, motionDamping: 15 })))));
    }
}
exports.default = NewDocumentRateChart;
//# sourceMappingURL=NewDocumentRateChart.js.map