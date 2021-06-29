import React from "react";
import {ActionMenuItemProvider, IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import {BlockIDStr} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import {useBlocksTreeStore} from "./BlocksTree";

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

