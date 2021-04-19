import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Clipboards} from "../util/system/clipboard/Clipboards";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useBlocksStore } from './store/BlocksStore';
import { observer } from "mobx-react-lite"
import {BlockPredicates} from "./store/BlockPredicates";

export const BlockContextMenuItems = observer(function MUIDocDropdownMenuItems() {

    const blocksStore = useBlocksStore();

    const onCopyMarkdown = React.useCallback(() => {

        const active = blocksStore.active;

        if (! active) {
            return;
        }

        const activeBlock = blocksStore.getBlock(active.id);

        if (! activeBlock) {
            return;
        }

        if (! BlockPredicates.isTextBlock(activeBlock)) {
            return;
        }

        const markdown = activeBlock.content.data;

        Clipboards.writeText(markdown);

    }, [blocksStore]);

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
