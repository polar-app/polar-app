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
    readonly setActive: (active: NoteIDStr | undefined) => void;

    readonly lookup: (notes: ReadonlyArray<NoteIDStr>) => ReadonlyArray<INote>;
    readonly lookupReverse: (id: NoteIDStr) => ReadonlyArray<NoteIDStr>;

    /**
     * Create a new note under the parent using the childRef for the
     * position of the note.
     */
    readonly createNewNote: (parent: NoteIDStr, childRef: NoteIDStr) => void;

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
                    }

                    reverse[item] = inbound

                }

            }

            setStore({...store, index, reverse});

        }

        function createNewNote(parent: NoteIDStr, childRef: NoteIDStr) {

            const store = storeProvider();
            const index = {...store.index};

            const id = Hashcodes.createRandomID();

            const parentNote = index[parent];

            if (! parentNote) {
                throw new Error("No parent note");
            }

            const items = parentNote.items || [];

            // FIXME: insert into the right places...

            const newNote: INote = {
                id
            }

            index[parentNote.id] = {
                ...parentNote,
                items: [...items, id]
            }

            index[newNote.id] = newNote;

            setStore({...store, index});

        }

        function setActive(active: NoteIDStr | undefined) {
            const store = storeProvider();
            setStore({...store, active});
        }

        return {
            doPut, doDelete, lookup, lookupReverse, createNewNote, setActive
        };

    }, [setStore, storeProvider])

}

export const [NotesStoreProvider, useNotesStore, useNotesCallbacks, useNotesMutator]
    = createObservableStore<INotesStore, Mutator, INotesCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory,
    enableShallowEquals: true
});

