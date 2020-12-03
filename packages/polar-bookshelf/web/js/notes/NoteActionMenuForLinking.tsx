import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import { deepMemo } from "../react/ReactUtils";
import {NoteIDStr, useNotesStore} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";

function useItemsProvider(): ActionMenuItemProvider {

    const {indexByName} = useNotesStore(['indexByName']);
    const indexByNameRef = useRefValue(indexByName);

    return React.useCallback((prompt: string): ReadonlyArray<IActionMenuItem> => {

        console.log("FIXME prompt: " + prompt);

        const promptLower = prompt.toLowerCase();

        const filteredKeys = Object.keys(indexByNameRef.current)
                                   .filter(key => key.toLowerCase().indexOf(promptLower) !== -1);

        return filteredKeys.map(key => {
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

    }, [indexByNameRef]);

}

interface IProps {
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteActionMenuForLinking = deepMemo(function NoteActionMenuForLinking(props: IProps) {

    const itemsProvider = useItemsProvider();

    return (
        <NoteActionMenu id={props.id}
                        trigger='[['
                        itemsProvider={itemsProvider}>

            {props.children}

        </NoteActionMenu>
    );

})

