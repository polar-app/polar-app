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
import {computeDocViewerContextMenuOrigin, DocViewerMenu, IDocViewerContextMenuOrigin} from "./DocViewerMenu";
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
import {useRefValue, useStateRef} from "../../../web/js/hooks/ReactHooks";
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
import {useBlocksStore} from "../../../web/js/notes/store/BlocksStore";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {DocMetaBlockContents} from "polar-migration-block-annotations/src/DocMetaBlockContents";
import {useAnnotationBlockManager} from "../../../web/js/notes/HighlightBlocksHooks";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useSideNavCallbacks} from "../../../web/js/sidenav/SideNavStore";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import {PagePrevButton} from "./toolbar/PagePrevButton";
import {PageNextButton} from "./toolbar/PageNextButton";
import {createStyles, makeStyles} from "@material-ui/core";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";

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
            <AppBar color={"inherit"} position="static">
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

                            <PagePrevButton size="medium"/>

                            <PageNextButton size="medium"/>

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

    export const useHandheldStyles = makeStyles(() =>
        createStyles({
            paper: { width: '100vw', overflow: 'hidden' },
        })
    );

    export const Handheld = React.memo(function Handheld() {

        const [open, setOpen] = React.useState(false);
        const classes = useHandheldStyles();

        return (
            <>
                <SideCar>
                    <Outliner/>
                </SideCar>

                <SwipeableDrawer
                    anchor='right'
                    classes={{ paper: classes.paper }}
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

        if (migratedRef.current || ! docMeta || ! user) {
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

        const migrate = async () => {
            const exists = await blockExists();

            if (! exists) {
                const namedBlocksIDs = Object.values(blocksStore.indexByName);
                const namedBlocks = blocksStore
                    .createSnapshot(namedBlocksIDs)
                    .filter((block): block is IBlock<INamedContent> =>
                        ['document', 'name', 'date'].indexOf(block.content.type) > -1);

                const { docContentStructure, tagContentsStructure } = DocMetaBlockContents
                    .getFromDocMeta(docMeta, namedBlocks);

                blocksStore.insertFromBlockContentStructure([
                    docContentStructure,
                    ...tagContentsStructure,
                ], { isUndoable: false });

                dialogs.snackbar({
                    message: "Migrating your annotations to the new format. This may take some time!",
                    type: "info",
                });
            }
        };

        migrate()
            .catch(console.error);
    }, [
        docMeta,
        user,
        blocksStore,
        dialogs,
        docFileResolver,
        firestore,
        migratedRef,
        annotationBlockManager,
    ]);
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



