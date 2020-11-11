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
exports.DocViewer = void 0;
const DocViewerToolbar_1 = require("./toolbar/DocViewerToolbar");
const React = __importStar(require("react"));
const DocViewerAppURLs_1 = require("./DocViewerAppURLs");
const LoadingProgress_1 = require("../../../web/js/ui/LoadingProgress");
const TextHighlightsView_1 = require("./annotations/TextHighlightsView");
const AnnotationSidebar2_1 = require("../../../web/js/annotation_sidebar/AnnotationSidebar2");
const PagemarkProgressBar_1 = require("./PagemarkProgressBar");
const AreaHighlightsView_1 = require("./annotations/AreaHighlightsView");
const PagemarksView_1 = require("./annotations/PagemarksView");
const ReactLifecycleHooks_1 = require("../../../web/js/hooks/ReactLifecycleHooks");
const DocViewerStore_1 = require("./DocViewerStore");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const PersistenceLayerApp_1 = require("../../repository/js/persistence_layer/PersistenceLayerApp");
const DocFindBar_1 = require("./DocFindBar");
const DocViewerGlobalHotKeys_1 = require("./DocViewerGlobalHotKeys");
const DocViewerMenu_1 = require("./DocViewerMenu");
const MUIContextMenu_1 = require("../../repository/js/doc_repo/MUIContextMenu");
const react_helmet_1 = require("react-helmet");
const DeviceRouter_1 = require("../../../web/js/ui/DeviceRouter");
const SwipeableDrawer_1 = __importDefault(require("@material-ui/core/SwipeableDrawer"));
const DocFindButton_1 = require("./DocFindButton");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Menu_1 = __importDefault(require("@material-ui/icons/Menu"));
const MUIPaperToolbar_1 = require("../../../web/js/mui/MUIPaperToolbar");
const DocRenderer_1 = require("./renderers/DocRenderer");
const MUILogger_1 = require("../../../web/js/mui/MUILogger");
const ViewerContainerStore_1 = require("./ViewerContainerStore");
const FileTypes_1 = require("../../../web/js/apps/main/file_loaders/FileTypes");
const ReactUtils_1 = require("../../../web/js/react/ReactUtils");
const ReactHooks_1 = require("../../../web/js/hooks/ReactHooks");
const NoDocument_1 = require("./NoDocument");
const DockLayout2_1 = require("../../../web/js/ui/doc_layout/DockLayout2");
const Outliner_1 = require("./outline/Outliner");
const FeedbackButton2_1 = require("../../repository/js/ui/FeedbackButton2");
const Main = React.memo(() => {
    return (React.createElement("div", { className: "DocViewer.Main", style: {
            flexGrow: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
        } },
        React.createElement(PagemarkProgressBar_1.PagemarkProgressBar, null),
        React.createElement(DocViewerGlobalHotKeys_1.DocViewerGlobalHotKeys, null),
        React.createElement(DocFindBar_1.DocFindBar, null),
        React.createElement("div", { className: "DocViewer.Main.Body", style: {
                minHeight: 0,
                overflow: 'auto',
                flexGrow: 1,
                position: 'relative'
            } },
            React.createElement(DocViewerContextMenu, null,
                React.createElement(DocMain, null)))));
});
const DocMain = React.memo(() => {
    const { docURL, docMeta } = DocViewerStore_1.useDocViewerStore(['docURL', 'docMeta']);
    if (!docURL) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(react_helmet_1.Helmet, null,
            React.createElement("title", null, (docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo.title) || '')),
        React.createElement(DocRenderer_1.DocRenderer, null,
            React.createElement(React.Fragment, null,
                React.createElement(TextHighlightsView_1.TextHighlightsView, null),
                React.createElement(AreaHighlightsView_1.AreaHighlightsView, null),
                React.createElement(PagemarksView_1.PagemarksView, null)))));
}, react_fast_compare_1.default);
const DocViewerContextMenu = MUIContextMenu_1.createContextMenu(DocViewerMenu_1.DocViewerMenu, { computeOrigin: DocViewerMenu_1.computeDocViewerContextMenuOrigin });
var Device;
(function (Device) {
    const HandheldToolbar = React.memo((props) => {
        return (React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true },
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center'
                }, className: "p-1" },
                React.createElement("div", { style: {
                        display: 'flex',
                        flexGrow: 1,
                        flexBasis: 0,
                        alignItems: 'center'
                    }, className: "" },
                    React.createElement(DocFindButton_1.DocFindButton, { className: "mr-1" })),
                React.createElement("div", { style: { alignItems: 'center' } },
                    React.createElement(IconButton_1.default, { onClick: props.toggleRightDrawer },
                        React.createElement(Menu_1.default, null))))));
    });
    Device.Handheld = React.memo(() => {
        const [open, setOpen] = React.useState(false);
        return (React.createElement(React.Fragment, null,
            React.createElement(SwipeableDrawer_1.default, { anchor: 'right', open: open, onClose: () => setOpen(false), onOpen: () => setOpen(true) },
                React.createElement(AnnotationSidebar2_1.AnnotationSidebar2, null)),
            React.createElement("div", { className: "DocViewer.Handheld", style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0
                } },
                React.createElement(HandheldToolbar, { toggleRightDrawer: () => setOpen(!open) }),
                React.createElement(Main, null))));
    }, react_fast_compare_1.default);
    Device.Desktop = React.memo(() => {
        const { resizer, docMeta } = DocViewerStore_1.useDocViewerStore(['resizer', 'docMeta']);
        const resizerRef = ReactHooks_1.useRefValue(resizer);
        const onDockLayoutResize = React.useCallback(() => {
            if (resizerRef.current) {
                resizerRef.current();
            }
            else {
                console.warn("No resizer");
            }
        }, [resizerRef]);
        return (React.createElement("div", { className: "DocViewer.Desktop", style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: 0
            } },
            React.createElement(DocViewerToolbar_1.DocViewerToolbar, null),
            React.createElement(FeedbackButton2_1.FeedbackButton2, null),
            React.createElement("div", { className: "DocViewer.Desktop.Body", style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0
                } },
                React.createElement(DockLayout2_1.DockLayout2, { onResize: onDockLayoutResize, dockPanels: [
                        {
                            id: "doc-panel-outline",
                            type: 'fixed',
                            side: 'left',
                            collapsed: true,
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                                flexGrow: 1
                            },
                            component: (React.createElement(Outliner_1.Outliner, null)),
                            width: 410,
                        },
                        {
                            id: "dock-panel-viewer",
                            type: 'grow',
                            style: {
                                display: 'flex'
                            },
                            component: React.createElement(Main, null)
                        },
                        {
                            id: "doc-panel-sidebar",
                            type: 'fixed',
                            side: 'right',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                                flexGrow: 1
                            },
                            component: React.createElement(React.Fragment, null, docMeta &&
                                React.createElement(AnnotationSidebar2_1.AnnotationSidebar2, null)),
                            width: 410,
                        }
                    ] }))));
    });
})(Device || (Device = {}));
const DocViewerMain = ReactUtils_1.deepMemo(() => {
    return (React.createElement(DeviceRouter_1.DeviceRouter, { handheld: React.createElement(Device.Handheld, null), desktop: React.createElement(Device.Desktop, null) }));
});
const DocViewerParent = ReactUtils_1.deepMemo((props) => (React.createElement("div", { "data-doc-viewer-id": props.docID, style: {
        display: 'flex',
        minHeight: 0,
        overflow: 'auto',
        flexGrow: 1,
    } }, props.children)));
exports.DocViewer = ReactUtils_1.deepMemo(() => {
    const { docURL } = DocViewerStore_1.useDocViewerStore(['docURL']);
    const { setDocMeta } = DocViewerStore_1.useDocViewerCallbacks();
    const log = MUILogger_1.useLogger();
    const persistenceLayerContext = PersistenceLayerApp_1.usePersistenceLayerContext();
    const parsedURL = React.useMemo(() => DocViewerAppURLs_1.DocViewerAppURLs.parse(document.location.href), []);
    const [exists, setExists, existsRef] = ReactHooks_1.useRefState(undefined);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        const handleLoad = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!parsedURL) {
                console.warn("Could not parse URL: " + document.location.href);
                return;
            }
            const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();
            const snapshotResult = yield persistenceLayer.getDocMetaSnapshot({
                fingerprint: parsedURL.id,
                onSnapshot: (snapshot => {
                    function computeType() {
                        return snapshot.hasPendingWrites ? 'snapshot-local' : 'snapshot-server';
                    }
                    if (existsRef.current !== snapshot.exists) {
                        setExists(snapshot.exists);
                    }
                    const type = computeType();
                    setDocMeta(snapshot.data, snapshot.hasPendingWrites, type);
                }),
                onError: (err) => {
                    log.error("Could not handle snapshot: ", err);
                }
            });
        });
        handleLoad()
            .catch(err => log.error(err));
    });
    if (exists === false) {
        return React.createElement(NoDocument_1.NoDocument, null);
    }
    if (!docURL || !parsedURL) {
        return React.createElement(LoadingProgress_1.LoadingProgress, null);
    }
    const fileType = FileTypes_1.FileTypes.create(docURL);
    const docID = parsedURL.id;
    return (React.createElement(DocViewerParent, { docID: docID },
        React.createElement(DocRenderer_1.DocViewerContext.Provider, { value: { fileType, docID } },
            React.createElement(ViewerContainerStore_1.ViewerContainerProvider, null,
                React.createElement(DocViewerMain, null)))));
});
//# sourceMappingURL=DocViewer.js.map