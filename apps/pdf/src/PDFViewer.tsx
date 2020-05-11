import {PDFToolbar} from "./PDFToolbar";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import {
    PDFDocMeta,
    PDFDocument,
    PDFPageNavigator,
    Resizer,
    ScaleLeveler
} from "./PDFDocument";
import * as React from "react";
import {ViewerContainer} from "./ViewerContainer";
import {Finder, FindHandler} from "./Finders";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {FindToolbar} from "./FindToolbar";
import {Logger} from "polar-shared/src/logger/Logger";
import {PDFScaleLevelTuple} from "./PDFScaleLevels";
import {PersistenceLayerProvider} from "../../../web/js/datastore/PersistenceLayer";
import {PDFAppURLs} from "./PDFAppURLs";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocMetaFileRefs} from "../../../web/js/datastore/DocMetaRef";
import {Backend} from "polar-shared/src/datastore/Backend";
import {URLStr} from "polar-shared/src/util/Strings";
import {LoadingProgress} from "../../../web/js/ui/LoadingProgress";
import {TextHighlightsView} from "./annotations/TextHighlightsView";
import {AnnotationSidebar2} from "../../../web/js/annotation_sidebar/AnnotationSidebar2";
import {PagemarkProgressBar} from "./PagemarkProgressBar";
import {AreaHighlightsView} from "./annotations/AreaHighlightsView";
import {PagemarksView} from "./annotations/PagemarksView";
import {Tag} from "polar-shared/src/tags/Tags";
import {useComponentDidMount} from "../../../web/js/hooks/lifecycle";
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import isEqual from "react-fast-compare";
import { useAnnotationSidebarStore } from "./AnnotationSidebarStore";

const log = Logger.create();

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

interface IState {
    readonly finder?: Finder;
    readonly findActive?: boolean;
    readonly findHandler?: FindHandler;
    readonly resizer?: Resizer;
    readonly pdfDocMeta?: PDFDocMeta
    readonly pdfPageNavigator?: PDFPageNavigator;
    readonly scaleLeveler?: ScaleLeveler;
}

const globalKeyMap = {
    FIND: 'command+f'
};

export const PDFViewer = React.memo((props: IProps) => {

    const [state, setState] = React.useState<IState>({});

    const callbacks = useDocViewerCallbacks();
    const store = useDocViewerStore();

    const annotationSidebarStore = useAnnotationSidebarStore();

    // FIXME: I think I can have hard wired types for state transition functions
    // like an uninitialized store, with missing values, then an initialized
    // one with a different 'type' value.

    useComponentDidMount(() => {

        const handleLoad = async () => {

            const parsedURL = PDFAppURLs.parse(document.location.href);

            if (! parsedURL) {
                console.log("No parsed URL")
                return;
            }

            // FIXME use DataLoader with this ...
            // FIXME use a Progress control so the page shows itself loading state

            const persistenceLayer = props.persistenceLayerProvider();

            // FIXME: load the file too

            // FIXME: unsubscribe on component unmount
            // FIXME not getting intial snapshot
            const snapshotResult = await persistenceLayer.getDocMetaSnapshot({
                fingerprint: parsedURL.id,
                onSnapshot: (snapshot => {
                    // TODO/FIXME: we need a better way to flag that the
                    // document was deleted vs not initialized.
                    callbacks.setDocMeta(snapshot.data!);
                }),
                onError: (err) => {
                    log.error("Could not handle snapshot: ", err);
                }

            });

        };

        handleLoad()
            .catch(err => log.error(err));

    });

    function onFinder(finder: Finder) {

        setState({
                     ...state,
                     finder
                 })

    }

    function onFind() {

        setState({
                          ...state,
                          findActive: true
                      })

    }

    function onFindExecute(query: string) {

        if (state.findHandler) {
            // there's already a find handler so that means there's an active
            // search so we should run the search 'again' to find the next match

            state.findHandler.again();
            return;
        }

        const doHandle = async () => {

            const opts = {
                query,
                phraseSearch: false,
                caseSensitive: false,
                highlightAll: true,
                findPrevious: false
            };

            const findHandler = await state.finder!.exec(opts);

            setState({...state, findHandler});

        };

        doHandle().catch(err => log.error(err));

    }

    function onFindCancel() {

        state.findHandler?.cancel();

        setState({
                          ...state,
                          findActive: false,
                          findHandler: undefined
                      });

    }

    function onDockLayoutResize() {
        if (state.resizer) {
            state.resizer();
        }
    }

    // function requestFullScreen() {
    //     document.body.requestFullscreen()
    //             .catch(err => log.error(err));
    // }
    //
    //
    // function exitFullScreen() {
    //     document.exitFullscreen()
    //             .catch(err => log.error(err));
    // }

    function onResizer(resizer: () => void) {
        setState({
                          ...state,
                          resizer
                      })
    }

    function onPDFDocMeta(pdfDocMeta: PDFDocMeta) {
        setState({
                          ...state,
                          pdfDocMeta
                      });
    }

    function onPDFPageNavigator(pdfPageNavigator: PDFPageNavigator) {
        setState({
                          ...state,
                          pdfPageNavigator
                      });
    }

    function doPageNav(delta: number) {

        const {pdfPageNavigator, pdfDocMeta} = state;

        if (! pdfPageNavigator || ! pdfDocMeta) {
            return;
        }

        const page = pdfPageNavigator.get() + delta;

        if (page <= 0) {
            // invalid page as we requested to jump too low
            return;
        }

        if (page > pdfDocMeta.nrPages) {
            // went past the end.
            return;
        }

        pdfPageNavigator.set(page);

    }

    function onPageNext() {
        doPageNav(1);
    }

    function onPagePrev() {
        doPageNav(-1);
    }

    function onPageJump(page: number) {

        const {pdfPageNavigator} = state;

        if (pdfPageNavigator) {
            pdfPageNavigator.set(page);
        }

    }

    function onScaleLeveler(scaleLeveler: ScaleLeveler) {
        setState({
                          ...state,
                          scaleLeveler
                      })
    }

    function onScale(scale: PDFScaleLevelTuple) {
        state.scaleLeveler!(scale);
    }


    // const globalKeyHandlers = {
    //     FIND: () => onFind()
    // };

    if (! store.docURL) {
        return <LoadingProgress/>
    }

    return (

        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
                 minHeight: 0
             }}>

            <PDFToolbar pdfDocMeta={state.pdfDocMeta}
                        onScale={scale => onScale(scale)}
                        onFullScreen={NULL_FUNCTION}
                        onPageNext={() => onPageNext()}
                        onPagePrev={() => onPagePrev()}
                        onPageJump={page => onPageJump(page)}
                        onFind={() => onFind()}/>

            <FindToolbar active={state.findActive}
                         onCancel={() => onFindCancel()}
                         onExecute={query => onFindExecute(query)}/>

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

                                <PagemarkProgressBar docMeta={store.docMeta!}/>

                                <div style={{
                                        minHeight: 0,
                                        overflow: 'auto',
                                        flexGrow: 1,
                                        position: 'relative'
                                     }}>

                                    <ViewerContainer/>

                                    <PDFDocument
                                        onFinder={finder => onFinder(finder)}
                                        target="viewerContainer"
                                        onResizer={resizer => onResizer(resizer)}
                                        onPDFDocMeta={pdfDocMeta => onPDFDocMeta(pdfDocMeta)}
                                        onPDFPageNavigator={pdfPageNavigator => onPDFPageNavigator(pdfPageNavigator)}
                                        onScaleLeveler={scaleLeveler => onScaleLeveler(scaleLeveler)}
                                        url={store.docURL}/>

                                    <TextHighlightsView docMeta={store.docMeta}
                                                        scaleValue={state.pdfDocMeta?.scaleValue}/>

                                    <AreaHighlightsView docMeta={store.docMeta}
                                                        scaleValue={state.pdfDocMeta?.scaleValue}/>

                                    <PagemarksView docMeta={store.docMeta}
                                                   scaleValue={state.pdfDocMeta?.scaleValue}/>

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
                            {store.docMeta &&
                                <AnnotationSidebar2
                                                   doc={{
                                                       docInfo: store.docMeta.docInfo,
                                                       docMeta: store.docMeta,
                                                       permission: {mode: 'rw'},
                                                       mutable: true,
                                                       oid: 123,
                                                   }}
                                                   data={annotationSidebarStore.data}
                                                   view={annotationSidebarStore.view}
                                                   tagsProvider={props.tagsProvider}
                                                   persistenceLayerProvider={props.persistenceLayerProvider}/>}
                            </>,
                        width: 300,
                    }
                ]}/>
            </div>

        </div>

    );
}, isEqual);
