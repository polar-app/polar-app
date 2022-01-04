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
import {ACTIONS, DEFAULT_STATE, IBlockAnnotation, reducer} from "./AnnotationPopupReducer";
import {IAutoFlashcardHandlerState} from "../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";
import {FileType} from "../../../../../web/js/apps/main/file_loaders/FileType";
import {IDStr} from "polar-shared/src/util/Strings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ISelectedContent} from "../../../../../web/js/highlights/text/selection/ISelectedContent";
import {isPresent} from "polar-shared/src/Preconditions";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useAnnotationBlockManager} from "../../../../../web/js/notes/HighlightBlocksHooks";
import {autorun} from "mobx";
import {BlockContentAnnotationTree} from "polar-migration-block-annotations/src/BlockContentAnnotationTree";
import {TextHighlightAnnotationContent} from "../../../../../web/js/notes/content/AnnotationContent";
import {InputEscapeListener} from "../../../../../web/js/mui/complete_listeners/InputEscapeListener";

export enum AnnotationPopupActionEnum {
    CHANGE_COLOR = "CHANGE_COLOR",
    EDIT = "EDIT",
    CREATE_COMMENT = "CREATE_COMMENT",
    CREATE_FLASHCARD = "CREATE_FLASHCARD",
    CREATE_AI_FLASHCARD = "CREATE_AI_FLASHCARD",
    EDIT_TAGS = "EDIT_TAGS",
    DELETE = "DELETE",
};

const AnnotationPopupContext = React.createContext<IAnnotationPopupContext | null>(null);

type IAnnotationPopupProviderProps = {
    docMeta: IDocMeta;
    docScale: IDocScale;
};

type IAnnotationPopupContext = {
    onCreateAnnotation: (color: ColorStr) => void;
    annotation?: IBlockAnnotation;
    selectionEvent?: ActiveSelectionEvent;
    setAiFlashcardStatus: (status: IAutoFlashcardHandlerState) => void;
    aiFlashcardStatus: IAutoFlashcardHandlerState,
    activeAction?: AnnotationPopupActionEnum;
    toggleAction: (action: AnnotationPopupActionEnum) => () => void;
    clear: () => void;
};

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

export function useCreateTextHighlightCallback() {

    const {docMeta, docScale} = useDocViewerStore(['docMeta', 'docScale']);
    const docViewerElementsContext = useDocViewerElementsContext();

    return React.useCallback((opts: ICreateTextHighlightCallbackOpts): TextHighlighter.ICreatedTextHighlight | null => {

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

export const AnnotationPopupProvider: React.FC<IAnnotationPopupProviderProps> = (props) => {
    const {docMeta, ...restProps} = props;
    const [state, dispatch] = React.useReducer(reducer, DEFAULT_STATE);
    const {annotation, selectionEvent, activeAction} = state;
    const {activeHighlight, textHighlightColor} = useDocViewerStore(["activeHighlight", "textHighlightColor"]);
    const {setActiveHighlight} = useDocViewerCallbacks();
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const createTextHighlightRef = useRefWithUpdates(useCreateTextHighlightCallback());
    const textHighlightColorRef = useRefWithUpdates(textHighlightColor);
    const setActiveHighlightRef = useRefWithUpdates(setActiveHighlight);
    const {fileType} = useDocViewerContext();
    const {create: createAnnotation} = useAnnotationBlockManager();
    const {getBlock} = useAnnotationBlockManager();

    const handleCreateAnnotation = React.useCallback((color: ColorStr, event = selectionEvent) => {
        if (event) {
            const {selectedContent, pageNum} = activeSelectionEventToTextHighlight(
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

            if (createdTextHighlight) {
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
            }
        }
    }, [docMeta, setActiveHighlight, fileType, selectionEvent, createTextHighlightRef, docViewerElementsRef, createAnnotation]);

    React.useEffect(() => {

        if (activeHighlight) {
            return autorun(() => {
                const annotation = getBlock(activeHighlight.highlightID, AnnotationContentType.TEXT_HIGHLIGHT);
                if (! annotation) {
                    setActiveHighlightRef.current(undefined);
                    return;
                }

                setTimeout(() => {
                    dispatch({
                        type: ACTIONS.ANNOTATION_SET,
                        payload: annotation,
                    });
                }, 50);
            });
        } else {
            dispatch({
                type: ACTIONS.ANNOTATION_SET,
                payload: undefined,
            });
        }
        return undefined;
    }, [activeHighlight, setActiveHighlightRef, docMeta, getBlock]);

    React.useEffect(() => {
        const targets = computeTargets(fileType, docViewerElementsRef.current.getDocViewerElement);
        const handleSelection: ActiveSelectionListener = (event) => {
            dispatch({ type: ACTIONS.RESET, payload: undefined });

            if (textHighlightColorRef.current) {
                if (event.type === "created") {
                    handleCreateAnnotation(textHighlightColorRef.current, event);
                }
            } else {
                if (event.type === "created") {
                    dispatch({ type: ACTIONS.SELECTION_CREATED, payload: event });
                    setActiveHighlight(undefined);
                } else {
                    dispatch({ type: ACTIONS.SELECTION_DESTROYED, payload: undefined });
                }
            }
        };

        const cleanupListeners: (() => void)[] = [];

        for (const target of targets) {
            cleanupListeners.push(ActiveSelections.addEventListener(handleSelection, target));
        }
        return () => cleanupListeners.forEach(cleanup => cleanup());
    }, [textHighlightColorRef, setActiveHighlight, fileType, docViewerElementsRef, handleCreateAnnotation]);

    const toggleAction = React.useCallback((action: AnnotationPopupActionEnum) => () => {
        dispatch({ type: ACTIONS.ACTION_TOGGLED, payload: action });
        if (!annotation && action !== AnnotationPopupActionEnum.DELETE) {
            handleCreateAnnotation(MAIN_HIGHLIGHT_COLORS[0]);
        }
    }, [annotation, handleCreateAnnotation, dispatch]);

    const clear = React.useCallback(() => {
        dispatch({ type: ACTIONS.ACTION_TOGGLED, payload: undefined });
    }, []);

    const value: IAnnotationPopupContext = {
        toggleAction,
        activeAction,
        clear,
        annotation,
        onCreateAnnotation: handleCreateAnnotation,
        selectionEvent,
        setAiFlashcardStatus: (status) => dispatch({ type: ACTIONS.UPDATE_AI_FLASHCARD_STATUS, payload: status }),
        aiFlashcardStatus: state.aiFlashcardStatus,
    };

    const handleEscape = React.useCallback(() => {
        setActiveHighlight(undefined);
        selectionEvent?.selection.empty();
        dispatch({ type: ACTIONS.RESET, payload: undefined });
    }, [dispatch, selectionEvent, setActiveHighlight]);

    return (
        <>
            <InputEscapeListener onEscape={handleEscape}>
                <AnnotationPopupContext.Provider value={value} {...restProps} />
            </InputEscapeListener>
        </>
    );
};

export const useAnnotationPopup = () => {
    const context = React.useContext(AnnotationPopupContext);
    if (!context) {
        throw new Error("useAnnotationPopup must be used within a component that's rendered within the AnnotationPopupContextProvider");
    }
    return context;
}
