import {DocToolbar} from "./DocToolbar";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import {OnFinderCallback, PDFDocument} from "./PDFDocument";
import * as React from "react";
import {ViewerContainer} from "./ViewerContainer";
import {Logger} from "polar-shared/src/logger/Logger";
import {PDFAppURLs} from "./PDFAppURLs";
import {LoadingProgress} from "../../../web/js/ui/LoadingProgress";
import {TextHighlightsView} from "./annotations/TextHighlightsView";
import {AnnotationSidebar2} from "../../../web/js/annotation_sidebar/AnnotationSidebar2";
import {PagemarkProgressBar} from "./PagemarkProgressBar";
import {AreaHighlightsView} from "./annotations/AreaHighlightsView";
import {PagemarksView} from "./annotations/PagemarksView";
import {useComponentDidMount} from "../../../web/js/hooks/lifecycle";
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import isEqual from "react-fast-compare";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {DocFindBar} from "./DocFindBar";
import {DocViewerGlobalHotKeys} from "./DocViewerGlobalHotKeys";
import {useDocFindCallbacks} from "./DocFindStore";
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "./DocViewerMenu";
import {createContextMenu} from "../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import {useAnnotationBar} from "./AnnotationBarHooks";

const log = Logger.create();

interface MainProps {
    readonly onFinder: OnFinderCallback;
}

const Main = React.memo((props: MainProps) => {

    const {docURL} = useDocViewerStore();

    if (! docURL) {
        return null;
    }

    return (
        <>
            <ViewerContainer/>

            <PDFDocument
                onFinder={props.onFinder}
                target="viewerContainer"
                url={docURL}/>

            <TextHighlightsView />

            <AreaHighlightsView/>

            <PagemarksView/>

        </>
    )
}, isEqual);

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

export const DocViewer = React.memo(() => {

    const {setDocMeta} = useDocViewerCallbacks();
    const {resizer, docURL, docMeta} = useDocViewerStore();
    const persistenceLayerContext = usePersistenceLayerContext()

    const {setFinder} = useDocFindCallbacks();

    useAnnotationBar();

    // FIXME: I think I can have hard wired types for state transition functions
    // like an uninitialized store, with missing values, then an initialized
    // one with a different 'type' value.

    useComponentDidMount(() => {

        const handleLoad = async () => {

            // TODO: do this in a root context component so we could make
            // this into a component that takes props, not just a URL.
            const parsedURL = PDFAppURLs.parse(document.location.href);

            if (! parsedURL) {
                console.log("No parsed URL")
                return;
            }

            // FIXME useSnapshotSubscriber for this so that we don't have to worry
            // about component unmount.
            // FIXME use a Progress control so the page shows itself loading state

            const persistenceLayer
                = persistenceLayerContext.persistenceLayerProvider();

            // FIXME: load the file too

            // FIXME: unsubscribe on component unmount
            // FIXME not getting intial snapshot
            const snapshotResult = await persistenceLayer.getDocMetaSnapshot({
                fingerprint: parsedURL.id,
                onSnapshot: (snapshot => {
                    // TODO/FIXME: we need a better way to flag that the
                    // document was deleted vs not initialized.
                    setDocMeta(snapshot.data!);
                }),
                onError: (err) => {
                    log.error("Could not handle snapshot: ", err);
                }

            });

        };

        handleLoad()
            .catch(err => log.error(err));

    });

    function onDockLayoutResize() {

        if (resizer) {
            resizer();
        }

    }

    if (! docURL) {
        return <LoadingProgress/>
    }

    return (

        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
                 minHeight: 0
             }}>

            <DocToolbar/>

            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     flexGrow: 1,
                     minHeight: 0
                 }}>

                <DockLayout
                    onResize={() => onDockLayoutResize()}
                    dockPanels={[
                    {
                        id: "dock-panel-viewer",
                        type: 'grow',
                        style: {
                            display: 'flex'
                        },
                        component:
                            <div style={{
                                    flexGrow: 1,
                                    minHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                <PagemarkProgressBar/>
                                <DocViewerGlobalHotKeys/>
                                <DocFindBar/>

                                <div style={{
                                        minHeight: 0,
                                        overflow: 'auto',
                                        flexGrow: 1,
                                        position: 'relative'
                                     }}>

                                    <DocViewerContextMenu>
                                        <Main onFinder={setFinder}/>
                                    </DocViewerContextMenu>
                                </div>

                            </div>
                    },
                    {
                        id: "doc-panel-sidebar",
                        type: 'fixed',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            flexGrow: 1
                        },
                        component:
                            <>
                            {docMeta &&
                                <AnnotationSidebar2 />}
                            </>,
                        width: 300,
                    }
                ]}/>
            </div>

        </div>

    );
}, isEqual);



