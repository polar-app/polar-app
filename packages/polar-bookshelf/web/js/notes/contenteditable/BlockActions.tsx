import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {ActionMenuItemsProvider, createActionsProvider} from "../../mui/action_menu/ActionStore";
import {useBlocksTreeStore} from "../BlocksTree";
import {TAG_IDENTIFIER} from "../content/HasLinks";
import {BlockTextContentUtils, useNamedBlocks} from "../NoteUtils";
import {BlockPredicates} from "../store/BlockPredicates";
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

    return (
        <BlockAction id={id}
                     trigger="[["
                     wrapStart="[[ "
                     wrapEnd=" ]]"
                     actionsProvider={noteActionsProvider}
                     computeActionInputText={computeLinkActionInputText}
                     disabled={disabled}
                     onAction={(id) => ({
                        type: "block-link",
                        target: id
                    })}>
            {children}
        </BlockAction>
    );
};

const TagsBlockAction: React.FC<IBlockActionProps> = (props) => {
    const { children, id, noteActionsProvider, disabled } = props;

    const computeLinkActionInputText = React.useCallback((str: string): string => {
        return str.replace(new RegExp(`^${TAG_IDENTIFIER}`), '');
    }, []);

    return (
        <BlockAction id={id}
                     trigger={TAG_IDENTIFIER}
                     wrapStart={TAG_IDENTIFIER}
                     wrapEnd=""
                     actionsProvider={noteActionsProvider}
                     computeActionInputText={computeLinkActionInputText}
                     disabled={disabled}
                     onAction={(id) => ({
                        type: "block-tag",
                        target: `${TAG_IDENTIFIER}${id}`
                    })}>
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

export const BlockActionsProvider: React.FC<IBlockActionsProviderProps> = (props) => {
    const { id, children } = props;

    const namedBlocks = useNamedBlocks();
    const blocksTreeStore = useBlocksTreeStore();
    const block = React.useMemo(() => blocksTreeStore.getBlock(id), [blocksTreeStore, id]);
    const canHaveLinks = React.useMemo(() => block && BlockPredicates.canHaveLinks(block), [block]);

    const noteLinkActions = React.useMemo(() => {
        return namedBlocks.map((block) => {
            const name = BlockTextContentUtils.getTextContentMarkdown(block.content);
            return {
                id: name,
                text: name,
            };
        });
    }, [namedBlocks]);

    const noteActionsProvider = React.useMemo(() => createActionsProvider(noteLinkActions), [noteLinkActions]);



    return (
        <WikiLinksBlockAction disabled={! canHaveLinks} id={id} noteActionsProvider={noteActionsProvider}>
            <TagsBlockAction disabled={! canHaveLinks} id={id} noteActionsProvider={noteActionsProvider}>
                {children}
            </TagsBlockAction>
        </WikiLinksBlockAction>
    );
};

