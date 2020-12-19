import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import { deepMemo } from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";

function useItemsProvider(): ActionMenuItemProvider {

    const {filterNotesByName} = useNotesStoreCallbacks();

    return React.useCallback((prompt: string): ReadonlyArray<IActionMenuItem> => {

        const filteredNoteNames = filterNotesByName(prompt);

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

    }, [filterNotesByName]);

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

