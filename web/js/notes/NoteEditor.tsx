import React from "react";
import {CKEditor5BalloonEditor} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NoteNavigation} from "./NoteNavigation";
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
import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import IEditor = ckeditor5.IEditor;
import {NoteEditorMutator} from "./store/NoteEditorMutator";

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
            return;
        }

        function subscribe() {
            editor!.editing.view.document.on('click', handleEditorClick);
        }

        function unsubscribe() {

            if (editor) {
                editor.editing.view.document.off('click', handleEditorClick);
            } else {
                console.warn("No editor in unsubscribe");
            }

        }

        unsubscribe();
        subscribe();

        return unsubscribe;

    }, [editor, handleEditorClick]);

}

// interface INoteEditorActiveProps {
//     readonly content: string;
//     readonly escaper?: ContentEscaper;
//     readonly onEditor: (editor: ckeditor5.IEditor) => void;
//     readonly onChange: (content: string) => void;
//     readonly preEscaped?: boolean;
// }
//
// const NoteEditorActive = React.memo(function NoteEditorActive(props: INoteEditorActiveProps) {
//
//     const {onEditor, onChange, escaper, preEscaped, content} = props;
//
//     return (
//         <CKEditor5BalloonEditor content={content}
//                                 preEscaped={true}
//                                 escaper={escaper}
//                                 onChange={onChange}
//                                 onEditor={onEditor}/>
//     );
// });

interface INoteEditorInactiveProps {
    readonly id: NoteIDStr;
    readonly content: string;
    readonly onClick: (event: React.MouseEvent) => void;
}


const NoteEditorInactive = observer(function NoteEditorInactive(props: INoteEditorInactiveProps) {

    // useLifecycleTracer('NoteEditorInactive', {id: props.id});

    const {content, onClick} = props;

    const linkNavigationClickHandler = useLinkNavigationClickHandler()

    const placeholder = content.trim() === '' ? '&nbsp;' : content;

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        linkNavigationClickHandler(event);
        onClick(event);
    }, [linkNavigationClickHandler, onClick]);

    return (
        // this uses the standard ckeditor spacing and border so things
        // don't jump around after we activate
        <div className="NoteEditorInactive"
             onClick={handleClick}
             style={{
             }}
             dangerouslySetInnerHTML={{__html: placeholder}}/>
    );

});

interface INoteEditorActivatorProps {
    readonly id: NoteIDStr;
    readonly content: string;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
    readonly onChange: (content: string) => void;
    readonly immutable: boolean | undefined;
}

/**
 * Handles loading the HTML the first time, when active (either via onClick or
 * when using navigation then we turn on ckeditor and keep it on so we don't
 * have to worry about the position / cursor being maintained.
 *
 * Once it's on keep it on as there's a performance benefit too.
 */
const NoteEditorActivator = observer(function NoteEditorActivator(props: INoteEditorActivatorProps) {

    const DEFAULT_ACTIVATED = true;

    // useLifecycleTracer('NoteEditorActivator', {id: props.id});

    const {onEditor, onChange, id, immutable} = props;

    const store = useNotesStore();

    const noteActivated = store.getNoteActivated(props.id);
    const [, setActivated, activatedRef] = useStateRef(DEFAULT_ACTIVATED);

    const escaper = MarkdownContentEscaper;

    // TODO: ckeditor STILL has a load delay of about 500ms so we might have to activate
    // AFTER mount so the page is faster and more interactive.

    const content = React.useMemo(() => escaper.escape(props.content), [escaper, props.content]);

    const handleActivated = React.useCallback(() => {

        if (immutable) {
            // console.log("Not activating editor (immutable)");
            return;
        }

        store.setActive(id)
        setActivated(true);

    }, [id, immutable, setActivated, store]);

    if (noteActivated?.note.id === props.id) {
        // there are two ways to activate this is that the user navigates to it
        // via key bindings and then the active item changes in the store, in
        // which case we have to turn this on and make it active OR the user
        // clicks on it which we have a handler for.
        activatedRef.current = true;
    }

    if (activatedRef.current && ! immutable) {

        return (
            <CKEditor5BalloonEditor key={props.id}
                                    content={content}
                                    defaultFocus={props.id === noteActivated?.note.id}
                                    preEscaped={true}
                                    escaper={escaper}
                                    onChange={onChange}
                                    onEditor={onEditor}/>
        );
    } else {

        return (
            <NoteEditorInactive id={id}
                                content={content}
                                onClick={handleActivated}/>
        );

    }


});


const NoteEditorInner = observer(function NoteEditorInner(props: IProps) {

    // useLifecycleTracer('NoteEditorInner', {id: props.id});

    const {id} = props;
    const store = useNotesStore()
    const setEditor = useSetEditorStore();

    const note = store.getNote(id);

    const handleChange = React.useCallback((content: string) => {
        if (note) {
            note.setContent(content);
        }
    }, [note]);

    const handleEditor = React.useCallback((editor: IEditor) => {
        setEditor(editor);
        store.setNoteEditorMutator(id, new NoteEditorMutator(editor));
    }, [id, setEditor, store]);

    if (! note) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    const {content} = note;

    return (
        <NoteEditorActivator id={id}
                             content={content || ''}
                             onChange={handleChange}
                             immutable={props.immutable}
                             onEditor={handleEditor}/>
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
