import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import { deepMemo } from "../react/ReactUtils";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NoteIDStr} from "./NotesStore";

function useItemsProvider(): ActionMenuItemProvider {

    return React.useCallback((): ReadonlyArray<IActionMenuItem> => {
        return [
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
                action: () => console.log('inserting table')
            },

        ]

    }, []);

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