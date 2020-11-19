import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {IDStr} from "polar-shared/src/util/Strings";

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

export interface INoteWithName extends INoteBase {

    readonly name: string;

}

export interface INoteWithContent extends INoteBase {

    readonly content: string;

}

export interface INoteWithNameAndContent extends INoteBase {

    readonly name: string;
    readonly content: string;

}

export type INote = INoteWithName | INoteWithContent | INoteWithNameAndContent;

interface INotesStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly index: NotesIndex;

    readonly reverse: ReverseNotesIndex;

}

interface INotesCallbacks {

    readonly doPut: (notes: ReadonlyArray<INote>) => void;
    readonly doDelete: (notes: ReadonlyArray<INote>) => void;

    readonly lookup: (notes: ReadonlyArray<NoteIDStr>) => ReadonlyArray<INote>;
    readonly lookupReverse: (id: NoteIDStr) => ReadonlyArray<NoteIDStr>;

}

const initialStore: INotesStore = {
    index: {},
    reverse: {}
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

            setStore({index, reverse});

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

            setStore({index, reverse});

        }

        return {
            doPut, doDelete, lookup, lookupReverse
        };

    }, [storeProvider])

}

export const [NotesStoreProvider, useNotesStore, useNotesCallbacks, useNotesMutator]
    = createObservableStore<INotesStore, Mutator, INotesCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory,
    enableShallowEquals: true
});

