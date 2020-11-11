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
exports.computePageDimensions = exports.useAnnotationContainers = void 0;
const React = __importStar(require("react"));
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const Functions_1 = require("polar-shared/src/util/Functions");
const DocViewerElementsContext_1 = require("../renderers/DocViewerElementsContext");
const DocViewerStore_1 = require("../DocViewerStore");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const ReactHooks_1 = require("../../../../web/js/hooks/ReactHooks");
const DocRenderer_1 = require("../renderers/DocRenderer");
function useSubscriber(subscriber) {
    const unsubscriberRef = React.useRef(undefined);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        unsubscriberRef.current = subscriber();
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        const unsubscriber = unsubscriberRef.current;
        if (unsubscriber) {
            unsubscriber();
        }
    });
}
function useScrollSubscriber(delegate) {
    const docViewerElements = DocViewerElementsContext_1.useDocViewerElementsContext();
    return () => {
        const docViewer = docViewerElements.getDocViewerElement();
        const viewerContainer = docViewer.querySelector('#viewerContainer');
        function handleScroll() {
            delegate();
        }
        const listenerOpts = { passive: true };
        viewerContainer.addEventListener('scroll', handleScroll, listenerOpts);
        function unsubscribe() {
            viewerContainer.removeEventListener('scroll', handleScroll);
        }
        return unsubscribe;
    };
}
function createResizeSubscriber(delegate) {
    return () => {
        function handleResize() {
            delegate();
        }
        window.addEventListener('resize', handleResize, { passive: true });
        function unsubscribe() {
            window.removeEventListener('resize', handleResize);
        }
        return unsubscribe;
    };
}
function useMutationObserverSubscriber(delegate) {
    const docViewerElements = DocViewerElementsContext_1.useDocViewerElementsContext();
    const { fileType } = DocRenderer_1.useDocViewerContext();
    return () => {
        if (fileType !== 'pdf') {
            return Functions_1.NULL_FUNCTION;
        }
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes") {
                    delegate();
                }
                if (mutation.type === "childList") {
                    delegate();
                }
            }
        });
        function doObserve(target) {
            observer.observe(target, {
                attributes: true,
                childList: true,
            });
            return () => {
                observer.disconnect();
            };
        }
        const pageElements = docViewerElements.getPageElements();
        const unsubscribers = pageElements.map(doObserve);
        return () => {
            unsubscribers.map(unsubscriber => unsubscriber());
        };
    };
}
function useAnnotationContainers() {
    const { page } = DocViewerStore_1.useDocViewerStore(['page']);
    const docViewerElementsContext = ReactHooks_1.useRefProvider(DocViewerElementsContext_1.useDocViewerElementsContext);
    const [annotationContainers, setAnnotationContainers] = React.useState([]);
    const doUpdateDelegate = React.useCallback(() => {
        function toAnnotationContainer(pageDescriptor) {
            const container = docViewerElementsContext.current.getContainerFromPageElement(pageDescriptor.element);
            if (!container) {
                return undefined;
            }
            return {
                pageNum: pageDescriptor.pageNum,
                pageElement: pageDescriptor.element,
                container
            };
        }
        const pageDescriptors = docViewerElementsContext.current.getPageDescriptors();
        const newAnnotationContainers = pageDescriptors.filter(current => current.loaded)
            .map(toAnnotationContainer)
            .filter(current => current !== undefined)
            .map(current => current);
        if (!react_fast_compare_1.default(annotationContainers, newAnnotationContainers)) {
            setAnnotationContainers(newAnnotationContainers);
        }
    }, [annotationContainers, docViewerElementsContext]);
    const doUpdate = React.useMemo(() => Debouncers_1.Debouncers.create(doUpdateDelegate), [doUpdateDelegate]);
    doUpdateDelegate();
    useSubscriber(useScrollSubscriber(doUpdate));
    useSubscriber(createResizeSubscriber(doUpdate));
    useSubscriber(useMutationObserverSubscriber(doUpdate));
    return annotationContainers;
}
exports.useAnnotationContainers = useAnnotationContainers;
function computePageDimensions(pageElement) {
    return {
        width: pageElement.clientWidth,
        height: pageElement.clientHeight
    };
}
exports.computePageDimensions = computePageDimensions;
//# sourceMappingURL=AnnotationHooks.js.map