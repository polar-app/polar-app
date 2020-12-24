import {createReactiveStore} from "../react/store/ReactiveStore";
import { makeObservable, makeAutoObservable, observable, action, computed } from "mobx"
import { IDStr } from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import {NoteTargetStr} from "./NoteLinkLoader";
import * as React from "react";
import {isPresent} from "polar-shared/src/Preconditions";

export type NoteIDStr = IDStr;
export type NoteNameStr = string;

export type NoteType = 'item' | 'named';

export type NotesIndex = {[id: string /* NoteIDStr */]: Note};
export type NotesIndexByName = {[name: string /* NoteNameStr */]: Note};

export type ReverseNotesIndex = {[id: string /* NoteIDStr */]: NoteIDStr[]};

export type StringSetMap = {[key: string]: boolean};

// export type NoteContent = string | ITypedContent<'markdown'> | ITypedContent<'name'>;
export type NoteContent = string;

/**
 * The position to place the cursor when jumping between items.
 */
export type NavPosition = 'start' | 'end';

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


export interface INote {

    readonly id: NoteIDStr;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    readonly content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    readonly links?: ReadonlyArray<NoteIDStr>;

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

class Note implements INote {

    @observable private _id: string;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items?: ReadonlyArray<NoteIDStr>;

    // TODO
    //
    // We might want to have a content object with a type so that we can
    // have 'name' or 'markdown' as the type... but we could also support
    // latex with this.
    @observable private _content: NoteContent;

    /**
     * The linked wiki references to other notes.
     */
    @observable private _links?: ReadonlyArray<NoteIDStr>;

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
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = opts.items;
        this._content = opts.content;
        this._links = opts.links;
        this._type = opts.type;

        makeObservable(this)
    }

    @computed get id() {
        return this._id;
    }

    @computed get created() {
        return this._created;
    }

    @computed get updated() {
        return this._updated;
    }

    @computed get items() {
        return this._items;
    }

    @computed get content() {
        return this._content;
    }

    @computed get links() {
        return this._links;
    }

    @computed get type() {
        return this._type;
    }

    @action setContent(content: string) {
        this._content = content;
    }

}

// FIXME can I use an observer as a hook?

class NotesStore {

    @observable private _index: NotesIndex = {};

    @observable private _indexByName: NotesIndex = {};

    /**
     * The reverse index so that we can build references to this node.
     */
    @observable private _reverse: ReverseNotesIndex = {};



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

    public lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr> {
        return this._reverse[id] || [];
    }


    public doPut(notes: ReadonlyArray<INote>, opts: DoPutOpts = {}) {

        for (const inote of notes) {

            const note = new Note(inote);
            this._index[inote.id] = note;

            if (inote.type === 'named') {
                this._indexByName[inote.content] = note;
            }

            const outboundNodeIDs = [
                ...(inote.items || []),
                ...(inote.links || []),
            ]

            for (const outboundNodeID of outboundNodeIDs) {
                const inbound = this.lookupReverse(outboundNodeID);

                if (! inbound.includes(inote.id)) {
                    this._reverse[outboundNodeID] = [...inbound, inote.id];
                }
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

}

export const [NotesStoreProvider, useNotesStore] = createReactiveStore(() => new NotesStore())