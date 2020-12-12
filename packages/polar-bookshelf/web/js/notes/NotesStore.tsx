import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import { Arrays } from 'polar-shared/src/util/Arrays';

export type NoteIDStr = IDStr;
export type NoteNameStr = string;

export type NotesIndex = Readonly<{[id: string /* NoteIDStr */]: INote}>;
export type NotesIndexByName = Readonly<{[name: string /* NoteNameStr */]: INote}>;

export type ReverseNotesIndex = Readonly<{[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>}>;

// TODO: latex, 'note-embed', 'annotation-embed'
export type NoteContentType = 'markdown' | 'name';

export interface ITypedContent<T extends NoteContentType> {
    readonly type: T;
    readonly content: string
}

// export type NoteContent = string | ITypedContent<'markdown'> | ITypedContent<'name'>;
export type NoteContent = string;

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

export type StringSetMap = Readonly<{[key: string]: boolean}>

interface INotesStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly index: NotesIndex;

    readonly indexByName: NotesIndex;

    /**
     * The reverse index so that we can build references to this node.
     */
    readonly reverse: ReverseNotesIndex;

    /**
     * The current root note
     */
    readonly root: NoteIDStr | undefined;

    /**
     * The currently active note.
     */
    readonly active: NoteIDStr | undefined;

    /**
     * The position to place the cursor when we jump between items.
     */
    readonly activePos: NavPosition;

    /**
     * The nodes that are expanded.
     */
    readonly expanded: StringSetMap;


    /**
     * The nodes that are selected by the user.
     */
    readonly selected: StringSetMap;

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

/**
 * The position to place the cursor when jumping between items.
 */
export type NavPosition = 'start' | 'end';

export type NewNotePosition = 'before' | 'after' | 'split';

interface INotesCallbacks {

    readonly doPut: (notes: ReadonlyArray<INote>, opts?: DoPutOpts) => void;

    readonly doDelete: (notes: ReadonlyArray<NoteIDStr>) => void;

    readonly updateNote: (id: NoteIDStr, content: string) => void;

    readonly setRoot: (active: NoteIDStr | undefined) => void;

    readonly setActive: (active: NoteIDStr | undefined) => void;

    readonly lookup: (notes: ReadonlyArray<NoteIDStr>) => ReadonlyArray<INote>;

    readonly lookupReverse: (id: NoteIDStr) => ReadonlyArray<NoteIDStr>;

    // TODO: createNewNote should probably be called createNewActiveChildNote or
    // something along those lines

    /**
     * Create a new note under the parent using the childRef for the
     * position of the note.
     */
    readonly createNewNote: (parent: NoteIDStr,
                             child: NoteIDStr,
                             pos: NewNotePosition) => void;

    /**
     * Navigate to the previous node in the graph.
     */
    readonly navPrev: (pos: NavPosition) => void;

    /**
     * Navigate to the next node in the graph.
     */
    readonly navNext: (pos: NavPosition) => void;

    readonly doIndent: (id: NoteIDStr, parent: NoteIDStr) => void;

    readonly toggleExpand: (id: NoteIDStr) => void;
    readonly expand: (id: NoteIDStr) => void;
    readonly collapse: (id: NoteIDStr) => void;

    readonly noteIsEmpty: (id: NoteIDStr) => boolean;

}

const initialStore: INotesStore = {
    index: {},
    indexByName: {},
    reverse: {},
    root: undefined,
    active: undefined,
    activePos: 'start',
    expanded: {},
    selected: {}
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<INotesStore>,
                        setStore: SetStore<INotesStore>): Mutator {
    return {};
}

function useCallbacksFactory(storeProvider: Provider<INotesStore>,
                             setStore: (store: INotesStore) => void,
                             mutator: Mutator): INotesCallbacks {

    return React.useMemo(() => {

        function lookup(notes: ReadonlyArray<NoteIDStr>): ReadonlyArray<INote> {

            const store = storeProvider();

            return notes.map(current => store.index[current])
                        .filter(current => current !== null && current !== undefined);

        }

        function lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr> {
            const store = storeProvider();
            return store.reverse[id] || [];
        }

        function doPut(notes: ReadonlyArray<INote>, opts: DoPutOpts = {}) {

            const store = storeProvider();

            const index = {...store.index};
            const indexByName = {...store.indexByName};
            const reverse = {...store.reverse};
            const expanded = {...store.expanded};

            for (const note of notes) {

                index[note.id] = note;

                if (note.type === 'named') {
                    indexByName[note.content] = note;
                }

                const outboundNodeIDs = [
                    ...(note.items || []),
                    ...(note.links || []),
                ]

                for (const outboundNodeID of outboundNodeIDs) {
                    const inbound = lookupReverse(outboundNodeID);

                    if (! inbound.includes(note.id)) {
                        reverse[outboundNodeID] = [...inbound, note.id];
                    }
                }

            }

            const active = opts.newActive ? opts.newActive : store.active;

            if (opts.newExpand) {
                expanded[opts.newExpand] = true;
            }

            setStore({...store, index, indexByName, reverse, active, expanded});

        }

        function doDelete(noteIDs: ReadonlyArray<NoteIDStr>) {

            const store = storeProvider();

            const index = {...store.index};
            const indexByName = {...store.indexByName};
            const reverse = {...store.reverse};

            for (const noteID of noteIDs) {

                const note = index[noteID];

                if (note) {

                    // *** delete the note from the index
                    delete index[noteID];

                    // *** delete the note from name index by name.
                    if (note.type === 'named') {
                        indexByName[note.content] = note;
                    }

                    // *** delete the reverse index for all the child items

                    // FIXME: what about deleting the entire tree under a note..
                    // how does that work?
                    //
                    // FIXME: we don't actually delete any of the items in teh
                    // parent node from this note so it would break navigation
                    for (const item of (note.items || [])) {

                        const inbound = lookupReverse(item)
                            .filter(current => current !== note.id);

                        if (inbound.length === 0) {
                            delete reverse[item];
                        } else {
                            reverse[item] = inbound
                        }

                    }

                }

            }

            setStore({...store, index, indexByName, reverse});

        }

        function updateNote(id: NoteIDStr, content: string) {

            const store = storeProvider();

            const note = store.index[id];

            if (! note) {
                console.warn("No note for id: " + id);
                return;
            }

            const now = ISODateTimeStrings.create();

            const newNote: INote = {
                ...note,
                updated: now,
                content
            };

            doPut([newNote])

        }

        /**
         * Based on the note's position, indent it if it has a sibling
         */
        function doIndent(id: NoteIDStr, parent: NoteIDStr) {

            const store = storeProvider();

            const {index} = store;

            const note = index[id];

            if (! note) {
                console.warn("No note for id: " + id);
                return;
            }

            const parentNote = index[parent];

            if (! parentNote) {
                console.warn("No parent note for id: " + parent);
                return;
            }

            const parentItems = (parentNote.items || []);

            // figure out the sibling index in the parent
            const siblingIndex = parentItems.indexOf(id);

            if (siblingIndex > 0) {

                const newParentID = parentItems[siblingIndex - 1];

                const newParentNode = index[newParentID];

                // *** remove myself from my parent

                function remove<T>(arr: ReadonlyArray<T>, idx: number) {
                    const newArr = [...arr];
                    newArr.splice(idx, 1);
                    return newArr;
                }

                const now = ISODateTimeStrings.create();

                const mutatedParentNode = {
                    ...parentNote,
                    updated: now,
                    items: remove(parentNote.items!, siblingIndex)
                }

                // ***: add myself to my newParent

                const mutatedNewParentNode = {
                    ...newParentNode,
                    updated: now,
                    items: [
                        ...(newParentNode.items || []),
                        id
                    ]
                }

                doPut([mutatedParentNode, mutatedNewParentNode], {
                    newActive: id,
                    newExpand: mutatedNewParentNode.id
                });

            }

        }

        /**
         * Used to determine when we can delete notes.
         */
        function noteIsEmpty(id: NoteIDStr) {

            const store = storeProvider();
            const index = {...store.index};

            const note = index[id];

            return note?.content.trim() === '';

        }

        function createNewNote(parent: NoteIDStr, child: NoteIDStr, pos: NewNotePosition) {

            console.log("Create new note...")

            const store = storeProvider();
            const index = {...store.index};

            const id = Hashcodes.createRandomID();

            const parentNote = index[parent];

            if (! parentNote) {
                throw new Error("No parent note");
            }

            const items = [...(parentNote.items || [])];

            const childIndexPosition = items.indexOf(child);

            const now = ISODateTimeStrings.create()

            const newNote: INote = {
                id,
                type: 'item',
                content: '',
                created: now,
                updated: now
            };

            function computeDelta() {
                switch (pos) {
                    case "before":
                        return 0;
                    case "after":
                        return 1;
                    case "split":
                        return 1;
                }
            }

            const delta = computeDelta();

            // this mutates the array under us and I don't necessarily like that
            // but it's a copy of the original to begin with.
            items.splice(childIndexPosition + delta, 0, newNote.id);

            const newParentNote = {
                ...parentNote,
                updated: now,
                items: [...items]
            }

            doPut([newParentNote, newNote], {newActive: newNote.id});

        }

        function setRoot(root: NoteIDStr | undefined) {
            const store = storeProvider();
            setStore({...store, root});
        }

        function setActive(active: NoteIDStr | undefined) {
            const store = storeProvider();
            setStore({...store, active});
        }


        function computeLinearItemsFromExpansionTree(id: NoteIDStr, root?: boolean): ReadonlyArray<NoteIDStr> {

            const store = storeProvider();
            const {index, expanded} = store;

            const note = index[id];

            if (! note) {
                console.warn("No note: ", id);
                return [];
            }

            const isExpanded = root === true ? true : expanded[id];

            if (isExpanded) {
                const items = (note.items || []);

                const result = [];

                for (const item of items) {
                    result.push(item);
                    result.push(...computeLinearItemsFromExpansionTree(item));
                }

                return result;

            } else {
                return [];
            }

        }

        function doNav(delta: 'prev' | 'next', pos: NavPosition) {

            const store = storeProvider();

            const {active, root} = store;

            if (root === undefined) {
                console.warn("No currently active root");
                return;
            }

            if (active === undefined) {
                console.warn("No currently active node");
                return;
            }

            const rootNote = Arrays.first(lookup([root]));

            if (! rootNote) {
                console.warn("No note in index for ID: ", root);
                return;
            }

            const items = [
                root,
                ...computeLinearItemsFromExpansionTree(root, true)
            ];

            const childIndex = items.indexOf(active);

            if (childIndex === -1) {
                console.warn(`Child ${active} not in note items`);
                return;
            }

            const deltaIndex = delta === 'prev' ? -1 : 1;

            const activeIndexWithoutBound = childIndex + deltaIndex;
            const activeIndex = Math.min(Math.max(0, activeIndexWithoutBound), items.length -1);

            const newActive = items[activeIndex];

            setStore({
                ...store,
                active: newActive,
                activePos: pos
            });

        }

        function navPrev(pos: NavPosition) {
            doNav('prev', pos);
        }

        function navNext(pos: NavPosition) {
            doNav('next', pos);
        }

        function toggleExpand(id: NoteIDStr) {

            const store = storeProvider();

            if (store.expanded[id]) {
                collapse(id);
            } else {
                expand(id);
            }

        }

        function expand(id: NoteIDStr) {
            const store = storeProvider();

            const expanded = {
                ...store.expanded,
            };

            expanded[id] = true;

            setStore({...store, expanded});
        }

        function collapse(id: NoteIDStr) {
            const store = storeProvider();

            const expanded = {
                ...store.expanded,
            };

            delete expanded[id];

            setStore({...store, expanded});
        }

        return {
            doPut,
            doDelete,
            updateNote,
            lookup,
            lookupReverse,
            createNewNote,
            setRoot,
            setActive,
            navPrev,
            navNext,
            doIndent,
            toggleExpand,
            expand,
            collapse,
            noteIsEmpty
        };

    }, [setStore, storeProvider])

}

export const [NotesStoreProvider, useNotesStore, useNotesStoreCallbacks, useNotesMutator]
    = createObservableStore<INotesStore, Mutator, INotesCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory,
    enableShallowEquals: true
});

