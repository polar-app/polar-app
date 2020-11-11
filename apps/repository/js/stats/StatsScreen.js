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
exports.StatsScreen = void 0;
const React = __importStar(require("react"));
const TopTagsChart_1 = require("./TopTagsChart");
const FixedNav_1 = require("../FixedNav");
const SpacedRepQueueChart_1 = require("./SpacedRepQueueChart");
const ReviewerTasks_1 = require("../reviewer/ReviewerTasks");
const Logger_1 = require("polar-shared/src/logger/Logger");
const PremiumFeature_1 = require("../../../../web/js/ui/premium_feature/PremiumFeature");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const DockLayout_1 = require("../../../../web/js/ui/doc_layout/DockLayout");
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const PersistenceLayerApp_1 = require("../persistence_layer/PersistenceLayerApp");
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
const ReadingProgressTable_1 = require("./ReadingProgressTable");
const react_helmet_1 = require("react-helmet");
const FeedbackButton2_1 = require("../ui/FeedbackButton2");
const log = Logger_1.Logger.create();
const ReadingStats = (props) => {
    return (React.createElement("div", null,
        React.createElement(SectionHeader, null,
            React.createElement("h1", null, "Statistics"),
            React.createElement(SectionText, null, "Polar keeps track of statistics of your document repository so you can better understand your reading habits and what types of documents are stored in your repository.")),
        React.createElement(PremiumFeature_1.PremiumFeature, { required: 'plus', feature: "statistics", size: "lg" },
            React.createElement(ReadingProgressTable_1.ReadingProgressTable, { docInfos: props.docInfos }))));
};
const ReviewerStats = (props) => {
    if (props.isReviewer) {
        return React.createElement("div", null,
            React.createElement(SectionHeader, null,
                React.createElement("h2", null, "Flashcards"),
                React.createElement(SectionText, null, "Stats for flashcard review including the queue length (amount of work needed to do to catch up) and the number of flashcards completed.")),
            React.createElement("div", { className: "mt-2" },
                React.createElement("div", { className: "" },
                    React.createElement(SpacedRepQueueChart_1.SpacedRepQueueChart, { mode: 'flashcard', type: 'queue' }))),
            React.createElement("div", { className: "mt-2" },
                React.createElement("div", { className: "" },
                    React.createElement(SpacedRepQueueChart_1.SpacedRepQueueChart, { mode: 'flashcard', type: 'completed' }))),
            React.createElement(SectionHeader, null,
                React.createElement("h2", null, "Incremental Reading"),
                React.createElement(SectionText, null, "Stats regarding incremental reading.  Incremental reading uses spaced repetition along with your annotations so you can easily review your notes in conjunction with your flashcards.")),
            React.createElement("div", { className: "mt-2" },
                React.createElement("div", { className: "" },
                    React.createElement(SpacedRepQueueChart_1.SpacedRepQueueChart, { mode: 'reading', type: 'queue' }))),
            React.createElement("div", { className: "mt-2" },
                React.createElement("div", { className: "" },
                    React.createElement(SpacedRepQueueChart_1.SpacedRepQueueChart, { mode: 'reading', type: 'completed' }))));
    }
    return React.createElement("div", null);
};
const SectionHeader = (props) => {
    return React.createElement("div", { className: "mt-3" }, props.children);
};
const SectionText = (props) => {
    return React.createElement("p", { className: "text-lg" }, props.children);
};
function useDocInfos() {
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    return repoDocMetaManager.repoDocInfoIndex.values()
        .map(current => current.docInfo);
}
const Desktop = (props) => {
    const docInfos = useDocInfos();
    return (React.createElement(Paper_1.default, { square: true, elevation: 0, style: {
            display: 'flex',
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: 'auto'
        } },
        React.createElement(FeedbackButton2_1.FeedbackButton2, null),
        React.createElement("div", { style: {
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto',
                flexGrow: 1,
            } },
            React.createElement(ReadingStats, { docInfos: docInfos }),
            React.createElement(ReviewerStats, { isReviewer: props.isReviewer }),
            React.createElement(PremiumFeature_1.PremiumFeature, { required: 'plus', feature: "statistics", size: "lg" },
                React.createElement(TopTagsChart_1.TopTagsChart, { docInfos: docInfos })))));
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
    { }
};
const PhoneAndTablet = React.memo((props) => {
    return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository", className: "statistics-view" },
        React.createElement(FixedNav_1.FixedNav.Body, { className: "" },
            React.createElement(DockLayout_1.DockLayout, { dockPanels: [
                    {
                        id: 'dock-panel-center',
                        type: 'grow',
                        component: (React.createElement("div", { className: "ml-1 mr-1" },
                            React.createElement(ReviewerStats, { isReviewer: props.isReviewer })))
                    },
                ] }))));
});
exports.StatsScreen = React.memo(() => {
    const [state, setState] = React.useState({ isReviewer: false });
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        const doAsync = () => __awaiter(void 0, void 0, void 0, function* () {
            const isReviewer = yield ReviewerTasks_1.ReviewerTasks.isReviewer();
            setState({ isReviewer });
        });
        doAsync()
            .catch(err => log.error(err));
    });
    const desktop = React.createElement(Desktop, Object.assign({}, state));
    const phoneAndTablet = React.createElement(PhoneAndTablet, Object.assign({}, state));
    return (React.createElement(React.Fragment, null,
        React.createElement(react_helmet_1.Helmet, null,
            React.createElement("title", null, "Polar: Statistics")),
        React.createElement(DeviceRouter_1.DeviceRouter, { desktop: desktop, phone: phoneAndTablet, tablet: phoneAndTablet })));
});
//# sourceMappingURL=StatsScreen.js.map