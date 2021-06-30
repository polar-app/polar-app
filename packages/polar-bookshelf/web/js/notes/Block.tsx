import React from "react";
import {BlockEditor} from "./BlockEditor";
import {BlockItems} from "./BlockItems";
import {BlockBulletButton} from "./BlockBulletButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {BlockContextMenuItems} from "./BlockContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";
import {BlockExpandToggleButton} from "./BlockExpandToggleButton";
import {BlockIDStr} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {BlockDragIndicator} from "./BlockDragIndicator";
import {useUndoQueue} from "../undo/UndoQueueProvider2";
import {useBlocksTreeStore} from "./BlocksTree";

const useStyles = makeStyles((theme) =>
    createStyles({
        selected: {
            background: theme.palette.primary.main
        },
    }),
);

interface IProps {
    readonly parent: BlockIDStr | undefined;
    readonly id: BlockIDStr;
}

export interface IBlockContextMenuOrigin {

}

export const [BlockContextMenu, useBlockContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(BlockContextMenuItems, {name: 'notes'});

export const BlockInner = observer((props: IProps) => {
    const blocksTreeStore = useBlocksTreeStore();

    const {id} = props;
    const {root} = blocksTreeStore;

    const classes = useStyles();
    const undoQueue = useUndoQueue();

    const theme = useTheme();
    const contextMenuHandlers = useBlockContextMenu();

    const expanded = blocksTreeStore.isExpanded(id);
    const selected = blocksTreeStore.isSelected(id);
    const block = blocksTreeStore.getBlock(id);

    const divRef = React.useRef<HTMLDivElement | null>(null);
    const dragActive = React.useRef<boolean>(false);

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

    const handleDragStart = React.useCallback((event: React.DragEvent) => {
        blocksTreeStore.setDropSource(props.id);
        // event.preventDefault();
        // event.stopPropagation();
    }, [props.id, blocksTreeStore]);

    const computeDragPosition = React.useCallback((event: React.DragEvent | React.MouseEvent) => {

        // FIXME: if this is a root note then we can only drag BELOW it...

        if (divRef.current) {

            const bcr = divRef.current.getBoundingClientRect();

            const deltaTop = Math.abs(event.clientY - bcr.top);
            const deltaBottom = Math.abs(event.clientY - bcr.bottom);

            if (deltaTop < deltaBottom) {
                return 'top';
            }

        }

        return 'bottom';

    }, []);

    const updateDropTarget = React.useCallback((event: React.DragEvent | React.MouseEvent) => {

        const pos = computeDragPosition(event);

        blocksTreeStore.setDropTarget({
            id: props.id, pos
        });

    }, [computeDragPosition, props.id, blocksTreeStore]);

    const handleDragEnter = React.useCallback((event: React.DragEvent) => {

        updateDropTarget(event);

        dragActive.current = true;

        event.preventDefault();
        event.stopPropagation();

    }, [updateDropTarget]);

    const handleDragExit = React.useCallback((event: React.DragEvent) => {

        dragActive.current = false;

        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleMouseMove = React.useCallback((event: React.MouseEvent) => {

        if (dragActive.current) {
            updateDropTarget(event);
        }

    }, [updateDropTarget]);

    const handleDrop = React.useCallback((event: React.DragEvent) => {

        event.preventDefault();

        // FIXME: do the move now... and actually move the item

        console.log("FIXME: DROP")

    }, []);

    if (! block) {
        return null;
    }

    const items = blocksTreeStore.lookup(block.itemsAsArray || []);

    const hasItems = items.length > 0;

    const dropActive = blocksTreeStore.dropTarget?.id === props.id && blocksTreeStore.dropSource !== props.id;

    return (
        <div ref={divRef}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onKeyDown={handleKeyDown}
             onDragStart={event => handleDragStart(event)}
             onDragEnter={event => handleDragEnter(event)}
             onDragLeave={event => handleDragExit(event)}
             onDragEnd={() => blocksTreeStore.clearDrop()}
             onDrop={event => handleDrop(event)}
             className={clsx(['Block', selected ? classes.selected : undefined])}>

                <BlockDragIndicator id={props.id}>
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

                            <div style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     minWidth: '3em',
                                     justifyContent: 'flex-end',
                                     marginRight: theme.spacing(0.5)
                                 }}>

                                {/*<NoteOverflowButton id={props.id}/>*/}

                                {hasItems && id !== root && (
                                    <BlockExpandToggleButton id={props.id}/>
                                )}

                                {block.parent && <BlockBulletButton target={props.id}/>}

                            </div>
                            <BlockEditor key={props.id} parent={props.parent} id={props.id} />

                            {/*{(block.content.type === 'date' || block.content.type === 'name') && (*/}
                            {/*    <div style={{*/}
                            {/*             fontSize: '20px',*/}
                            {/*             fontWeight: 'bold'*/}
                            {/*         }}*/}
                            {/*         key={props.id}>*/}
                            {/*        {block.content.data}*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>

                        {(expanded || id === root) && (
                            <BlockItems parent={props.id} notes={items}/>
                        )}
                </>
            </BlockDragIndicator>
        </div>
    );
});

export const Block = observer(function Note(props: IProps) {

    // useLifecycleTracer('Note');

    return (
        <BlockContextMenu>
            <BlockInner {...props}/>
        </BlockContextMenu>
    );

});

