import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import { deepMemo } from "../react/ReactUtils";
import { BlockIDStr } from "./store/BlocksStore";

function useItemsProvider(): ActionMenuItemProvider {

    const defaultAction = () => {
        return undefined;
    };

    const items = React.useMemo((): ReadonlyArray<IActionMenuItem> => [
        {
            id: 'today',
            text: 'Today',
            action: defaultAction
        },
        {
            id: 'tomorrow',
            text: 'Tomorrow',
            action: defaultAction
        },
        {
            id: 'table',
            text: 'Table',
            action: (id) => {
                // console.log("insertTable", editor);
                // editor.commands.get('insertTable').execute();
                return undefined;
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
    readonly id: BlockIDStr;
    readonly children: JSX.Element;
}

export const NoteActionMenuForCommands = deepMemo(function NoteActionMenuForCommands(props: IProps) {

    // useLifecycleTracer('NoteActionMenuForCommands', {id: props.id});

    const itemsProvider = useItemsProvider();

    return (
        <NoteActionMenu id={props.id}
                        trigger='/'
                        itemsProvider={itemsProvider}>

            {props.children}

        </NoteActionMenu>
    );

})
