import React, {useEffect, useState} from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/ReactLifecycleHooks";
import ePub, {EpubCFI, Rendition} from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import {PageNavigator} from "../../PageNavigator";
import {Resizer, useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from 'epubjs/types/section';
import {EPUBFindRenderer} from "./EPUBFindRenderer";
import {EPUBFindControllers} from "./EPUBFindControllers";
import {useDocFindCallbacks} from "../../DocFindStore";
import {IFrameEventForwarder} from "./IFrameEventForwarder";
import {SCALE_VALUE_PAGE_WIDTH, ScaleLevelTuple} from '../../ScaleLevels';
import './EPUBDocument.css';
import {DocumentInit} from "../DocumentInitHook";
import {DOMTextIndexProvider} from "../../annotations/DOMTextIndexContext";
import {useEPUBDocumentCallbacks, useEPUBDocumentStore} from './EPUBDocumentStore';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import {Latch} from "polar-shared/src/util/Latch";
import {useWindowResizeEventListener} from "../../../../../web/js/react/WindowHooks";
import {IDimensions} from 'polar-shared/src/util/IDimensions';
import {EPUBContextMenuRoot} from "./contextmenu/EPUBContextMenuRoot";
import {FluidPagemarkCreateOpts, FluidPagemarkFactory, IFluidPagemark} from "../../FluidPagemarkFactory";
import {IPagemarkRange} from "polar-shared/src/metadata/IPagemarkRange";
import {useStylesheetURL} from "./EPUBDocumentHooks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {AnnotationLinks} from "../../../../../web/js/annotation_sidebar/AnnotationLinks";
import {IPagemarkAnchor} from "polar-shared/src/metadata/IPagemarkAnchor";
import {LinkLoaderDelegate, useLinkLoader} from "../../../../../web/js/ui/util/LinkLoaderHook";
import {IOutlineItem} from "../../outline/IOutlineItem";
import {Nonces} from "polar-shared/src/util/Nonces";
import {Numbers} from "polar-shared/src/util/Numbers";
import {NavItem} from 'epubjs/types/navigation';
import {Devices} from 'polar-shared/src/util/Devices';
import {useFirestorePrefs} from "../../../../repository/js/persistence_layer/FirestorePrefs";
import {ViewerElements} from "../ViewerElements";
import {DocViewerAppURLs} from "../../DocViewerAppURLs";
import {AnnotationPopup} from '../../annotations/annotation_popup/AnnotationPopup';
import {useDocumentViewerVisibleElemFocus} from '../UseSidenavDocumentChangeCallbackHook';
import {RenditionOptions} from "epubjs/types/rendition";
import {Browsers} from "polar-browsers/src/Browsers";
import {useTaskEventReporterHandler} from "../../../../../web/js/analytics/Analytics";
import useEPUBFindController = EPUBFindControllers.useEPUBFindController;

interface IProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
    readonly children: React.ReactNode;
}

interface ExtendedSpine {
    readonly items: ReadonlyArray<Section>;
}

// TODO how do I pre-filter the HTML to reject XSS attacks...

function forwardEvents(target: HTMLElement) {
    // this is needed because keyboard events and other events ould be swallowed
    // by the iframe.

    const iframe = target.querySelector('iframe')! as HTMLIFrameElement;
    IFrameEventForwarder.start(iframe, target);

}

function handleLinkClicks(target: HTMLElement, linkLoader: LinkLoaderDelegate, baseURL: string | undefined) {

    const iframe = target.querySelector('iframe')! as HTMLIFrameElement;

    if (!iframe.contentDocument) {
        console.warn("No content document");
        return;
    }

    const links = Array.from(iframe.contentDocument.querySelectorAll('a'));

    console.log("handleLinkClicks: Handling N link clicks with listeners: " + links.length);

    for (const link of links) {

        link.addEventListener('click', (event) => {

            const href = link.getAttribute('href');

            if (!href) {
                console.log("handleLinkClicks: Link has no href");
                return;
            }

            function resolveURL(href: string) {

                if (!href.startsWith('http:') && !href.startsWith("https:")) {
                    // The URL is not fully resolved so we have to resolve it properly.
                    return new URL(href, baseURL).toString();
                }

                return href;

            }

            const url = resolveURL(href);

            console.log("handleLinkClicks: Link clicked. Loading with link loader: ", url);

            linkLoader(url);

            event.stopPropagation();
            event.preventDefault();

        });

    }
}

export function useFixedWidth() {

    const prefs = useFirestorePrefs();

    if (Devices.isDesktop()) {
        return prefs.isMarked('fixed-width-epub');
    }

    return false;

}

/**
 * Preserve the user's progress inside the book to localStorage, ever 1 second
 * @param fingerprint Fingerprint of the book
 * @param rendition The Rendition (view) that shows the ePub Book object
 */
const useBookProgressPreserver = (fingerprint: string, rendition?: Rendition) => {
    useEffect(() => {
        if (!rendition) {
            return;
        }
        const interval = setInterval(() => {
            const currentLocation = rendition.currentLocation();

            // @ts-ignore TS types seem to be outdated for this one in our @types package
            const cfi = currentLocation.start.cfi;

            const localStorageKey = `progress.${fingerprint}`;
            localStorage.setItem(localStorageKey, JSON.stringify({cfi}));
        }, 1000);

        return () => clearInterval(interval);
    }, [fingerprint, rendition]);
};

/**
 * Restores the user's progress within the book with the provided Fingerprint
 */
const useBookProgressRestorer = (fingerprint: string, rendition?: Rendition) => {
    useEffect((() => {
        if (!rendition) {
            return;
        }

        // Don't restore if user visited a certain page directly through a URL bookmark
        if (window.location.hash.includes('page=')) {
            return;
        }

        const localStorageKey = `progress.${fingerprint}`;
        const restoredPayload = localStorage.getItem(localStorageKey);
        if (!restoredPayload) {
            console.log(`No stored prior progress. Resuming book to the beginning`);
            return;
        }
        const {cfi} = JSON.parse(restoredPayload);

        console.log(`Restoring progress to CFI: ${cfi}`);
        rendition.display(cfi).then().catch((e) => console.error(e));
    }), [fingerprint, rendition]);
}

export const EPUBDocument = React.memo(function EPUBDocument(props: IProps) {

    const {docURL, docMeta} = props;

    const {
        setDocDescriptor,
        setPageNavigator,
        setDocScale,
        setResizer,
        setFluidPagemarkFactory,
        setPage,
        setOutline,
        setOutlineNavigator,
        setScaleLeveler
    }
        = useDocViewerCallbacks();

    const {setFinder}
        = useDocFindCallbacks();

    const {renderIter}
        = useEPUBDocumentStore(['renderIter'])

    const {incrRenderIter, setSection}
        = useEPUBDocumentCallbacks()

    const finder = useEPUBFindController();
    const epubResizer = useEPUBResizer();
    const epubZoom = useEPubZoom();
    const log = useLogger();
    const sectionRef = React.useRef<Section | undefined>(undefined);
    const stylesheet = useStylesheetURL();
    const linkLoader = useLinkLoader();

    const [rendition, setRendition] = useState<Rendition>();

    const docLoadEventReporterHandler = useTaskEventReporterHandler('docLoad', {type: 'epub'});

    const docViewerElements = useDocViewerElementsContext();

    useBookProgressPreserver(props.docMeta.docInfo.fingerprint, rendition);
    useBookProgressRestorer(props.docMeta.docInfo.fingerprint, rendition);

    const doLoad = React.useCallback(async () => {

        function doInitialCallbacks() {

            setFinder(finder);

            // the doc scale needs to be set to that we're 1.0 as epub doesn't support
            // scale just yet.
            setDocScale({scale: SCALE_VALUE_PAGE_WIDTH, scaleValue: 1.0});

        }

        doInitialCallbacks();
        const book = ePub(docURL);

        const docID = props.docMeta.docInfo.fingerprint;
        const {viewerElement} = ViewerElements.find(docID);

        const pageElement = viewerElement.querySelector(".page")! as HTMLDivElement;

        if (!pageElement) {
            throw new Error("No page element");
        }

        // TODO:
        //
        // test no width but set the iframe CSS style to width

        // NOTE: types are wrong here and method CAN be set.

        interface IExtendedRenditionOptions extends RenditionOptions {
            readonly method: 'blobUrl' | 'srcdoc'
        }

        const opts: IExtendedRenditionOptions = {
            flow: "scrolled-doc",
            width: '100%',
            resizeOnOrientationChange: false,
            stylesheet,
            method: Browsers.get()?.id === 'safari' ? 'blobUrl' : 'srcdoc'
            // height: '100%',
            // layout: 'pre-paginated'
        }

        const rendition = book.renderTo(pageElement, opts as any);

        rendition.on('locationChanged', (event: any) => {
            // noop... this is called when the location of the book is changed
            // so we can use it to re-attach annotations.

            console.log('epubjs event: locationChanged', event);

        });

        const {handleScale, setScaling} = epubZoom
        const scaleLeveler = (scale: ScaleLevelTuple) => {
            setScaling(scale);
            return handleScale(scale);
        };

        setScaleLeveler(scaleLeveler);

        function createResizer(): Resizer {
            return () => {
                epubResizer()
            };
        }

        const resizer = createResizer();
        setResizer(resizer);

        rendition.on('resize', () => {
            console.error("epubjs event: resize", new Error("FAIL: this should not happen"));
        });

        rendition.on('resized', () => {
            console.error("epubjs event: resized", new Error("FAIL: this should not happen"));
        });

        rendition.on('rendered', (section: Section) => {
            console.log("FIXME rendered: " + document.location.href);

            console.log('epubjs event: rendered: ');
            epubResizer();
            // we have to update the section here as we jumped within the EPUB
            // directly.
            handleSection(section);

            forwardEvents(pageElement);
            handleLinkClicks(pageElement, linkLoader, props.docMeta.docInfo.url);

            // applyCSS();
            incrRenderIter();

            setRendition(rendition);
        });

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        // the 'pages' are sections that are defined as 'linear' in the spine.
        // and the rest are not pages.
        const pages = spine.items.filter(current => current.linear);

        function handleSection(section: Section) {

            function computePageNumberFromSection(): number | undefined {

                const sectionIndex
                    = arrayStream(pages)
                    .withIndex()
                    .filter(current => current.value.index === section.index)
                    .first();

                return sectionIndex?.index ? sectionIndex?.index + 1 : undefined;

            }

            setSection(section);
            sectionRef.current = section;

            const pageNumberFromSection = computePageNumberFromSection();

            if (pageNumberFromSection) {
                setPage(pageNumberFromSection);
            }

        }

        function createPageNavigator(): PageNavigator {

            let page: number = 1;
            const count = pages.length;

            function get(): number {
                return page;
            }

            async function jumpToPage(newPage: number) {

                page = newPage;

                const newSection = pages[newPage - 1];

                async function displayAndWaitForRender() {

                    // we need to use a latch here because the page isn't really
                    // change until it's rendered and other dependencies might
                    // need to wait like highlights that depend on the page being
                    // shown.
                    const renderedLatch = new Latch<boolean>();
                    rendition.once('rendered', () => renderedLatch.resolve(true))
                    await rendition.display(newSection.index)
                    await renderedLatch.get();

                }

                function updateURL() {

                    // only update the current URL if it's the right docID... might want to make this
                    // into a helper function.
                    if (docID === DocViewerAppURLs.parse(document.location.href)?.id) {

                        if (document.location.hash.indexOf('page=' + newPage) === -1) {
                            // document.location.hash = '#page=' + newPage;
                        }

                    }

                }

                await displayAndWaitForRender();
                handleSection(newSection);
                updateURL();

            }

            return {count, jumpToPage, get};

        }

        function createFluidPagemarkFactory(): FluidPagemarkFactory {

            function create(opts: FluidPagemarkCreateOpts): IFluidPagemark | undefined {

                if (!opts.range) {
                    return undefined;
                }

                const cfiBase = sectionRef.current!.cfiBase;
                const epubCFI = new EpubCFI(opts.range, cfiBase);

                const anchor: IPagemarkAnchor = {
                    type: 'epubcfi',
                    value: epubCFI.toString()
                };

                function computeRange(): IPagemarkRange | undefined {
                    switch (opts.direction) {
                        case "top":
                            return {
                                start: anchor,
                                end: opts.existing?.range?.end
                            };
                        case "bottom":
                            return {
                                start: opts.existing?.range?.start,
                                end: anchor
                            };
                        default:
                            return {
                                start: opts.existing?.range?.start,
                                end: anchor
                            };

                    }
                }

                const range = computeRange();

                if (!range) {
                    return undefined;
                }

                return {range}

            }

            return {create};

        }

        const pageNavigator = createPageNavigator();
        setPageNavigator(pageNavigator);

        // define the fluid pagemark factor so that the menu can use this
        // when creating pagemarks.
        const fluidPagemarkFactory = createFluidPagemarkFactory();
        setFluidPagemarkFactory(fluidPagemarkFactory);

        const annotationLink = AnnotationLinks.parse(document.location);

        await pageNavigator.jumpToPage(annotationLink?.page || 1);

        setDocDescriptor({
            fingerprint: docMeta.docInfo.fingerprint,
            nrPages: pageNavigator.count
        });

        const metadata = await book.loaded.metadata;

        console.log({metadata});

        const navigation = await book.loaded.navigation;

        function createOutline() {

            function toOutline(item: NavItem): IOutlineItem {

                const id = Numbers.toString(nonceFactory());

                return {
                    id,
                    title: item.label,
                    destination: item.href,
                    children: (item.subitems || []).map(toOutline)
                };

            }

            const nonceFactory = Nonces.createFactory();

            const items = navigation.toc.map(toOutline);

            return {items};

        }

        setOutline(createOutline());

        setOutlineNavigator(async (destination: any) => {
            await rendition.display(destination)
        });

        console.log("landmarks: ", navigation.landmarks);

        console.log("toc: ", navigation.toc);

        const pageList = await book.loaded.pageList;

        console.log("pageList: ", pageList);

        const manifest = await book.loaded.manifest;

        console.log("manifest: ", manifest);

        console.log("Loaded epub");

    }, [docMeta.docInfo.fingerprint, docURL, epubResizer, finder,
        incrRenderIter, linkLoader, props.docMeta.docInfo.fingerprint, props.docMeta.docInfo.url, setDocDescriptor,
        setDocScale, setFinder, setFluidPagemarkFactory, setOutline, setOutlineNavigator,
        setPage, setPageNavigator, setSection, stylesheet, setResizer, setScaleLeveler, epubZoom]);


    useWindowResizeEventListener('epub-resizer', epubResizer);

    useComponentDidMount(() => {
        docLoadEventReporterHandler(doLoad)
            .catch(err => log.error("Could not load EPUB: ", err));
    })

    useDocumentViewerVisibleElemFocus(
        props.docMeta.docInfo.fingerprint,
        docViewerElements.getDocViewerElement().querySelector<HTMLIFrameElement>("iframe") || undefined
    );

    return renderIter && (
        <DOMTextIndexProvider>
            <DocumentInit/>
            <AnnotationPopup key={`popup-${renderIter}`}/>
            <EPUBFindRenderer/>
            <EPUBContextMenuRoot/>
            {props.children}
        </DOMTextIndexProvider>
    ) || null;

});


function useEPUBResizer() {

    const docViewerElements = useDocViewerElementsContext();
    const fixedWidth = useFixedWidth();

    return React.useCallback(() => {

        const docViewer = docViewerElements.getDocViewerElement();

        function computeContainerDimensions(): IDimensions {
            const element = docViewer.querySelector(".page") as HTMLElement;
            const width = element!.offsetWidth;
            const height = element!.offsetHeight;
            return {width, height}
        }

        function setWidthAndHeight(element: HTMLElement | null | undefined, dimensions: IDimensions) {

            function hasValidDimensions() {
                return dimensions.width !== 0 && dimensions.height !== 0;
            }

            if (element) {

                if (hasValidDimensions()) {

                    element.style.width = `${dimensions.width}px`;
                    element.style.height = `${dimensions.height}px`;

                } else {
                    console.log("Not setting dimensions (invalid): ", dimensions);
                }

            } else {
                console.warn("Can not set element style (no element)");
            }

        }

        function adjustEpubView(dimensions: IDimensions) {
            const element = docViewer.querySelector(".epub-view") as HTMLElement;
            if (element) {
                setWidthAndHeight(element, dimensions);
            }
        }

        function adjustIframe(dimensions: IDimensions) {
            const element = docViewer.querySelector(".epub-view iframe") as HTMLElement;
            setWidthAndHeight(element, dimensions);
        }

        function adjustIframeBody(dimensions: IDimensions) {

            const iframe = docViewer.querySelector(".epub-view iframe") as HTMLIFrameElement;

            if (!iframe) {
                console.warn("No iframe");
                return;
            }

            if (!iframe.contentDocument) {
                console.warn("No contentDocument");
                return;
            }

            const body = iframe.contentDocument.body

            setWidthAndHeight(body, dimensions);

            iframe.contentDocument.body.style.height = 'auto';
            iframe.contentDocument.body.style.padding = '8px';

            if (fixedWidth) {
                iframe.contentDocument.body.style.maxWidth = '700px';
                iframe.contentDocument.body.style.margin = 'auto';

            } else {
                iframe.contentDocument.body.style.width = 'auto';
            }

        }

        console.log("Resizing EPUB");

        const dimensions = computeContainerDimensions();

        adjustEpubView(dimensions);
        adjustIframe(dimensions);
        adjustIframeBody(dimensions);

    }, [docViewerElements, fixedWidth]);

}

function useEPubZoom() {
    const [scale, setScaling] = React.useState<ScaleLevelTuple>({label: 'page fit', value: 'page-fit'});

    const docViewerElements = useDocViewerElementsContext();

    const handleScale = React.useCallback((scale: ScaleLevelTuple) => {

        const setScale = () => {
            const iframe = docViewerElements.getDocViewerElement().querySelector(".epub-view iframe") as HTMLIFrameElement

            if (iframe?.contentDocument) {
                iframe.contentDocument.body.style.fontSize = `${Number(scale.value) * 100}%`
                const images = iframe.contentDocument.querySelectorAll('img')

                Array.from(images).forEach((image) => {
                    image.setAttribute('style', 'max-width: 100% !important; display: block')
                    const newWidth = image.clientWidth * Number(scale.value)
                    const newHeight = image.clientHeight * Number(scale.value)
                    image.style.width = `${newWidth}px`
                    image.style.height = `${newHeight}px`
                });

            }
            return Number(scale.value);
        }

        return setScale();
    }, [docViewerElements])

    handleScale(scale);

    return {handleScale, setScaling};
}
