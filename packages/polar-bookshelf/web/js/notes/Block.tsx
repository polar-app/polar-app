import React from "react";
import {BlockEditor} from "./BlockEditor";
import {BlockItems} from "./BlockItems";
import {BlockBulletButton} from "./BlockBulletButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {BlockContextMenuItems} from "./BlockContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";
import {BlockExpandToggleButton} from "./BlockExpandToggleButton";
import {observer} from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {BlockDragIndicator} from "./BlockDragIndicator";
import {useUndoQueue} from "../undo/UndoQueueProvider2";
import {useBlocksTreeStore} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Divider} from "@material-ui/core";
import {useDragDropHandler} from "./DropHandler";
import {Interstitial} from "./Interstitial";

const useStyles = makeStyles((theme) =>
    createStyles({
        selected: {
            background: theme.palette.primary.main
        },
        titleBlock: {
            fontWeight: 'bold',
            fontSize: 22,
        },
    }),
);

interface IProps {
    readonly parent: BlockIDStr | undefined;
    readonly id: BlockIDStr;
    readonly withHeader?: boolean;
    readonly noExpand?: boolean;
    readonly noBullet?: boolean;
}

export interface IBlockContextMenuOrigin {

}

export const [BlockContextMenu, useBlockContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(BlockContextMenuItems, {name: 'notes'});

export const BlockInner = observer((props: IProps) => {
    const blocksTreeStore = useBlocksTreeStore();

    const {id, parent, withHeader = false, noExpand = false, noBullet = false} = props;
    const {root} = blocksTreeStore;
    const isRoot = id === root;
    const dragDropBinds = useDragDropHandler({ id, isRoot });

    const classes = useStyles();
    const undoQueue = useUndoQueue();

    const theme = useTheme();
    const contextMenuHandlers = useBlockContextMenu();

    const expanded = blocksTreeStore.isExpanded(id);
    const selected = blocksTreeStore.isSelected(id);
    const interstitials = blocksTreeStore.getInterstitials(id);
    const block = blocksTreeStore.getBlock(id);

    const handleMouseDown = React.useCallback((event: React.MouseEvent) => {

        if (event.shiftKey) {

            if (blocksTreeStore.active !== undefined) {

                if (blocksTreeStore.active?.id !== id) {

                    blocksTreeStore.setSelectionRange(blocksTreeStore.active.id, id);

                    window.getSelection()!.removeAllRanges();

                }

            }

            // we have to stop propagation here because otherwise it will bubble
            // up to the root and select that.
            event.stopPropagation();

        } else {
            blocksTreeStore.clearSelected('Note: handleMouseDown');
        }

    }, [id, blocksTreeStore]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        function abortEvent() {
            event.preventDefault();
            event.stopPropagation();
        }

        function computeUndoOperation(): 'undo' | 'redo' | undefined {

            // **** macos

            // *** undo
            if (event.metaKey && event.key === 'z') {
                return 'undo';
            }

            // *** redo
            if (event.metaKey && event.shiftKey && event.key === 'z') {
                abortEvent();
                return 'redo';
            }

            // **** windows

            // *** undo alt+backspace
            if (event.metaKey && event.key === 'Backspace') {
                abortEvent();
                return 'undo';
            }

            // ** undo: ctrl+z
            if (event.ctrlKey && event.key === 'z') {
                abortEvent();
                return 'undo';
            }

            // ** redo: ctrl+y
            if (event.ctrlKey && event.key === 'y') {
                // this is redo..
                return 'redo';
            }

            // ** redo: ctrl+shift+z
            if (event.ctrlKey && event.shiftKey && event.key === 'z') {
                // this is redo..
                return 'redo';
            }

            return undefined;

        }

        const op = computeUndoOperation();

        if (op !== undefined) {

            switch (op) {

                case "undo":
                    undoQueue.undo();
                    break;
                case "redo":
                    undoQueue.redo();
                    break;

            }

            abortEvent();
        }

    }, [undoQueue]);


    const topInterstitials = React.useMemo(() => interstitials.filter(({target}) => target.pos === 'top'), [interstitials]);
    const bottomInterstitials = React.useMemo(() => interstitials.filter(({target}) => target.pos === 'bottom'), [interstitials]);

    if (! block) {
        return null;
    }

    const items = blocksTreeStore.lookup(block.itemsAsArray || []);

    const hasItems = items.length > 0;

    return (
        <div onMouseDown={handleMouseDown}
             onKeyDown={handleKeyDown}
             data-blockID={id}
             className={clsx('Block', { [classes.selected]: selected }) }
             {...dragDropBinds}>

            {topInterstitials.map(interstitial => <Interstitial key={interstitial.id} interstitial={interstitial} />) }
            <BlockDragIndicator id={id}>
                <>
                    <div {...contextMenuHandlers}
                         style={{
                             display: 'flex',
                             alignItems: 'flex-start',
                             boxSizing: 'border-box',
                             paddingTop: theme.spacing(0.5),
                             paddingBottom: theme.spacing(0.5),
                             // background: dropActive ? 'red' : 'inherit'
                         }}>

                        {!(noExpand && noBullet) && (
                            <div style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     minWidth: '3em',
                                     justifyContent: 'flex-end',
                                     marginRight: theme.spacing(0.5),
                                 }}>


                                {hasItems && !noExpand && (
                                    <BlockExpandToggleButton id={id}/>
                                )}

                                {!noBullet && <BlockBulletButton target={id}/>}

                            </div>
                        )}

                        {withHeader && isRoot
                            ? (
                                <BlockEditor
                                    parent={parent}
                                    id={id}
                                    className={classes.titleBlock}
                                />
                            ) : (
                                <BlockEditor
                                    parent={parent}
                                    id={id}
                                />
                            )
                        }
                    </div>

                    {withHeader && isRoot &&
                        <Divider style={{ margin: '13px 0 22px' }} />
                    }

                    {(expanded || (isRoot && noExpand)) && (
                        <BlockItems parent={id} notes={items} indent={!withHeader} />
                    )}
                </>
            </BlockDragIndicator>
            {bottomInterstitials.map(interstitial => <Interstitial key={interstitial.id} interstitial={interstitial} />) }
        </div>
    );
});

export const Block = observer(function Note(props: IProps) {

    return (
        <BlockContextMenu>
            <BlockInner {...props}/>
        </BlockContextMenu>
    );

});

