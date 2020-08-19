import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/ReactLifecycleHooks";
import ePub from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";
import {PageNavigator} from "../../PageNavigator";
import {Resizer, useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from 'epubjs/types/section';
import blue from '@material-ui/core/colors/blue';
import {EPUBFindRenderer} from "./EPUBFindRenderer";
import {EPUBFindControllers} from "./EPUBFindControllers";
import {useDocFindCallbacks} from "../../DocFindStore";
import {IFrameEventForwarder} from "./IFrameEventForwarder";
import {SCALE_VALUE_PAGE_WIDTH} from '../../ScaleLevels';
import {useAnnotationBar} from '../../AnnotationBarHooks';
import './EPUBDocument.css';
import useEPUBFindController = EPUBFindControllers.useEPUBFindController;
import {DocumentInit} from "../DocumentInitHook";
import {DOMTextIndexProvider} from "../../annotations/DOMTextIndexContext";
import { useEPUBDocumentStore, useEPUBDocumentCallbacks } from './EPUBDocumentStore';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import { Arrays } from 'polar-shared/src/util/Arrays';
import {Latch} from "polar-shared/src/util/Latch";
import {useResizeEventListener} from "../../../../../web/js/react/WindowHooks";
import { IDimensions } from 'polar-shared/src/util/IDimensions';
import {DarkModeScrollbars} from "../../../../../web/js/mui/css/DarkModeScrollbars";
import {EPUBContextMenuRoot} from "./contextmenu/EPUBContextMenuRoot";

interface IProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
    readonly children: React.ReactNode;
}

interface ExtendedSpine {
    readonly items: ReadonlyArray<Section>;
}

// FIXME how do I pre-filter the HTML to reject XSS attacks...

function forwardEvents(target: HTMLElement) {
    // this is needed because keyboard events and other events ould be swallowed
    // by the iframe.

    const iframe = target.querySelector('iframe')! as HTMLIFrameElement;
    IFrameEventForwarder.start(iframe, target);
}

export const EPUBDocument = (props: IProps) => {

    const {docURL, docMeta} = props;

    const {setDocDescriptor, setPageNavigator, setDocScale, setResizer}
        = useDocViewerCallbacks();

    const {setFinder}
        = useDocFindCallbacks();

    const {renderIter}
        = useEPUBDocumentStore(['renderIter'])

    const {incrRenderIter}
        = useEPUBDocumentCallbacks()

    const css = useCSS();
    const finder = useEPUBFindController();
    const annotationBarInjector = useAnnotationBar({noRectTexts: true});
    const docViewerElements = useDocViewerElementsContext();
    const epubResizer = useEPUBResizer();
    const log = useLogger();


    async function doLoad() {

        function doInitialCallbacks() {

            setFinder(finder);

            // the doc scale needs to be set to that we're 1.0 as epub doesn't support
            // scale just yet.
            setDocScale({scale: SCALE_VALUE_PAGE_WIDTH, scaleValue: 1.0});

        }

        doInitialCallbacks();

        const book = ePub(docURL);

        const pageElement = Arrays.first(docViewerElements.getPageElements());

        if (! pageElement) {
            throw new Error("No page element");
        }

        // TODO:
        //
        // test no width but set the iframe CSS style to width

        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
            resizeOnOrientationChange: false
            // width: '400px',
            // height: '100%',
            // layout: 'pre-paginated'
        });

        function applyCSS() {
            rendition.themes.default(css);
        }

        rendition.on('locationChanged', (event: any) => {
            // noop... this is called when the location of the book is changed
            // so we can use it to re-attach annotations.

            forwardEvents(pageElement);
            applyCSS();
            annotationBarInjector();

        });

        function createResizer(): Resizer {
            return () => {
                epubResizer()
            };
        }

        const resizer = createResizer();
        setResizer(resizer);

        rendition.on('resize', (event: any) => {
            console.error("epubjs: resize", new Error("FAIL: this should not happen"));
        });

        rendition.on('resized', (event: any) => {
            console.error("epubjs: resized", new Error("FAIL: this should not happen"));
        });

        rendition.on('rendered', (event: any) => {
            incrRenderIter();
            epubResizer();
        });

        await rendition.display();

        const metadata = await book.loaded.metadata;

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        function createPageNavigator(): PageNavigator {

            let page: number = 1;
            const pages = spine.items.filter(current => current.linear);
            const count = pages.length;

            function get(): number {
                return page;
            }

            async function set(newPage: number) {

                page = newPage;
                const newSection = pages[newPage - 1];

                // we need to use a latch here because the page isn't really
                // change until it's rendered and other dependencies might
                // need to wait like highlights that depend on the page being
                // shown.
                const renderedLatch = new Latch<boolean>();
                rendition.once('rendered', () => renderedLatch.resolve(true))

                await rendition.display(newSection.index)
                await renderedLatch.get();

            }

            return {count, set, get};

        }

        const pageNavigator = createPageNavigator();
        setPageNavigator(pageNavigator);

        setDocDescriptor({
            fingerprint: docMeta.docInfo.fingerprint,
            nrPages: pageNavigator.count
        });

        console.log({metadata});

        const navigation = await book.loaded.navigation;

        console.log("landmarks: ", navigation.landmarks);

        console.log("toc: ", navigation.toc);

        const pageList = await book.loaded.pageList;

        console.log("pageList: ", pageList);

        const manifest = await book.loaded.manifest;

        console.log("manifest: ", manifest);

        console.log("Loaded epub");

    }

    useResizeEventListener(epubResizer);

    useComponentDidMount(() => {
        doLoad()
            .catch(err => log.error("Could not load EPUB: ", err));
    })

    return renderIter && (
        <DOMTextIndexProvider>
            <DocumentInit/>
            <EPUBFindRenderer/>
            <EPUBContextMenuRoot/>
            {props.children}
        </DOMTextIndexProvider>
    ) || null;

};


function useEPUBResizer() {

    const docViewerElements = useDocViewerElementsContext();

    return () => {

        const docViewer = docViewerElements.getDocViewerElement();

        function computeContainerDimensions(): IDimensions {
            const element = docViewer.querySelector(".page") as HTMLElement;
            const width = element!.offsetWidth;
            const height = element!.offsetHeight;
            return {width, height}
        }

        function setWidth(element: HTMLElement, dimensions: IDimensions) {
            element.style.width = `${dimensions.width}px`;
            element.style.height = `${dimensions.height}px`;
        }

        function adjustEpubView(dimensions: IDimensions) {
            const element = docViewer.querySelector(".epub-view") as HTMLElement;
            setWidth(element, dimensions);
        }

        function adjustIframe(dimensions: IDimensions) {
            const element = docViewer.querySelector(".epub-view iframe") as HTMLElement;
            setWidth(element, dimensions);
        }

        function adjustIframeBody(dimensions: IDimensions) {
            const iframe = docViewer.querySelector(".epub-view iframe") as HTMLIFrameElement;
            setWidth(iframe.contentDocument!.body, dimensions);


            // this epub padding and I can't figure out where    this is being set.
            // iframe.contentDocument!.documentElement.style.padding = '0';
            // iframe.contentDocument!.body.style.padding = '5px';

            iframe.contentDocument!.body.style.width = 'auto';
            iframe.contentDocument!.body.style.height = 'auto';

        }

        const dimensions = computeContainerDimensions();
        adjustEpubView(dimensions);
        adjustIframe(dimensions);
        adjustIframeBody(dimensions);

        console.log("Resized to dimensions: ", dimensions);

    }

}


function useCSS() {

    const theme = useTheme();

    const darkModeScrollbars = theme.palette.type === 'dark' ?
                               DarkModeScrollbars.createCSS() :
                               {};

    const color = theme.palette.type === 'dark' ? 'rgb(217, 217, 217)' : theme.palette.text.primary;

    const baseColorStyles = {
        'color': `${color} !important`,
        'background-color': `${theme.palette.background.default} !important`,
    };

    const paddingStyles = {
        "padding-top": "10px",
        "padding-bottom": "10px",
        "padding-left": "10px",
        "padding-right": "10px",
        "padding": "10px",
    }

    return {

        ...darkModeScrollbars,
        'body, html': {
            ...baseColorStyles,
            'font-family': `${theme.typography.fontFamily} !important`,
            'padding': '0px',
            'padding-bottom': '5px !important',
            'max-width': '800px !important',
            'margin-left': 'auto !important',
            'margin-right': 'auto !important',
            'margin-bottom': '5px !important'
        },
        'body :not(.polar-ui)': {
            ...baseColorStyles,
        },
        'body': {
            'margin': '5px',
            ...paddingStyles
        },
        'html': {
            ...paddingStyles
        },
        'h1, h2, h3': {
            'color': `${theme.palette.text.primary}`
        },

        'header h2': {

        },

        'header > figure': {
            margin: '0px',
            display: 'flex'
        },

        'header > figure > img': {
            // height: '100%',
            // width: '100%',
            // 'object-fit': 'contain'
            'margin-left': 'auto',
            'margin-right': 'auto',
            'max-height': '100% !important',
            'max-width': '100% !important',
        },

        "a:link": {
            color: blue[300],
        },
        "a:visited": {
            color: blue[600],
        },
        "a:hover": {
            color: blue[400],
        },
        "a:active": {
            color: blue[500],
        },

    };

}
