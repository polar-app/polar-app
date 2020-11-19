import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export type NoteIDStr = IDStr;

export type NotesIndex = {[id: string /* NoteIDStr */]: INote};
export type ReverseNotesIndex = {[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>};


interface INoteBase {

    readonly id: NoteIDStr;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

    // FIXME: create and lastUpdated timestamps for notes
    //

}

export interface INote extends INoteBase {

    readonly name?: string;
    readonly content?: string;

}

interface INotesStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly index: NotesIndex;

    readonly reverse: ReverseNotesIndex;

    /**
     * The currently active note.
     */
    readonly active: NoteIDStr | undefined;

}

interface INotesCallbacks {

    readonly doPut: (notes: ReadonlyArray<INote>) => void;

    readonly doDelete: (notes: ReadonlyArray<INote>) => void;

    readonly updateNote: (id: NoteIDStr, content: string) => void;

    readonly setActive: (active: NoteIDStr | undefined) => void;

    readonly lookup: (notes: ReadonlyArray<NoteIDStr>) => ReadonlyArray<INote>;
    readonly lookupReverse: (id: NoteIDStr) => ReadonlyArray<NoteIDStr>;

    /**
     * Create a new note under the parent using the childRef for the
     * position of the note.
     */
    readonly createNewNote: (parent: NoteIDStr, child: NoteIDStr) => void;

    /**
     * Navigate to the previous node in the graph.
     */
    readonly navPrev: (parent: NoteIDStr, child: NoteIDStr) => void;

    /**
     * Navigate to the next node in the graph.
     */
    readonly navNext: (parent: NoteIDStr, child: NoteIDStr) => void;

}

const initialStore: INotesStore = {
    index: {},
    reverse: {},
    active: undefined
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

        function doPut(notes: ReadonlyArray<INote>) {

            const store = storeProvider();

            const index = {...store.index};
            const reverse = {...store.reverse};

            for (const note of notes) {

                index[note.id] = note;

                for (const item of (note.items || [])) {
                    const inbound = lookupReverse(item);
                    reverse[item] = [...inbound, note.id];
                }

            }

            setStore({...store, index, reverse});

        }

        function doDelete(notes: ReadonlyArray<INote>) {

            const store = storeProvider();

            const index = {...store.index};
            const reverse = {...store.reverse};

            for (const note of notes) {

                delete index[note.id];

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

            setStore({...store, index, reverse});

        }
        function updateNote(id: NoteIDStr, content: string) {

            const store = storeProvider();

            const note = store.index[id];

            if (! note) {
                console.warn("No note for id: " + id);
                return;
            }

            const newNote: INote = {
                ...note,
                content
            };

            doPut([newNote])

        }


        function createNewNote(parent: NoteIDStr, child: NoteIDStr) {

            const store = storeProvider();
            const index = {...store.index};

            const id = Hashcodes.createRandomID();

            const parentNote = index[parent];

            if (! parentNote) {
                throw new Error("No parent note");
            }

            const items = [...(parentNote.items || [])];

            const childIndexPosition = items.indexOf(child);

            const newNote: INote = {
                id
            }

            // this mutates the array under us and I don't necessarily like that
            // but it's a copy of the original to begin with.
            items.splice(childIndexPosition + 1, 0, newNote.id);

            index[parentNote.id] = {
                ...parentNote,
                items
            }

            index[newNote.id] = newNote;

            setStore({
                ...store,
                index,
                active: newNote.id
            });

        }

        function setActive(active: NoteIDStr | undefined) {
            const store = storeProvider();
            setStore({...store, active});
        }

        function doNav(delta: 'prev' | 'next',
                       parent: NoteIDStr,
                       child: NoteIDStr) {

            const store = storeProvider();

            const {active, index} = store;

            if (active === undefined) {
                return;
            }

            const parentNote = index[parent];

            if (! parentNote) {
                console.warn("No note in index for ID: ", parent);
                return;
            }

            const items = parentNote.items || [];

            const childIndex = items.indexOf(child);

            if (childIndex === -1) {
                console.warn("Child not in node items: ", child);
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

        function navPrev(parent: NoteIDStr, child: NoteIDStr) {
            doNav('prev', parent, child);
        }

        function navNext(parent: NoteIDStr, child: NoteIDStr) {
            doNav('next', parent, child);
        }

        return {
            doPut,
            doDelete,
            updateNote,
            lookup,
            lookupReverse,
            createNewNote,
            setActive,
            navPrev,
            navNext
        };

    }, [setStore, storeProvider])

}

export const [NotesStoreProvider, useNotesStore, useNotesStoresCallbacks, useNotesMutator]
    = createObservableStore<INotesStore, Mutator, INotesCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory,
    enableShallowEquals: true
});

