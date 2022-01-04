import {TextHighlightAnnotationContent} from "../../../../../web/js/notes/content/AnnotationContent";
import {Block} from "../../../../../web/js/notes/store/Block";
import {IAutoFlashcardHandlerState} from "../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {ActiveSelectionEvent} from "../../../../../web/js/ui/popup/ActiveSelections";
import {AnnotationPopupActionEnum} from "./AnnotationPopupContext";

export type IBlockAnnotation = Block<TextHighlightAnnotationContent>;

type IAnnotationPopupState = {
    annotation?: IBlockAnnotation;
    selectionEvent?: ActiveSelectionEvent;
    type?: "selection" | "annotation";
    annotationId?: string;
    activeAction?: AnnotationPopupActionEnum;
    pendingAction?: AnnotationPopupActionEnum;
    aiFlashcardStatus: IAutoFlashcardHandlerState;
};

type Action<K, T> = {
    type: K;
    payload: T;
};

export const ACTIONS = {
    SELECTION_CREATED: "SELECTION_CREATED",
    SELECTION_DESTROYED: "SELECTION_DESTROYED",
    ACTION_TOGGLED: "ACTION_TOGGLED",
    ANNOTATION_SET: "ANNOTATION_SET",
    UPDATE_AI_FLASHCARD_STATUS: "UPDATE_AI_FLASHCARD_STATUS",
    RESET: "RESET",
} as const;

export const DEFAULT_STATE: IAnnotationPopupState = {
    aiFlashcardStatus: "idle",
};

type ISelectionCreatedAction  = Action<typeof ACTIONS.SELECTION_CREATED, ActiveSelectionEvent>;
type ISelectionDestroyed      = Action<typeof ACTIONS.SELECTION_DESTROYED, undefined>
type IActionToggledAction     = Action<typeof ACTIONS.ACTION_TOGGLED, AnnotationPopupActionEnum | undefined>;
type IAnnotationSetAction     = Action<typeof ACTIONS.ANNOTATION_SET, IBlockAnnotation | undefined>;
type IUpdateAIFlashcardStatus = Action<typeof ACTIONS.UPDATE_AI_FLASHCARD_STATUS, IAutoFlashcardHandlerState>;
type IResetAction             = Action<typeof ACTIONS.RESET, undefined>;


type IAnnotationPopupReducerActions = 
    ISelectionCreatedAction |
    ISelectionDestroyed |
    IActionToggledAction |
    IAnnotationSetAction |
    IUpdateAIFlashcardStatus |
    IResetAction;


type IAnnotationPopupReducer = React.Reducer<IAnnotationPopupState, IAnnotationPopupReducerActions>;


export const reducer: IAnnotationPopupReducer = (state = {...DEFAULT_STATE}, action): IAnnotationPopupState => {
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
        const id = action.payload
                ? action.payload.id
                : undefined;
        if (state.pendingAction) {
            return {
                ...DEFAULT_STATE,
                annotation: action.payload,
                type: "annotation",
                activeAction: state.pendingAction,
                annotationId: id,
            };
        } else if (action.payload) {
            return {
                ...DEFAULT_STATE,
                activeAction: state.activeAction,
                type: "annotation",
                annotation: action.payload,
                annotationId: id,
            };
        } else {
            return {
                ...state,
                annotation: action.payload,
                annotationId: id,
            };
        }
    case ACTIONS.UPDATE_AI_FLASHCARD_STATUS:
        return {...state, aiFlashcardStatus: action.payload};        
    case ACTIONS.RESET:
        return {...DEFAULT_STATE};
    }
};
