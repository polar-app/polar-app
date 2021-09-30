import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Clipboards} from "../util/system/clipboard/Clipboards";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {observer} from "mobx-react-lite"
import {BlockPredicates} from "./store/BlockPredicates";
import {useBlocksTreeStore} from './BlocksTree';
import {BlockTextContentUtils} from './NoteUtils';

export const BlockContextMenuItems = observer(function MUIDocDropdownMenuItems() {

    const blocksTreeStore = useBlocksTreeStore();

    const onCopyMarkdown = React.useCallback(() => {

        const active = blocksTreeStore.active;

        if (! active) {
            return;
        }

        const activeBlock = blocksTreeStore.getBlock(active.id);

        if (! activeBlock) {
            return;
        }

        if (! BlockPredicates.isEditableBlock(activeBlock)) {
            return;
        }

        const markdown = BlockTextContentUtils.getTextContentMarkdown(activeBlock.content);

        Clipboards.writeText(markdown);

    }, [blocksTreeStore]);

    return (
        <>

            <MenuItem onClick={onCopyMarkdown}>
                <ListItemIcon>
                    <FileCopyIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Copy Markdown"/>
            </MenuItem>

        </>
    );
});
