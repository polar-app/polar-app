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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacedRepQueueChart = void 0;
const React = __importStar(require("react"));
const StatTitle_1 = __importDefault(require("./StatTitle"));
const line_1 = require("@nivo/line");
const Statistics_1 = require("polar-shared/src/util/Statistics");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const ReviewerStatistics_1 = require("../reviewer/ReviewerStatistics");
const Logger_1 = require("polar-shared/src/logger/Logger");
const StatBox_1 = require("./StatBox");
const LoadingProgress_1 = require("../../../../web/js/ui/LoadingProgress");
const StatisticsReducers_1 = require("./StatisticsReducers");
const NivoHooks_1 = require("./NivoHooks");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const HEIGHT = '300px';
const log = Logger_1.Logger.create();
const Chart = React.memo((props) => {
    const nivoTheme = NivoHooks_1.useNivoTheme();
    const theme = useTheme_1.default();
    const createTitle = () => {
        switch (props.type) {
            case "queue":
                return "Number of tasks pending (queue length)";
            case "completed":
                return "Number of tasks completed";
        }
    };
    const title = createTitle();
    return (React.createElement(StatBox_1.StatBox, null,
        React.createElement(React.Fragment, null,
            React.createElement(StatTitle_1.default, null, title),
            React.createElement("div", { style: {
                    height: HEIGHT,
                    width: '100%'
                } },
                React.createElement(line_1.ResponsiveLine, { data: props.lineData, isInteractive: true, margin: {
                        top: 10,
                        right: 10,
                        bottom: 50,
                        left: 40
                    }, colors: { scheme: 'nivo' }, enableArea: true, yScale: {
                        type: 'linear'
                    }, xScale: {
                        type: 'time',
                    }, axisBottom: {
                        format: '%b %d',
                        tickValues: 5,
                    }, animate: true, theme: nivoTheme, legends: [{
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 50,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemsSpacing: 4,
                            symbolSize: 20,
                            symbolShape: 'circle',
                            itemDirection: 'left-to-right',
                            itemTextColor: theme.palette.text.secondary,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }] })))));
});
const NeedChardData = () => {
    return React.createElement("div", null);
};
class SpacedRepQueueChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
    }
    componentDidMount() {
        const doAsync = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield ReviewerStatistics_1.ReviewerStatistics.statistics(this.props.mode, this.props.type);
            this.setState({ data });
        });
        doAsync()
            .catch(err => log.error("Could not fetch queue stats: ", err));
    }
    render() {
        const { data } = this.state;
        if (!data) {
            return React.createElement(LoadingProgress_1.LoadingProgress, { style: { height: HEIGHT } });
        }
        const computeStats = () => {
            const createDatapointsReducer = () => {
                switch (this.props.type) {
                    case "queue":
                        return StatisticsReducers_1.minDatapointsReducer;
                    case "completed":
                        return StatisticsReducers_1.sumDatapointsReducer;
                }
            };
            const emptyDatapointFactory = (created) => {
                return {
                    created,
                    type: this.props.type,
                    mode: this.props.mode,
                    nrNew: 0,
                    nrLapsed: 0,
                    nrLearning: 0,
                    nrReview: 0
                };
            };
            return Statistics_1.Statistics.compute(data, createDatapointsReducer(), emptyDatapointFactory);
        };
        const stats = computeStats();
        const computeLineData = () => {
            const toDataPoint = (spacedRepStat, id) => {
                const x = ISODateTimeStrings_1.ISODateTimeStrings.parse(spacedRepStat.created);
                const y = spacedRepStat[id];
                return { x, y };
            };
            const computeLine = (id) => {
                return {
                    id,
                    data: stats.map(current => toDataPoint(current, id))
                };
            };
            return [
                computeLine('nrLearning'),
                computeLine('nrReview'),
                computeLine('nrLapsed')
            ];
        };
        const lineData = computeLineData();
        const Main = () => {
            if (lineData[0].data.length < 3) {
                return React.createElement(NeedChardData, null);
            }
            else {
                return React.createElement(Chart, { type: this.props.type, lineData: lineData });
            }
        };
        return (React.createElement("div", null,
            React.createElement(Main, null)));
    }
}
exports.SpacedRepQueueChart = SpacedRepQueueChart;
//# sourceMappingURL=SpacedRepQueueChart.js.map