import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export type NoteIDStr = IDStr;
export type NoteNameStr = string;

export type NotesIndex = Readonly<{[id: string /* NoteIDStr */]: INote}>;
export type NotesIndexByName = Readonly<{[name: string /* NoteNameStr */]: INote}>;

export type ReverseNotesIndex = Readonly<{[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>}>;

export interface INote {

    readonly id: NoteIDStr;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

    readonly name?: NoteNameStr;

    readonly content?: string;

    /**
     * The linked wiki references to other notes.
     */
    readonly links?: ReadonlyArray<NoteIDStr>;

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
     * The nodes that are expanded.
     */
    readonly expanded: StringSetMap;

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

interface INotesCallbacks {

    readonly doPut: (notes: ReadonlyArray<INote>, opts?: DoPutOpts) => void;

    readonly doDelete: (notes: ReadonlyArray<INote>) => void;

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
    readonly createNewNote: (parent: NoteIDStr, child: NoteIDStr) => void;

    /**
     * Navigate to the previous node in the graph.
     */
    readonly navPrev: () => void;

    /**
     * Navigate to the next node in the graph.
     */
    readonly navNext: () => void;

    readonly doIndent: (id: NoteIDStr, parent: NoteIDStr) => void;

    readonly toggleExpand: (id: NoteIDStr) => void;
    readonly expand: (id: NoteIDStr) => void;
    readonly collapse: (id: NoteIDStr) => void;

}

const initialStore: INotesStore = {
    index: {},
    indexByName: {},
    reverse: {},
    root: undefined,
    active: undefined,
    expanded: {}
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

                if (note.name) {
                    indexByName[note.name] = note;
                }

                // FIXME: read the existing note, and if it's there, we have to remove the existing...

                const outboundNodeIDs = [
                    ...(note.items || []),
                    ...(note.links || []),
                ]

                for (const outboundNodeID of outboundNodeIDs) {
                    const inbound = lookupReverse(outboundNodeID);
                    reverse[outboundNodeID] = [...inbound, note.id];
                }

            }

            const active = opts.newActive ? opts.newActive : store.active;

            if (opts.newExpand) {
                expanded[opts.newExpand] = true;
            }

            setStore({...store, index, indexByName, reverse, active, expanded});

        }

        function doDelete(notes: ReadonlyArray<INote>) {

            const store = storeProvider();

            const index = {...store.index};
            const indexByName = {...store.indexByName};
            const reverse = {...store.reverse};

            for (const note of notes) {

                delete index[note.id];

                if (note.name) {
                    indexByName[note.name] = note;
                }

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

        function createNewNote(parent: NoteIDStr, child: NoteIDStr) {

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
                created: now,
                updated: now
            };

            // this mutates the array under us and I don't necessarily like that
            // but it's a copy of the original to begin with.
            items.splice(childIndexPosition + 1, 0, newNote.id);

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

        function doNav(delta: 'prev' | 'next') {

            const store = storeProvider();

            const {active, root, index, expanded} = store;

            function computeLinearItemsFromExpansionTree(id: NoteIDStr, root?: boolean): ReadonlyArray<NoteIDStr> {

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

            if (root === undefined) {
                console.warn("No currently active root");
                return;
            }

            if (active === undefined) {
                console.warn("No currently active node");
                return;
            }

            const rootNote = index[root];

            if (! rootNote) {
                console.warn("No note in index for ID: ", parent);
                return;
            }

            const items = computeLinearItemsFromExpansionTree(root, true);

            const childIndex = items.indexOf(active);

            if (childIndex === -1) {
                console.warn("Child not in node items: ", active);
                return;
            }

            const deltaIndex = delta === 'prev' ? -1 : 1;

            const activeIndexWithoutBound = childIndex + deltaIndex;
            const activeIndex = Math.min(Math.max(0, activeIndexWithoutBound), items.length -1);

            const newActive = items[activeIndex];

            setStore({
                ...store,
                active: newActive
            });

        }

        function navPrev() {
            doNav('prev');
        }

        function navNext() {
            doNav('next');
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
            collapse
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

