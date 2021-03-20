import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {NoteActionMenuForCommands} from "./NoteActionMenuForCommands";
import {Arrays} from "polar-shared/src/util/Arrays";
import { NoteActionMenuForLinking } from "./NoteActionMenuForLinking";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";
import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import {NoteContentEditable} from "./textarea/NoteContentEditable";
import {ContentEditables} from "./ContentEditables";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";
import html2markdown = HTMLToMarkdown.html2markdown;
import { HTMLStr } from "polar-shared/src/util/Strings";

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

const NoteEditorInner = observer(function NoteEditorInner(props: IProps) {

    const {id} = props;
    const store = useNotesStore()
    const noteActivated = store.getNoteActivated(props.id);
    const linkNavigationClickHandler = useLinkNavigationClickHandler();
    const ref = React.createRef<HTMLDivElement | null>();

    const note = store.getNote(id);

    const escaper = MarkdownContentEscaper;

    const handleChange = React.useCallback((content: HTMLStr) => {

        if (note) {
            const markdown = escaper.unescape(content);
            note.setContent(markdown);
        }

    }, [escaper, note]);

    const content = React.useMemo(() => escaper.escape(note?.content || ''), [escaper, note?.content]);

    const onClick = React.useCallback((event: React.MouseEvent) => {

        if (noteActivated?.note.id !== props.id) {
            linkNavigationClickHandler(event);
            return;
        }

        store.setActive(props.id);

    }, [linkNavigationClickHandler, noteActivated?.note.id, props.id, store]);

    const handleEnter = React.useCallback(() => {

        if (ref.current) {
            const split = ContentEditables.splitAtCursor(ref.current);

            if (split) {

                const prefix = html2markdown(ContentEditables.fragmentToHTML(split.prefix));
                const suffix = html2markdown(ContentEditables.fragmentToHTML(split.suffix));

                store.createNewNote(id, {prefix, suffix});

            }

        }

    }, [id, ref, store]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        switch (event.key) {

            case 'Enter':
                handleEnter();
                abortEvent();
                break;

        }

    }, [handleEnter]);

    if (! note) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    return (
        <NoteContentEditable id={props.id}
                             parent={props.parent}
                             innerRef={ref}
                             content={content}
                             onChange={handleChange}
                             onClick={onClick}
                             onKeyDown={onKeyDown}/>
    );

});

const NoteEditorWithEditorStore = observer(function NoteEditorWithEditorStore(props: IProps) {

    // useLifecycleTracer('NoteEditorWithEditorStore', {id: props.id});

    return (
        <NoteActionMenuForLinking id={props.id}>
            <NoteActionMenuForCommands id={props.id}>
                <NoteNavigation parent={props.parent} id={props.id}>
                    <NoteEditorInner {...props}/>
                </NoteNavigation>
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

    return (
        <NoteEditorWithEditorStore {...props}/>
    );

});
