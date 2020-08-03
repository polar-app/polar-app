import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "@polar-app/epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";
import {PageNavigator} from "../../PageNavigator";
import {Resizer, useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from '@polar-app/epubjs/types/section';
import blue from '@material-ui/core/colors/blue';
import {EPUBFindRenderer} from "./EPUBFindRenderer";
import {EPUBFindControllers} from "./EPUBFindControllers";
import {useDocFindCallbacks} from "../../DocFindStore";
import {IFrameEvents} from "./IFrameEvents";
import {SCALE_VALUE_PAGE_WIDTH} from '../../ScaleLevels';
import {useAnnotationBar} from '../../AnnotationBarHooks';
import './EPUBDocument.css';
import {DocViewerAnnotationRouter} from '../../DocViewerAnnotationRouter';
import useEPUBFindController = EPUBFindControllers.useEPUBFindController;
import {DocumentInit} from "../DocumentInitHook";
import {DOMTextIndexProvider} from "../../annotations/DOMTextIndexContext";
import { useEPUBDocumentStore, useEPUBDocumentCallbacks } from './EPUBDocumentStore';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import { Arrays } from 'polar-shared/src/util/Arrays';
import {Latch} from "polar-shared/src/util/Latch";

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
    IFrameEvents.forwardEvents(iframe, target);
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

        rendition.on('rendered', (event: any) => {
            incrRenderIter();
        });

        await rendition.display();

        const metadata = await book.loaded.metadata;

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        function createPageNavigator(): PageNavigator {

            const pages = spine.items.filter(current => current.linear);

            async function set(page: number) {

                const newSection = pages[page - 1];

                // we need to use a latch here because the page isn't really
                // change until it's rendered and other dependencies might
                // need to wait like highlights that depend on the page being
                // shown.
                const renderedLatch = new Latch<boolean>();
                rendition.once('rendered', () => renderedLatch.resolve(true))

                await rendition.display(newSection.index)
                await renderedLatch.get();

            }

            return {
                set,
                count: spine.items.length
            };

        }

        const pageNavigator = createPageNavigator();
        setPageNavigator(pageNavigator);

        setDocDescriptor({
            fingerprint: docMeta.docInfo.fingerprint,
            nrPages: pageNavigator.count
        });

        function createResizer(): Resizer {
            return () => {
                // FIXME: we need a resizer.  The issue now is that epub.js uses
                // width fixed based on its container size and when the sidebar
                // is resized it doesn't resize.
            };
        }

        setResizer(createResizer());

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

    useComponentDidMount(() => {
        doLoad()
            .catch(err => log.error("Could not load EPUB: ", err));
    })

    return renderIter && (
        <DOMTextIndexProvider>
            <DocumentInit/>
            <EPUBFindRenderer/>
            <DocViewerAnnotationRouter/>
            {props.children}
        </DOMTextIndexProvider>
    ) || null;

};

function useCSS() {

    const theme = useTheme();

    const baseColorStyles = {
        'color': `${theme.palette.text.primary} !important`,
        'background-color': `${theme.palette.background.default} !important`,
    };

    return {
        'body, html': {
            ...baseColorStyles,
            'font-family': `${theme.typography.fontFamily} !important`,
            'padding': '10px',
            'padding-bottom': '10px !important'
        },
        'body :not(.polar-ui)': {
            ...baseColorStyles,
        },
        'body': {
            'margin': '5px',
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
