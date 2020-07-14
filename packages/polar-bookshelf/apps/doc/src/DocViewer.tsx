import {DocViewerToolbar} from "./DocViewerToolbar";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import * as React from "react";
import {DocViewerAppURLs} from "./DocViewerAppURLs";
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
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "./DocViewerMenu";
import {createContextMenu} from "../../repository/js/doc_repo/MUIContextMenu";
import {useAnnotationBar} from "./AnnotationBarHooks";
import {Helmet} from "react-helmet";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {DocFindButton} from "./DocFindButton";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import {DocRenderer} from "./renderers/DocRenderer";
import {useLogger} from "../../../web/js/mui/MUILogger";

const Main = React.memo(() => {

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

            <div className="DocViewer.Main.Body"
                 style={{
                     minHeight: 0,
                     overflow: 'auto',
                     flexGrow: 1,
                     position: 'relative'
                 }}>

                <DocViewerContextMenu>
                    <DocMain/>
                </DocViewerContextMenu>
            </div>

        </div>
    )
})

const DocMain = React.memo(() => {

    const {docURL, docMeta} = useDocViewerStore();

    if (! docURL) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>{docMeta?.docInfo.title || ''}</title>
            </Helmet>

            <DocRenderer/>

            <TextHighlightsView />

            <AreaHighlightsView/>

            <PagemarksView/>

        </>
    )
}, isEqual);

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

namespace Device {

    interface HandheldToolbarProps {
        readonly toggleRightDrawer: () => void;
    }

    const HandheldToolbar = React.memo((props: HandheldToolbarProps) => {

        return (
            <MUIPaperToolbar borderBottom>
            <div style={{
                     display: 'flex',
                     alignItems: 'center'
                 }}
                 className="p-1">

                <div style={{
                         display: 'flex',
                         flexGrow: 1,
                         flexBasis: 0,
                         alignItems: 'center'
                     }}
                     className="">

                    <DocFindButton className="mr-1"/>
                </div>

                <div style={{alignItems: 'center'}}>
                    <IconButton onClick={props.toggleRightDrawer}>
                        <MenuIcon/>
                    </IconButton>
                </div>

            </div>
            </MUIPaperToolbar>
        )
    });

    export const Handheld = React.memo(() => {

        const [open, setOpen] = React.useState(false);

        return (
            <>

                <SwipeableDrawer
                    anchor='right'
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}>

                    <AnnotationSidebar2 />

                </SwipeableDrawer>

                <div className="DocViewer.Handheld"
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         flexGrow: 1,
                         minHeight: 0
                     }}>

                    <HandheldToolbar toggleRightDrawer={() => setOpen(!open)}/>

                    {/*<DocToolbar/>*/}

                    <Main/>

                </div>
            </>
        );
    }, isEqual);

    export const Desktop = React.memo(() => {

        const {resizer, docMeta} = useDocViewerStore();

        function onDockLayoutResize() {

            if (resizer) {
                resizer();
            }

        }

        return (

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

                    <DockLayout
                        onResize={() => onDockLayoutResize()}
                        dockPanels={[
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
                                width: 350,
                            }
                        ]}/>
                </div>

            </div>

        );
    });

}


export const DocViewer = React.memo(() => {

    const log = useLogger();
    const {setDocMeta} = useDocViewerCallbacks();
    const {docURL} = useDocViewerStore();
    const persistenceLayerContext = usePersistenceLayerContext()

    useAnnotationBar();

    // TODO: I think I can have hard wired types for state transition functions
    // like an uninitialized store, with missing values, then an initialized one
    // with a different 'type' value.

    useComponentDidMount(() => {

        const handleLoad = async () => {

            // TODO: do this in a root context component so we could make
            // this into a component that takes props, not just a URL.
            const parsedURL = DocViewerAppURLs.parse(document.location.href);

            if (! parsedURL) {
                console.warn("Could not parse URL: " + document.location.href)
                return;
            }

            // FIXME useSnapshotSubscriber for this so that we don't have to worry
            // about component unmount.

            const persistenceLayer
                = persistenceLayerContext.persistenceLayerProvider();

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

    if (! docURL) {
        return <LoadingProgress/>
    }

    return (
        <DeviceRouter handheld={<Device.Handheld/>}
                      desktop={<Device.Desktop/>}/>
    )

}, isEqual);



