"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentInit = exports.useDocumentInit = void 0;
const react_1 = __importDefault(require("react"));
const DocViewerAnnotationHook_1 = require("../DocViewerAnnotationHook");
const ReadingProgressResume_1 = require("../../../../web/js/view/ReadingProgressResume");
const DocViewerStore_1 = require("../DocViewerStore");
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
var useReadingProgressResume = ReadingProgressResume_1.ReadingProgressResume.useReadingProgressResume;
function useDocumentInit() {
    const { pageNavigator, docMeta } = DocViewerStore_1.useDocViewerStore(['pageNavigator', 'docMeta']);
    const jumpToPageLoader = DocViewerAnnotationHook_1.useDocViewerJumpToPageLoader();
    const [resumeProgressActive, resumeProgressHandler] = useReadingProgressResume();
    function doInit() {
        if (!pageNavigator) {
            throw new Error("No pageNavigator");
        }
        if (!docMeta) {
            throw new Error("No docMeta");
        }
        if (resumeProgressActive) {
            console.log("DocumentInit: Resuming reading progress via pagemarks");
            resumeProgressHandler();
        }
        else {
            if (jumpToPageLoader(document.location, 'init')) {
                console.log("DocumentInit: Jumped to page via page param.");
            }
        }
        return undefined;
    }
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        setTimeout(doInit, 1);
    });
}
exports.useDocumentInit = useDocumentInit;
exports.DocumentInit = react_1.default.memo(() => {
    DocViewerAnnotationHook_1.useDocViewerPageJumpListener();
    useDocumentInit();
    return null;
});
//# sourceMappingURL=DocumentInitHook.js.map