import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {EditorStoreProvider, useEditorStore, useSetEditorStore} from "./EditorStoreProvider";
import {NoteActionMenuForCommands} from "./NoteActionMenuForCommands";
import {Arrays} from "polar-shared/src/util/Arrays";
import { NoteActionMenuForLinking } from "./NoteActionMenuForLinking";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import IEventData = ckeditor5.IEventData;
import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import {INoteEditorMutator} from "./store/NoteEditorMutator";
import {CKEditorActivator} from "../../../apps/stories/impl/ckeditor5/CKEditorActivator";

interface ILinkNavigationEvent {
    readonly abortEvent: () => void;
    readonly target: EventTarget | null;
}

function useLinkNavigationEventListener() {

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();

    return React.useCallback((event: ILinkNavigationEvent) => {

        const {target, abortEvent} = event;

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

}

function useLinkNavigationClickHandler() {

    const linkNavigationEventListener = useLinkNavigationEventListener();

    return React.useCallback((event: React.MouseEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        const target = event.target;

        linkNavigationEventListener({target, abortEvent});

    }, [linkNavigationEventListener]);

}

function useLinkNavigation() {

    const editor = useEditorStore();

    const linkNavigationEventListener = useLinkNavigationEventListener();

    // FIXME: this won't fire because of CKEditorActivator not installing this until the
    // component is mounted.

    const handleEditorClick = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        function abortEvent() {
            event.domEvent.stopPropagation();
            event.domEvent.preventDefault();
            eventData.stop();
        }

        const target = event.domEvent.target;

        linkNavigationEventListener({abortEvent, target});

    }, [linkNavigationEventListener]);

    React.useEffect(() => {

        if (! editor) {
            // console.log("useLinkNavigation: No editor");
            return;
        }

        function subscribe() {
            editor!.editing.view.document.on('click', handleEditorClick);
        }

        function unsubscribe() {

            if (editor) {
                editor.editing.view.document.off('click', handleEditorClick);
            } else {
                console.warn("useLinkNavigation: No editor in unsubscribe");
            }

        }

        unsubscribe();
        subscribe();

        return unsubscribe;

    }, [editor, handleEditorClick]);

}

const NoteEditorInner = observer(function NoteEditorInner(props: IProps) {

    // useLifecycleTracer('NoteEditorInner', {id: props.id});

    const {id} = props;
    const store = useNotesStore()
    const setEditor = useSetEditorStore();
    const noteActivated = store.getNoteActivated(props.id);
    const onClickWhileInactive = useLinkNavigationClickHandler();

    const note = store.getNote(id);

    const handleChange = React.useCallback((content: string) => {
        if (note) {
            note.setContent(content);
        }
    }, [note]);

    const handleEditorMutator = React.useCallback((editorMutator: INoteEditorMutator) => {
        store.setNoteEditorMutator(id, editorMutator);
    }, [id, store]);

    const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {
        setEditor(editor);
    }, [setEditor]);

    const escaper = MarkdownContentEscaper;

    const content = React.useMemo(() => escaper.escape(note?.content || ''), [escaper, note]);

    React.useEffect(() => {

        return () => {
            store.clearNoteEditorMutator(id);
        }

    }, [id, store]);

    if (! note) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    return (
        <CKEditorActivator content={content}
                           onChange={handleChange}
                           onEditor={handleEditor}
                           defaultFocus={props.id === noteActivated?.note.id}
                           preEscaped={true}
                           escaper={escaper}
                           onEditorMutator={handleEditorMutator}
                           onClickWhileInactive={onClickWhileInactive}/>
    );

});

const NoteEditorWithEditorStore = observer(function NoteEditorWithEditorStore(props: IProps) {

    // useLifecycleTracer('NoteEditorWithEditorStore', {id: props.id});

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

    readonly parent: NoteIDStr | undefined;

    readonly id: NoteIDStr;

    /**
     * Used when showing content that can't edited so that we get the normal
     * HTML conversion but also link navigation when clicked.
     */
    readonly immutable?: boolean;

}

export const NoteEditor = observer(function NoteEditor(props: IProps) {

    // useLifecycleTracer('NoteEditor', {id: props.id});

    return (
        <EditorStoreProvider initialValue={undefined}>
            <NoteEditorWithEditorStore {...props}/>
        </EditorStoreProvider>
    );

});
