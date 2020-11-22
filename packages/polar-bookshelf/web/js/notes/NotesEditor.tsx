import React from "react";
import {ckeditor5, CKEditor5BalloonEditor} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NoteNavigation} from "./NoteNavigation";
import {NoteIDStr, useNotesStoresCallbacks} from "./NotesStore";
import { deepMemo } from "../react/ReactUtils";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import { EditorStoreProvider, useSetEditorStore } from "./EditorStoreProvider";
import { NoteActionMenuForCommands } from "./NoteActionMenuForCommands";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly content: string | undefined;
}

function useLinkNavigation() {

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const linkLoaderRef = useLinkLoaderRef();

    const handleClick = React.useCallback((event: MouseEvent) => {

        // FIXME: this will break determinine which of the editor controls
        // are active

        if (event.target instanceof HTMLAnchorElement) {
            console.log("FIXME: anchor element");

            const href = event.target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {
                    console.log("FIXME: inner navigation.");
                } else {
                    const linkLoader = linkLoaderRef.current;
                    linkLoader(href, {newWindow: true, focus: true});
                    event.stopPropagation();
                }

            }

        }

    }, [linkLoaderRef]);

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

const Inner = deepMemo((props: IProps) => {

    const {updateNote} = useNotesStoresCallbacks()
    const setEditor = useSetEditorStore();

    const ref = useLinkNavigation();

    const handleChange = React.useCallback((content: string) => {
        updateNote(props.id, content);
    }, [props.id, updateNote]);

    return (
        <NoteActionMenuForCommands id={props.id}>
            <div ref={ref}>
                <NoteNavigation parent={props.parent} id={props.id}>
                    <CKEditor5BalloonEditor content={props.content || ''} onChange={handleChange} onEditor={setEditor}/>
                </NoteNavigation>
            </div>
        </NoteActionMenuForCommands>
    );

});



export const NoteEditor = deepMemo((props: IProps) => {

    return (
        <EditorStoreProvider initialValue={undefined}>
            <Inner {...props}/>
        </EditorStoreProvider>
    );

});
