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
exports.DocViewerMenu = exports.computeDocViewerContextMenuOrigin = void 0;
const MUIMenuItem_1 = require("../../../web/js/mui/menu/MUIMenuItem");
const React = __importStar(require("react"));
const Bookmark_1 = __importDefault(require("@material-ui/icons/Bookmark"));
const Bookmarks_1 = __importDefault(require("@material-ui/icons/Bookmarks"));
const DocViewerStore_1 = require("./DocViewerStore");
const Elements_1 = require("../../../web/js/util/Elements");
const PhotoSizeSelectLarge_1 = __importDefault(require("@material-ui/icons/PhotoSizeSelectLarge"));
const AreaHighlightHooks_1 = require("./annotations/AreaHighlightHooks");
const DeleteForever_1 = __importDefault(require("@material-ui/icons/DeleteForever"));
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const AnnotationMutationsContext_1 = require("../../../web/js/annotation_sidebar/AnnotationMutationsContext");
const IDocMetas_1 = require("polar-shared/src/metadata/IDocMetas");
const MUIDialogControllers_1 = require("../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const Ranges_1 = require("../../../web/js/highlights/text/selection/Ranges");
const Clipboards_1 = require("../../../web/js/util/system/clipboard/Clipboards");
const MUIMenuSubheader_1 = require("../../../web/js/mui/menu/MUIMenuSubheader");
const PagemarkMode_1 = require("polar-shared/src/metadata/PagemarkMode");
const BookmarkBorder_1 = __importDefault(require("@material-ui/icons/BookmarkBorder"));
const MUIMenuSection_1 = require("../../../web/js/mui/menu/MUIMenuSection");
function useAnnotationMetaToRefResolver() {
    const { docMeta } = DocViewerStore_1.useDocViewerStore(['docMeta']);
    return React.useCallback((annotationMeta) => {
        const { id, annotationType, pageNum } = annotationMeta;
        if (!docMeta) {
            throw new Error("No docMeta");
        }
        const pageMeta = IDocMetas_1.IDocMetas.getPageMeta(docMeta, pageNum);
        function getOriginal() {
            switch (annotationType) {
                case AnnotationType_1.AnnotationType.PAGEMARK:
                    return (pageMeta.pagemarks || {})[id];
                case AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT:
                    return (pageMeta.textHighlights || {})[id];
                case AnnotationType_1.AnnotationType.AREA_HIGHLIGHT:
                    return (pageMeta.areaHighlights || {})[id];
                default:
                    throw new Error("Unsupported annotationType: " + annotationMeta.annotationType);
            }
        }
        const original = getOriginal();
        return {
            id, annotationType, pageNum,
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            original
        };
    }, [docMeta]);
}
function withPointerEvents(element, className, delegate) {
    const elements = Array.from(element.querySelectorAll("." + className));
    const elementStyleRestores = [];
    for (const element of elements) {
        elementStyleRestores.push({
            element,
            pointerEvents: element.style.pointerEvents
        });
        element.style.pointerEvents = 'auto';
    }
    try {
        return delegate();
    }
    finally {
        for (const restore of elementStyleRestores) {
            restore.element.style.pointerEvents = restore.pointerEvents;
        }
    }
}
function selectedElements(pageElement, point, className) {
    return withPointerEvents(pageElement, className, () => {
        const doc = pageElement.ownerDocument;
        const elements = doc.elementsFromPoint(point.x, point.y);
        return elements.filter(element => element.classList.contains(className));
    });
}
function selectedAnnotationMetas(pageElement, pageNum, annotationType, point, className) {
    function toAnnotationMeta(element) {
        const id = element.getAttribute("data-annotation-id");
        if (!id) {
            throw new Error("No id for annotation type: " + annotationType);
        }
        return { id, pageNum, annotationType };
    }
    return selectedElements(pageElement, point, className).map(toAnnotationMeta);
}
function computeDocViewerContextMenuOrigin(event) {
    const target = event.target;
    function computeContextPageMeta() {
        function computePageElementWithFileType() {
            const pageElement = Elements_1.Elements.untilRoot(target, ".page");
            if (pageElement) {
                return [pageElement, 'pdf'];
            }
            return [event.nativeEvent.view.document.body, 'epub'];
        }
        const [pageElement, fileType] = computePageElementWithFileType();
        function parsePageNumFromPageElement(pageElement) {
            return parseInt(pageElement.getAttribute("data-page-number"));
        }
        function computePageNumForPDF() {
            return parsePageNumFromPageElement(pageElement);
        }
        function computePageNumForEPUB() {
            const pageElement = Elements_1.Elements.untilRoot(event.nativeEvent.view.frameElement, '.page');
            return parsePageNumFromPageElement(pageElement);
        }
        function computePageNum() {
            switch (fileType) {
                case "pdf":
                    return computePageNumForPDF();
                case "epub":
                    return computePageNumForEPUB();
            }
        }
        const pageNum = computePageNum();
        return { pageElement, pageNum, fileType };
    }
    const { pageElement, pageNum, fileType } = computeContextPageMeta();
    const eventTargetOffset = Elements_1.Elements.getRelativeOffsetRect(target, pageElement);
    function computePointWithinPageElement() {
        const pageElementBCR = pageElement.getBoundingClientRect();
        return {
            x: event.clientX - pageElementBCR.x,
            y: event.clientY - pageElementBCR.y
        };
    }
    const pointWithinPageElement = computePointWithinPageElement();
    const point = { x: event.clientX, y: event.clientY };
    const pagemarks = selectedAnnotationMetas(pageElement, pageNum, AnnotationType_1.AnnotationType.PAGEMARK, point, 'pagemark');
    const areaHighlights = selectedAnnotationMetas(pageElement, pageNum, AnnotationType_1.AnnotationType.AREA_HIGHLIGHT, point, 'area-highlight');
    const textHighlights = selectedAnnotationMetas(pageElement, pageNum, AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT, point, 'text-highlight');
    const hasSelection = event.nativeEvent.view !== null && event.nativeEvent.view.getSelection() !== null;
    function selectionToText() {
        if (!event.nativeEvent.view) {
            return "";
        }
        const selection = event.nativeEvent.view.getSelection();
        if (!selection) {
            return "";
        }
        return Ranges_1.Ranges.toText(selection.getRangeAt(0));
    }
    function computeRange() {
        const view = event.nativeEvent.view;
        if (!view) {
            return undefined;
        }
        const selection = view.getSelection();
        if (!selection) {
            return undefined;
        }
        if (selection.rangeCount === 0) {
            return undefined;
        }
        return selection.getRangeAt(0);
    }
    const range = computeRange();
    return {
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        windowWidth: event.nativeEvent.view.innerWidth,
        windowHeight: event.nativeEvent.view.innerHeight,
        x: eventTargetOffset.left + event.nativeEvent.offsetX,
        y: eventTargetOffset.top + event.nativeEvent.offsetY,
        width: pageElement.clientWidth,
        height: pageElement.clientHeight,
        pointWithinPageElement,
        pageNum,
        pagemarks,
        areaHighlights,
        textHighlights,
        fileType,
        hasSelection,
        selectionToText,
        target: event.target,
        range
    };
}
exports.computeDocViewerContextMenuOrigin = computeDocViewerContextMenuOrigin;
exports.DocViewerMenu = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { docDescriptor } = DocViewerStore_1.useDocViewerStore(['docDescriptor']);
    const { onPagemark } = DocViewerStore_1.useDocViewerCallbacks();
    const { onAreaHighlightCreated } = AreaHighlightHooks_1.useAreaHighlightHooks();
    const annotationMutationsContext = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const annotationMetaToRefResolver = useAnnotationMetaToRefResolver();
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    const origin = props.origin;
    const onCreatePagemarkToPoint = React.useCallback(() => {
        onPagemark({
            type: 'create-to-point',
            x: origin.x,
            y: origin.y,
            width: origin.width,
            height: origin.height,
            pageNum: origin.pageNum,
            range: origin.range
        });
    }, [onPagemark, origin]);
    const onCreatePagemarkFromPage = React.useCallback(() => {
        function onDone(fromPage) {
            onPagemark(Object.assign(Object.assign({ type: 'create-from-page' }, origin), { fromPage }));
        }
        const nrPages = docDescriptor.nrPages;
        function inputValidator(value) {
            function createResult(message) {
                return { message };
            }
            if (!Numbers_1.Numbers.isNumber(value)) {
                return createResult("Input given must be a number");
            }
            const fromPage = parseInt(value);
            if (fromPage <= 0) {
                return createResult("Page must start at 1.");
            }
            if (fromPage > nrPages) {
                return createResult(`Page too large. Document is only ${nrPages} in length`);
            }
            if (fromPage > origin.pageNum) {
                return createResult("Page may not exceed " + origin.pageNum);
            }
            return undefined;
        }
        const pageLimit = Math.min(nrPages, origin.pageNum);
        dialogManager.prompt({
            title: "Create Pagemark From Page",
            description: "Enter a starting page from which to create the pagemark: ",
            placeholder: `Enter a page from 1 to ${pageLimit}`,
            type: 'number',
            autoComplete: 'off',
            inputValidator,
            onCancel: Functions_1.NULL_FUNCTION,
            onDone: (value) => onDone(parseInt(value))
        });
    }, [dialogManager, docDescriptor, onPagemark, origin]);
    const onCreateAreaHighlight = () => {
        const { pageNum, pointWithinPageElement } = origin;
        onAreaHighlightCreated({ pageNum, pointWithinPageElement });
    };
    const onDeletePagemark = (annotations) => {
        function toMutation(annotationRef) {
            return {
                type: 'delete',
                pageNum: annotationRef.pageNum,
                pagemark: annotationRef.original
            };
        }
        annotations.map(annotationMetaToRefResolver)
            .map(toMutation)
            .forEach(onPagemark);
    };
    const onDelete = (annotations) => {
        const selected = annotations.map(annotationMetaToRefResolver);
        annotationMutationsContext.onDeleted({ selected });
    };
    const onCopy = () => {
        const clipboard = Clipboards_1.Clipboards.getInstance();
        clipboard.writeText(origin.selectionToText());
    };
    const onPagemarkSetMode = (annotation) => {
        function convertPagemarkModeToOption(mode) {
            function createOption(mode, label) {
                label = label || mode.replace(/_/g, " ");
                return {
                    id: mode,
                    label,
                    value: mode
                };
            }
            switch (mode) {
                case PagemarkMode_1.PagemarkMode.PRE_READ:
                    return createOption(mode, 'PREVIOUSLY READ');
                default:
                    return createOption(mode);
            }
        }
        const options = Object.values(PagemarkMode_1.PagemarkMode).map(convertPagemarkModeToOption);
        function onDone(selected) {
            const annotationRef = annotationMetaToRefResolver(annotation);
            onPagemark({
                type: 'update-mode',
                pageNum: annotation.pageNum,
                mode: selected.value,
                existing: annotationRef.original
            });
        }
        dialogManager.select({
            title: "Set Pagemark Mode",
            description: "Change the pagemark mode which impacts the color of the pagemark and how it impacts your reading progress.",
            options,
            onCancel: Functions_1.NULL_FUNCTION,
            onDone
        });
    };
    const onPagemarkForEntireDocument = () => {
        onPagemark({
            type: 'create-for-entire-document'
        });
    };
    const isPDF = origin.fileType === 'pdf';
    return (React.createElement(React.Fragment, null,
        React.createElement(MUIMenuSubheader_1.MUIMenuSubheader, null, "Pagemarks"),
        React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "create-pagemark-to-current-location", text: "Pagemark to Current Location", icon: React.createElement(Bookmark_1.default, null), onClick: onCreatePagemarkToPoint }),
        origin.pageNum > 1 && (React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "create-pagemark-from-page-to-current-location", text: "Pagemark from Page To to Current Location", icon: React.createElement(Bookmarks_1.default, null), onClick: onCreatePagemarkFromPage })),
        React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "mark-entire-document-read", text: "Mark Entire Document as Read", icon: React.createElement(Bookmarks_1.default, null), onClick: onPagemarkForEntireDocument }),
        (((_b = (_a = props.origin) === null || _a === void 0 ? void 0 : _a.pagemarks) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0 &&
            React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "set-pagemark-mode", text: "Label Pagemark", icon: React.createElement(BookmarkBorder_1.default, null), onClick: () => onPagemarkSetMode(origin.pagemarks[0]) }),
        (((_d = (_c = props.origin) === null || _c === void 0 ? void 0 : _c.pagemarks) === null || _d === void 0 ? void 0 : _d.length) || 0) > 0 &&
            React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "delete-pagemark", text: "Delete Pagemark", icon: React.createElement(DeleteForever_1.default, null), onClick: () => onDeletePagemark(origin.pagemarks) }),
        React.createElement(MUIMenuSection_1.MUIMenuSection, { title: "Area Highlights" },
            isPDF &&
                React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "create-area-highlight", text: "Create Area Highlight", icon: React.createElement(PhotoSizeSelectLarge_1.default, null), onClick: onCreateAreaHighlight }),
            isPDF && (((_f = (_e = props.origin) === null || _e === void 0 ? void 0 : _e.areaHighlights) === null || _f === void 0 ? void 0 : _f.length) || 0) > 0 &&
                React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "delete-area-highlight", text: "Delete Area Highlight", icon: React.createElement(DeleteForever_1.default, null), onClick: () => onDelete(origin.areaHighlights) })),
        React.createElement(MUIMenuSection_1.MUIMenuSection, { title: "Text Highlights" }, (((_h = (_g = props.origin) === null || _g === void 0 ? void 0 : _g.textHighlights) === null || _h === void 0 ? void 0 : _h.length) || 0) > 0 &&
            React.createElement(MUIMenuItem_1.MUIMenuItem, { key: "delete-text-highlight", text: "Delete Text Highlight", icon: React.createElement(DeleteForever_1.default, null), onClick: () => onDelete(origin.textHighlights) }))));
};
//# sourceMappingURL=DocViewerMenu.js.map