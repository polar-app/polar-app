import {action, makeObservable, observable} from "mobx";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {CursorPositions} from "../contenteditable/CursorPositions";
import {ContentEditables} from "../ContentEditables";
import {Nonces} from "polar-shared/src/util/Nonces";

export interface INoteFormatBarState {
    /**
     * The block element where the selection range exists
     */
    readonly elem: HTMLDivElement;
    
    /**
     * The id of the block that the current selection range is within
     */
    readonly id: BlockIDStr;

    /**
     * A nonce so we can react to changes
     */
    readonly nonce: number;
}

/**
 * Actions that require extra UI elements to be shown on screen
 *
 * eg: creating a link from the active selection
 */
export type INoteFormatBarAction = 'link';

const generateNonce = Nonces.createFactory();

export class NoteFormatBarStore {
    /* eslint-disable functional/prefer-readonly-type */

    /**
     * @see INoteFormatBarState
     */
    @observable private _state: INoteFormatBarState | undefined = undefined;

    /**
     * @see INoteFormatBarAction
     */
    @observable private _action: INoteFormatBarAction | undefined = undefined;

    /**
     * The rect of the currently active selection
     *
     * This is useful when an action requires extra steps (eg: typing something in an input)
     * where the caret needs to be in a different place, because the browser doesn't allow
     * having text selected somewhere and a focused input at the same time.
     *
     * Example: when creating an external link from a selection
     * Here the user needs to paste the link that will replace the selected text,
     * but as soon as the user places their cursor within the input that will contain the link,
     * the currently active selection range disappears because the cursor is being used
     * somewhere else (the link input in this case)
     *
     * This is where the following 2 properties come into play.
     * They save the selection so it can be restored later
     * 
     */
    @observable private _savedRangeRect: ILTRect | undefined = undefined;
    private _savedRange: Range | undefined = undefined;

    /* eslint-enable functional/prefer-readonly-type */

    constructor() {
        makeObservable(this);
    }

    get state() {
        return this._state;
    }

    get savedRangeRect() {
        return this._savedRangeRect;
    }

    get action() {
        return this._action;
    }

    @action setState(state: Omit<INoteFormatBarState, 'nonce'>) {
        this._state = { ...state, nonce: generateNonce() };
    }

    @action setAction(action: INoteFormatBarAction) {
        this._action = action;
    }

    @action toggleAction(action: INoteFormatBarAction) {
        if (this._action === action) {
            if (this._savedRange) {
                this.restoreRange();
            }

            this.clearAction();
        } else {
            this._action = action;
        }
    }

    @action clearSavedRange() {
        this._savedRange = undefined;
        this._savedRangeRect = undefined;
    }

    @action clearAction() {
        this._action = undefined;
        this.clearSavedRange();
    }

    @action clearState() {
        this._state = undefined;
    }

    @action clear() {
        this.clearAction();
        this.clearState();
    }

    public saveRange() {
        const range = ContentEditables.currentRange();

        if (! range) {
            return;
        }

        this._savedRange = range;

        const { top, left, width, height } = range.getBoundingClientRect();
        this._savedRangeRect = {
            top,
            left,
            width,
            height,
        };
    }

    @action restoreRange() {
        if (this._savedRange) {
            CursorPositions.defineNewRange(this._savedRange);
            this.clearSavedRange();
        }
    }
}
