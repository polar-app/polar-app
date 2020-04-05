import {PDFToolbar} from "./PDFToolbar";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import {
    PDFDocMeta,
    PDFDocument,
    Resizer,
    PDFPageNavigator,
    ScaleLeveler, PDFScaleLevelTuple
} from "./PDFDocument";
import {TextAreaHighlight} from "./TextAreaHighlight";
import * as React from "react";
import {ViewerContainer} from "./ViewerContainer";
import {Finder, FindHandler} from "./Finders";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {FindToolbar} from "./FindToolbar";
import {Logger} from "polar-shared/src/logger/Logger";
import {GlobalHotKeys} from "react-hotkeys";

const log = Logger.create();

interface IProps {

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
        this.doPageNav = this.doPageNav.bind(this);
        this.onScale = this.onScale.bind(this);

        this.state = {
        }

    }

    public render() {

        const globalKeyHandlers = {
            FIND: () => this.onFind()
        };

        return (

            <GlobalHotKeys
                keyMap={globalKeyMap}
                handlers={globalKeyHandlers}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                }}>

                <PDFToolbar pdfDocMeta={this.state.pdfDocMeta}
                            onScale={scale => this.onScale(scale)}
                            onFullScreen={NULL_FUNCTION}
                            onPageNext={() => this.onPageNext()}
                            onPagePrev={() => this.onPagePrev()}
                            onFind={() => this.onFind()}/>

                <FindToolbar active={this.state.findActive}
                             onCancel={() => this.onFindCancel()}
                             onExecute={query => this.onFindExecute(query)}/>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                }}>

                    <DockLayout
                        onResize={() => this.onDockLayoutResize()}
                        dockPanels={[
                        {
                            id: "dock-panel-viewer",
                            type: 'grow',
                            style: {
                                position: 'relative'
                            },
                            component:
                                <div>

                                    <ViewerContainer/>

                                    <PDFDocument
                                        onFinder={finder => this.onFinder(finder)}
                                        target="viewerContainer"
                                        onResizer={resizer => this.onResizer(resizer)}
                                        onPDFDocMeta={pdfDocMeta => this.onPDFDocMeta(pdfDocMeta)}
                                        onPDFPageNavigator={pdfPageNavigator => this.onPDFPageNavigator(pdfPageNavigator)}
                                        onScaleLeveler={scaleLeveler => this.onScaleLeveler(scaleLeveler)}
                                        url="./test.pdf"/>

                                    <TextAreaHighlight/>

                                </div>
                        },
                        {
                            id: "doc-panel-sidebar",
                            type: 'fixed',
                            component: <div>this is the right panel</div>,
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

    private onScaleLeveler(scaleLeveler: ScaleLeveler) {
        this.setState({
            ...this.state,
            scaleLeveler
        })
    }

    private onScale(scale: PDFScaleLevelTuple) {
        this.state.scaleLeveler!(scale);
    }
}
