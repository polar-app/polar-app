import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import { deepMemo } from "../react/ReactUtils";
import {NoteIDStr, useNotesStore} from "./NotesStore2";

function useItemsProvider(): ActionMenuItemProvider {

    const store = useNotesStore();

    return React.useCallback((prompt: string): ReadonlyArray<IActionMenuItem> => {

        const filteredNoteNames = store.filterNotesByName(prompt);

        return filteredNoteNames.map(key => {
            return {
                id: key.toLowerCase(),
                text: key,
                action: () => {
                    return {
                        type: 'replace'
                    };
                }
            }
        });

    }, [store]);

}

interface IProps {
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteActionMenuForLinking = deepMemo(function NoteActionMenuForLinking(props: IProps) {

    const itemsProvider = useItemsProvider();

    return (
        <NoteActionMenu id={props.id}
                        trigger='['
                        itemsProvider={itemsProvider}>

            {props.children}

        </NoteActionMenu>
    );

})

