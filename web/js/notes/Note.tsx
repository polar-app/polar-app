import React from "react";
import {NoteEditor} from "./NoteEditor";
import {NoteItems} from "./NoteItems";
import {NoteBulletButton} from "./NoteBulletButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {NoteContextMenuItems} from "./NoteContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";
import { NoteExpandToggleButton } from "./NoteExpandToggleButton";
import { BlockIDStr, useNotesStore } from "./store/BlocksStore";
import { observer,  } from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";

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

export interface INoteContextMenuOrigin {

}

export const [NoteContextMenu, useNoteContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(NoteContextMenuItems, {name: 'notes'});

export const NoteInner = observer((props: IProps) => {

    const {id} = props;

    const store = useNotesStore();
    const classes = useStyles();

    const theme = useTheme();
    const contextMenuHandlers = useNoteContextMenu();

    const expanded = store.isExpanded(id);
    const selected = store.isSelected(id);
    const note = store.getNote(id);

    const root = store.root;

    const handleMouseDown = React.useCallback((event: React.MouseEvent) => {

        if (event.shiftKey) {

            if (store.active !== undefined) {

                if (store.active?.id !== id) {

                    store.setSelectionRange(store.active.id, id);

                    window.getSelection()!.removeAllRanges();

                }

            }

            // we have to stop propagation here because otherwise it will bubble
            // up to the root and select that.
            event.stopPropagation();

        } else {
            store.clearSelected('Note: handleMouseDown');
        }

    }, [id, store]);

    if (! note) {
        return null;
    }

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
            abortEvent();
        }

    }, []);

    const handleDragStart = React.useCallback((event: React.DragEvent) => {
        store.setDropSource(props.id);
        // event.preventDefault();
        // event.stopPropagation();
    }, [props.id, store]);

    const handleDragEnter = React.useCallback((event: React.DragEvent) => {
        store.setDropTarget(props.id);
        event.preventDefault();
        event.stopPropagation();
    }, [props.id, store]);

    const handleDragExit = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const items = store.lookup(note.items || []);

    const hasItems = items.length > 0;

    const dropActive = store.dropTarget === props.id && store.dropSource !== props.id;

    return (
        <div onMouseDown={handleMouseDown}
             onKeyDown={handleKeyDown}
             onDragStart={event => handleDragStart(event)}
             onDragEnter={event => handleDragEnter(event)}
             onDragLeave={event => handleDragExit(event)}
             onDragEnd={() => store.clearDrop()}
             onDrop={event => event.preventDefault()}
             className={clsx(['Note', selected ? classes.selected : undefined])}>

            <div {...contextMenuHandlers}
                 style={{
                     display: 'flex',
                     alignItems: 'flex-start',
                     marginTop: theme.spacing(0.5),
                     marginBottom: theme.spacing(0.5),
                     background: dropActive ? 'red' : 'inherit'
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
                        <NoteExpandToggleButton id={props.id}/>
                    )}

                    <NoteBulletButton target={props.id}/>

                </div>

                <NoteEditor key={props.id} parent={props.parent} id={props.id} />

            </div>

            {(expanded || id === root) && (
                <NoteItems parent={props.id} notes={items}/>
            )}
        </div>
    );
});

export const Note = observer(function Note(props: IProps) {

    // useLifecycleTracer('Note');

    return (
        <NoteContextMenu>
            <NoteInner {...props}/>
        </NoteContextMenu>
    );

});

