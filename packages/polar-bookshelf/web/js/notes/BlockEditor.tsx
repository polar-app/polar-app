import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {BlockIDStr} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import {BlockContentEditable, useUpdateCursorPosition} from "./contenteditable/BlockContentEditable";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContent} from "./content/MarkdownContent";
import {BlockImageContent} from "./blocks/BlockImageContent";
import {useBlockKeyDownHandler} from "./contenteditable/BlockKeyboardHandlers";
import {ContentEditables} from "./ContentEditables";
import {reaction} from "mobx";
import {useBlocksTreeStore} from "./BlocksTree";
import {useHistory} from "react-router";
import {NoteURLs} from "./NoteURLs";
import {HashURLs} from "polar-shared/src/util/HashURLs";

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
    const blocksTreeStore = useBlocksTreeStore();

    return React.useCallback((event: ILinkNavigationEvent): boolean => {

        const {target, abortEvent} = event;

        if (target instanceof HTMLAnchorElement) {

            const href = target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        const getPanes = (): ReadonlyArray<string> => {
                            const {searchParams} = new URL(window.location.href);
                            const panes = searchParams.get('panes');
                            if (panes) {
                                return panes.split(',');
                            }
                            return [];
                        };

                        const rootPaneURL = NoteURLs.parse(location.pathname)!;
                        const {hash: targetNoteID} = new URL(target.href);
                        const targetBlock = blocksTreeStore.getBlockByTarget(targetNoteID.slice(1));
                        const rootPaneBlock = blocksTreeStore.getBlockByTarget(rootPaneURL.target);
                        if (targetBlock && rootPaneBlock) {
                            const panes = getPanes();
                            const idx = panes.indexOf(blocksTreeStore.root);
                            const getBasePanes = () => {
                                if (rootPaneBlock.id === blocksTreeStore.root) {
                                    return [];
                                } else if (idx === -1) {
                                    return [...panes];
                                } else {
                                    return panes.slice(0, idx + 1);
                                }
                            }
                            const basePanes = getBasePanes();
                            const newPanes = [...basePanes, targetBlock.id].join(',');
                            noteLinkLoader(`${rootPaneURL.target}?panes=${newPanes}`);
                            abortEvent();
                        }
                        /*
                            noteLinkLoader(anchor);
                            abortEvent();
                            return true;
                        */
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

    }, [linkLoaderRef, noteLinkLoader, blocksTreeStore]);

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

    const {id, parent} = props;
    const {root} = useBlocksTreeStore();
    const blocksTreeStore = useBlocksTreeStore()
    const linkNavigationClickHandler = useLinkNavigationClickHandler();
    const ref = React.createRef<HTMLDivElement | null>();
    const updateCursorPosition = useUpdateCursorPosition();
    const history = useHistory();

    const block = blocksTreeStore.getBlock(id);
    const data = blocksTreeStore.getBlockContentData(id);

    const handleChange = React.useCallback((markdown: MarkdownStr) => {
        const block = blocksTreeStore.getBlock(id);

        if (block && block.content.type === "markdown") {
            blocksTreeStore.setBlockContent(id, new MarkdownContent({
                type: 'markdown',
                data: markdown,
                links: block.content.links,
            }))
        }

    }, [blocksTreeStore, id]);

    React.useEffect(() => {
        const focusBlock = () => {
            const active = blocksTreeStore.active;
            if (active && active.id === id) {
                if (ref.current) {

                    if (active.pos !== undefined) {
                        updateCursorPosition(ref.current, active)
                    }

                }
            } else if (ref.current) {
                ContentEditables.insertEmptySpacer(ref.current);
            }
        };
        focusBlock();
        const disposer = reaction(() => blocksTreeStore.active?.nonce, focusBlock);
        return () => disposer();
    }, [id, updateCursorPosition, blocksTreeStore, ref]);

    const onClick = React.useCallback((event: React.MouseEvent) => {

        if (linkNavigationClickHandler(event)) {
            return;
        }

        blocksTreeStore.setActive(id);

    }, [linkNavigationClickHandler, id, blocksTreeStore]);

    const {onKeyDown} = useBlockKeyDownHandler({
        contentEditableRef: ref,
        blockID: id,
        readonly: block?.readonly,
    });

    const handleMouseDown = React.useCallback<React.MouseEventHandler<HTMLDivElement>>((evt) => {
        const {target} = evt;
        if (target instanceof HTMLAnchorElement) {
            blocksTreeStore.saveActiveBlockForNote(root);
        }
    }, [root, blocksTreeStore, history]);

    if (! block) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    if (~["markdown", "date", "name"].indexOf(block.content.type)) {
        return (
            <BlockContentEditable id={id}
                                  parent={parent}
                                  innerRef={ref}
                                  content={data || ''}
                                  onMouseDown={handleMouseDown}
                                  onKeyDown={onKeyDown}
                                  onChange={handleChange}
                                  readonly={block.readonly}
                                  onClick={onClick} />
        );
    }

    if (block.content.type === "image") {
        const {width, height, src} = block.content;
        return (
            <BlockImageContent id={id}
                               parent={parent}
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


