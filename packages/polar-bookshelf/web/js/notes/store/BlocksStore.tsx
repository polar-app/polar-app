import * as React from "react";
import {createReactiveStore} from "../../react/store/ReactiveStore";
import {action, computed, makeObservable, observable} from "mobx"
import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import {NoteTargetStr} from "../NoteLinkLoader";
import {isPresent} from "polar-shared/src/Preconditions";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {INote} from "./INote";
import {ReverseIndex} from "./ReverseIndex";
import {Note} from "./Note";
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import { Numbers } from "polar-shared/src/util/Numbers";
import {CursorPositions} from "../contenteditable/CursorPositions";

export type NoteIDStr = IDStr;
export type NoteNameStr = string;

export type NoteType = 'item' | 'named';

export type NotesIndex = {[id: string /* NoteIDStr */]: Note};
export type NotesIndexByName = {[name: string /* NoteNameStr */]: NoteIDStr};

export type ReverseNotesIndex = {[id: string /* NoteIDStr */]: NoteIDStr[]};

export type StringSetMap = {[key: string]: boolean};

// export type NoteContent = string | ITypedContent<'markdown'> | ITypedContent<'name'>;
export type NoteContent = string;

/**
 * A offset into the content of a not where we should place the cursor.
 */
export type NoteContentOffset = number;

/**
 * The position to place the cursor when jumping between items.
 *
 * When 'start' jump to the start.
 *
 * When 'end' jump to the end of the note.
 *
 * When undefined, make no jump.
 */
export type NavPosition = 'start' | 'end' | NoteContentOffset;

export interface INoteActivated {
    readonly note: INote;
    readonly activePos: NavPosition | undefined;
}

interface DoPutOpts {

    /**
     * The new active node after the put operation.
     */
    readonly newActive?: IActiveNote;

    /**
     * Expand the give parent note.
     */
    readonly newExpand?: NoteIDStr;

}

export type NewNotePosition = 'before' | 'after' | 'split';

export type NewChildPos = 'before' | 'after';

export interface INewChildPosition {
    readonly ref: NoteIDStr;
    readonly pos: NewChildPos;
}

export interface ISplitNote {
    readonly prefix: string;
    readonly suffix: string;
}

export interface DeleteNoteRequest {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
}

export interface IMutation<E, V> {
    readonly error?: E;
    readonly value?: V;
}

export interface INoteMerge {
    readonly source: NoteIDStr;
    readonly target: NoteIDStr;
}

export interface NavOpts {
    readonly shiftKey: boolean;
}

/**
 * The result of a createNote operation.
 */
export interface ICreatedNote {
    /**
     * The ID of the newly created note.
     */
    readonly id: NoteIDStr;

    /**
     * The parent of the newly created note.
     */
    readonly parent: NoteIDStr;
}

export type DoIndentResult = IMutation<'no-note' | 'no-parent' | 'no-parent-note' | 'no-sibling', NoteIDStr>;

export type DoUnIndentResult = IMutation<'no-note' | 'no-parent' | 'no-parent-note' | 'no-parent-note-parent' | 'no-parent-note-parent-note', NoteIDStr>

/**
 * The active note and the position it should be set to once it's made active.
 */
export interface IActiveNote {

    readonly id: NoteIDStr;

    /**
     * The position within the note.  When undefined, do not jump the position
     * and keep the cursor where it is.
     */
    readonly pos: NavPosition | undefined;

}

export class BlocksStore {

    @observable _index: NotesIndex = {};

    @observable _indexByName: NotesIndexByName = {};

    /**
     * The reverse index so that we can build references to this node.
     */
    @observable _reverse: ReverseIndex = new ReverseIndex();

    /**
     * The current root note
     */
    @observable public root: NoteIDStr | undefined = undefined;

    /**
     * The currently active note.
     */
    @observable _active: IActiveNote | undefined = undefined;
    /**
     * The notes that are expanded.
     */
    @observable _expanded: StringSetMap = {};

    /**
     * The nodes that are selected by the user so that they can be highlighted in the UI.
     */
    @observable _selected: StringSetMap = {};

    @observable _dropTarget: NoteIDStr | undefined = undefined;

    @observable _dropSource: NoteIDStr | undefined = undefined;

    /**
     * Used so that when we change the selected notes, that we know which is the
     * FIRST so that we can compute a from and to based on their position.
     */
    @observable _selectedAnchor: IDStr | undefined = undefined;

    constructor() {
        this.root = undefined;
        makeObservable(this);
    }

    @computed get index() {
        return this._index;
    }

    @computed get indexByName() {
        return this._indexByName;
    }

    /**
     * Get all the nodes by name.
     */
    getNamedNodes() {
        return Object.keys(this._indexByName);
    }

    @computed get reverse() {
        return this._reverse;
    }

    @computed get expanded() {
        return this._expanded;
    }

    // @computed get root() {
    //     return this._root;
    // }

    @computed get active() {
        return this._active;
    }

    @computed get selected() {
        return this._selected;
    }

    selectedIDs() {
        return Object.keys(this._selected);
    }

    @action public clearSelected(reason: string) {
        this._selected = {};
        this._selectedAnchor = undefined;
    }

    @computed get dropTarget() {
        return this._dropTarget;
    }

    @action public setDropTarget(dropTarget: NoteIDStr) {
        this._dropTarget = dropTarget;
    }

    @computed get dropSource() {
        return this._dropSource;
    }

    @action public setDropSource(dropSource: NoteIDStr) {
        this._dropSource = dropSource;
    }

    @action public clearDrop() {
        this._dropTarget = undefined;
        this._dropSource = undefined;
    }

    /**
     * Return true if the given note is active.
     */
    public isActive(id: NoteIDStr): boolean {
        return this._active?.id === id;
    }

    public lookup(notes: ReadonlyArray<NoteIDStr>): ReadonlyArray<INote> {

        return notes.map(current => this._index[current])
            .filter(current => current !== null && current !== undefined);

    }

    public lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr> {
        return this._reverse.get(id);
    }

    @action public doPut(notes: ReadonlyArray<INote>, opts: DoPutOpts = {}) {

        for (const inote of notes) {

            const note = new Note(inote);
            this._index[inote.id] = note;

            if (inote.type === 'named') {
                this._indexByName[inote.content] = note.id;
            }

            for (const link of note.links) {
                this._reverse.add(link, note.id);
            }

        }

        this._active = opts.newActive ? opts.newActive : this._active;

        if (opts.newExpand) {
            this._expanded[opts.newExpand] = true;
        }

    }

    public hasSelected(): boolean {
        return Object.keys(this._selected).length > 0;
    }

    public getNote(id: NoteIDStr): Note | undefined {
        return this._index[id] || undefined;
    }

    public getParent(id: NoteIDStr): Note | undefined {

        const note = this._index[id];

        if (note) {

            if (note.parent) {
                return this._index[note.parent] || undefined;
            }

        }

        return undefined;

    }

    private doSibling(id: NoteIDStr, type: 'prev' | 'next'): NoteIDStr | undefined {

        const parent = this.getParent(id);

        if (parent) {

            const idx = parent.items.indexOf(id);

            if (idx !== -1) {

                switch (type) {

                    case "prev":
                        return Arrays.prevSibling(parent.items, idx);
                    case "next":
                        return Arrays.nextSibling(parent.items, idx);

                }

            }

        }

        return undefined;

    }

    public prevSibling(id: NoteIDStr) {
        return this.doSibling(id, 'prev');
    }

    public nextSibling(id: NoteIDStr) {
        return this.doSibling(id, 'next');
    }


    public getNoteByTarget(target: NoteIDStr | NoteTargetStr): Note | undefined {

        const noteByID = this._index[target];

        if (noteByID) {
            return noteByID;
        }

        const noteRefByName = this._indexByName[target];

        if (noteRefByName) {
            return this._index[noteRefByName] || undefined;
        }

        return undefined;

    }

    public getNoteByName(name: NoteNameStr): Note | undefined {

        const noteRefByName = this._indexByName[name];

        if (noteRefByName) {
            return this._index[noteRefByName] || undefined;
        }

        return undefined;

    }


    public getActiveNote(id: NoteIDStr): Note | undefined {

        const active = this._active;

        if ( ! active) {
            return undefined;
        }

        return this._index[id] || undefined;
    }

    public filterNotesByName(filter: string): ReadonlyArray<NoteNameStr> {

        filter = filter.toLowerCase();

        return Object.keys(this._indexByName)
            .filter(key => key.toLowerCase().indexOf(filter) !== -1);

    }


    @action public expand(id: NoteIDStr) {
        this._expanded[id] = true;
    }

    @action public collapse(id: NoteIDStr) {
        delete this._expanded[id];
    }


    @action public setSelectionRange(fromNote: NoteIDStr, toNote: NoteIDStr) {

        if (! this.root) {
            throw new Error("No root");
        }

        const linearExpansionTree = [this.root, ...this.computeLinearExpansionTree2(this.root)];

        const fromNoteIdx = linearExpansionTree.indexOf(fromNote);
        const toNoteIdx = linearExpansionTree.indexOf(toNote);

        if (fromNoteIdx === -1) {
            throw new Error("selectedAnchor not found: " + fromNote);
        }

        if (toNoteIdx === -1) {
            throw new Error("toNoteIdx not found");
        }

        const min = Math.min(fromNoteIdx, toNoteIdx);
        const max = Math.max(fromNoteIdx, toNoteIdx);

        const newSelected
            = arrayStream(Numbers.range(min, max))
                 .map(current => linearExpansionTree[current])
                 .toMap2(current => current, () => true);

        this._selected = newSelected;

    }

    @action public doNav(delta: 'prev' | 'next',
                         pos: NavPosition,
                         opts: NavOpts): boolean {

        if (this.root === undefined) {
            console.warn("No currently active root");
            return false;
        }

        if (this._active === undefined) {
            console.warn("No currently active node");
            return false;
        }

        const rootNote = Arrays.first(this.lookup([this.root]));

        if (! rootNote) {
            console.warn("No note in index for ID: ", this.root);
            return false;
        }

        const items = [
            this.root,
            ...this.computeLinearExpansionTree(this.root)
        ];

        const childIndex = items.indexOf(this._active?.id);

        if (childIndex === -1) {
            console.warn(`Child ${this._active.id} not in note items`);
            return false;
        }

        const deltaIndex = delta === 'prev' ? -1 : 1;

        const activeIndexWithoutBound = childIndex + deltaIndex;
        const activeIndex = Math.min(Math.max(0, activeIndexWithoutBound), items.length -1);

        const newActive = items[activeIndex];

        if (opts.shiftKey) {

            if (this.hasSelected()) {
                this.setSelectionRange(this._selectedAnchor!, newActive);
            } else {

                // only select the entire/current node at first.
                this._selected[this._active?.id] = true;
                this._selectedAnchor = this._active?.id;

                function clearSelection() {
                    const sel = window.getSelection()!;
                    sel.getRangeAt(0).collapse(true);
                }

                // TODO: this probably shouldn't be here - in the store.
                clearSelection();

                return true;
            }

        } else {
            // no shift key so by definition nothing is selected so clear the selections
            this._selected = {};
            this._selectedAnchor = undefined;
        }

        this.setActiveWithPosition(newActive, pos);

        return true;

    }

    public navPrev(pos: NavPosition, opts: NavOpts) {
        return this.doNav('prev', pos, opts);
    }

    public navNext(pos: NavPosition, opts: NavOpts) {
        return this.doNav('next', pos, opts);
    }

    public toggleExpand(id: NoteIDStr) {

        if (this._expanded[id]) {
            this.collapse(id);
        } else {
            this.expand(id);
        }

    }

    /**
     * A 'linear' expansion tree is are the list of expanded nodes as a series
     * as if you enumerated them from top to bottom.
     *
     * So for example:
     *
     * - A
     *     - B
     *     - C
     * - D
     *
     * The result would be [A, B, C, D]
     */
    private computeLinearExpansionTree(id: NoteIDStr,
                                       root: boolean = true): ReadonlyArray<NoteIDStr> {

        const note = this._index[id];

        if (! note) {
            console.warn("computeLinearExpansionTree: No note: ", id);
            return [];
        }

        const isExpanded = root ? true : this._expanded[id];

        if (isExpanded) {
            const items = (note.items || []);

            const result = [];

            for (const item of items) {
                result.push(item);
                result.push(...this.computeLinearExpansionTree(item, false));
            }

            return result;

        } else {
            return [];
        }

    }

    private computeLinearExpansionTree2(id: NoteIDStr): ReadonlyArray<NoteIDStr> {

        const note = this._index[id];

        if (! note) {
            console.warn("computeLinearExpansionTree2: No note: ", id);
            return [];
        }

        const isExpanded = this._expanded[id] || id === this.root;

        if (isExpanded) {
            const items = (note.items || []);

            const result = [];

            for (const item of items) {
                result.push(item);
                result.push(...this.computeLinearExpansionTree(item, false));
            }

            return result;

        } else {
            return [];
        }

    }


    @action public setActive(active: NoteIDStr | undefined) {

        if (active) {
            this._active = {
                id: active,
                pos: undefined
            };
        } else {
            this._active = undefined;
        }

    }

    @action public setActiveWithPosition(active: NoteIDStr | undefined,
                                         activePos: NavPosition | undefined) {

        if (active) {
            this._active = {
                id: active,
                pos: activePos
            };
        } else {
            this._active = undefined;
        }

    }

    @action public setRoot(root: NoteIDStr | undefined) {
        this.root = root;
    }

    public isExpanded(id: NoteIDStr): boolean {
        return isPresent(this._expanded[id]);
    }

    public isSelected(id: NoteIDStr): boolean {
        return isPresent(this._selected[id]);
    }

    public getNoteActivated(id: NoteIDStr): INoteActivated | undefined {

        const active = this._active;

        if (! active) {
            return undefined;
        }

        if (id !== active.id) {
            return undefined;
        }

        const note = this._index[active.id];

        if (note) {
            return {note, activePos: active.pos};
        } else {
            return undefined;
        }

    }

    /**
     * Return true if this note can be merged. Meaning it has a previous sibling
     * we can merge with.
     */
    public canMerge(id: NoteIDStr): INoteMerge | undefined {

        const prevSibling = this.prevSibling(id);

        if (prevSibling) {
            return {
                source: id,
                target: prevSibling
            }
        }

        const note = this.getNote(id);

        if (note?.parent) {
            return {
                source: id,
                target: note.parent
            }
        }

        return undefined;

    }

    @action public mergeNotes(target: NoteIDStr, source: NoteIDStr) {

        const targetNote = this._index[target];
        const sourceNote = this._index[source];

        if (targetNote.type !== sourceNote.type) {
            console.warn("Note types are incompatible and can't be merged");
            return 'incompatible-note-types';
        }

        const offset = CursorPositions.renderedTextLength(targetNote.content);

        const items = [...targetNote.items, ...sourceNote.items];
        const links = [...targetNote.links, ...sourceNote.links];

        const newContent = targetNote.content + " " + sourceNote.content;
        targetNote.setContent(newContent);
        targetNote.setItems(items);
        targetNote.setLinks(links);

        const deleteSourceNote = () => {
            // we have to set items to an empty array or doDelete will also remove the children recursively.
            sourceNote.setItems([]);
            this.doDelete([sourceNote.id]);
        }

        deleteSourceNote();

        this.setActiveWithPosition(targetNote.id, offset);

        return undefined;

    }

    /**
     * Create a new named note but only when a note with this name does not exist.
     */
    @action public createNewNamedNote(name: NoteNameStr): NoteIDStr {

        const existingNote = this.getNoteByName(name);

        if (existingNote) {
            // note already exists...
            return existingNote.id;
        }

        function createNewNote(): INote {
            const now = ISODateTimeStrings.create()
            return {
                id: Hashcodes.createRandomID(),
                parent: undefined,
                type: 'named',
                content: name,
                created: now,
                updated: now,
                items: [],
                links: []
            };
        }

        const newNote = createNewNote();

        this.doPut([newNote]);

        return newNote.id;

    }

    /**
     * Create a new note in reference to the note with given ID.
     */
    @action public createNewNote(id: NoteIDStr,
                                 split?: ISplitNote): ICreatedNote {

        // *** we first have to compute the new parent this has to be computed
        // based on the expansion tree because if the current note setup is like:
        //
        // - first
        // - second
        //
        // and we are creating a note on 'first' then the new note should be
        // between first and second like:
        //
        //
        // - first
        // - *new note*
        // - second
        //
        // However if we have:
        //
        // - first
        //     - first child item
        // - second
        //
        // then we have to create it like:
        // - first
        //     - *new note*
        //     - first child item
        // - second

        /**
         * A new note instruction that creates the note relative to a sibling
         * and provides the parent.
         */
        interface INewNotePositionRelative {
            readonly type: 'relative';
            readonly parentNote: Note;
            readonly ref: NoteIDStr;
            readonly pos: NewChildPos;
        }

        interface INewNotePositionFirstChild {
            readonly type: 'first-child';
            readonly parentNote: Note;
        }

        const computeNewNotePosition = (): INewNotePositionRelative | INewNotePositionFirstChild => {

            const linearExpansionTree = this.computeLinearExpansionTree2(id);

            const nextNoteID = Arrays.first(linearExpansionTree);

            const createNewNotePositionRelative = (ref: NoteIDStr, pos: NewChildPos): INewNotePositionRelative => {

                const note = this.getNote(ref)!;
                const parentNote = this.getNote(note.parent!)!;

                return {
                    type: 'relative',
                    parentNote,
                    ref,
                    pos
                };

            }

            if (nextNoteID) {
                return createNewNotePositionRelative(nextNoteID, 'before')
            } else {

                const note = this.getNote(id)!;

                if (note.parent) {

                    const parentNote = this.getNote(note.parent)!;

                    return {
                        type: 'relative',
                        parentNote,
                        ref: id,
                        pos: 'after'
                    }

                } else {

                    return {
                        type: 'first-child',
                        parentNote: note
                    }

                }

            }


        }

        function createNewNote(parentNote: Note): INote {
            const now = ISODateTimeStrings.create()

            const id = Hashcodes.createRandomID();

            const items = newNoteInheritsItems ? currentNote.items : [];

            return {
                id,
                parent: parentNote.id,
                type: 'item',
                content: split?.suffix || '',
                created: now,
                updated: now,
                items,
                links: []
            };

        }

        const newNoteInheritsItems = split?.suffix !== undefined && split?.suffix !== '';

        const currentNote = this.getNote(id)!;

        const newNotePosition = computeNewNotePosition();

        const {parentNote} = newNotePosition;

        const newNote = createNewNote(parentNote);

        this.doPut([newNote]);

        switch(newNotePosition.type) {

            case "relative":
                parentNote.addItem(newNote.id, newNotePosition);
                break;
            case "first-child":
                parentNote.addItem(newNote.id, 'first-child');
                break;

        }

        if (split?.suffix !== undefined && newNote.items.length > 0) {
            this.expand(newNote.id);
        }

        if (split?.prefix !== undefined) {
            currentNote.setContent(split.prefix);

            if (newNoteInheritsItems) {
                currentNote.setItems([]);
            }

        }

        this.setActiveWithPosition(newNote.id, 'start');

        return {
            id: newNote.id,
            parent: newNote.parent!
        };

    }

    private cursorOffsetCapture(): IActiveNote | undefined {

        const captureOffset = (): number | undefined => {

            if (this.active !== undefined) {

                const range = document.getSelection()!.getRangeAt(0);
                return CursorPositions.computeCurrentOffset(range.startContainer as HTMLElement);

            }

            return undefined;

        }

        if (this.active) {
            const id = this.active.id;
            const pos = captureOffset();

            return {id, pos};
        } else {
            return undefined;
        }


    }

    @action private cursorOffsetRestore(active: IActiveNote | undefined) {

        if (active?.id) {

            this._active = {
                ...active
            }

        }

    }

    /**
     * A note is only indentable if it has a parent and we are not the first
     * child in that parent. IE it must have a previous sibling so that we can
     * be
     */
    public isIndentable(id: NoteIDStr): boolean {

        const note = this.getNote(id);

        if (! note) {
            return false;
        }

        if (! note.parent) {
            return false;
        }

        const parentNote = this.getNote(note.parent);

        if (! parentNote) {
            // this is a bug and shouldn't happen
            return false;
        }

        return parentNote.items.indexOf(id) !== 0;

    }

    private computeSelectedIndentableNoteIDs(): ReadonlyArray<NoteIDStr> {
        const selectedIDs = this.selectedIDs();
        return selectedIDs.filter(current => this.isIndentable(current));
    }

    /**
     * Make the active note a child of the prev sibling.
     *
     * @return The new parent NoteID or the code as to why it couldn't be re-parented.
     */
    public doIndent(id: NoteIDStr): ReadonlyArray<DoIndentResult> {

        const doExec = (id: NoteIDStr): DoIndentResult => {

            console.log("doIndent: " + id);

            const note = this._index[id];

            if (! note) {
                return {error: 'no-note'};
            }

            if (! note.parent) {
                return {error: 'no-parent'};
            }

            const parentNote = this._index[note.parent];

            if (! parentNote) {
                console.warn("No parent note for id: " + note.parent);
                return {error: 'no-parent-note'};
            }

            const parentItems = (parentNote.items || []);

            // figure out the sibling index in the parent
            const siblingIndex = parentItems.indexOf(id);

            if (siblingIndex > 0) {

                const newParentID = parentItems[siblingIndex - 1];

                const newParentNote = this._index[newParentID];

                // *** remove myself from my parent

                parentNote.removeItem(id);

                // ***: add myself to my newParent

                newParentNote.addItem(id);

                note.setParent(newParentNote.id);
                this.expand(newParentID);

                return {value: newParentNote.id};

            } else {
                return {error: 'no-sibling'};
            }

        }

        const cursorOffset = this.cursorOffsetCapture();

        try {

            if (this.hasSelected()) {
                return this.computeSelectedIndentableNoteIDs().map(id => doExec(id));
            } else {
                return [doExec(id)];
            }

        } finally {
            this.cursorOffsetRestore(cursorOffset);
        }

    }

    public isUnIndentable(id: NoteIDStr) {

        if (id === this.root) {
            return false;
        }

        const note = this.getNote(id);

        if (! note) {
            return false;
        }

        if (! note.parent) {
            // this is the root...
            return false;
        }

        if (note.parent === this.root) {
            return false;
        }

        return true;

    }

    private computeSelectedUnIndentableNoteIDs(): ReadonlyArray<NoteIDStr> {
        const selectedIDs = this.selectedIDs();
        return selectedIDs.filter(current => this.isUnIndentable(current));
    }

    public doUnIndent(id: NoteIDStr): ReadonlyArray<DoUnIndentResult> {

        const doExec = (id: NoteIDStr): DoUnIndentResult => {

            console.log("doUnIndent: " + id);

            const note = this._index[id];

            if (! note) {
                return {error: 'no-note'};
            }

            if (! note.parent) {
                return {error: 'no-parent'};
            }

            const parentNote = this._index[note.parent];

            if (! parentNote) {
                return {error: 'no-parent-note'};
            }

            if (! parentNote.parent) {
                return {error: 'no-parent-note-parent'};
            }

            const newParentNote = this._index[parentNote.parent];

            if (! newParentNote) {
                return {error: 'no-parent-note-parent-note'};
            }

            note.setParent(newParentNote.id);
            newParentNote.addItem(id, {pos: 'after', ref: parentNote.id});
            parentNote.removeItem(id);

            return {value: id};

        };

        const cursorOffset = this.cursorOffsetCapture();

        try {

            if (this.hasSelected()) {
                return this.computeSelectedUnIndentableNoteIDs().map(id => doExec(id));
            } else {
                return [doExec(id)];
            }

        } finally {
            this.cursorOffsetRestore(cursorOffset);
        }

    }

    public noteIsEmpty(id: NoteIDStr): boolean {

        const note = this._index[id];
        return note?.content.trim() === '';

    }

    @action public doDelete(noteIDs: ReadonlyArray<NoteIDStr>) {

        interface NextActive {
            readonly active: NoteIDStr;
            readonly activePos: NavPosition;
        }

        const computeNextActive = (): NextActive | undefined => {

            const noteID = notesToDelete[0];
            const note = this._index[noteID];

            if (! note) {
                console.log("No note for ID: " + noteID)
                return undefined;
            }

            if (! note.parent) {
                console.log("No parent for ID: " + noteID)
                return undefined;
            }

            const linearExpansionTree = this.computeLinearExpansionTree(note.parent);

            const deleteIndexes = arrayStream(notesToDelete)
                .map(current => linearExpansionTree.indexOf(current))
                .filter(current => current !== -1)
                .sort((a, b) => a - b)
                .collect()

            if (deleteIndexes.length === 0) {
                return undefined;
            }

            const head = linearExpansionTree.slice(0, Arrays.first(deleteIndexes));
            const tail = linearExpansionTree.slice(Arrays.last(deleteIndexes)! + 1);

            const tailFirst = Arrays.first(tail);

            if (tailFirst !== undefined) {
                return {
                    active: tailFirst,
                    activePos: 'start'
                }
            }

            const headLast = Arrays.last(head);

            if (headLast !== undefined) {
                return {
                    active: headLast,
                    activePos: 'start'
                }
            }

            return {
                active: note.parent,
                activePos: 'start'
            };

        }

        const handleDelete = (notes: ReadonlyArray<NoteIDStr>) => {

            let deleted: number = 0;

            for (const noteID of notes) {

                const note = this._index[noteID];

                if (note) {

                    // *** first delete all children,  We have to do this first
                    // or else they won't have parents.

                    handleDelete(note.items);

                    // *** delete the id for this note from the parents items.

                    if (note.parent) {

                        const parentNote = this._index[note.parent];

                        if (! parentNote) {
                            console.warn(`handleDelete: Note ${note.id} (${noteID}) has no parent for ID ${note.parent}`);
                            continue;
                        }

                        parentNote.removeItem(note.id);

                    }

                    // we have to capture this before we delete the node
                    // and keep a snapshot of it
                    const inboundIDs = [...this.reverse.get(note.id)];

                    // *** delete the note from the index
                    delete this._index[note.id];

                    // *** delete the note from name index by name.
                    if (note.type === 'named') {
                        delete this._indexByName[note.content];
                    }

                    // *** delete the reverse index for this item

                    for (const inboundID of inboundIDs) {
                        this.reverse.remove(note.id, inboundID);
                    }

                    ++deleted;

                }

            }

            return deleted;

        };

        const selected = this.selectedIDs();

        const notesToDelete = selected.length > 0 ? selected : noteIDs;

        if (notesToDelete.length === 0) {
            return;
        }

        const nextActive = computeNextActive();

        if (handleDelete(notesToDelete) > 0) {

            if (nextActive) {
                this.setActiveWithPosition(nextActive.active, nextActive.activePos);
            }

            // we have to clear now because the notes we deleted might have been selected
            this.clearSelected('doDelete');

        }

    }

    /**
     * Compute the path to a note from its parent but not including the actual note.
     */
    public pathToNote(id: NoteIDStr): ReadonlyArray<Note> {

        let current = this._index[id];

        const result = [];

        while (current.parent) {
            const parentNote = this._index[current.parent];
            result.push(parentNote);
            current = parentNote;
        }

        return result.reverse();

    }

}

export const [NotesStoreProvider, useNotesStoreDelegate] = createReactiveStore(() => new BlocksStore())

export function useNotesStore() {
    const delegate = useNotesStoreDelegate();
    return delegate;
}
