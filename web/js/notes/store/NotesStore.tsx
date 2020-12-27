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
import {INoteEditorMutator} from "./NoteEditorMutator";

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
 * The position to place the cursor when jumping between items.
 *
 * When 'start' jump to the start.
 *
 * When 'end' jump to the end of the note.
 *
 * When undefined, make no jump.
 */
export type NavPosition = 'start' | 'end' | undefined;

export interface INoteActivated {
    readonly note: INote;
    readonly activePos: NavPosition;
}

interface DoPutOpts {

    /**
     * The new active node after the put operation.
     */
    readonly newActive?: NoteIDStr;

    /**
     * Expand the give parent note.
     */
    readonly newExpand?: NoteIDStr;

}

export type NewNotePosition = 'before' | 'after' | 'split';

export interface INewChildPosition {
    readonly ref: NoteIDStr;
    readonly pos: 'before' | 'after';
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



export class NotesStore {

    @observable _noteEditors: {[id: string]: INoteEditorMutator} = {}

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
    @observable _active: NoteIDStr | undefined = undefined;

    /**
     * The position to place the cursor when we jump between items.
     */
    @observable _activePos: NavPosition = 'start';

    /**
     * The nodes that are expanded.
     */
    @observable _expanded: StringSetMap = {};


    /**
     * The nodes that are selected by the user.
     */
    @observable _selected: StringSetMap = {};

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


    @action public doNav(delta: 'prev' | 'next', pos: NavPosition) {

        if (this.root === undefined) {
            console.warn("No currently active root");
            return;
        }

        if (this._active === undefined) {
            console.warn("No currently active node");
            return;
        }

        const rootNote = Arrays.first(this.lookup([this.root]));

        if (! rootNote) {
            console.warn("No note in index for ID: ", this.root);
            return;
        }

        const items = [
            this.root,
            ...this.computeLinearItemsFromExpansionTree(this.root)
        ];

        const childIndex = items.indexOf(this._active);

        if (childIndex === -1) {
            console.warn(`Child ${this._active} not in note items`);
            return;
        }

        const deltaIndex = delta === 'prev' ? -1 : 1;

        const activeIndexWithoutBound = childIndex + deltaIndex;
        const activeIndex = Math.min(Math.max(0, activeIndexWithoutBound), items.length -1);

        const newActive = items[activeIndex];

        this._active = newActive;
        this._activePos = pos;

    }

    public navPrev(pos: NavPosition) {
        this.doNav('prev', pos);
    }

    public navNext(pos: NavPosition) {
        this.doNav('next', pos);
    }

    public toggleExpand(id: NoteIDStr) {

        if (this._expanded[id]) {
            this.collapse(id);
        } else {
            this.expand(id);
        }

    }

    private computeLinearItemsFromExpansionTree(id: NoteIDStr,
                                                root: boolean = true): ReadonlyArray<NoteIDStr> {

        const note = this._index[id];

        if (! note) {
            console.warn("No note: ", id);
            return [];
        }


        const isExpanded = root ? true : this._expanded[id];

        if (isExpanded) {
            const items = (note.items || []);

            const result = [];

            for (const item of items) {
                result.push(item);
                result.push(...this.computeLinearItemsFromExpansionTree(item, false));
            }

            return result;

        } else {
            return [];
        }

    }

    @action public setActive(active: NoteIDStr | undefined) {
        this._active = active;
    }

    @action public setActiveWithPosition(active: NoteIDStr | undefined, activePos: NavPosition) {
        this._active = active;
        this._activePos = activePos;
    }

    @action public setRoot(root: NoteIDStr | undefined) {
        this.root = root;
    }

    public isExpanded(id: NoteIDStr): boolean {
        return isPresent(this._expanded[id]);
    }

    public getNoteActivated(id: NoteIDStr): INoteActivated | undefined {

        const active = this._active;
        const activePos = this._activePos;

        if (! active) {
            return undefined;
        }

        if (id !== active) {
            return undefined;
        }

        const note = this._index[active];

        if (note) {
            return {note, activePos};
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

        return undefined;

    }

    @action public mergeNotes(target: NoteIDStr, source: NoteIDStr) {

        const targetNote = this._index[target];
        const sourceNote = this._index[source];

        if (targetNote.type !== sourceNote.type) {
            return 'incompatible-note-types';
        }

        targetNote.setContent(targetNote.content + sourceNote.content);
        targetNote.setItems([...targetNote.items, ...sourceNote.items]);
        targetNote.setLinks([...targetNote.links, ...sourceNote.links]);

        this.doDelete([sourceNote.id]);

        // now the target has to become active
        // FIXME: this is wrong... it should be at the merge point with the new node

        // FIXME: we can use the markdown to html converter to determine WHERE the nodes shold
        // be offset.. joined.
        this._active = targetNote.id;
        this._activePos = undefined;

        // *** now update the editor so it's setup correctly

        const editor = this.getNoteEditorMutator(target);
        editor.setCursorPosition('end');
        editor.setData(targetNote.content);

        return undefined;

    }

    @action public createNewNote(parent: NoteIDStr,
                                 child: NoteIDStr | undefined,
                                 pos: NewNotePosition,
                                 split?: ISplitNote) {

        const index = this._index;

        const id = Hashcodes.createRandomID();

        const parentNote = this._index[parent];

        if (! parentNote) {
            throw new Error("No parent note");
        }

        const now = ISODateTimeStrings.create()

        function createNewNote(): INote {
            return {
                id,
                parent,
                type: 'item',
                content: split?.suffix || '',
                created: now,
                updated: now,
                items: [],
                links: []
            };
        }

        const newNote = createNewNote();

        this.doPut([newNote]);

        // TODO: is before actually used/needed her?

        function computeNewChildPosition(): INewChildPosition | undefined {
            if (child) {
                return {
                    ref: child,
                    pos: 'after'
                };
            } else {
                return undefined;
            }
        }

        parentNote.addItem(newNote.id, computeNewChildPosition());

        if (split?.prefix && child) {

            const currentNote = index[child];
            currentNote.setContent(split.prefix);

        }

        this._active = newNote.id;
        this._activePos = 'start';

    }

    /**
     * Make the active note a child of the prev sibling.
     *
     * @return The new parent NoteID or the code as to why it couldn't be reparented.
     */
    public doIndent(id: NoteIDStr): IMutation<'no-note' | 'no-parent' | 'no-parent-note' | 'no-sibling', NoteIDStr> {

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

    public doUnIndent(id: NoteIDStr): IMutation<'no-note' | 'no-parent' | 'no-parent-note' | 'no-parent-note-parent' | 'no-parent-note-parent-note', NoteIDStr> {

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

        newParentNote.addItem(id, {pos: 'after', ref: parentNote.id});
        parentNote.removeItem(id);

        return {value: id};

    }

    public noteIsEmpty(id: NoteIDStr): boolean {

        const note = this._index[id];
        return note?.content.trim() === '';

    }

    @action public doDelete(notes: ReadonlyArray<NoteIDStr>) {

        if (notes.length === 0) {
            return;
        }

        interface NextActive {
            readonly active: NoteIDStr;
            readonly activePos: NavPosition;
        }

        const computeNextActive = (): NextActive | undefined => {

            const noteID = notes[0];
            const note = this._index[noteID];

            if (! note) {
                return undefined;
            }

            if (! note.parent) {
                return undefined;
            }

            const expansionTree = this.computeLinearItemsFromExpansionTree(note.parent);

            const currentIndex = expansionTree.indexOf(note.id);

            if (currentIndex > 0) {

                const nextActive = expansionTree[currentIndex - 1];

                return {
                    active: nextActive,
                    activePos: 'end'
                }

            } else {
                return {
                    active: note.parent,
                    activePos: 'end'
                }
            }

        }

        const handleDelete = (notes: ReadonlyArray<NoteIDStr>) => {

            for (const noteID of notes) {

                const note = this._index[noteID];

                if (note) {

                    // *** delete the id for this note from the parents items.

                    if (note.parent) {

                        const parentNote = this._index[note.parent];

                        if (! parentNote) {
                            console.warn("No parent note for ID: " + note.parent);
                            return;
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

                    // *** now delete all children too...

                    handleDelete(note.items);

                }

            }

        };

        const nextActive = computeNextActive();
        handleDelete(notes);

        if (nextActive) {
            this._active = nextActive.active;
            this._activePos = nextActive.activePos;
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

    @observable public getNoteEditorMutator(id: NoteIDStr): INoteEditorMutator {
        return this._noteEditors[id];
    }

    @action public setNoteEditorMutator(id: NoteIDStr, editor: INoteEditorMutator) {
        return this._noteEditors[id] = editor;
    }

    @action public clearNoteEditorMutator(id: NoteIDStr) {
        delete this._noteEditors[id];
    }

}

export const [NotesStoreProvider, useNotesStore] = createReactiveStore(() => new NotesStore())