import React from "react";
import {ckeditor5, CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import {NoteNavigation} from "./NoteNavigation";
import {NoteIDStr, useNotesStoresCallbacks} from "./NotesStore";
import { deepMemo } from "../react/ReactUtils";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly content: string | undefined;
}

const items: ReadonlyArray<IActionMenuItem> = [
    {
        id: 'today',
        text: 'Today'
    },
    {
        id: 'tomorrow',
        text: 'Tomorrow'
    },

]

export const NoteEditor = deepMemo((props: IProps) => {

    const [editor, setEditor] = React.useState<ckeditor5.IEditor | undefined>();

    const {updateNote} = useNotesStoresCallbacks()

    const handleClick = React.useCallback((event: React.MouseEvent) => {
    }, []);

    const handleChange = React.useCallback((content: string) => {
        updateNote(props.id, content);
    }, [props.id, updateNote]);

    return (
        <NoteActionMenu items={() => items} onItem={item => console.log('got item: ', item)}>
            <div onClick={handleClick}>
                <NoteNavigation parent={props.parent} id={props.id} editor={editor}>
                    <CKEditor5 content={props.content || ''} onChange={handleChange} onEditor={setEditor}/>
                </NoteNavigation>
            </div>
        </NoteActionMenu>
    );

});
