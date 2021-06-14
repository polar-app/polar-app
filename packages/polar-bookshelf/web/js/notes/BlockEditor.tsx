import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {BlockIDStr, useBlocksStore} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import {BlockContentEditable, useUpdateCursorPosition} from "./contenteditable/BlockContentEditable";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContent} from "./content/MarkdownContent";
import {BlockImageContent} from "./blocks/BlockImageContent";
import {useBlockKeyDownHandler} from "./contenteditable/BlockKeyboardHandlers";
import {ContentEditables} from "./ContentEditables";

interface ILinkNavigationEvent {
    readonly abortEvent: () => void;
    readonly target: EventTarget | null;
}

export interface BlockEditorGenericProps {
    readonly id: BlockIDStr;

    readonly onClick?: (event: React.MouseEvent) => void;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly parent: BlockIDStr | undefined;

    readonly onKeyDown?: (event: React.KeyboardEvent) => void;

    readonly style?: React.CSSProperties;

    readonly className?: string;

    readonly readonly?: boolean;
}

function useLinkNavigationEventListener() {

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();

    return React.useCallback((event: ILinkNavigationEvent): boolean => {

        const {target, abortEvent} = event;

        if (target instanceof HTMLAnchorElement) {

            const href = target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        noteLinkLoader(anchor);
                        abortEvent();
                        return true;
                    }

                } else {
                    const linkLoader = linkLoaderRef.current;
                    linkLoader(href, {newWindow: true, focus: true});
                    abortEvent();
                    return true;
                }

            }

        }

        return false;

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

        return linkNavigationEventListener({target, abortEvent});

    }, [linkNavigationEventListener]);

}

const NoteEditorInner = observer(function BlockEditorInner(props: IProps) {

    const {id} = props;
    const blocksStore = useBlocksStore()
    const linkNavigationClickHandler = useLinkNavigationClickHandler();
    const ref = React.createRef<HTMLDivElement | null>();
    const updateCursorPosition = useUpdateCursorPosition();

    const block = blocksStore.getBlock(id);
    const data = blocksStore.getBlockContentData(id);

    const handleChange = React.useCallback((markdown: MarkdownStr) => {
        const block = blocksStore.getBlock(id);

        if (block && block.content.type === "markdown") {
            blocksStore.setBlockContent(id, new MarkdownContent({
                type: 'markdown',
                data: markdown,
                links: block.content.links,
            }))
        }

    }, [blocksStore, id]);

    React.useEffect(() => {
        if (blocksStore.active?.id === props.id) {
            if (ref.current) {

                if (blocksStore.active.pos !== undefined) {
                    updateCursorPosition(ref.current, blocksStore.active)
                }

                ref.current.focus();

            }
        } else if (ref.current) {
            ContentEditables.insertEmptySpacer(ref.current);
        }
    }, [props.id, updateCursorPosition, blocksStore.active, ref]);

    const onClick = React.useCallback((event: React.MouseEvent) => {

        if (linkNavigationClickHandler(event)) {
            return;
        }

        blocksStore.setActive(props.id);

    }, [linkNavigationClickHandler, props.id, blocksStore]);

    const {onKeyDown} = useBlockKeyDownHandler({
        contentEditableRef: ref,
        blockID: props.id,
        readonly: block?.readonly,
    });

    if (! block) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    if (~["markdown", "date", "name"].indexOf(block.content.type)) {
        return (
            <BlockContentEditable id={props.id}
                                  parent={props.parent}
                                  innerRef={ref}
                                  content={data || ''}
                                  onKeyDown={onKeyDown}
                                  onChange={handleChange}
                                  readonly={block.readonly}
                                  onClick={onClick} />
        );
    }

    if (block.content.type === "image") {
        const {width, height, src} = block.content;
        return (
            <BlockImageContent id={props.id}
                               parent={props.parent}
                               width={width}
                               height={height}
                               src={src}
                               innerRef={ref}
                               onClick={onClick}
                               readonly={block.readonly}
                               onKeyDown={onKeyDown} />
        );
    }

    return null;
});

const NoteEditorWithEditorStore = observer(function NoteEditorWithEditorStore(props: IProps) {

    // useLifecycleTracer('NoteEditorWithEditorStore', {id: props.id});

    return (
        <NoteNavigation parent={props.parent} id={props.id}>
            <NoteEditorInner {...props}/>
        </NoteNavigation>
    );

});

interface IProps {

    readonly parent: BlockIDStr | undefined;

    readonly id: BlockIDStr;

    /**
     * Used when showing content that can't edited so that we get the normal
     * HTML conversion but also link navigation when clicked.
     */
    readonly immutable?: boolean;

}

export const BlockEditor = observer(function BlockEditor(props: IProps) {

    return (
        <NoteEditorWithEditorStore {...props}/>
    );

});


