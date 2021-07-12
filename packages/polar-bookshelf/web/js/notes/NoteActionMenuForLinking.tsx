import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import {observer} from "mobx-react-lite"
import {useBlocksTreeStore} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

function useItemsProvider(): ActionMenuItemProvider {

    const blocksTreeStore = useBlocksTreeStore();

    return React.useCallback((prompt: string): ReadonlyArray<IActionMenuItem> => {

        const filteredNoteNames = blocksTreeStore.filterByName(prompt);

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

    }, [blocksTreeStore]);

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

