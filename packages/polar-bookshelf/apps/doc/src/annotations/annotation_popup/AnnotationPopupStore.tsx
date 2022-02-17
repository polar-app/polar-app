import {action, makeObservable, observable} from "mobx";
import {IAutoFlashcardHandlerState} from "../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {IAutoClozeDeletionHandlerState} from "../../../../../web/js/annotation_sidebar/AutoClozeDeletionHook";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {ActiveSelectionEvent} from "../../../../../web/js/ui/popup/ActiveSelections";
import {AnnotationPopupActionEnum} from "./AnnotationPopupContext";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";

export type IAnnotationCreator = (color: ColorStr, event: ActiveSelectionEvent) => void;

export class AnnotationPopupStore {
    /* eslint-disable functional/prefer-readonly-type */

    @observable private _selectedAnnotationID: BlockIDStr | undefined = undefined;
    @observable private _selectionEvent: ActiveSelectionEvent | undefined = undefined;
    @observable private _activeAction: AnnotationPopupActionEnum | undefined = undefined;
    @observable private _aiFlashcardStatus: IAutoFlashcardHandlerState = 'idle';
    @observable private _aiClozeFlashcardStatus: IAutoClozeDeletionHandlerState = 'idle';

    public createAnnotationFromSelectionEvent: IAnnotationCreator;

    /* eslint-enable functional/prefer-readonly-type */

    constructor(annotationCreator: IAnnotationCreator) {
        makeObservable(this);

        this.createAnnotationFromSelectionEvent = annotationCreator;
    }

    get selectedAnnotationID() {
        return this._selectedAnnotationID;
    }

    get selectionEvent() {
        return this._selectionEvent;
    }

    get activeAction() {
        return this._activeAction;
    }

    get aiFlashcardStatus() {
        return this._aiFlashcardStatus;
    }

    get aiClozeFlashcardStatus() {
        return this._aiClozeFlashcardStatus;
    }

    @action setSelection(event: ActiveSelectionEvent) {
        this._selectionEvent = event;
    }

    @action setSelectedAnnotationID(id: BlockIDStr) {
        this._selectedAnnotationID = id;
    }

    @action setAiFlashcardStatus(status: IAutoFlashcardHandlerState) {
        this._aiFlashcardStatus = status;
    }

    @action setAiClozeFlashcardStatus(status: IAutoClozeDeletionHandlerState) {
        this._aiClozeFlashcardStatus = status;
    }

    @action toggleActiveAction(action: AnnotationPopupActionEnum) {
        if (action === this._activeAction) {
            this._activeAction = undefined;
            return;
        }

        if (! this._selectionEvent && ! this._selectedAnnotationID) {
            return;
        }

        if (! this._selectedAnnotationID && this._selectionEvent) {
            this.createAnnotationFromSelectionEvent(MAIN_HIGHLIGHT_COLORS[0], this._selectionEvent);
        }
        this._activeAction = action;
    }

    @action clearActiveAction() {
        this._activeAction = undefined;
    }

    @action reset() {
        this._selectedAnnotationID = undefined;
        this._selectionEvent = undefined;
        this._activeAction = undefined;
        this._aiFlashcardStatus = 'idle';
    }
}

