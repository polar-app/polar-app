import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import { deepMemo } from "../react/ReactUtils";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NoteIDStr} from "./NotesStore";

function useItemsProvider(): ActionMenuItemProvider {

    const items = React.useMemo((): ReadonlyArray<IActionMenuItem> => [
        {
            id: 'today',
            text: 'Today',
            action: NULL_FUNCTION
        },
        {
            id: 'tomorrow',
            text: 'Tomorrow',
            action: NULL_FUNCTION
        },
        {
            id: 'table',
            text: 'Table',
            action: (id, editor) => {
                console.log("insertTable", editor);
                editor.commands.get('insertTable').execute()
            }
        },

    ], []);

    return React.useCallback((prompt: string): ReadonlyArray<IActionMenuItem> => {

        const predicate = (item: IActionMenuItem) => {
            return prompt === undefined || item.text.toLowerCase().indexOf(prompt.toLowerCase()) !== -1;
        };

        return items.filter(predicate);

    }, [items]);

}

interface IProps {
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteActionMenuForCommands = deepMemo((props: IProps) => {

    const itemsProvider = useItemsProvider();

    return (
        <NoteActionMenu id={props.id}
                        itemsProvider={itemsProvider}>

            {props.children}

        </NoteActionMenu>
    );

})