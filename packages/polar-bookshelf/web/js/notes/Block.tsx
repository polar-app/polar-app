import React from "react";
import {BlockEditor} from "./BlockEditor";
import {BlockItems} from "./BlockItems";
import {BlockBulletButton} from "./BlockBulletButton";
import {BlockExpandToggleButton} from "./BlockExpandToggleButton";
import {observer} from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {BlockDragIndicator} from "./BlockDragIndicator";
import {useUndoQueue} from "../undo/UndoQueueProvider2";
import {useBlocksTreeStore} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Box, Theme} from "@material-ui/core";
import {useDragDropHandler} from "./DropHandler";
import {Interstitial} from "./Interstitial";
import {BlockContextMenu, useBlockContextMenu} from "./BlockContextMenu";

interface IUseStylesProps {
    readonly hasGutter: boolean;
}

export const NOTES_GUTTER_SIZE = 20;

const useStyles = makeStyles<Theme, IUseStylesProps>((theme) =>
    createStyles({
        selected: {
            background: theme.palette.primary.main
        },
        titleBlock: {
            fontWeight: 'bold',
            fontSize: 32,
            letterSpacing: 0.5,
            lineHeight: 1.66,
        },
        titleBlockWrapper: {
            marginLeft: 28,
        },
        iconButtonWrapper: {
            width: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconButton: {
            width: 20,
            height: 20,
            display: 'block',
        },
        expandButtonWrapper: ({ hasGutter }) => ({
            marginRight: hasGutter ? NOTES_GUTTER_SIZE : 0,
        }),
    }),
);

interface IProps {
    readonly parent: BlockIDStr | undefined;
    readonly id: BlockIDStr;
    readonly isHeader?: boolean;
    readonly alwaysExpanded?: boolean;
    readonly noBullet?: boolean;
    readonly hasGutter?: boolean;
    readonly dontRenderChildren?: boolean;
}


export const BlockInner = observer((props: IProps) => {
    const blocksTreeStore = useBlocksTreeStore();

    const {
        id,
        parent,
        isHeader = false,
        alwaysExpanded = false,
        noBullet = false,
        hasGutter = false,
        dontRenderChildren = false,
    } = props;

    const {root} = blocksTreeStore;
    const isRoot = id === root;
    const dragDropCallbacks = useDragDropHandler({ id, isRoot });

    const classes = useStyles({ hasGutter });
    const undoQueue = useUndoQueue();

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

    const topInterstitials = React.useMemo(() => interstitials.filter(({position}) => position === 'top'), [interstitials]);
    const bottomInterstitials = React.useMemo(() => interstitials.filter(({position}) => position === 'bottom'), [interstitials]);

    if (! block) {
        return null;
    }

    const childrenIDs = block.itemsAsArray;

    const hasItems = childrenIDs.length > 0;

    // TODO: on the root element below (Block), add the drag and drop handlers.
    // For now it doesn't work and we disabled it for now.
    return (
        <div onMouseDown={handleMouseDown}
             onKeyDown={handleKeyDown}
             className={clsx('Block', { [classes.selected]: selected }) }>

            {topInterstitials.map(interstitial =>
                <Interstitial key={interstitial.id}
                              interstitial={interstitial}
                              hasGutter={hasGutter} />
            )}
            <BlockDragIndicator id={id}>
                <Box {...contextMenuHandlers}
                    display="flex"
                    my={0.3}
                    mx={0.25}
                    className={clsx({ [classes.titleBlockWrapper]: isHeader })}>

                    {! (alwaysExpanded && noBullet) && (
                        <Box display="flex" alignItems="stretch" style={{ height: 28 }}>
                            <div className={clsx(classes.iconButtonWrapper, classes.expandButtonWrapper)}>
                                {hasItems && ! alwaysExpanded && (
                                    <BlockExpandToggleButton className={classes.iconButton} id={id} />
                                )}
                            </div>

                            <div className={classes.iconButtonWrapper}>
                                {! noBullet && <BlockBulletButton className={classes.iconButton} target={id}/>}
                            </div>

                        </Box>
                    )}

                    <BlockEditor
                        parent={parent}
                        id={id}
                        className={isHeader ? classes.titleBlock : ""}
                    />

                </Box>

                {(expanded || alwaysExpanded) && ! dontRenderChildren && (
                    <Box display="flex" pl={! isHeader && hasGutter ? `${NOTES_GUTTER_SIZE}px` : 0}>
                        <BlockItems parent={id}
                                    blockIDs={childrenIDs}
                                    hasGutter={isHeader && hasGutter}
                                    indent={! isHeader} />
                    </Box>
                )}
            </BlockDragIndicator>
            {bottomInterstitials.map(interstitial =>
                <Interstitial key={interstitial.id}
                              interstitial={interstitial}
                              hasGutter={hasGutter} />
            )}
        </div>
    );
});

export const Block = React.memo(function Note(props: IProps) {

    return (
        <BlockContextMenu>
            <BlockInner {...props}/>
        </BlockContextMenu>
    );

});

