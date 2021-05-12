import {AutoFlashcardHandlerState} from "../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {ActiveSelectionEvent} from "../../../../../web/js/ui/popup/ActiveSelections";
import {AnnotationPopupActionEnum} from "./AnnotationPopupActionContext";

type IAnnotationPopupState = {
    annotation?: IDocAnnotation;
    selectionEvent?: ActiveSelectionEvent;
    type?: "selection" | "annotation";
    annotationId?: string;
    activeAction?: AnnotationPopupActionEnum;
    pendingAction?: AnnotationPopupActionEnum;
    ai_flashcard_status: AutoFlashcardHandlerState;
};

type Action<K, T = undefined> = {
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
    ai_flashcard_status: "idle",
};

type ISelectionCreatedAction  = Action<typeof ACTIONS.SELECTION_CREATED, ActiveSelectionEvent>;
type ISelectionDestroyed      = Action<typeof ACTIONS.SELECTION_DESTROYED>
type IActionToggledAction     = Action<typeof ACTIONS.ACTION_TOGGLED, AnnotationPopupActionEnum | undefined>;
type IAnnotationSetAction     = Action<typeof ACTIONS.ANNOTATION_SET, IDocAnnotation | undefined>;
type IUpdateAIFlashcardStatus = Action<typeof ACTIONS.UPDATE_AI_FLASHCARD_STATUS, AutoFlashcardHandlerState>;
type IResetAction             = Action<typeof ACTIONS.RESET>;


type IAnnotationPopupReducerActions = 
    ISelectionCreatedAction |
    ISelectionDestroyed |
    IActionToggledAction |
    IAnnotationSetAction |
    IUpdateAIFlashcardStatus |
    IResetAction;


type IAnnotationPopupReducer = React.Reducer<IAnnotationPopupState, IAnnotationPopupReducerActions>;


export const reducer: IAnnotationPopupReducer = (state = {...DEFAULT_STATE}, action) => {
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
    case ACTIONS.UPDATE_AI_FLASHCARD_STATUS:
        return {...state, ai_flashcard_status: action.payload};        
    case ACTIONS.RESET:
        return {...DEFAULT_STATE};
    }
};
