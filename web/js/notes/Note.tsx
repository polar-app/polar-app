import React from "react";
import {NoteEditor} from "./NoteEditor";
import {
    NoteIDStr,
    useNotesStoreCallbacks,
    useNotesStore,
    useNoteFromStore,
    StringSetMap,
    useNoteExpanded
} from "./NotesStore";
import {NoteItems} from "./NoteItems";
import {deepMemo} from "../react/ReactUtils";
import {NoteBulletButton} from "./NoteBulletButton";
import {useLifecycleTracer, useLifecycleTracerForHook} from "../hooks/ReactHooks";
import {NoteOverflowButton} from "./NoteOverflowButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {NoteContextMenuItems} from "./NoteContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";
import { NoteExpandToggleButton } from "./NoteExpandToggleButton";

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly isExpanded?: boolean;
}

export interface INoteContextMenuOrigin {

}

export const [NoteContextMenu, useNoteContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(NoteContextMenuItems);

export const NoteInner = deepMemo(function NoteInner(props: IProps) {

    useLifecycleTracer('NoteInner', {id: props.id});

    const {id} = props;

    const {root} = useNotesStore(['root']);
    const {lookup} = useNotesStoreCallbacks();
    const expanded = useNoteExpanded(props.id);
    const theme = useTheme();
    const contextMenuHandlers = useNoteContextMenu();

    const note = useNoteFromStore(id);

    if (! note) {
        return null;
    }

    const items = lookup(note.items || []);

    const hasItems = items.length > 0;

    return (
        <>
            <div className="Note"
                 {...contextMenuHandlers}
                 style={{
                     display: 'flex',
                     alignItems: 'flex-start',
                     marginTop: theme.spacing(0.5),
                     marginBottom: theme.spacing(0.5)
                 }}>

                <div style={{
                         display: 'flex',
                         alignItems: 'center',
                         width: '3em',
                         justifyContent: 'flex-end',
                         marginRight: theme.spacing(0.5)
                     }}>

                    <NoteOverflowButton id={props.id}/>

                    {hasItems && id !== root && (
                        <NoteExpandToggleButton id={props.id}/>
                    )}

                    <NoteBulletButton target={props.id}/>

                </div>

                <NoteEditor parent={props.parent} id={props.id} />

            </div>

            {(expanded || props.isExpanded) && (
                <NoteItems parent={props.id} notes={items}/>
            )}
        </>
    );
});



export const Note = deepMemo(function Note(props: IProps) {

    useLifecycleTracer('Note');

    return (
        <NoteContextMenu>
            <NoteInner {...props}/>
        </NoteContextMenu>
    );

});

