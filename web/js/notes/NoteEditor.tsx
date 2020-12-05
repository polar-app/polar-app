import React from "react";
import {CKEditor5BalloonEditor, ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NoteNavigation} from "./NoteNavigation";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {deepMemo} from "../react/ReactUtils";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {EditorStoreProvider, useSetEditorStore} from "./EditorStoreProvider";
import {NoteActionMenuForCommands} from "./NoteActionMenuForCommands";
import {Arrays} from "polar-shared/src/util/Arrays";
import { NoteActionMenuForLinking } from "./NoteActionMenuForLinking";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {useLifecycleTracer, useStateRef} from "../hooks/ReactHooks";
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";

function useLinkNavigation() {

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();

    const handleClick = React.useCallback((event: MouseEvent) => {

        // FIXME: this will break determine which of the editor controls
        // are active

        if (event.target instanceof HTMLAnchorElement) {

            const href = event.target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        noteLinkLoader(anchor);
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

    }, [linkLoaderRef, noteLinkLoader]);

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

interface INoteEditorActivatorProps {
    readonly id: NoteIDStr;
    readonly content: string;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
    readonly onChange: (content: string) => void;
}

/**
 * Handles loading the HTML the first time, when active (either via onClick or
 * when using navigation then we turn on ckeditor and keep it on so we don't
 * have to worry about the position / cursor being maintained.
 *
 * Once it's on keep it on as there's a performance benefit too.
 */
const NoteEditorActivator = deepMemo(function NoteEditorActivator(props: INoteEditorActivatorProps) {

    useLifecycleTracer('NoteEditorActivator');

    const {onEditor, onChange, id} = props;
    const {active} = useNotesStore(['active']);
    const {setActive} = useNotesStoreCallbacks();
    const [, setActivated, activatedRef] = useStateRef(false);

    const escaper = MarkdownContentEscaper;

    // TODO: ckeditor STILL has a load delay of about 500ms so we might have to activate
    // AFTER mount so the page is faster and more interactive.

    // TODO: add a preEscaped property to CKEditor5BalloonEditor because
    // otherwise we're double escaping
    const content = React.useMemo(() => escaper.escape(props.content), [escaper, props.content]);

    const handleActivated = React.useCallback(() => {
        setActive(id)
        setActivated(true);
    }, [id, setActivated, setActive]);

    if (active === props.id) {
        // there are two ways to activate this is that the user navigates to it
        // via key bindings and then the active item changes in the store, in
        // which case we have to turn this on and make it active OR the user
        // clicks on it which we have a handler for.
        activatedRef.current = true;
    }

    if (activatedRef.current) {

        return (
            <CKEditor5BalloonEditor content={content}
                                    escaper={escaper}
                                    onChange={onChange}
                                    onEditor={onEditor}/>
        );
    } else {

        const placeholder = content.trim() === '' ? ' ' : content;

        return (
            // this uses the standard ckeditor spacing and border so things
            // don't jump around after we activate
            <div className="note-inactive"
                 style={{
                     // padding: "0 var(--ck-spacing-standard)",
                     // border: "1px solid transparent"
                 }}
                 onClick={handleActivated} dangerouslySetInnerHTML={{__html: placeholder}}/>
        );

    }


});

const NoteEditorInner = deepMemo(function NoteEditorInner(props: IProps) {

    useLifecycleTracer('NoteEditorInner');

    const {id} = props;
    const {index} = useNotesStore(['index']);
    const {updateNote} = useNotesStoreCallbacks()
    const setEditor = useSetEditorStore();

    const note = index[id];
    const {content} = note;

    const handleChange = React.useCallback((content: string) => {
        updateNote(props.id, content);
    }, [props.id, updateNote]);

    return (
        <NoteEditorActivator id={id}
                             content={content || ''}
                             onChange={handleChange}
                             onEditor={setEditor}/>
    );

});

const NoteEditorWithStore = deepMemo(function NoteEditorWithStore(props: IProps) {

    useLifecycleTracer('NoteEditorWithStore');

    const ref = useLinkNavigation();

    return (
        <NoteActionMenuForLinking id={props.id}>
            <NoteActionMenuForCommands id={props.id}>
                <div ref={ref}>
                    <NoteNavigation parent={props.parent} id={props.id}>
                        <NoteEditorInner {...props}/>
                    </NoteNavigation>
                </div>
            </NoteActionMenuForCommands>
        </NoteActionMenuForLinking>
    );

});

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
}

export const NoteEditor = deepMemo(function NoteEditor(props: IProps) {

    useLifecycleTracer('NoteEditor');

    return (
        <EditorStoreProvider initialValue={undefined}>
            <NoteEditorWithStore {...props}/>
        </EditorStoreProvider>
    );

});
