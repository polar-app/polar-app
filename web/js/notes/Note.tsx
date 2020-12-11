import React from "react";
import {NoteEditor} from "./NoteEditor";
import {NoteIDStr, useNotesStoreCallbacks, useNotesStore} from "./NotesStore";
import {NoteItems} from "./NoteItems";
import {deepMemo} from "../react/ReactUtils";
import {NoteBulletButton} from "./NoteBulletButton";
import {useLifecycleTracer} from "../hooks/ReactHooks";
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

    useLifecycleTracer('NoteInner');

    const {id} = props;
    const {index, expanded, root} = useNotesStore(['index', 'expanded', 'root']);
    const {lookup} = useNotesStoreCallbacks();
    const theme = useTheme();

    const note = index[id];

    const items = lookup(note.items || []);

    const contextMenuHandlers = useNoteContextMenu();

    const hasItems = items.length > 0;
    const isExpanded = props.isExpanded || expanded[id] === true;

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

                    <NoteOverflowButton target={props.id}/>

                    {hasItems && id !== root && (
                        <NoteExpandToggleButton id={props.id}/>
                    )}

                    <NoteBulletButton target={props.id}/>

                </div>

                <NoteEditor parent={props.parent} id={props.id} />

            </div>

            {isExpanded && (
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

