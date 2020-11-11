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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAreaHighlightHooks = void 0;
const React = __importStar(require("react"));
const AnnotationMutationsContext_1 = require("../../../../web/js/annotation_sidebar/AnnotationMutationsContext");
const DocMetas_1 = require("../../../../web/js/metadata/DocMetas");
const DocViewerStore_1 = require("../DocViewerStore");
const AreaHighlightRenderers_1 = require("./AreaHighlightRenderers");
var createAreaHighlightFromEvent = AreaHighlightRenderers_1.AreaHighlightRenderers.createAreaHighlightFromEvent;
var createAreaHighlightFromOverlayRect = AreaHighlightRenderers_1.AreaHighlightRenderers.createAreaHighlightFromOverlayRect;
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const DocRenderer_1 = require("../renderers/DocRenderer");
function useAreaHighlightHooks() {
    const { onAreaHighlight } = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const { docScale, docMeta } = DocViewerStore_1.useDocViewerStore(['docScale', 'docMeta']);
    const { fileType } = DocRenderer_1.useDocViewerContext();
    const log = MUILogger_1.useLogger();
    const onAreaHighlightCreatedAsync = React.useCallback((opts) => __awaiter(this, void 0, void 0, function* () {
        const { pageNum, pointWithinPageElement } = opts;
        if (docScale && docMeta) {
            const capturedAreaHighlight = yield createAreaHighlightFromEvent(pageNum, pointWithinPageElement, docScale, fileType);
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
            const mutation = Object.assign({ type: 'create', docMeta,
                pageMeta }, capturedAreaHighlight);
            onAreaHighlight(mutation);
        }
    }), [docMeta, docScale, fileType, onAreaHighlight]);
    const onAreaHighlightCreated = React.useCallback((opts) => {
        onAreaHighlightCreatedAsync(opts)
            .catch(err => log.error(err));
    }, [log, onAreaHighlightCreatedAsync]);
    const onAreaHighlightUpdatedAsync = React.useCallback((opts) => __awaiter(this, void 0, void 0, function* () {
        const { areaHighlight, pageNum, overlayRect } = opts;
        if (docScale && docMeta) {
            const capturedAreaHighlight = yield createAreaHighlightFromOverlayRect(pageNum, overlayRect, docScale, fileType);
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
            const mutation = Object.assign(Object.assign({ type: 'update', docMeta,
                pageMeta }, capturedAreaHighlight), { areaHighlight });
            onAreaHighlight(mutation);
        }
    }), [docMeta, docScale, fileType, onAreaHighlight]);
    const onAreaHighlightUpdated = React.useCallback((opts) => {
        onAreaHighlightUpdatedAsync(opts)
            .catch(err => log.error(err));
    }, [log, onAreaHighlightUpdatedAsync]);
    return { onAreaHighlightCreated, onAreaHighlightUpdated };
}
exports.useAreaHighlightHooks = useAreaHighlightHooks;
//# sourceMappingURL=AreaHighlightHooks.js.map