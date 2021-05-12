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

export function usePrevious<T>(value: T): React.MutableRefObject<T | undefined>['current'] {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export enum AnnotationPopupActionEnum {
    CHANGE_COLOR = "CHANGE_COLOR",
    EDIT = "EDIT",
    CREATE_COMMENT = "CREATE_COMMENT",
    CREATE_FLASHCARD = "CREATE_FLASHCARD",
    CREATE_AI_FLASHCARD = "CREATE_AI_FLASHCARD",
    EDIT_TAGS = "EDIT_TAGS",
    COPY = "COPY",
};

const AnnotationPopupActionContext = React.createContext<IAnnotationPopupActionContext | null>(null);

type IAnnotationPopupActionProviderProps = {
    docMeta: IDocMeta;
    docScale: IDocScale;
};

type IAnnotationPopupActionContext = {
    activeAction?: AnnotationPopupActionEnum;
    toggleAction: (action: AnnotationPopupActionEnum) => () => void;
    clear: () => void;
    onCreateAnnotation: () => void;
    annotation?: IDocAnnotation;
    selectionEvent?: ActiveSelectionEvent;
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

type IAnnotationPopupState = {
    annotation?: IDocAnnotation;
    selectionEvent?: ActiveSelectionEvent;
    type?: "selection" | "annotation";
    annotationId?: string;
    activeAction?: AnnotationPopupActionEnum;
    pendingAction?: AnnotationPopupActionEnum;
};

type Action<K, T = undefined> = {
    type: K;
    payload?: T;
};

const ACTIONS = {
    SELECTION_CREATED: "SELECTION_CREATED",
    SELECTION_DESTROYED: "SELECTION_DESTROYED",
    ACTION_TOGGLED: "ACTION_TOGGLED",
    ANNOTATION_SET: "ANNOTATION_SET",
    RESET: "RESET",
} as const;

const DEFAULT_STATE: IAnnotationPopupState = {};

type ISelectionCreatedAction = Action<typeof ACTIONS.SELECTION_CREATED, ActiveSelectionEvent>;
type ISelectionDestroyed     = Action<typeof ACTIONS.SELECTION_DESTROYED>
type IActionToggledAction    = Action<typeof ACTIONS.ACTION_TOGGLED, AnnotationPopupActionEnum>;
type IAnnotationSetAction    = Action<typeof ACTIONS.ANNOTATION_SET, IDocAnnotation>;
type IResetAction            = Action<typeof ACTIONS.RESET>;


type IAnnotationPopupReducerActions = 
    ISelectionCreatedAction |
    ISelectionDestroyed |
    IActionToggledAction |
    IAnnotationSetAction |
    IResetAction;


type IAnnotationPopupReducer = React.Reducer<IAnnotationPopupState, IAnnotationPopupReducerActions>;


const reducer: IAnnotationPopupReducer = (state = {...DEFAULT_STATE}, action) => {
    switch (action.type) {
    case ACTIONS.SELECTION_CREATED:
        return {...DEFAULT_STATE, type: "selection", selectionEvent: action.payload};
    case ACTIONS.SELECTION_DESTROYED:
        if (state.annotation && state.type === "annotation") {
            return state;
        } else {
            return {...DEFAULT_STATE};
        }
    case ACTIONS.ACTION_TOGGLED:
        if (state.annotation) {
            return {...state, activeAction: state.activeAction === action.payload ? undefined : action.payload};
        } else {
            return {...state, activeAction: action.payload, pendingAction: action.payload};
        }
    case ACTIONS.ANNOTATION_SET:
        if (state.pendingAction) {
            return {
                ...DEFAULT_STATE,
                annotation: action.payload,
                type: "annotation",
                activeAction: state.pendingAction,
                annotationId: action.payload?.guid,
            };
        } else if (action.payload && action.payload.guid !== state.annotationId) {
            return {
                ...DEFAULT_STATE,
                type: "annotation",
                annotation: action.payload,
                annotationId: action.payload?.guid,
            };
        } else {
            return {
                ...state,
                annotation: action.payload,
                annotationId: action.payload?.guid,
            };
        }
    case ACTIONS.RESET:
        return {...DEFAULT_STATE};
    }
};

export const AnnotationPopupActionProvider: React.FC<IAnnotationPopupActionProviderProps> = (props) => {
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
                    dispatch({ type: ACTIONS.SELECTION_DESTROYED });
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


    const handleCreateAnnotation = React.useCallback(() => {
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
                    highlightColor: "red",
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
            handleCreateAnnotation();
        }
    }, [annotation, handleCreateAnnotation, dispatch]);

    const clear = React.useCallback(() => {
        dispatch({ type: ACTIONS.ACTION_TOGGLED });
    }, []);

    const value: IAnnotationPopupActionContext = {
        toggleAction,
        activeAction,
        clear,
        annotation,
        onCreateAnnotation: handleCreateAnnotation,
        selectionEvent,
    };

    return <AnnotationPopupActionContext.Provider value={value} {...restProps} />;
};

export const useAnnotationPopupAction = () => {
    const context = React.useContext(AnnotationPopupActionContext);
    if (!context) {
        throw new Error("useAnnotationPopupAction must be used within a component that's rendered within the AnnotationPopupActionContextProvider");
    }
    return context;
}

