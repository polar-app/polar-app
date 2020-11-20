import React from "react";
import {ckeditor5, CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IActionMenuItem, NoteActionMenu} from "./NoteActionMenu";
import {NoteNavigation} from "./NoteNavigation";
import {NoteIDStr, useNotesStoresCallbacks} from "./NotesStore";
import { deepMemo } from "../react/ReactUtils";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

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

function useLinkNavigation() {

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClick = React.useCallback((event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
    }, []);

    React.useEffect(() => {
        if (ref) {
            ref.addEventListener('click', handleClick, {capture: true})
        }
    }, [handleClick, ref]);

    useComponentWillUnmount(() => {
        if (ref) {
            ref.removeEventListener('click', handleClick, {capture: true})
        }
    })

    return setRef;

}

export const NoteEditor = deepMemo((props: IProps) => {

    const [editor, setEditor] = React.useState<ckeditor5.IEditor | undefined>();

    const {updateNote} = useNotesStoresCallbacks()

    const ref = useLinkNavigation();

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        console.log("FIXME: got click");
        event.stopPropagation();
        event.preventDefault();
    }, []);

    const handleChange = React.useCallback((content: string) => {
        updateNote(props.id, content);
    }, [props.id, updateNote]);

    return (
        <NoteActionMenu items={() => items} onItem={item => console.log('got item: ', item)}>
            <div onClick={handleClick} ref={ref}>
                <NoteNavigation parent={props.parent} id={props.id} editor={editor}>
                    <CKEditor5 content={props.content || ''} onChange={handleChange} onEditor={setEditor}/>
                </NoteNavigation>
            </div>
        </NoteActionMenu>
    );

});
