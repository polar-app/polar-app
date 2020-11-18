import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {IDStr} from "polar-shared/src/util/Strings";

export type NoteIDStr = IDStr;

export type NotesIndex = {[id: string /* NoteIDStr */]: INote};
export type ReverseNotesIndex = {[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>};

export interface INote {

    readonly id: NoteIDStr;

    readonly content: string;

    /**
     * The sub-items of this node as node IDs.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

}

interface INotesStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly index: NotesIndex;

    readonly reverse: ReverseNotesIndex;

}

interface INotesCallbacks {

    readonly add: (notes: ReadonlyArray<INote>) => void;
    readonly remove: (notes: ReadonlyArray<INote>) => void;

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

        function lookupReverse(id: NoteIDStr): ReadonlyArray<NoteIDStr> {
            const store = storeProvider();
            return store.reverse[id] || [];
        }

        function add(notes: ReadonlyArray<INote>) {

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

        }

        function remove(notes: ReadonlyArray<INote>) {

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

        }

        return {
            add, remove, lookupReverse
        };

    }, [])

}

export const [NotesStoreProvider, useNotesStore, useNotesCallbacks, useNotesMutator]
    = createObservableStore<INotesStore, Mutator, INotesCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory,
    enableShallowEquals: true
});

