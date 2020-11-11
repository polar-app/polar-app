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
exports.DocRepoFilterBar = void 0;
const React = __importStar(require("react"));
const MUIToggleButton_1 = require("../../../../web/js/ui/MUIToggleButton");
const Flag_1 = __importDefault(require("@material-ui/icons/Flag"));
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const MUISearchBox2_1 = require("../../../../web/js/mui/MUISearchBox2");
const DocRepoStore2_1 = require("./DocRepoStore2");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.DocRepoFilterBar = ReactUtils_1.deepMemo((props) => {
    const { filters } = DocRepoStore2_1.useDocRepoStore(['filters']);
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const { setFilters } = callbacks;
    const Right = () => {
        if (props.right) {
            return props.right;
        }
        else {
            return React.createElement("div", null);
        }
    };
    return (React.createElement("div", { id: "filter-bar", style: {} },
        React.createElement(Grid_1.default, { spacing: 1, container: true, direction: "row", justify: "flex-start", style: { flexWrap: 'nowrap' }, alignItems: "center" },
            React.createElement(Grid_1.default, { item: true },
                React.createElement(MUIToggleButton_1.MUIToggleButton, { id: "toggle-flagged", tooltip: "Show only flagged documents.", size: "medium", label: "flagged", icon: React.createElement(Flag_1.default, null), initialValue: filters.flagged, onChange: value => setFilters(Object.assign(Object.assign({}, filters), { flagged: value })) })),
            React.createElement(Grid_1.default, { item: true },
                React.createElement(MUIToggleButton_1.MUIToggleButton, { id: "toggle-archived", tooltip: "Toggle showing archived documents", size: "medium", label: "archived", initialValue: filters.archived, onChange: value => setFilters(Object.assign(Object.assign({}, filters), { archived: value })) })),
            React.createElement(Grid_1.default, { item: true },
                React.createElement(MUISearchBox2_1.MUISearchBox2, { id: "filter_title", placeholder: "Search by title", initialValue: filters.title, autoComplete: "off", onChange: text => setFilters(Object.assign(Object.assign({}, filters), { title: text })) })))));
});
//# sourceMappingURL=DocRepoFilterBar.js.map