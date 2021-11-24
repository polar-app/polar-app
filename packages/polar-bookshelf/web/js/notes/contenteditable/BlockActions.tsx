import {observer} from "mobx-react-lite";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {ActionMenuItemsProvider, createActionsProvider} from "../../mui/action_menu/ActionStore";
import {TAG_IDENTIFIER} from "../content/HasLinks";
import {BlockPredicates} from "../store/BlockPredicates";
import {useBlocksStore} from "../store/BlocksStore";
import {BlockAction} from "./BlockAction";

interface IBlockActionProps {
    id: BlockIDStr;
    noteActionsProvider: ActionMenuItemsProvider;
    disabled?: boolean;
}

const WikiLinksBlockAction: React.FC<IBlockActionProps> = (props) => {
    const { children, id, noteActionsProvider, disabled } = props;

    const computeLinkActionInputText = React.useCallback((str: string): string => {
        return str.replace(/^\[\[./, '')
                  .replace(/.\]\]$/, '');
    }, []);

    const handleAction = React.useCallback((id: string) => ({
        type: "block-link" as const,
        target: id,
    }), []);

    return (
        <BlockAction id={id}
                     trigger="[["
                     wrapStart="[[ "
                     wrapEnd=" ]]"
                     actionsProvider={noteActionsProvider}
                     computeActionInputText={computeLinkActionInputText}
                     disabled={disabled}
                     onAction={handleAction}>
            {children}
        </BlockAction>
    );
};

const TagsBlockAction: React.FC<IBlockActionProps> = (props) => {

    const { children, id, noteActionsProvider, disabled } = props;

    const computeLinkActionInputText = React.useCallback((str: string): string => {
        return str.replace(new RegExp(`^${TAG_IDENTIFIER}`), '');
    }, []);

    const handleAction = React.useCallback((id: string) => ({
        type: "block-tag" as const,
        target: `${TAG_IDENTIFIER}${id}`,
    }), []);

    return (
        <BlockAction id={id}
                     trigger={TAG_IDENTIFIER}
                     wrapStart={TAG_IDENTIFIER}
                     wrapEnd=""
                     actionsProvider={noteActionsProvider}
                     computeActionInputText={computeLinkActionInputText}
                     disabled={disabled}
                     onAction={handleAction}>
            {children}
        </BlockAction>
    );
};

const BlockActionComponentMap = {
    links: WikiLinksBlockAction,
    tags: TagsBlockAction,
};

type IBlockActionToggles = {
    [Key in keyof typeof BlockActionComponentMap]?: boolean;
};

interface IBlockActionsProviderProps extends IBlockActionToggles {
    id: BlockIDStr;
}

export const BlockActionsProvider: React.FC<IBlockActionsProviderProps> = observer((props) => {
    const { id, children } = props;

    const blocksStore = useBlocksStore();
    const block = React.useMemo(() => blocksStore.getBlock(id), [blocksStore, id]);
    const canHaveLinks = React.useMemo(() => block && BlockPredicates.canHaveLinks(block), [block]);

    const noteLinkActions = React.useMemo(() => {
        return blocksStore.namedBlockEntries.map(({ label }) => {
            return {
                id: label,
                text: label,
            };
        });
    }, [blocksStore.namedBlockEntries]);

    const noteActionsProvider = React.useMemo(() => createActionsProvider(noteLinkActions), [noteLinkActions]);

    return (
        <WikiLinksBlockAction disabled={! canHaveLinks} id={id} noteActionsProvider={noteActionsProvider}>
            <TagsBlockAction disabled={! canHaveLinks} id={id} noteActionsProvider={noteActionsProvider}>
                {children}
            </TagsBlockAction>
        </WikiLinksBlockAction>
    );
});

