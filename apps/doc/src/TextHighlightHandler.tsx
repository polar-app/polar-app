import * as React from "react";
import {IDocViewerStore, useDocViewerStore} from "./DocViewerStore";
import {
    ITextHighlightCreate,
    useAnnotationMutationsContext
} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {TextHighlighter} from "./text_highlighter/TextHighlighter";
import {useDocViewerContext} from "./renderers/DocRenderer";
import {SelectedContents} from "../../../web/js/highlights/text/selection/SelectedContents";
import {ISelectedContent} from "../../../web/js/highlights/text/selection/ISelectedContent";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import { IDocViewerElements, useDocViewerElementsContext } from "./renderers/DocViewerElementsContext";
import {IDStr} from "polar-shared/src/util/Strings";
import {ActiveSelectionListener, ActiveSelections} from "../../../web/js/ui/popup/ActiveSelections";
import {FileType} from "../../../web/js/apps/main/file_loaders/FileType";
import {isPresent} from "polar-shared/src/Preconditions";
import {Elements} from "../../../web/js/util/Elements";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";


/**
 * The minimum properties we need to annotate without having to have the full
 * store context like docMeta.
 */
interface ICreateTextHighlightCallbackOpts {

    /**
     * The document ID (fingerprint) in this this document as created.
     */
    readonly docID: IDStr;

    readonly pageNum: number;

    readonly highlightColor: HighlightColor;

    readonly selectedContent: ISelectedContent;

}

type CreateTextHighlightCallback = (opts: ICreateTextHighlightCallbackOpts) => ITextHighlight | null;

function useCreateTextHighlightCallback(): CreateTextHighlightCallback {

    const annotationMutations = useAnnotationMutationsContext();
    const {docMeta, docScale} = useDocViewerStore(['docMeta', 'docScale']);
    const docViewerElementsContext = useDocViewerElementsContext();

    return (opts: ICreateTextHighlightCallbackOpts): ITextHighlight | null => {

        if (docMeta === undefined) {
            throw new Error("No docMeta");
        }

        if (docScale === undefined) {
            throw new Error("No docScale");
        }

        if (docMeta.docInfo.fingerprint !== opts.docID) {
            // this text highlight is from another doc.
            return null;
        }

        // TODO: what if this page isn't visible
        const pageElement = docViewerElementsContext.getPageElementForPage(opts.pageNum)!;

        const {pageMeta, textHighlight}
            = TextHighlighter.createTextHighlight({...opts, docMeta, docScale, pageElement});

        const mutation: ITextHighlightCreate = {
            type: 'create',
            docMeta, pageMeta, textHighlight
        }

        annotationMutations.onTextHighlight(mutation);
        return textHighlight;
    };

}

/**
 * Function that will register our event listeners when returned.
 */
export type AnnotationBarEventListenerRegisterer = () => void;

function computeTargets(fileType: FileType, docViewerElementProvider: () => HTMLElement): ReadonlyArray<HTMLElement> {

    const docViewerElement = docViewerElementProvider();

    function computeTargetsForPDF(): ReadonlyArray<HTMLElement> {
        return Array.from(docViewerElement.querySelectorAll(".page")) as HTMLElement[];
    }

    function computeTargetsForEPUB(): ReadonlyArray<HTMLElement> {
        return Array.from(docViewerElement.querySelectorAll("iframe"))
                    .map(iframe => iframe.contentDocument)
                    .filter(contentDocument => isPresent(contentDocument))
                    .map(contentDocument => contentDocument!)
                    .map(contentDocument => contentDocument.documentElement)
    }

    switch(fileType) {

        case "pdf":
            return computeTargetsForPDF();

        case "epub":
            return computeTargetsForEPUB();

    }
}

export const TextHighlightHandler: React.FC = () => {
    const store = React.useRef<Pick<IDocViewerStore, 'docMeta' | 'textHighlightColor'>>();
    const createTextHighlightCallback = React.useRef<CreateTextHighlightCallback>()
    const docViewerElements = React.useRef<IDocViewerElements>();
    const {fileType} = useDocViewerContext();

    store.current = useDocViewerStore(['docMeta', 'textHighlightColor']);
    createTextHighlightCallback.current = useCreateTextHighlightCallback();
    docViewerElements.current = useDocViewerElementsContext();
    

    React.useEffect(() => {
        const targets = computeTargets(fileType, docViewerElements.current!.getDocViewerElement);
        const handleSelection: ActiveSelectionListener = (event) => {
            const {selection} = event;
            const {docMeta, textHighlightColor} = store.current!;

            if (event.type !== "created" || !textHighlightColor) {
                return;
            }

            const getPageNumberForPageElement = () => {
                const getNumber = (pageElement: HTMLElement) => (
                    parseInt(pageElement.getAttribute("data-page-number")!, 10));
                switch (fileType) {
                    case "pdf":
                        const pdfPageElement = Elements.untilRoot(event.element, ".page");
                        return getNumber(pdfPageElement);
                    case "epub":
                        const docViewerElement = docViewerElements.current!.getDocViewerElement();
                        const epubPageElement = docViewerElement.querySelector('.page') as HTMLElement;
                        return getNumber(epubPageElement);
                }
            }

            const selectedContent = SelectedContents.computeFromSelection(selection, {
                noRectTexts: fileType === "epub",
                fileType,
            });

            selection.empty();

            const docID = docMeta?.docInfo.fingerprint;

            if (docID) {

                const pageNum = getPageNumberForPageElement()!;

                createTextHighlightCallback.current!({
                    selectedContent,
                    highlightColor: textHighlightColor,
                    docID,
                    pageNum,
                });
            } else {
                console.warn("No docID")
            }
        };
        const cleanupListeners: (() => void)[] = [];

        for (const target of targets) {
            cleanupListeners.push(ActiveSelections.addEventListener(handleSelection, target));
        }
        return () => cleanupListeners.forEach(cleanup => cleanup());
    }, [fileType]);

    return null;
}
