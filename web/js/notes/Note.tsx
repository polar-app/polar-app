import React from "react";
import {NoteEditor} from "./NoteEditor";
import {NoteIDStr, useNotesStoreCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";
import {NoteBullet} from "./NoteBullet";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import {NoteOverflowButton} from "./NoteOverflowButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {NoteContextMenuItems} from "./NoteContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;

}

export interface INoteContextMenuOrigin {

}

export const [NoteContextMenu, useNoteContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(NoteContextMenuItems);



export const NoteInner = deepMemo(function NoteInner(props: IProps) {

    useLifecycleTracer('NoteInner');

    const {id} = props;
    const {index} = useNotesStore(['index']);
    const {lookup} = useNotesStoreCallbacks();
    const theme = useTheme();

    const note = index[id];

    const notes = lookup(note.items || []);

    const contextMenuHandlers = useNoteContextMenu();

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
                         marginRight: theme.spacing(0.5)
                     }}>

                    <NoteOverflowButton target={props.id}/>

                    <NoteBullet target={props.id}/>

                </div>

                <NoteEditor parent={props.parent} id={props.id} />

            </div>

            <Notes parent={props.parent} notes={notes}/>
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

