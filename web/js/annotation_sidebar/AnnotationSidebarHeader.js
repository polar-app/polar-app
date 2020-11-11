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
exports.AnnotationHeader = void 0;
const AnnotationSidebarStore_1 = require("../../../apps/doc/src/AnnotationSidebarStore");
const MUIPaperToolbar_1 = require("../mui/MUIPaperToolbar");
const MUISearchBox2_1 = require("../mui/MUISearchBox2");
const ExportButton_1 = require("../ui/export/ExportButton");
const FeatureToggle_1 = require("../ui/FeatureToggle");
const React = __importStar(require("react"));
const Exporters_1 = require("../metadata/exporter/Exporters");
const DocMetaContextProvider_1 = require("./DocMetaContextProvider");
const PersistenceLayerApp_1 = require("../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const MUILogger_1 = require("../mui/MUILogger");
const MUIButtonBar_1 = require("../mui/MUIButtonBar");
exports.AnnotationHeader = () => {
    const annotationSidebarCallbacks = AnnotationSidebarStore_1.useAnnotationSidebarCallbacks();
    const exportCallback = useExportCallback();
    return (React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true },
        React.createElement(MUIButtonBar_1.MUIButtonBar, { className: "ml-1 mr-1" },
            React.createElement(MUISearchBox2_1.MUISearchBox2, { style: { flexGrow: 1 }, className: "mt-1 mb-1", onChange: text => annotationSidebarCallbacks.setFilter(text), autoComplete: "off", placeholder: "Filter annotations by text" }),
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement("div", { className: "mt-auto mb-auto" },
                    React.createElement(ExportButton_1.ExportButton, { onExport: exportCallback })),
                React.createElement(FeatureToggle_1.FeatureToggle, { name: 'groups' })))));
};
function useExportCallback() {
    var _a;
    const docMetaContext = DocMetaContextProvider_1.useDocMetaContext();
    const persistenceLayer = PersistenceLayerApp_1.usePersistenceLayerContext();
    const log = MUILogger_1.useLogger();
    const docMeta = (_a = docMetaContext.doc) === null || _a === void 0 ? void 0 : _a.docMeta;
    return (format) => {
        Exporters_1.Exporters.doExportFromDocMeta(persistenceLayer.persistenceLayerProvider, format, docMeta)
            .catch(err => log.error(err));
    };
}
//# sourceMappingURL=AnnotationSidebarHeader.js.map