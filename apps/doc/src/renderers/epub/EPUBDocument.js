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
exports.EPUBDocument = void 0;
const react_1 = __importDefault(require("react"));
const ReactLifecycleHooks_1 = require("../../../../../web/js/hooks/ReactLifecycleHooks");
const epubjs_1 = __importStar(require("epubjs"));
const DocViewerStore_1 = require("../../DocViewerStore");
const EPUBFindRenderer_1 = require("./EPUBFindRenderer");
const EPUBFindControllers_1 = require("./EPUBFindControllers");
const DocFindStore_1 = require("../../DocFindStore");
const IFrameEventForwarder_1 = require("./IFrameEventForwarder");
const ScaleLevels_1 = require("../../ScaleLevels");
const AnnotationBarHooks_1 = require("../../AnnotationBarHooks");
require("./EPUBDocument.css");
const DocumentInitHook_1 = require("../DocumentInitHook");
const DOMTextIndexContext_1 = require("../../annotations/DOMTextIndexContext");
const EPUBDocumentStore_1 = require("./EPUBDocumentStore");
const MUILogger_1 = require("../../../../../web/js/mui/MUILogger");
const DocViewerElementsContext_1 = require("../DocViewerElementsContext");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const Latch_1 = require("polar-shared/src/util/Latch");
const WindowHooks_1 = require("../../../../../web/js/react/WindowHooks");
const EPUBContextMenuRoot_1 = require("./contextmenu/EPUBContextMenuRoot");
const EPUBDocumentHooks_1 = require("./EPUBDocumentHooks");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const AnnotationLinks_1 = require("../../../../../web/js/annotation_sidebar/AnnotationLinks");
var useEPUBFindController = EPUBFindControllers_1.EPUBFindControllers.useEPUBFindController;
const LinkLoaderHook_1 = require("../../../../../web/js/ui/util/LinkLoaderHook");
const Nonces_1 = require("polar-shared/src/util/Nonces");
const Numbers_1 = require("polar-shared/src/util/Numbers");
function forwardEvents(target) {
    const iframe = target.querySelector('iframe');
    IFrameEventForwarder_1.IFrameEventForwarder.start(iframe, target);
}
function handleLinkClicks(target, linkLoader) {
    const iframe = target.querySelector('iframe');
    const links = Array.from(iframe.contentDocument.querySelectorAll('a'));
    for (const link of links) {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href) {
                return;
            }
            if (!href.startsWith('http')) {
                return;
            }
            console.log("linkClicked: ", href);
            linkLoader(href, { focus: true, newWindow: true });
            event.stopPropagation();
            event.preventDefault();
        });
    }
}
exports.EPUBDocument = (props) => {
    const { docURL, docMeta } = props;
    const { setDocDescriptor, setPageNavigator, setDocScale, setResizer, setFluidPagemarkFactory, setPage, setOutline, setOutlineNavigator } = DocViewerStore_1.useDocViewerCallbacks();
    const { setFinder } = DocFindStore_1.useDocFindCallbacks();
    const { renderIter } = EPUBDocumentStore_1.useEPUBDocumentStore(['renderIter']);
    const { incrRenderIter, setSection } = EPUBDocumentStore_1.useEPUBDocumentCallbacks();
    const finder = useEPUBFindController();
    const annotationBarInjector = AnnotationBarHooks_1.useAnnotationBar({ noRectTexts: true });
    const docViewerElements = DocViewerElementsContext_1.useDocViewerElementsContext();
    const epubResizer = useEPUBResizer();
    const log = MUILogger_1.useLogger();
    const sectionRef = react_1.default.useRef(undefined);
    const stylesheet = EPUBDocumentHooks_1.useStylesheetURL();
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    function doLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            function doInitialCallbacks() {
                setFinder(finder);
                setDocScale({ scale: ScaleLevels_1.SCALE_VALUE_PAGE_WIDTH, scaleValue: 1.0 });
            }
            doInitialCallbacks();
            const book = epubjs_1.default(docURL);
            const pageElement = Arrays_1.Arrays.first(docViewerElements.getPageElements());
            if (!pageElement) {
                throw new Error("No page element");
            }
            const rendition = book.renderTo(pageElement, {
                flow: "scrolled-doc",
                width: '100%',
                resizeOnOrientationChange: false,
                stylesheet,
            });
            rendition.on('locationChanged', (event) => {
                console.log('epubjs event: locationChanged', event);
            });
            function createResizer() {
                return () => {
                    epubResizer();
                };
            }
            const resizer = createResizer();
            setResizer(resizer);
            rendition.on('resize', () => {
                console.error("epubjs event: resize", new Error("FAIL: this should not happen"));
            });
            rendition.on('resized', () => {
                console.error("epubjs event: resized", new Error("FAIL: this should not happen"));
            });
            rendition.on('rendered', (section) => {
                console.log('epubjs event: rendered: ');
                epubResizer();
                handleSection(section);
                forwardEvents(pageElement);
                handleLinkClicks(pageElement, linkLoader);
                annotationBarInjector();
                incrRenderIter();
            });
            const spine = (yield book.loaded.spine);
            const pages = spine.items.filter(current => current.linear);
            function handleSection(section) {
                function computePageNumberFromSection() {
                    const sectionIndex = ArrayStreams_1.arrayStream(pages)
                        .withIndex()
                        .filter(current => current.value.index === section.index)
                        .first();
                    return (sectionIndex === null || sectionIndex === void 0 ? void 0 : sectionIndex.index) ? (sectionIndex === null || sectionIndex === void 0 ? void 0 : sectionIndex.index) + 1 : undefined;
                }
                setSection(section);
                sectionRef.current = section;
                const pageNumberFromSection = computePageNumberFromSection();
                if (pageNumberFromSection) {
                    setPage(pageNumberFromSection);
                }
            }
            function createPageNavigator() {
                let page = 1;
                const count = pages.length;
                function get() {
                    return page;
                }
                function jumpToPage(newPage) {
                    return __awaiter(this, void 0, void 0, function* () {
                        page = newPage;
                        const newSection = pages[newPage - 1];
                        function displayAndWaitForRender() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const renderedLatch = new Latch_1.Latch();
                                rendition.once('rendered', () => renderedLatch.resolve(true));
                                yield rendition.display(newSection.index);
                                yield renderedLatch.get();
                            });
                        }
                        function updateURL() {
                            document.location.hash = '#page=' + newPage;
                        }
                        yield displayAndWaitForRender();
                        handleSection(newSection);
                        updateURL();
                    });
                }
                return { count, jumpToPage, get };
            }
            function createFluidPagemarkFactory() {
                function create(opts) {
                    if (!opts.range) {
                        return undefined;
                    }
                    const cfiBase = sectionRef.current.cfiBase;
                    const epubCFI = new epubjs_1.EpubCFI(opts.range, cfiBase);
                    const anchor = {
                        type: 'epubcfi',
                        value: epubCFI.toString()
                    };
                    function computeRange() {
                        var _a, _b, _c, _d, _e, _f;
                        switch (opts.direction) {
                            case "top":
                                return {
                                    start: anchor,
                                    end: (_b = (_a = opts.existing) === null || _a === void 0 ? void 0 : _a.range) === null || _b === void 0 ? void 0 : _b.end
                                };
                            case "bottom":
                                return {
                                    start: (_d = (_c = opts.existing) === null || _c === void 0 ? void 0 : _c.range) === null || _d === void 0 ? void 0 : _d.start,
                                    end: anchor
                                };
                            default:
                                return {
                                    start: (_f = (_e = opts.existing) === null || _e === void 0 ? void 0 : _e.range) === null || _f === void 0 ? void 0 : _f.start,
                                    end: anchor
                                };
                        }
                    }
                    const range = computeRange();
                    if (!range) {
                        return undefined;
                    }
                    return { range };
                }
                return { create };
            }
            const pageNavigator = createPageNavigator();
            setPageNavigator(pageNavigator);
            const fluidPagemarkFactory = createFluidPagemarkFactory();
            setFluidPagemarkFactory(fluidPagemarkFactory);
            const annotationLink = AnnotationLinks_1.AnnotationLinks.parse(document.location);
            yield pageNavigator.jumpToPage((annotationLink === null || annotationLink === void 0 ? void 0 : annotationLink.page) || 1);
            setDocDescriptor({
                fingerprint: docMeta.docInfo.fingerprint,
                nrPages: pageNavigator.count
            });
            const metadata = yield book.loaded.metadata;
            console.log({ metadata });
            const navigation = yield book.loaded.navigation;
            function createOutline() {
                function toOutline(item) {
                    const id = Numbers_1.Numbers.toString(nonceFactory());
                    return {
                        id,
                        title: item.label,
                        destination: item.href,
                        children: (item.subitems || []).map(toOutline)
                    };
                }
                const nonceFactory = Nonces_1.Nonces.createFactory();
                const items = navigation.toc.map(toOutline);
                return { items };
            }
            setOutline(createOutline());
            setOutlineNavigator((destination) => __awaiter(this, void 0, void 0, function* () {
                yield rendition.display(destination);
            }));
            console.log("landmarks: ", navigation.landmarks);
            console.log("toc: ", navigation.toc);
            const pageList = yield book.loaded.pageList;
            console.log("pageList: ", pageList);
            const manifest = yield book.loaded.manifest;
            console.log("manifest: ", manifest);
            console.log("Loaded epub");
        });
    }
    WindowHooks_1.useWindowResizeEventListener(epubResizer);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        doLoad()
            .catch(err => log.error("Could not load EPUB: ", err));
    });
    return renderIter && (react_1.default.createElement(DOMTextIndexContext_1.DOMTextIndexProvider, null,
        react_1.default.createElement(DocumentInitHook_1.DocumentInit, null),
        react_1.default.createElement(EPUBFindRenderer_1.EPUBFindRenderer, null),
        react_1.default.createElement(EPUBContextMenuRoot_1.EPUBContextMenuRoot, null),
        props.children)) || null;
};
function useEPUBResizer() {
    const docViewerElements = DocViewerElementsContext_1.useDocViewerElementsContext();
    return () => {
        console.log("Resizing EPUB");
        const docViewer = docViewerElements.getDocViewerElement();
        function computeContainerDimensions() {
            const element = docViewer.querySelector(".page");
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            return { width, height };
        }
        function setWidth(element, dimensions) {
            if (element) {
                element.style.width = `${dimensions.width}px`;
                element.style.height = `${dimensions.height}px`;
            }
            else {
                console.warn("Can not set element style (no element)");
            }
        }
        function adjustEpubView(dimensions) {
            const element = docViewer.querySelector(".epub-view");
            if (element) {
                setWidth(element, dimensions);
            }
        }
        function adjustIframe(dimensions) {
            const element = docViewer.querySelector(".epub-view iframe");
            setWidth(element, dimensions);
        }
        function adjustIframeBody(dimensions) {
            var _a;
            const iframe = docViewer.querySelector(".epub-view iframe");
            const body = (_a = iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body;
            setWidth(body, dimensions);
            iframe.contentDocument.body.style.width = 'auto';
            iframe.contentDocument.body.style.height = 'auto';
        }
        const dimensions = computeContainerDimensions();
        adjustEpubView(dimensions);
        adjustIframe(dimensions);
        adjustIframeBody(dimensions);
        console.log("Resized to dimensions: ", dimensions);
    };
}
//# sourceMappingURL=EPUBDocument.js.map