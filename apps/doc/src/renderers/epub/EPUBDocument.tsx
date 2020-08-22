import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/ReactLifecycleHooks";
import ePub, {EpubCFI} from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import {PageNavigator} from "../../PageNavigator";
import {Resizer, useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from 'epubjs/types/section';
import {EPUBFindRenderer} from "./EPUBFindRenderer";
import {EPUBFindControllers} from "./EPUBFindControllers";
import {useDocFindCallbacks} from "../../DocFindStore";
import {IFrameEventForwarder} from "./IFrameEventForwarder";
import {SCALE_VALUE_PAGE_WIDTH} from '../../ScaleLevels';
import {useAnnotationBar} from '../../AnnotationBarHooks';
import './EPUBDocument.css';
import {DocumentInit} from "../DocumentInitHook";
import {DOMTextIndexProvider} from "../../annotations/DOMTextIndexContext";
import {
    useEPUBDocumentCallbacks,
    useEPUBDocumentStore
} from './EPUBDocumentStore';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {useDocViewerElementsContext} from "../DocViewerElementsContext";
import {Arrays} from 'polar-shared/src/util/Arrays';
import {Latch} from "polar-shared/src/util/Latch";
import {useResizeEventListener} from "../../../../../web/js/react/WindowHooks";
import {IDimensions} from 'polar-shared/src/util/IDimensions';
import {EPUBContextMenuRoot} from "./contextmenu/EPUBContextMenuRoot";
import {FluidPagemarkFactory, IFluidPagemark} from "../../FluidPagemarkFactory";
import {IDocViewerContextMenuOrigin} from "../../DocViewerMenu";
import {IPagemarkRange} from "polar-shared/src/metadata/IPagemarkRange";
import {Percentages} from 'polar-shared/src/util/Percentages';
import {useStylesheetURL} from "./EPUBDocumentHooks";
import useEPUBFindController = EPUBFindControllers.useEPUBFindController;

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

    const {setDocDescriptor, setPageNavigator, setDocScale, setResizer, setFluidPagemarkFactory}
        = useDocViewerCallbacks();

    const {setFinder}
        = useDocFindCallbacks();

    const {renderIter}
        = useEPUBDocumentStore(['renderIter'])

    const {incrRenderIter, setSection}
        = useEPUBDocumentCallbacks()

    const finder = useEPUBFindController();
    const annotationBarInjector = useAnnotationBar({noRectTexts: true});
    const docViewerElements = useDocViewerElementsContext();
    const epubResizer = useEPUBResizer();
    const log = useLogger();
    const sectionRef = React.useRef<Section | undefined>(undefined);
    const stylesheet = useStylesheetURL();

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

        // FIXME another idea would be to hide the document until it's rendered
        // then apply my themes and then render them.. .

        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
            resizeOnOrientationChange: false,
            stylesheet,
            // height: '100%',
            // layout: 'pre-paginated'
        });

        rendition.on('locationChanged', (event: any) => {
            // noop... this is called when the location of the book is changed
            // so we can use it to re-attach annotations.

            console.log('epubjs event: locationChanged', event);

        });

        function createResizer(): Resizer {
            return () => {
                epubResizer()
            };
        }

        const resizer = createResizer();
        setResizer(resizer);

        rendition.on('resize', (event: any) => {
            console.error("epubjs event: resize", new Error("FAIL: this should not happen"));
        });

        rendition.on('resized', (event: any) => {
            console.error("epubjs event: resized", new Error("FAIL: this should not happen"));
        });

        // FIXME: in the docViewerStore we can set a PagemarkRangeFactory or
        // something along those line to help us create pagemarks from the EPUB
        // directly so that the DocViewerMenu can use that.

        rendition.on('rendered', (section: Section) => {
            console.log('epubjs event: rendered: ');

            epubResizer();
            // FIXME: when we jump between pages in the UI ... by clicking the
            // ToC the 'page' that we're on isn't updated. We can listen for the
            // section here, then find out what pages it's on, then set the the
            // page.

            // we have to update the section here as we jumped within the EPUB
            // directly.
            handleSection(section);

            forwardEvents(pageElement);

            // applyCSS();
            annotationBarInjector();

            incrRenderIter();

        });

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        function handleSection(section: Section) {
            setSection(section);
            sectionRef.current = section;
        }

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
                handleSection(newSection);

            }

            return {count, set, get};

        }

        function createFluidPagemarkFactory(): FluidPagemarkFactory {

            function create(origin: IDocViewerContextMenuOrigin): IFluidPagemark | undefined {

                if (! origin.range) {
                    return undefined;
                }

                // FIXME: this percentage computation might not be required.
                const percentage = Percentages.calculate(origin.pageY, origin.windowHeight);
                const cfiBase = sectionRef.current!.cfiBase;
                const epubCFI = new EpubCFI(origin.range, cfiBase);

                const range: IPagemarkRange = {
                    end: {
                        type: 'epubcfi',
                        value: epubCFI.toString()
                    }
                };

                return {percentage, range}

            }


            return {create};

        }

        const pageNavigator = createPageNavigator();
        setPageNavigator(pageNavigator);

        // define the fluid pagemark factor so that the menu can use this
        // when creating pagemarks.
        const fluidPagemarkFactory = createFluidPagemarkFactory();
        setFluidPagemarkFactory(fluidPagemarkFactory);

        await pageNavigator.set(1);

        setDocDescriptor({
            fingerprint: docMeta.docInfo.fingerprint,
            nrPages: pageNavigator.count
        });

        const metadata = await book.loaded.metadata;

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
