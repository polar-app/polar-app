import {createReactiveStore} from "../react/store/ReactiveStore";
import { makeObservable, makeAutoObservable, observable, action, computed } from "mobx"
import { IDStr } from "polar-shared/src/util/Strings";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import {NoteTargetStr} from "./NoteLinkLoader";
import * as React from "react";
import {isPresent} from "polar-shared/src/Preconditions";
import { Hashcodes } from "polar-shared/src/util/Hashcodes";

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

export interface ISplitNote {
    readonly prefix: string;
    readonly suffix: string;
}

export interface DeleteNoteRequest {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
}

export interface INote {

    readonly id: NoteIDStr;

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

class Note implements INote {

    @observable private _id: string;

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

    @action addItem(id: NoteIDStr) {
        this._items.push(id);
        this._updated = ISODateTimeStrings.create();
    }

    @action addLink(id: NoteIDStr) {
        this._links.push(id);
        this._updated = ISODateTimeStrings.create();
    }

    @action removeLink(id: NoteIDStr) {

        const idx = this.items.indexOf(id);

        if (idx === -1) {
            return;
        }

        // this mutates the array under us and I don't necessarily like that
        // but it's a copy of the original to begin with.
        this._items.splice(idx, 1);
        this._updated = ISODateTimeStrings.create();

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

    public getNoteActivated(id: NoteIDStr) {

        const active = this._active;
        const activePos = this._activePos;

        if (! active) {
            return undefined;
        }

        if (id !== active) {
            return undefined;
        }

        const note = this._index[active] || this._indexByName[active] || undefined;

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
                type: 'item',
                content: split?.suffix || '',
                created: now,
                updated: now,
                items: [],
                links: []
            };
        }

        const newNote: INote = createNewNote();

        // function computeNewParentNote(): INote {
        //
        //     function computeDelta() {
        //         switch (pos) {
        //             case "before":
        //                 return 0;
        //             case "after":
        //                 return 1;
        //             case "split":
        //                 return 1;
        //         }
        //     }
        //
        //     const delta = computeDelta();
        //
        //     const items = [...(parentNote.items || [])];
        //
        //     const childIndexPosition = child ? items.indexOf(child) : 0;
        //
        //     const newItems = [...items];
        //
        //     // this mutates the array under us and I don't necessarily like that
        //     // but it's a copy of the original to begin with.
        //     newItems.splice(childIndexPosition + delta, 0, newNote.id);
        //
        //     return  {
        //         id: parentNote.id,
        //         ...parentNote,
        //         updated: now,
        //         items: newItems
        //     };
        //
        // }
        //
        // const nextParentNote = computeNewParentNote();
        //
        // // we might have to mutate previous note while the new note is created if it's a split.
        // function computePrevNote(): INote | undefined {
        //
        //     if (child && split) {
        //
        //         const note = index[child];
        //
        //         return {
        //             ...note,
        //             updated: now,
        //             content: split.prefix
        //         };
        //
        //     } else {
        //         return undefined;
        //     }
        //
        // }
        //
        // const prevNote = computePrevNote();
        //
        // console.log("FIXME: prevNote: ", prevNote);
        //
        // const mutations = [
        //         nextParentNote, newNote, prevNote
        //     ]
        // .filter(current => current !== undefined)
        // .map(current => current!);
        //
        // this.doPut(mutations, {newActive: newNote.id});

    }

    /**
     * Make the active note a child of the prev sibling.
     */
    public doIndent(id: NoteIDStr, parent: NoteIDStr) {
        //
        // const store = storeProvider();
        //
        // const {index} = store;
        //
        // const note = index[id];
        //
        // if (! note) {
        //     console.warn("No note for id: " + id);
        //     return;
        // }
        //
        // const parentNote = index[parent];
        //
        // if (! parentNote) {
        //     console.warn("No parent note for id: " + parent);
        //     return;
        // }
        //
        // const parentItems = (parentNote.items || []);
        //
        // // figure out the sibling index in the parent
        // const siblingIndex = parentItems.indexOf(id);
        //
        // if (siblingIndex > 0) {
        //
        //     const newParentID = parentItems[siblingIndex - 1];
        //
        //     const newParentNode = index[newParentID];
        //
        //     // *** remove myself from my parent
        //
        //     const now = ISODateTimeStrings.create();
        //
        //     function createNewItems() {
        //         const newItems = [...parentItems];
        //         newItems.splice(siblingIndex, 1);
        //         return newItems;
        //     }
        //
        //     const mutatedParentNode = {
        //         ...parentNote,
        //         updated: now,
        //         items: createNewItems()
        //     }
        //
        //     // ***: add myself to my newParent
        //
        //     const mutatedNewParentNode = {
        //         ...newParentNode,
        //         updated: now,
        //         items: [
        //             ...(newParentNode.items || []),
        //             id
        //         ]
        //     }
        //
        //     doPut([mutatedParentNode, mutatedNewParentNode], {
        //         newActive: id,
        //         newExpand: mutatedNewParentNode.id
        //     });
        //
    }

    public doUnIndent(id: NoteIDStr, parent: NoteIDStr) {
        //
        // const store = storeProvider();
        //
        // const {index, root} = store;
        //
        // const note = index[id];
        //
        // if (! note) {
        //     console.warn("No note for id: " + id);
        //     return;
        // }
        //
        // const parentNote = index[parent];
        //
        // if (! parentNote) {
        //     console.warn("No parent note for id: " + parent);
        //     return;
        // }
        //
        // if (! root) {
        //     console.warn("No root note");
        //     return;
        // }
        //
        // const expansionTree = computeLinearItemsFromExpansionTree(root);
        //
        // const parentIndexWithinExpansionTree = expansionTree.indexOf(parent);
        //
        // const newParentID = expansionTree[parentIndexWithinExpansionTree + 1];
        //
        // const newParentNode = index[newParentID];
        //
        // // *** remove myself from my current parent
        //
        // const now = ISODateTimeStrings.create();
        //
        // function createMutatedParentNode() {
        //
        //     function createNewItems() {
        //         return (parentNote.items || []).filter(current => current !== id)
        //     }
        //
        //     return {
        //         ...parentNote,
        //         updated: now,
        //         items: createNewItems()
        //     }
        //
        // }
        //
        // const mutatedParentNode = createMutatedParentNode();
        //
        // function createMutatedNewParentNode() {
        //
        //     const newParentItems = (newParentNode.items || []);
        //
        //     function createNewItems() {
        //         const newItems = [...newParentItems];
        //         newItems.splice(newParentItems.indexOf(parent), 0, id)
        //         return newItems;
        //     }
        //
        //     return {
        //         ...newParentNode,
        //         updated: now,
        //         items: createNewItems()
        //     };
        //
        // }
        //
        // const mutatedNewParentNode = createMutatedNewParentNode();
        //
        // doPut([mutatedParentNode, mutatedNewParentNode], {
        //     newActive: id,
        //     newExpand: mutatedNewParentNode.id
        // });

    }

    public noteIsEmpty(id: NoteIDStr) {

        //
        // const store = storeProvider();
        // const index = {...store.index};
        //
        // const note = index[id];
        //
        // return note?.content.trim() === '';

    }

    public doDelete(deleteRequests: ReadonlyArray<DeleteNoteRequest>) {
        //
        // if (deleteRequests.length === 0) {
        //     return;
        // }
        //
        // const store = storeProvider();
        //
        // const index = {...store.index};
        // const indexByName = {...store.indexByName};
        // const reverse = {...store.reverse};
        //
        // interface NextActive {
        //     readonly active: NoteIDStr;
        //     readonly activePos: NavPosition;
        // }
        //
        // function computeNextActive(): NextActive | undefined {
        //
        //     const deleteRequest = deleteRequests[0];
        //     const expansionTree = computeLinearItemsFromExpansionTree(deleteRequest.parent);
        //
        //     const currentIndex = expansionTree.indexOf(deleteRequest.id);
        //
        //     if (currentIndex > 0) {
        //         const nextActive = expansionTree[currentIndex - 1];
        //
        //         return {
        //             active: nextActive,
        //             activePos: 'end'
        //         }
        //
        //     } else {
        //         return {
        //             active: deleteRequest.parent,
        //             activePos: 'end'
        //         }
        //     }
        //
        // }
        //
        // function handleDelete(deleteRequests: ReadonlyArray<DeleteNoteRequest>) {
        //
        //     for (const deleteRequest of deleteRequests) {
        //
        //         const note = index[deleteRequest.id];
        //
        //         if (note) {
        //
        //             // *** delete the id for this note from the parents items.
        //
        //             const parentNote = index[deleteRequest.parent];
        //
        //             if (! parentNote) {
        //                 console.warn("No parent note for ID: " + deleteRequest.parent);
        //                 return;
        //             }
        //
        //             index[parentNote.id] = {
        //                 ...parentNote,
        //                 items: (parentNote.items || []).filter(item => item !== deleteRequest.id)
        //             }
        //
        //             // *** delete the note from the index
        //             delete index[deleteRequest.id];
        //
        //             // *** delete the note from name index by name.
        //             if (note.type === 'named') {
        //                 indexByName[note.content] = note;
        //             }
        //
        //             // *** delete the reverse index for this item
        //
        //             const inbound = lookupReverse(deleteRequest.id)
        //                 .filter(current => current !== note.id);
        //
        //             if (inbound.length === 0) {
        //                 delete reverse[deleteRequest.id];
        //             } else {
        //                 reverse[deleteRequest.id] = inbound
        //             }
        //
        //             // *** now delete all children too...
        //
        //             function toDeleteNoteRequest(id: NoteIDStr): DeleteNoteRequest {
        //                 return {
        //                     parent: note.id,
        //                     id
        //                 }
        //             }
        //
        //             handleDelete((note.items || []).map(toDeleteNoteRequest));
        //
        //         }
        //
        //     }
        //
        // }
        //
        // const nextActive = computeNextActive();
        // handleDelete(deleteRequests);
        //
        // setStore({...store, index, indexByName, reverse, ...nextActive});

    }


}

export const [NotesStoreProvider, useNotesStore] = createReactiveStore(() => new NotesStore())