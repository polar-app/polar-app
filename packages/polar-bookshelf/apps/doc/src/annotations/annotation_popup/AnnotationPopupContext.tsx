import React from "react";
import {
    ActiveSelectionEvent,
    ActiveSelectionListener,
    ActiveSelections
} from "../../../../../web/js/ui/popup/ActiveSelections";
import {Elements} from "../../../../../web/js/util/Elements";
import {IDocScale, useDocViewerCallbacks, useDocViewerStore} from "../../DocViewerStore";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {IDocViewerElements, useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {SelectedContents} from "../../../../../web/js/highlights/text/selection/SelectedContents";
import {TextHighlighter} from "../../text_highlighter/TextHighlighter";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {FileType} from "../../../../../web/js/apps/main/file_loaders/FileType";
import {IDStr} from "polar-shared/src/util/Strings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ISelectedContent} from "../../../../../web/js/highlights/text/selection/ISelectedContent";
import {isPresent} from "polar-shared/src/Preconditions";
import {useAnnotationBlockManager} from "../../../../../web/js/notes/HighlightBlocksHooks";
import {BlockContentAnnotationTree} from "polar-migration-block-annotations/src/BlockContentAnnotationTree";
import {TextHighlightAnnotationContent} from "../../../../../web/js/notes/content/AnnotationContent";
import {InputEscapeListener} from "../../../../../web/js/mui/complete_listeners/InputEscapeListener";
import {AnnotationPopupStore, IAnnotationCreator} from "./AnnotationPopupStore";

export enum AnnotationPopupActionEnum {
    CHANGE_COLOR = "CHANGE_COLOR",
    EDIT = "EDIT",
    CREATE_COMMENT = "CREATE_COMMENT",
    CREATE_FLASHCARD = "CREATE_FLASHCARD",
    CREATE_AI_FLASHCARD = "CREATE_AI_FLASHCARD",
    EDIT_TAGS = "EDIT_TAGS",
};

interface IAnnotationPopupProviderProps {
    readonly docMeta: IDocMeta;
    readonly docScale: IDocScale;
};

const AnnotationPopupContext = React.createContext<AnnotationPopupStore | null>(null);

export function computeTargets(fileType: FileType, docViewerElementProvider: () => HTMLElement): ReadonlyArray<HTMLElement> {

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

export function useCreateTextHighlightCallback(docMeta: IDocMeta, docScale: IDocScale) {

    const docViewerElementsContext = useDocViewerElementsContext();

    return React.useCallback((opts: ICreateTextHighlightCallbackOpts): TextHighlighter.ICreatedTextHighlight | null => {

        if (docMeta.docInfo.fingerprint !== opts.docID) {
            // this text highlight is from another doc.
            return null;
        }

        const pageElement = docViewerElementsContext.getPageElementForPage(opts.pageNum)!;

        return TextHighlighter.createTextHighlight({ ...opts, docMeta, docScale, pageElement });
    }, [docMeta, docScale, docViewerElementsContext]);
}

export const activeSelectionEventToTextHighlight = (
    event: ActiveSelectionEvent,
    fileType: FileType,
    docViewerElements: IDocViewerElements
) => {
    const getPageNumberForPageElement = () => {
        const getNumber = (pageElement: HTMLElement) => (
            parseInt(pageElement.getAttribute("data-page-number")!, 10));
        switch (fileType) {
            case "pdf":
                const pdfPageElement = Elements.untilRoot(event.element, ".page");
                return getNumber(pdfPageElement);
            case "epub":
                const docViewerElement = docViewerElements.getDocViewerElement();
                const epubPageElement = docViewerElement.querySelector('.page') as HTMLElement;
                return getNumber(epubPageElement);
        }
    }

    const selectedContent = SelectedContents.computeFromSelection(event.selection, {
        noRectTexts: fileType === "epub",
        fileType,
    });

    const pageNum = getPageNumberForPageElement()!;

    return {
        selectedContent,
        pageNum,
    };
};

interface IAnnotationPopupListenersProps {
    readonly createAnnotationFromSelectionEvent: IAnnotationCreator;
}

const AnnotationPopupListeners: React.FC<IAnnotationPopupListenersProps> = (props) => {
    const { createAnnotationFromSelectionEvent } = props;
    const { activeHighlight, textHighlightColor } = useDocViewerStore(["activeHighlight", "textHighlightColor"]);
    const { fileType } = useDocViewerContext();
    const textHighlightColorRef = useRefWithUpdates(textHighlightColor);
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const annotationPopupStore = useAnnotationPopupStore();

    React.useEffect(() => {

        if (activeHighlight) {
            setTimeout(() => {
                annotationPopupStore.setSelectedAnnotationID(activeHighlight.highlightID);
            });
        } else {
            annotationPopupStore.reset();
        }

        return undefined;
    }, [annotationPopupStore, activeHighlight]);

    React.useEffect(() => {
        const targets = computeTargets(fileType, docViewerElementsRef.current.getDocViewerElement);
        const handleSelection: ActiveSelectionListener = (event) => {
            annotationPopupStore.reset();
            if (event.type === "created") {
                if (textHighlightColorRef.current) {
                    createAnnotationFromSelectionEvent(textHighlightColorRef.current, event);
                } else {
                    annotationPopupStore.setSelection(event);
                }
            }
        };

        const listeners = targets.map(target => ActiveSelections.addEventListener(handleSelection, target));
        return () => listeners.forEach(cleanup => cleanup());
    }, [textHighlightColorRef, annotationPopupStore, fileType, docViewerElementsRef, createAnnotationFromSelectionEvent]);

    return null;
};

export const AnnotationPopupProvider: React.FC<IAnnotationPopupProviderProps> = (props) => {
    const { docMeta, docScale } = props;
    const { setActiveHighlight } = useDocViewerCallbacks();
    const createTextHighlightRef = useRefWithUpdates(useCreateTextHighlightCallback(docMeta, docScale));
    const { create: createAnnotation } = useAnnotationBlockManager();
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const { fileType } = useDocViewerContext();

    const handleCreateAnnotation = React.useCallback((color: ColorStr, event: ActiveSelectionEvent) => {
        if (! event) {
            return;
        }

        const { selectedContent, pageNum } = activeSelectionEventToTextHighlight(
            event,
            fileType,
            docViewerElementsRef.current
        );

        if (selectedContent.text.length === 0) {
            return;
        }

        event.selection.empty();
        const fingerprint = docMeta.docInfo.fingerprint;
        const createdTextHighlight = createTextHighlightRef.current({
            pageNum,
            selectedContent,
            highlightColor: color,
            docID: fingerprint,
        });

        if (! createdTextHighlight) {
            return;
        }

        const {textHighlight} = createdTextHighlight;

        const content = BlockContentAnnotationTree.toTextHighlightAnnotation(
            docMeta,
            pageNum,
            textHighlight,
        );

        const id = createAnnotation(fingerprint, new TextHighlightAnnotationContent({
            type: content.type,
            docID: content.docID,
            links: [],
            pageNum: content.pageNum,
            value: content.value,
        }));

        if (id) {
            setActiveHighlight({
                highlightID: id,
                pageNum,
            });
        }
    }, [docMeta, setActiveHighlight, fileType, createTextHighlightRef, docViewerElementsRef, createAnnotation]);

    const handleCreateAnnotationRef = useRefWithUpdates(handleCreateAnnotation);

    const value = React.useMemo(() => {
        return new AnnotationPopupStore(handleCreateAnnotationRef.current);
    }, [handleCreateAnnotationRef]);

    return (
        <AnnotationPopupContext.Provider value={value}>
            <AnnotationPopupListeners createAnnotationFromSelectionEvent={handleCreateAnnotation} />
            <EscapeHandler>
                {props.children}
            </EscapeHandler>
        </AnnotationPopupContext.Provider>
    );
};

const EscapeHandler: React.FC = (props) => {
    const annotationPopupStore = useAnnotationPopupStore();
    const { setActiveHighlight } = useDocViewerCallbacks();

    const handleEscape = React.useCallback(() => {
        setActiveHighlight(undefined);
        annotationPopupStore.selectionEvent?.selection.empty();
        annotationPopupStore.reset();
    }, [annotationPopupStore, setActiveHighlight]);

    return (
        <InputEscapeListener onEscape={handleEscape}>
            <>{props.children}</>
        </InputEscapeListener>
    );
};

export const useAnnotationPopupStore = () => {
    const value = React.useContext(AnnotationPopupContext);

    if (! value) {
        throw new Error("useAnnotationPopupStore must be used in a component that's wrapped within AnnotationPopupContextProvider");
    }

    return value;
};
