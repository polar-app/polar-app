import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import React from "react";
import {ActiveSelectionListener, ActiveSelections} from "../../../../../web/js/ui/popup/ActiveSelections";
import {ActiveSelectionEvent} from "../../../../../web/js/ui/popup/ActiveSelections";
import {Elements} from "../../../../../web/js/util/Elements";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {IDocScale, useDocViewerCallbacks, useDocViewerStore} from "../../DocViewerStore";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {computeTargets} from "../../TextHighlightHandler";
import {DocAnnotations} from "../../../../../web/js/annotation_sidebar/DocAnnotations";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {ActiveHighlightData} from "./AnnotationPopupHooks";
import {SelectedContents} from "../../../../../web/js/highlights/text/selection/SelectedContents";
import {TextHighlighter} from "../../text_highlighter/TextHighlighter";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {DEFAULT_STATE, reducer, ACTIONS} from "./AnnotationPopupReducer";
import {AutoFlashcardHandlerState} from "../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";

export enum AnnotationPopupActionEnum {
    CHANGE_COLOR = "CHANGE_COLOR",
    EDIT = "EDIT",
    CREATE_COMMENT = "CREATE_COMMENT",
    CREATE_FLASHCARD = "CREATE_FLASHCARD",
    CREATE_AI_FLASHCARD = "CREATE_AI_FLASHCARD",
    EDIT_TAGS = "EDIT_TAGS",
    COPY = "COPY",
    DELETE = "DELETE",
};

const AnnotationPopupContext = React.createContext<IAnnotationPopupContext | null>(null);

type IAnnotationPopupProviderProps = {
    docMeta: IDocMeta;
    docScale: IDocScale;
};

type IAnnotationPopupContext = {
    onCreateAnnotation: (color: ColorStr) => void;
    annotation?: IDocAnnotation;
    selectionEvent?: ActiveSelectionEvent;
    setAiFlashcardStatus: (status: AutoFlashcardHandlerState) => void;
    aiFlashcardStatus: AutoFlashcardHandlerState,
    activeAction?: AnnotationPopupActionEnum;
    toggleAction: (action: AnnotationPopupActionEnum) => () => void;
    clear: () => void;
};

const toAnnotation = (docMeta: IDocMeta, activeHighlight: ActiveHighlightData): IDocAnnotation | undefined => {
    const { type, highlightID, pageNum } = activeHighlight;
    if (type === AnnotationType.TEXT_HIGHLIGHT) {
        const highlights = docMeta.pageMetas[pageNum].textHighlights;
        const textHighlight: ITextHighlight | undefined = Object.values(highlights)
            .find(highlight => highlight.guid === highlightID);
        if (textHighlight) {
            return DocAnnotations.createFromTextHighlight(docMeta, textHighlight, docMeta.pageMetas[pageNum]);
        }
    }
    return undefined;
};


export const AnnotationPopupProvider: React.FC<IAnnotationPopupProviderProps> = (props) => {
    const {docMeta, docScale, ...restProps} = props;
    const [state, dispatch] = React.useReducer(reducer, DEFAULT_STATE);
    const {annotation, selectionEvent, activeAction} = state;
    const {activeHighlight, textHighlightColor}
        = useDocViewerStore(["activeHighlight", "textHighlightColor"]);
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const {fileType} = useDocViewerContext();
    const {setActiveHighlight} = useDocViewerCallbacks();
    const annotationMutations = useAnnotationMutationsContext();

    React.useEffect(() => {
        if (activeHighlight) {
            const annotation = toAnnotation(docMeta, activeHighlight);
            if (!annotation) {
                setActiveHighlight(undefined);
            }
            dispatch({ type: ACTIONS.ANNOTATION_SET, payload: annotation });
        }
    }, [activeHighlight, setActiveHighlight, docMeta]);
    
    React.useEffect(() => {
        const targets = computeTargets(fileType, docViewerElementsRef.current.getDocViewerElement);
        const handleSelection: ActiveSelectionListener = (event) => {
            if (!textHighlightColor) {
                if (event.type === "created") {
                    dispatch({ type: ACTIONS.SELECTION_CREATED, payload: event });
                } else {
                    dispatch({ type: ACTIONS.SELECTION_DESTROYED, payload: undefined });
                }
                setActiveHighlight(undefined);
            }
        };

        const cleanupListeners: (() => void)[] = [];

        for (const target of targets) {
            cleanupListeners.push(ActiveSelections.addEventListener(handleSelection, target));
        }
        return () => cleanupListeners.forEach(cleanup => cleanup());
    }, [textHighlightColor, setActiveHighlight, fileType, docViewerElementsRef]);


    const handleCreateAnnotation = React.useCallback((color: ColorStr) => {
        if (selectionEvent) {
            const selectedContent = SelectedContents.computeFromSelection(selectionEvent.selection, {
                noRectTexts: fileType === "epub",
                fileType,
            });
            if (selectedContent.text.length === 0) {
                return;
            }
            const getPageNumberForPageElement = () => {
                const getNumber = (pageElement: HTMLElement) => (
                    parseInt(pageElement.getAttribute("data-page-number")!, 10));
                switch (fileType) {
                    case "pdf":
                        const pdfPageElement = Elements.untilRoot(selectionEvent.element, ".page");
                        return getNumber(pdfPageElement);
                    case "epub":
                        const docViewerElement = docViewerElementsRef.current.getDocViewerElement();
                        const epubPageElement = docViewerElement.querySelector('.page') as HTMLElement;
                        return getNumber(epubPageElement);
                }
            };
            const pageNum = getPageNumberForPageElement()!;

            const pageElement = docViewerElementsRef.current.getPageElementForPage(pageNum)!;
            const {textHighlight} = TextHighlighter.createTextHighlight({
                    docMeta,
                    docScale,
                    pageElement,
                    selectedContent,
                    pageNum,
                    highlightColor: color,
                });

            annotationMutations.onTextHighlight({
                type: 'create',
                docMeta,
                pageMeta: docMeta.pageMetas[pageNum],
                textHighlight,
            });
            setActiveHighlight({
                highlightID: textHighlight.guid,
                type: AnnotationType.TEXT_HIGHLIGHT,
                pageNum,
            });
            selectionEvent.selection.empty();
        }
    }, [docMeta, docScale, annotationMutations, setActiveHighlight, fileType, selectionEvent, docViewerElementsRef]);

    const toggleAction = React.useCallback((action: AnnotationPopupActionEnum) => () => {
        dispatch({ type: ACTIONS.ACTION_TOGGLED, payload: action });
        if (!annotation) {
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

    return <AnnotationPopupContext.Provider value={value} {...restProps} />;
};

export const useAnnotationPopup = () => {
    const context = React.useContext(AnnotationPopupContext);
    if (!context) {
        throw new Error("useAnnotationPopup must be used within a component that's rendered within the AnnotationPopupContextProvider");
    }
    return context;
}

