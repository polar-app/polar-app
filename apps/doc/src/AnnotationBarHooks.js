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
exports.useAnnotationBar = void 0;
const React = __importStar(require("react"));
const DocViewerStore_1 = require("./DocViewerStore");
const SimpleReactor_1 = require("../../../web/js/reactor/SimpleReactor");
const ControlledAnnotationBars_1 = require("../../../web/js/ui/annotationbar/ControlledAnnotationBars");
const AnnotationMutationsContext_1 = require("../../../web/js/annotation_sidebar/AnnotationMutationsContext");
const TextHighlighter_1 = require("./text_highlighter/TextHighlighter");
const DocRenderer_1 = require("./renderers/DocRenderer");
const SelectedContents_1 = require("../../../web/js/highlights/text/selection/SelectedContents");
const PostMessageHooks_1 = require("./text_highlighter/PostMessageHooks");
const MessageListeners_1 = require("./text_highlighter/MessageListeners");
const DocViewerElementsContext_1 = require("./renderers/DocViewerElementsContext");
function useCreateTextHighlightCallback() {
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const { docMeta, docScale } = DocViewerStore_1.useDocViewerStore(['docMeta', 'docScale']);
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    return (opts) => {
        if (!docMeta) {
            throw new Error("No docMeta");
        }
        if (!docScale) {
            throw new Error("docScale");
        }
        const pageElement = docViewerElementsContext.getPageElementForPage(opts.pageNum);
        const { pageMeta, textHighlight } = TextHighlighter_1.TextHighlighter.createTextHighlight(Object.assign(Object.assign({}, opts), { docMeta, docScale, pageElement }));
        const mutation = {
            type: 'create',
            docMeta, pageMeta, textHighlight
        };
        annotationMutations.onTextHighlight(mutation);
    };
}
const POST_MESSAGE_SERVICE = 'create-text-highlight';
function useAnnotationBar(opts = {}) {
    const store = React.useRef(undefined);
    const createTextHighlightCallbackRef = React.useRef(undefined);
    const { fileType } = DocRenderer_1.useDocViewerContext();
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    store.current = DocViewerStore_1.useDocViewerStore(['docMeta', 'docScale']);
    createTextHighlightCallbackRef.current = useCreateTextHighlightCallback();
    const messageListener = MessageListeners_1.MessageListeners.createListener(POST_MESSAGE_SERVICE, (message) => {
        const createTextHighlightCallback = createTextHighlightCallbackRef.current;
        createTextHighlightCallback(message);
    });
    const messageDispatcher = MessageListeners_1.MessageListeners.createDispatcher(POST_MESSAGE_SERVICE);
    PostMessageHooks_1.useMessageListener(messageListener);
    const { noRectTexts } = opts;
    return React.useMemo(() => {
        const popupStateEventDispatcher = new SimpleReactor_1.SimpleReactor();
        const triggerPopupEventDispatcher = new SimpleReactor_1.SimpleReactor();
        const annotationBarControlledPopupProps = {
            id: 'annotationbar',
            placement: 'top',
            popupStateEventDispatcher,
            triggerPopupEventDispatcher
        };
        const onHighlighted = (highlightCreatedEvent) => {
            console.log("onHighlighted: ", highlightCreatedEvent);
            const { selection } = highlightCreatedEvent.activeSelection;
            const selectedContent = SelectedContents_1.SelectedContents.computeFromSelection(selection, { noRectTexts, fileType });
            selection.empty();
            messageDispatcher({
                pageNum: highlightCreatedEvent.pageNum,
                highlightColor: highlightCreatedEvent.highlightColor,
                selectedContent
            });
        };
        const annotationBarCallbacks = {
            onHighlighted,
        };
        return () => {
            const docViewerElementProvider = () => docViewerElementsContext.getDocViewerElement();
            ControlledAnnotationBars_1.ControlledAnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks, { fileType, docViewerElementProvider });
        };
    }, [docViewerElementsContext, fileType, messageDispatcher, noRectTexts]);
}
exports.useAnnotationBar = useAnnotationBar;
//# sourceMappingURL=AnnotationBarHooks.js.map