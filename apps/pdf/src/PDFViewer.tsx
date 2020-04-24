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
import {GlobalHotKeys} from "react-hotkeys";
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

const log = Logger.create();

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
    readonly finder?: Finder;
    readonly findActive?: boolean;
    readonly findHandler?: FindHandler;
    readonly resizer?: Resizer;
    readonly pdfDocMeta?: PDFDocMeta
    readonly pdfPageNavigator?: PDFPageNavigator;
    readonly scaleLeveler?: ScaleLeveler;
    readonly docMeta?: IDocMeta;
    readonly docURL?: URLStr;
}

const globalKeyMap = {
    FIND: 'command+f'
};

export class PDFViewer extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);

        this.onFinder = this.onFinder.bind(this);
        this.onFind = this.onFind.bind(this);
        this.onFindExecute = this.onFindExecute.bind(this);
        this.onDockLayoutResize = this.onDockLayoutResize.bind(this);
        this.onResizer = this.onResizer.bind(this);
        this.onPDFDocMeta = this.onPDFDocMeta.bind(this);
        this.onPDFPageNavigator = this.onPDFPageNavigator.bind(this);
        this.onPageNext = this.onPageNext.bind(this);
        this.onPagePrev = this.onPagePrev.bind(this);
        this.onPageJump = this.onPageJump.bind(this);
        this.doPageNav = this.doPageNav.bind(this);
        this.onScale = this.onScale.bind(this);

        this.state = {
        }

    }

    public componentDidMount(): void {

        const handleLoad = async () => {

            const parsedURL = PDFAppURLs.parse(document.location.href);

            if (! parsedURL) {
                console.log("No parsed URL")
                return;
            }

            // FIXME use DataLoader with this ...
            // FIXME use a Progress control so the page shows itself loading state

            const persistenceLayer = this.props.persistenceLayerProvider();

            // FIXME: load the file too

            // FIXME: unsubscribe on component unmount
            // FIXME not getting intial snapshot
            const snapshotResult = await persistenceLayer.getDocMetaSnapshot({
                fingerprint: parsedURL.id,
                onSnapshot: (snapshot => this.onDocMeta(snapshot.data)),
                onError: (err) => {
                    log.error("Could not handle snapshot: ", err);
                }

            });

        };

        handleLoad().catch(err => log.error(err));

    }

    public render() {

        const globalKeyHandlers = {
            FIND: () => this.onFind()
        };

        if (! this.state.docURL) {
            return <LoadingProgress/>
        }

        return (

            <GlobalHotKeys
                keyMap={globalKeyMap}
                handlers={globalKeyHandlers}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0
                }}>

                <PDFToolbar pdfDocMeta={this.state.pdfDocMeta}
                            onScale={scale => this.onScale(scale)}
                            onFullScreen={NULL_FUNCTION}
                            onPageNext={() => this.onPageNext()}
                            onPagePrev={() => this.onPagePrev()}
                            onPageJump={page => this.onPageJump(page)}
                            onFind={() => this.onFind()}/>

                <FindToolbar active={this.state.findActive}
                             onCancel={() => this.onFindCancel()}
                             onExecute={query => this.onFindExecute(query)}/>

                <div style={{
                         display: 'flex',
                         flexDirection: 'column',
                         flexGrow: 1,
                         minHeight: 0
                     }}>

                    <DockLayout
                        onResize={() => this.onDockLayoutResize()}
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

                                    <PagemarkProgressBar docMeta={this.state.docMeta!}/>

                                    <div style={{
                                            minHeight: 0,
                                            overflow: 'auto',
                                            flexGrow: 1,
                                            position: 'relative'
                                         }}>

                                        <ViewerContainer/>

                                        <PDFDocument
                                            onFinder={finder => this.onFinder(finder)}
                                            target="viewerContainer"
                                            onResizer={resizer => this.onResizer(resizer)}
                                            onPDFDocMeta={pdfDocMeta => this.onPDFDocMeta(pdfDocMeta)}
                                            onPDFPageNavigator={pdfPageNavigator => this.onPDFPageNavigator(pdfPageNavigator)}
                                            onScaleLeveler={scaleLeveler => this.onScaleLeveler(scaleLeveler)}
                                            url={this.state.docURL}/>

                                        <TextHighlightsView docMeta={this.state.docMeta}
                                                            scaleValue={this.state.pdfDocMeta?.scaleValue}/>

                                        <AreaHighlightsView docMeta={this.state.docMeta}
                                                            scaleValue={this.state.pdfDocMeta?.scaleValue}/>

                                        <PagemarksView docMeta={this.state.docMeta}
                                                       scaleValue={this.state.pdfDocMeta?.scaleValue}/>

                                    </div>

                                </div>
                        },
                        {
                            id: "doc-panel-sidebar",
                            type: 'fixed',
                            component:
                                <>
                                {this.state.docMeta &&
                                    <AnnotationSidebar2
                                                       doc={{
                                                           docInfo: this.state.docMeta.docInfo,
                                                           docMeta: this.state.docMeta,
                                                           permission: {mode: 'rw'},
                                                           mutable: true,
                                                           oid: 123,
                                                       }}
                                                       tagsProvider={() => []}
                                                       persistenceLayerProvider={this.props.persistenceLayerProvider}/>}
                                </>,
                            width: 300,
                            style: {
                                overflow: 'none'
                            }
                        }
                    ]}/>
                </div>

            </GlobalHotKeys>

        );
    }

    private onFinder(finder: Finder) {

        this.setState({
            ...this.state,
            finder
        })

    }

    private onFind() {

        this.setState({
            ...this.state,
            findActive: true
        })

    }

    private onFindExecute(query: string) {

        if (this.state.findHandler) {
            // there's already a find handler so that means there's an active
            // search so we should run the search 'again' to find the next match

            this.state.findHandler.again();
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

            const findHandler = await this.state.finder!.exec(opts);

            this.setState({...this.state, findHandler});

        };

        doHandle().catch(err => log.error(err));

    }

    private onFindCancel() {

        this.state.findHandler?.cancel();

        this.setState({
            ...this.state,
            findActive: false,
            findHandler: undefined
        });

    }

    private onDockLayoutResize() {
        if (this.state.resizer) {
            this.state.resizer();
        }
    }

    private requestFullScreen() {
        document.body.requestFullscreen()
            .catch(err => log.error(err));
    }


    private exitFullScreen() {
        document.exitFullscreen()
            .catch(err => log.error(err));
    }

    private onResizer(resizer: () => void) {
        this.setState({
            ...this.state,
            resizer
        })
    }

    private onPDFDocMeta(pdfDocMeta: PDFDocMeta) {
        this.setState({
            ...this.state,
            pdfDocMeta
        });
    }

    private onPDFPageNavigator(pdfPageNavigator: PDFPageNavigator) {
        this.setState({
            ...this.state,
            pdfPageNavigator
        });
    }

    private doPageNav(delta: number) {

        const {pdfPageNavigator, pdfDocMeta} = this.state;

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

    private onPageNext() {
        this.doPageNav(1);
    }

    private onPagePrev() {
        this.doPageNav(-1);
    }

    private onPageJump(page: number) {

        const {pdfPageNavigator} = this.state;

        if (pdfPageNavigator) {
            pdfPageNavigator.set(page);
        }

    }

    private onScaleLeveler(scaleLeveler: ScaleLeveler) {
        this.setState({
            ...this.state,
            scaleLeveler
        })
    }

    private onScale(scale: PDFScaleLevelTuple) {
        this.state.scaleLeveler!(scale);
    }

    private onDocMeta(docMeta: IDocMeta | undefined) {

        const computeDocURL = (): URLStr | undefined => {

            if (docMeta) {

                const docMetaFileRef = DocMetaFileRefs.createFromDocMeta(docMeta);
                const persistenceLayer = this.props.persistenceLayerProvider();

                if (docMetaFileRef.docFile) {
                    const file = persistenceLayer.getFile(Backend.STASH, docMetaFileRef.docFile);
                    return file.url;
                }

            }

            return undefined;

        };

        const docURL = computeDocURL();

        this.setState({
            ...this.state,
            docURL,
            docMeta
        });


    }
}
