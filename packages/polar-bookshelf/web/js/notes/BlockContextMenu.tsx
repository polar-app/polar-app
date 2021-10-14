import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {createContextMenu, IMouseEvent, MenuComponentProps} from '../../../apps/repository/js/doc_repo/MUIContextMenu2';
import {BlockIDStr} from 'polar-blocks/src/blocks/IBlock';
import {DOMBlocks} from './contenteditable/DOMBlocks';
import {getNoteAnchorFromHref, useNoteWikiLinkIdentifierCreator} from './NoteLinksHooks';
import {RoutePathNames} from '../apps/repository/RoutePathNames';
import {useLinkLoaderRef} from '../ui/util/LinkLoaderHook';

type IBlockContextMenuOriginBase = {
    blockID: BlockIDStr;
};

type IBlockContextMenuLinkOrigin = {
    type: 'wiki-link';
    href: string;
};

type IBlockContextMenuOrigin = IBlockContextMenuOriginBase & (IBlockContextMenuLinkOrigin);

const computeOrigin = (event: IMouseEvent): IBlockContextMenuOrigin | undefined => {
    const target = event.target;

    if (! (target instanceof HTMLElement)) {
        return;
    }

    const blockElem = DOMBlocks.findBlockParent(target)
    const blockID = blockElem ? DOMBlocks.getBlockID(blockElem) : undefined;

    if (! blockID) {
        return;
    }


    if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute('href');

        if (! href || ! href.startsWith('#')) {
            return;
        }

        return {
            blockID,
            type: 'wiki-link',
            href: target.href,
        };
    }


    // Not sure if we're gonna support other stuff in the future
    return undefined;
};

export const BlockContextMenuItems: React.FC<MenuComponentProps<IBlockContextMenuOrigin>> = (props) => {

    const { origin } = props;
    const createNoteWikiLinkIdentifier = useNoteWikiLinkIdentifierCreator();
    const linkLoaderRef = useLinkLoaderRef();

    const handleOpenInNewTab = React.useCallback(() => {
        if (! origin || origin.type !== 'wiki-link') {
            return;
        }

        const anchor = getNoteAnchorFromHref(origin.href);

        if (! anchor) {
            return;
        }

        const target = createNoteWikiLinkIdentifier(origin.blockID, anchor);
        const url = RoutePathNames.NOTE(encodeURIComponent(target));

        linkLoaderRef.current(url, {newWindow: true, focus: true});
    }, [origin, createNoteWikiLinkIdentifier]);

    if (! origin) {
        return null;
    }

    return (
        <>

            <MenuItem onClick={handleOpenInNewTab}>
                <ListItemIcon>
                    <OpenInNewIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Open in new Tab"/>
            </MenuItem>

        </>
    );
};

const [BlockContextMenu, useBlockContextMenu]
    = createContextMenu<IBlockContextMenuOrigin>(BlockContextMenuItems, {name: 'notes', computeOrigin });

const useBlockCustomContextMenu = () => {
    const contextMenuHandlers = useBlockContextMenu();

    const onContextMenu = React.useCallback((event: IMouseEvent) => {
        if (event.target instanceof HTMLAnchorElement) {
            const href = event.target.getAttribute('href');

            // Only handle wiki links for now
            if (href && href.startsWith('#')) {
                contextMenuHandlers.onContextMenu(event);
            }
        }
    }, [contextMenuHandlers]);

    return {onContextMenu};
};

export {
    BlockContextMenu,
    useBlockCustomContextMenu as useBlockContextMenu,
};
