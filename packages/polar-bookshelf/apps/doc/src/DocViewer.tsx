import {DocViewerToolbar} from "./toolbar/DocViewerToolbar";
import * as React from "react";
import {DocViewerAppURLs} from "./DocViewerAppURLs";
import {LoadingProgress} from "../../../web/js/ui/LoadingProgress";
import {TextHighlightsView} from "./annotations/TextHighlightsView";
import {PagemarkProgressBar} from "./PagemarkProgressBar";
import {AreaHighlightsView} from "./annotations/AreaHighlightsView";
import {PagemarksView} from "./annotations/PagemarksView";
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import isEqual from "react-fast-compare";
import {DocFindBar} from "./DocFindBar";
import {DocViewerGlobalHotKeys} from "./DocViewerGlobalHotKeys";
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "./DocViewerMenu";
import {createContextMenu} from "../../repository/js/doc_repo/MUIContextMenu";
import {Helmet} from "react-helmet";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {DocFindButton} from "./DocFindButton";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import {DocRenderer, DocViewerContext} from "./renderers/DocRenderer";
import {ViewerContainerProvider} from "./ViewerContainerStore";
import {FileTypes} from "../../../web/js/apps/main/file_loaders/FileTypes";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {useStateRef, useRefValue} from "../../../web/js/hooks/ReactHooks";
import {NoDocument} from "./NoDocument";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import {Outliner} from "./outline/Outliner";
import {useDocViewerSnapshot} from "./UseDocViewerSnapshot";
import {useZenModeResizer} from "./ZenModeResizer";
import {useDocumentViewerVisible} from "./renderers/UseSidenavDocumentChangeCallbackHook";
import {SidenavTriggerIconButton} from "../../../web/js/sidenav/SidenavTriggerIconButton";
import {SideCar} from "../../../web/js/sidenav/SideNav";
import {AreaHighlightModeToggle} from "./toolbar/AreaHighlightModeToggle";
import {AnnotationSidebar} from "../../../web/js/annotation_sidebar/AnnotationSidebar";
import {useFirestore} from "../../repository/js/FirestoreProvider";
import {BlockContent, useBlocksStore} from "../../../web/js/notes/store/BlocksStore";
import {DocumentContent} from "../../../web/js/notes/content/DocumentContent";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {AnnotationContent, AnnotationHighlightContent} from "../../../web/js/notes/content/AnnotationContent";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IComment} from "polar-shared/src/metadata/IComment";
import {MarkdownContent} from "../../../web/js/notes/content/MarkdownContent";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {DocAnnotationLoader2} from "../../../web/js/annotation_sidebar/DocAnnotationLoader2";
import {IDocAnnotationRef} from "../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationBlockMigrator} from "./AnnotationBlockMigrator";
import {useAnnotationBlockManager} from "../../../web/js/notes/HighlightBlocksHooks";
import {BlockContentStructure} from "../../../web/js/notes/HTMLToBlocks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockHighlights} from "../../../web/js/notes/BlockHighlights";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useSideNavCallbacks} from "../../../web/js/sidenav/SideNavStore";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AccountTreeIcon from '@material-ui/icons/AccountTree';

export const NEW_NOTES_ANNOTATION_BAR_ENABLED = LocalStorageFeatureToggles.get('notes.docs-integration');

const Main = React.memo(function Main() {

    return (

        <div className="DocViewer.Main"
             style={{
                 flexGrow: 1,
                 minHeight: 0,
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            <PagemarkProgressBar/>
            <DocViewerGlobalHotKeys/>
            <DocFindBar/>

            <div id="docviewer-main-body" className="DocViewer.Main.Body"
                 style={{
                     minHeight: 0,
                     overflow: 'auto',
                     flexGrow: 1,
                     position: 'relative'
                 }}>

                <DeviceRouter
                    handheld={<DocMain/>}
                    desktop={(
                        <DocViewerContextMenu>
                            <DocMain/>
                        </DocViewerContextMenu>
                    )}
                />
            </div>

        </div>
    )
})

const DocMain = React.memo(function DocMain() {

    const {docURL, docMeta} = useDocViewerStore(['docURL', 'docMeta']);
    const isVisible = useDocumentViewerVisible(docMeta?.docInfo.fingerprint || '');

    if (! docURL) {
        return null;
    }

    return (
        <>
            {isVisible &&
                <Helmet>
                    <title>Polar: { docMeta?.docInfo.title }</title>
                </Helmet>
            }
            <DocRenderer>
                <>
                    <TextHighlightsView />

                    <AreaHighlightsView/>

                    <PagemarksView/>
                </>
            </DocRenderer>

        </>
    )
}, isEqual);

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

namespace Device {

    interface HandheldToolbarProps {
        readonly toggleRightDrawer: () => void;
    }

    const HandheldToolbar = React.memo(function HandheldToolbar(props: HandheldToolbarProps) {

        const {closeCurrentTab} = useSideNavCallbacks();

        return (
            <AppBar position="static">
                <Toolbar>
                    <div style={{
                             display: 'flex',
                             alignItems: 'center',
                             flexGrow: 1,
                         }}>

                        <div style={{
                                 display: 'flex',
                                 flexGrow: 1,
                                 flexBasis: 0,
                                 alignItems: 'center'
                             }}
                             className="">

                            <IconButton onClick={() => closeCurrentTab()}>
                                <ArrowBackIcon/>
                            </IconButton>

                            <DocFindButton size="medium"/>

                            <SidenavTriggerIconButton icon={<AccountTreeIcon/>}/>

                        </div>

                        <div style={{ alignItems: 'center', display: 'flex' }}>
                            <AreaHighlightModeToggle />
                            <IconButton onClick={props.toggleRightDrawer}>
                                <MenuIcon/>
                            </IconButton>
                        </div>

                    </div>
                </Toolbar>
            </AppBar>
        )
    });

    export const Handheld = React.memo(function Handheld() {

        const [open, setOpen] = React.useState(false);

        return (
            <>

                {/*<SwipeableDrawer*/}
                {/*    anchor='left'*/}
                {/*    open={open}*/}
                {/*    onClose={() => setOpen(false)}*/}
                {/*    onOpen={() => setOpen(true)}>*/}

                {/*    <Outliner />*/}

                {/*</SwipeableDrawer>*/}
                <SideCar>
                    <Outliner/>
                </SideCar>

                <SwipeableDrawer
                    anchor='right'
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}>

                    <AnnotationSidebar />

                </SwipeableDrawer>

                <div className="DocViewer.Handheld"
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         flexGrow: 1,
                         minHeight: 0
                     }}>

                    <HandheldToolbar toggleRightDrawer={() => setOpen(!open)}/>

                    {/* <DocToolbar/> */}

                    <Main/>

                </div>
            </>
        );
    }, isEqual);

    export const Desktop = React.memo(function Desktop() {

        const {resizer} = useDocViewerStore(['resizer']);

        const resizerRef = useRefValue(resizer);

        const onDockLayoutResize = React.useCallback(() => {

            if (resizerRef.current) {
                resizerRef.current();
            } else {
                console.warn("No resizer");
            }

        }, [resizerRef]);

        return (

            <DockLayout.Root
                onResize={onDockLayoutResize}
                dockPanels={[
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
                        component: (
                            <Outliner/>
                        ),
                        width: 410,
                    },
                    {
                        id: "dock-panel-viewer",
                        type: 'grow',
                        style: {
                            display: 'flex'
                        },
                        component: <Main/>
                    },
                    {
                        id: "doc-panel-sidebar",
                        type: 'fixed',
                        side: 'right',
                        collapsed: true,
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            flexGrow: 1
                        },
                        component: <AnnotationSidebar />,
                        width: 410,
                    }
                ]}>
                <>
                    <div className="DocViewer.Desktop"
                         style={{
                             display: 'flex',
                             flexDirection: 'column',
                             flexGrow: 1,
                             minHeight: 0
                         }}>

                        <DocViewerToolbar/>

                        <div className="DocViewer.Desktop.Body"
                             style={{
                                 display: 'flex',
                                 flexDirection: 'column',
                                 flexGrow: 1,
                                 minHeight: 0
                             }}>

                            <DockLayout.Main/>
                        </div>

                    </div>
                </>
            </DockLayout.Root>

        );
    });

}

const DocViewerMain = deepMemo(function DocViewerMain() {

    useZenModeResizer();

    return (
        <DeviceRouter handheld={<Device.Handheld/>}
                      desktop={<Device.Desktop/>}/>
    );

});

interface DocViewerParentProps {
    readonly docID: string;
    readonly children: React.ReactNode;
}

const DocViewerParent = deepMemo((props: DocViewerParentProps) => (
    <div data-doc-viewer-id={props.docID}
         style={{
             display: 'flex',
             minHeight: 0,
             overflow: 'auto',
             flexGrow: 1,
         }}>
        {props.children}
    </div>
));

const useDocumentBlockMigrator = () => {
    const { docMeta } = useDocViewerStore(['docMeta']);
    const { firestore, user } = useFirestore();
    const blocksStore = useBlocksStore();
    const migratedRef = React.useRef(false);
    const dialogs = useDialogManager();
    const { persistenceLayerProvider } = usePersistenceLayerContext();
    const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
    const annotationBlockManager = useAnnotationBlockManager();

    React.useEffect(() => {
        if (migratedRef.current || ! docMeta || ! user || ! NEW_NOTES_ANNOTATION_BAR_ENABLED) {
            return;
        }

        migratedRef.current = true;

        const fingerprint = docMeta.docInfo.fingerprint;

        const blockExists = async () => {
            const { size } = await firestore
                .collection('block')
                .where('content.type', '==', 'document')
                .where('content.docInfo.fingerprint', '==', fingerprint)
                .where('nspace', '==', user.uid)
                .get();

            return size !== 0;
        };

        const createDocumentBlock = (): BlockIDStr => {
            const tags = Object.entries(docMeta.docInfo.tags || {})
                .reduce((acc, [key, tag]) => ({ ...acc, [key]: { ...tag, source: 'self' } }), {});

            const links = AnnotationBlockMigrator.tagsToLinks(blocksStore, tags);

            const docInfo = { ...docMeta.docInfo };
            delete docInfo.tags;

            return blocksStore.createNewNamedBlock({
                content: new DocumentContent({
                    type: "document",
                    docInfo,
                    links,
                })
            });
        };

        const generateAnnotationBlocks = (annotations: ReadonlyArray<IDocAnnotationRef>): ReadonlyArray<BlockContentStructure> =>
            arrayStream(annotations)
                .map((annotation) => {
                    const content = migrateAnnotation(annotation);

                    return content ? {
                        content: content,
                        children: generateAnnotationBlocks(annotation.children())
                    } : null;
                })
                .filterPresent()
                .collect();

        const migrateAnnotation = (annotation: IDocAnnotationRef): BlockContent | null => {
            const links = annotation.tags
                ? AnnotationBlockMigrator.tagsToLinks(blocksStore, annotation.tags)
                : [];

            const getContent = (): AnnotationContent | MarkdownContent | null => {
                switch (annotation.annotationType) {
                    case AnnotationType.TEXT_HIGHLIGHT:
                        return AnnotationBlockMigrator
                            .migrateTextHighlight(
                                annotation.original as ITextHighlight,
                                annotation.pageNum,
                                fingerprint,
                                links,
                            );
                    case AnnotationType.AREA_HIGHLIGHT:
                        return AnnotationBlockMigrator
                            .migrateAreaHighlight(
                                annotation.original as IAreaHighlight,
                                annotation.pageNum,
                                fingerprint,
                                links,
                            );
                    case AnnotationType.FLASHCARD:
                        return AnnotationBlockMigrator
                            .migrateFlashcard(
                                annotation.original as IFlashcard,
                                annotation.pageNum,
                                fingerprint,
                                links,
                            );
                    case AnnotationType.COMMENT:
                        const wikiLinks = AnnotationBlockMigrator.linksToMarkdown(links);
                        const markdown = AnnotationBlockMigrator.textToMarkdown((annotation.original as IComment).content);
                        return new MarkdownContent({
                            type: 'markdown',
                            links: [],
                            data: `${markdown} ${wikiLinks}`,
                        });
                    default:
                        return null;
                }
            };

            const content = getContent();

            return content;
        };

        const migrate = async () => {
            const exists = await blockExists();

            if (! exists) {
                const annotations = DocAnnotationLoader2
                    .load(docMeta, docFileResolver)
                    .map(DocAnnotations.toRef);
                const documentBlockID = createDocumentBlock();

                const contentStructure = generateAnnotationBlocks(annotations)
                    .filter((data): data is BlockContentStructure<AnnotationHighlightContent> => (
                        data.content.type === AnnotationContentType.AREA_HIGHLIGHT
                        || data.content.type === AnnotationContentType.TEXT_HIGHLIGHT
                    ))
                    .map(data => ({ ...data, id: Hashcodes.createRandomID() }));

                const sorted = BlockHighlights.sortByPositionInDocument(docMeta, contentStructure);

                blocksStore.insertFromBlockContentStructure(sorted, { ref: documentBlockID });

                dialogs.snackbar({
                    message: "Migrating your annotations to the new format. This may take some time!",
                    type: "info",
                });
            }
        };

        migrate()
            .catch(console.error);
    }, [docMeta, user, blocksStore, dialogs, docFileResolver, firestore, migratedRef, annotationBlockManager]);
};

export const DocViewer = deepMemo(function DocViewer() {

    const {docURL} = useDocViewerStore(['docURL']);
    const {setDocMeta} = useDocViewerCallbacks();
    const parsedURL = React.useMemo(() => DocViewerAppURLs.parse(document.location.href), []);
    const [exists, setExists, existsRef] = useStateRef<boolean | undefined>(undefined);
    useDocumentBlockMigrator();

    const snapshot = useDocViewerSnapshot(parsedURL?.id);

    React.useEffect(() => {

        if (snapshot) {

            if (existsRef.current !== snapshot.exists) {
                setExists(snapshot.exists)
            }

            if (snapshot.docMeta) {

                function computeType() {
                    return snapshot?.hasPendingWrites ? 'snapshot-local' : 'snapshot-server';
                }

                const type = computeType();

                setDocMeta(snapshot.docMeta, snapshot.hasPendingWrites, type);

            }

        }


    }, [existsRef, setDocMeta, setExists, snapshot]);

    if (parsedURL === undefined || exists === false) {
        return <NoDocument/>;
    }

    const docID = parsedURL.id;

    if (docURL === undefined) {
        return (
            <>
                <LoadingProgress/>
            </>
        )
    }

    const fileType = FileTypes.create(docURL);

    return (
        <DocViewerParent docID={docID}>
            <DocViewerContext.Provider value={{fileType, docID}}>
                <ViewerContainerProvider>
                    <DocViewerMain/>
                </ViewerContainerProvider>
            </DocViewerContext.Provider>
        </DocViewerParent>
    );

});



