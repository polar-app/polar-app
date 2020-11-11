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
exports.DocViewerToolbar = void 0;
const React = __importStar(require("react"));
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const ScaleLevels_1 = require("../ScaleLevels");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Remove_1 = __importDefault(require("@material-ui/icons/Remove"));
const Add_1 = __importDefault(require("@material-ui/icons/Add"));
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const Select_1 = __importDefault(require("@material-ui/core/Select"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const FormControl_1 = __importDefault(require("@material-ui/core/FormControl"));
const DocFindButton_1 = require("../DocFindButton");
const MUIButtonBar_1 = require("../../../../web/js/mui/MUIButtonBar");
const DocViewerStore_1 = require("../DocViewerStore");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const DocFindStore_1 = require("../DocFindStore");
const DocumentWriteStatus_1 = require("../../../../web/js/apps/repository/connectivity/DocumentWriteStatus");
const MUIDocFlagButton_1 = require("../../../repository/js/doc_repo/buttons/MUIDocFlagButton");
const MUIDocArchiveButton_1 = require("../../../repository/js/doc_repo/buttons/MUIDocArchiveButton");
const DocViewerToolbarOverflowButton_1 = require("../DocViewerToolbarOverflowButton");
const MUIDocTagButton_1 = require("../../../repository/js/doc_repo/buttons/MUIDocTagButton");
const FullScreenButton_1 = require("./FullScreenButton");
const NumPages_1 = require("./NumPages");
const PageNumberInput_1 = require("./PageNumberInput");
const PagePrevButton_1 = require("./PagePrevButton");
const PageNextButton_1 = require("./PageNextButton");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const DockLayoutToggleButton_1 = require("../../../../web/js/ui/doc_layout/DockLayoutToggleButton");
exports.DocViewerToolbar = ReactUtils_1.deepMemo(() => {
    var _a, _b;
    const { docScale, pageNavigator, scaleLeveler, docMeta } = DocViewerStore_1.useDocViewerStore(['docScale', 'pageNavigator', 'scaleLeveler', 'docMeta']);
    const { finder } = DocFindStore_1.useDocFindStore(['finder']);
    const { setScale, onDocTagged, doZoom, toggleDocArchived, toggleDocFlagged } = DocViewerStore_1.useDocViewerCallbacks();
    const handleScaleChange = (scale) => {
        const value = ArrayStreams_1.arrayStream(ScaleLevels_1.ScaleLevelTuples)
            .filter(current => current.value === scale)
            .first();
        setScale(value);
    };
    return (React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true },
        React.createElement("div", { style: {
                display: 'flex',
            }, className: "p-1 vertical-aligned-children" },
            React.createElement("div", { style: {
                    display: 'flex',
                    flexGrow: 1,
                    flexBasis: 0
                }, className: "vertical-aligned-children" },
                React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                    React.createElement(DockLayoutToggleButton_1.DockLayoutToggleButton, { side: 'left' }),
                    finder && (React.createElement(React.Fragment, null,
                        React.createElement(DocFindButton_1.DocFindButton, { className: "mr-1" }),
                        React.createElement(Divider_1.default, { orientation: "vertical", flexItem: true }))),
                    React.createElement(PagePrevButton_1.PagePrevButton, null),
                    React.createElement(PageNextButton_1.PageNextButton, null),
                    pageNavigator && (React.createElement(React.Fragment, null,
                        React.createElement(PageNumberInput_1.PageNumberInput, { nrPages: pageNavigator.count }),
                        React.createElement(NumPages_1.NumPages, { nrPages: pageNavigator.count }))))),
            React.createElement("div", { style: {
                    display: 'flex',
                    flexGrow: 1,
                    flexBasis: 0
                }, className: "vertical-align-children" },
                React.createElement("div", { style: {
                        display: 'flex',
                        alignItems: 'center'
                    }, className: "ml-auto mr-auto vertical-align-children" }, docScale && scaleLeveler && (React.createElement(DeviceRouter_1.DeviceRouters.Desktop, null,
                    React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                        React.createElement(IconButton_1.default, { onClick: () => doZoom('-') },
                            React.createElement(Remove_1.default, null)),
                        React.createElement(FormControl_1.default, { variant: "outlined", size: "small" },
                            React.createElement(Select_1.default, { value: docScale.scale.value || 'page-width', onChange: event => handleScaleChange(event.target.value) }, ScaleLevels_1.ScaleLevelTuples.map(current => (React.createElement(MenuItem_1.default, { key: current.value, value: current.value }, current.label))))),
                        React.createElement(IconButton_1.default, { onClick: () => doZoom('+') },
                            React.createElement(Add_1.default, null))))))),
            React.createElement("div", { style: {
                    display: 'flex',
                    flexGrow: 1,
                    flexBasis: 0
                }, className: "vertical-aligned-children" },
                React.createElement("div", { style: { display: 'flex' }, className: "ml-auto vertical-aligned-children" },
                    React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                        React.createElement(MUIDocTagButton_1.MUIDocTagButton, { size: "medium", onClick: onDocTagged }),
                        React.createElement(MUIDocArchiveButton_1.MUIDocArchiveButton, { size: "medium", onClick: toggleDocArchived, active: (_a = docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo) === null || _a === void 0 ? void 0 : _a.archived }),
                        React.createElement(MUIDocFlagButton_1.MUIDocFlagButton, { size: "medium", onClick: toggleDocFlagged, active: (_b = docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo) === null || _b === void 0 ? void 0 : _b.flagged }),
                        React.createElement(Divider_1.default, { orientation: "vertical", flexItem: true }),
                        React.createElement("div", { className: "ml-3 mr-2", style: { display: 'flex' } },
                            React.createElement(DocumentWriteStatus_1.DocumentWriteStatus, null)),
                        React.createElement(FullScreenButton_1.FullScreenButton, null),
                        React.createElement(DocViewerToolbarOverflowButton_1.DocViewerToolbarOverflowButton, { docInfo: docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo }),
                        React.createElement(DockLayoutToggleButton_1.DockLayoutToggleButton, { side: 'right' })))))));
});
//# sourceMappingURL=DocViewerToolbar.js.map