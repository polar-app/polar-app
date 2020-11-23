import React from "react";
import {CKEditor5BalloonEditor} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NoteNavigation} from "./NoteNavigation";
import {NoteIDStr, useNotesStoresCallbacks} from "./NotesStore";
import {deepMemo} from "../react/ReactUtils";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {EditorStoreProvider, useSetEditorStore} from "./EditorStoreProvider";
import {NoteActionMenuForCommands} from "./NoteActionMenuForCommands";
import {Arrays} from "polar-shared/src/util/Arrays";
import { useHistory } from "react-router-dom";
import {useRefValue} from "../hooks/ReactHooks";
import { NoteActionMenuForLinking } from "./NoteActionMenuForLinking";
import {WikiLinks} from "./WikiLinks";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly content: string | undefined;
}

function useLinkNavigation() {

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const linkLoaderRef = useLinkLoaderRef();
    const history = useHistory();
    const historyRef = useRefValue(history);

    const handleClick = React.useCallback((event: MouseEvent) => {

        // FIXME: this will break determine which of the editor controls
        // are active

        if (event.target instanceof HTMLAnchorElement) {

            const href = event.target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        const newURL = '/apps/stories/notes/' + anchor;
                        historyRef.current.push(newURL);
                        event.stopPropagation();
                        event.preventDefault();
                    }

                } else {
                    const linkLoader = linkLoaderRef.current;
                    linkLoader(href, {newWindow: true, focus: true});
                    event.stopPropagation();
                    event.preventDefault();
                }

            }

        }

    }, [historyRef, linkLoaderRef]);

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

    const wikiLinkContent = React.useMemo(() => WikiLinks.escape(props.content || ''), [props.content])

    const handleChange = React.useCallback((content: string) => {
        updateNote(props.id, content);

        // updateNote(props.id, WikiLinks.unescape(content));
    }, [props.id, updateNote]);

    return (
        <NoteActionMenuForLinking id={props.id}>
            <NoteActionMenuForCommands id={props.id}>
                <div ref={ref}>
                    <NoteNavigation parent={props.parent} id={props.id}>
                        <CKEditor5BalloonEditor content={wikiLinkContent} onChange={handleChange} onEditor={setEditor}/>
                    </NoteNavigation>
                </div>
            </NoteActionMenuForCommands>
        </NoteActionMenuForLinking>
    );

});

export const NoteEditor = deepMemo((props: IProps) => {

    return (
        <EditorStoreProvider initialValue={undefined}>
            <Inner {...props}/>
        </EditorStoreProvider>
    );

});
