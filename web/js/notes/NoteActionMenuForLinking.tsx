import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import {BlockIDStr, useBlocksStore} from "./store/BlocksStore";
import { observer } from "mobx-react-lite"

function useItemsProvider(): ActionMenuItemProvider {

    const store = useBlocksStore();

    return React.useCallback((prompt: string): ReadonlyArray<IActionMenuItem> => {

        const filteredNoteNames = store.filterByName(prompt);

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
    readonly id: BlockIDStr;
    readonly children: JSX.Element;
}

export const NoteActionMenuForLinking = observer(function NoteActionMenuForLinking(props: IProps) {

    const itemsProvider = useItemsProvider();

    return (
        <NoteActionMenu id={props.id}
                        trigger='['
                        itemsProvider={itemsProvider}>

            {props.children}

        </NoteActionMenu>
    );

})

