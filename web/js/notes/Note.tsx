import React from "react";
import {NoteEditor} from "./NoteEditor";
import {NoteIDStr, useNotesStoreCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";
import {NoteBullet} from "./ NoteBullet";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import {NoteOverflow} from "./NoteOverflow";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {NoteContextMenuItems} from "./NoteContextMenuItems";

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

    const note = index[id];

    const notes = lookup(note.items || []);

    const contextMenuHandlers = useNoteContextMenu();

    return (
        <>
            <div className="Note"
                 {...contextMenuHandlers}
                 style={{
                     display: 'flex',
                     alignItems: 'flex-start'
                 }}>

                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>

                    <NoteOverflow target={props.id}/>

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

