import React from "react";
import {CKEditor5BalloonEditor, ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NoteNavigation} from "./NoteNavigation";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {deepMemo} from "../react/ReactUtils";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {EditorStoreProvider, useEditorStore, useSetEditorStore} from "./EditorStoreProvider";
import {NoteActionMenuForCommands} from "./NoteActionMenuForCommands";
import {Arrays} from "polar-shared/src/util/Arrays";
import { NoteActionMenuForLinking } from "./NoteActionMenuForLinking";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {useLifecycleTracer, useStateRef} from "../hooks/ReactHooks";
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import IEventData = ckeditor5.IEventData;

function useLinkNavigation() {

    const editor = useEditorStore();

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();

    const handleEditorClick = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        function abortEvent() {
            event.domEvent.stopPropagation();
            event.domEvent.preventDefault();
            eventData.stop();
        }

        const target = event.domEvent.target;

        if (target instanceof HTMLAnchorElement) {

            const href = target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        noteLinkLoader(anchor);
                        abortEvent();
                    }

                } else {
                    const linkLoader = linkLoaderRef.current;
                    linkLoader(href, {newWindow: true, focus: true});
                    abortEvent();
                }

            }

        }

    }, [linkLoaderRef, noteLinkLoader]);

    React.useEffect(() => {

        if (editor) {

            // *** off first
            editor.editing.view.document.off('click', handleEditorClick);

            // *** then on
            editor.editing.view.document.on('click', handleEditorClick);

        } else {
            // console.warn("No editor");
        }

    }, [editor, handleEditorClick]);

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
                                    preEscaped={true}
                                    escaper={escaper}
                                    onChange={onChange}
                                    onEditor={onEditor}/>
        );
    } else {

        const placeholder = content.trim() === '' ? '&nbsp;' : content;

        return (
            // this uses the standard ckeditor spacing and border so things
            // don't jump around after we activate
            <div className="note-inactive"
                 style={{
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

    useLinkNavigation();

    return (
        <NoteActionMenuForLinking id={props.id}>
            <NoteActionMenuForCommands id={props.id}>
                <div>
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
