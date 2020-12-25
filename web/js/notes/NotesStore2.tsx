import * as React from "react";
import {createReactiveStore} from "../react/store/ReactiveStore";
import { makeObservable, makeAutoObservable, observable, action, computed } from "mobx"
import { IDStr } from "polar-shared/src/util/Strings";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import {NoteTargetStr} from "./NoteLinkLoader";
import {isPresent} from "polar-shared/src/Preconditions";
import { Hashcodes } from "polar-shared/src/util/Hashcodes";

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
 */
export type NavPosition = 'start' | 'end';

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

export interface INote {

    readonly id: NoteIDStr;

    readonly parent: NoteIDStr | undefined;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items: ReadonlyArray<NoteIDStr>;

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    readonly content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    readonly links: ReadonlyArray<NoteIDStr>;

    // FIXMEL this needs to be refactoed because
    // the content type of the node should/could change and we need markdown/latex/etc note types
    // but also we need the ability to do block embeds an so forth and those are a specic note type.
    // FIXME: maybe content would be a reference to another type..

    /**
     * There are two types of notes.  One is just an 'item' where the 'content'
     * is the body of the item and isn't actually a unique name and then there
     * is a 'named' note where the content is actually the name of the note and
     * has constrained semantics (can't have a link, image, etc.
     */
    readonly type: 'item' | 'named';

}

export class ReverseIndex {

    @observable private index: {[key: string]: NoteIDStr[]} = {};

    @computed get(target: NoteIDStr): ReadonlyArray<NoteIDStr> {
        return this.index[target] || [];
    }

    @action add(target: NoteIDStr, inbound: NoteIDStr) {

        const current = this.index[target];

        if (current) {
            current.push(inbound);
        } else {
            this.index[target] = [inbound];
        }

    }

    @action remove(target: NoteIDStr, inbound: NoteIDStr) {

        const current = this.index[target];

        if (current) {

            const idx = current.indexOf(inbound);

            if (idx > -1) {
                // this mutates the array under us and I don't necessarily like that
                // but it's a copy of the original to begin with.
                current.splice(idx, 1);
            }

            if (current.length === 0) {
                delete this.index[target];
            }

        }

    }

}



export class Note implements INote {

    @observable private _id: NoteIDStr;

    @observable private _parent: NoteIDStr | undefined;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items: NoteIDStr[];

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    @observable private _content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    @observable private _links: NoteIDStr[];

    // FIXMEL this needs to be refactoed because
    // the content type of the node should/could change and we need markdown/latex/etc note types
    // but also we need the ability to do block embeds an so forth and those are a specic note type.
    // FIXME: maybe content would be a reference to another type..

    /**
     * There are two types of notes.  One is just an 'item' where the 'content'
     * is the body of the item and isn't actually a unique name and then there
     * is a 'named' note where the content is actually the name of the note and
     * has constrained semantics (can't have a link, image, etc.
     */
    @observable private _type: NoteType;

    constructor(opts: INote) {

        this._id = opts.id;
        this._parent = opts.parent;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = [...opts.items];
        this._content = opts.content;
        this._links = [...opts.links];
        this._type = opts.type;

        makeObservable(this)
    }

    @computed get id() {
        return this._id;
    }

    @computed get parent() {
        return this._parent;
    }

    @computed get created() {
        return this._created;
    }

    @computed get updated() {
        return this._updated;
    }

    @computed get items(): ReadonlyArray<NoteIDStr> {
        return this._items;
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): ReadonlyArray<NoteIDStr> {
        return this._links;
    }

    @computed get type() {
        return this._type;
    }

    @action setContent(content: string) {
        this._content = content;
        this._updated = ISODateTimeStrings.create();
    }

    @action setParent(id: NoteIDStr) {
        this._parent = id;
        this._updated = ISODateTimeStrings.create();
    }

    @action addItem(id: NoteIDStr, pos?: INewChildPosition) {


        if (pos) {

            const idx = this._items.indexOf(pos.ref);

            if (idx !== -1) {
                const delta = pos.pos === 'before' ? 0 : 1;
                this._items.splice(idx + delta, 0, id);
            }

        } else {
            this._items.push(id);
        }

        this._updated = ISODateTimeStrings.create();
    }

    @action removeItem(id: NoteIDStr) {

        const idx = this.items.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._items.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

    }

    @action addLink(id: NoteIDStr) {
        this._links.push(id);
        this._updated = ISODateTimeStrings.create();
    }

    @action removeLink(id: NoteIDStr) {

        const idx = this._links.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._links.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

    }

}

// FIXME can I use an observer as a hook?

export class NotesStore {

    @observable private _index: NotesIndex = {};

    @observable private _indexByName: NotesIndexByName = {};

    /**
     * The reverse index so that we can build references to this node.
     */
    @observable private _reverse: ReverseIndex = new ReverseIndex();

    /**
     * The current root note
     */
    @observable private _root: NoteIDStr | undefined;

    /**
     * The currently active note.
     */
    @observable private _active: NoteIDStr | undefined;

    /**
     * The position to place the cursor when we jump between items.
     */
    @observable private _activePos: NavPosition = 'start';

    /**
     * The nodes that are expanded.
     */
    @observable private _expanded: StringSetMap = {};


    /**
     * The nodes that are selected by the user.
     */
    @observable private _selected: StringSetMap = {};

    constructor() {
        makeAutoObservable(this);
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

    @computed get root() {
        return this._root;
    }

    @computed get active() {
        return this._active;
    }

    public lookup(notes: ReadonlyArray<NoteIDStr>): ReadonlyArray<INote> {

        return notes.map(current => this._index[current])
            .filter(current => current !== null && current !== undefined);

    }

    @computed public lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr> {
        return this._reverse.get(id);
    }

    public doPut(notes: ReadonlyArray<INote>, opts: DoPutOpts = {}) {

        for (const inote of notes) {

            const note = new Note(inote);
            this._index[inote.id] = note;

            if (inote.type === 'named') {
                this._indexByName[inote.content] = note.id;
            }

            const outboundNodeIDs = [
                ...(inote.items || []),
                ...(inote.links || []),
            ]

            for (const outboundNodeID of outboundNodeIDs) {
                const inbound = this.lookupReverse(outboundNodeID);

                this._reverse.add(note.id, outboundNodeID);

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

    public getNoteByTarget(target: NoteIDStr | NoteTargetStr): Note | undefined {
        return this._index[target] || this._indexByName[target] || undefined
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

    @action  public collapse(id: NoteIDStr) {
        delete this._expanded[id];
    }


    @action public doNav(delta: 'prev' | 'next', pos: NavPosition) {

        if (this._root === undefined) {
            console.warn("No currently active root");
            return;
        }

        if (this._active === undefined) {
            console.warn("No currently active node");
            return;
        }

        const rootNote = Arrays.first(this.lookup([this._root]));

        if (! rootNote) {
            console.warn("No note in index for ID: ", this._root);
            return;
        }

        const items = [
            this._root,
            ...this.computeLinearItemsFromExpansionTree(this._root)
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

    public setActive(active: NoteIDStr | undefined) {
        this._active = active;
    }

    public setRoot(root: NoteIDStr | undefined) {
        this._root = root;
    }

    public isExpanded(id: NoteIDStr): boolean {
        return isPresent(this._expanded[id]);
    }

    // TODO: write a test for this... OH!!!
    // thjis isn't working because it's not being observed...
    @computed public getNoteActivated(id: NoteIDStr): INoteActivated | undefined {

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
    public createNewNote(parent: NoteIDStr,
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

    public doDelete(notes: ReadonlyArray<NoteIDStr>) {

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

}

export const [NotesStoreProvider, useNotesStore] = createReactiveStore(() => new NotesStore())