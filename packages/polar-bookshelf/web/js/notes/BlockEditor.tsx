import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {observer} from "mobx-react-lite"
import {BlockContentEditable, useUpdateCursorPosition} from "./contenteditable/BlockContentEditable";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {BlockImageContent} from "./blocks/BlockImageContent";
import {useBlockKeyDownHandler} from "./contenteditable/BlockKeyboardHandlers";
import {reaction} from "mobx";
import {useBlocksTreeStore} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {ContentEditables} from "./ContentEditables";
import {useLinkNavigationClickHandler} from "./NoteLinksHooks";
import {BlockDocumentContent} from "./blocks/BlockDocumentContent";
import {BlockAnnotationContent} from "./blocks/BlockAnnotationContent/BlockAnnotationContent";
import {BlockPredicates} from "./store/BlockPredicates";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {Block} from "./store/Block";
import {BlockContent, useBlocksStore} from "./store/BlocksStore";
import {BlockTextContentUtils} from "./BlockTextContentUtils";

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

export const useBlockContentUpdater = () => {
    const blocksStore = useBlocksStore();

    return React.useCallback((id: BlockIDStr, data: MarkdownStr) => {

        const block = blocksStore.getBlock(id);

        if (! block || ! BlockPredicates.isEditableBlock(block)) {
            return;
        }

        const content = block.content;

        if (! block.readonly && content.type !== AnnotationContentType.FLASHCARD) {
            const newContent = BlockTextContentUtils.updateTextContentMarkdown(content, data);
            blocksStore.setBlockContent(block.id, newContent);
        }

    }, [blocksStore]);
};

interface INoteEditorInnerProps extends IProps {
    readonly block: Readonly<Block<BlockContent>>;
}

const NoteEditorInner = function BlockEditorInner(props: INoteEditorInnerProps) {

    const { id, parent, style = {}, className = "", block } = props;
    const {root} = useBlocksTreeStore();
    const blocksTreeStore = useBlocksTreeStore()
    const linkNavigationClickHandler = useLinkNavigationClickHandler({ id });
    const blockContentChanger = useBlockContentUpdater();
    const ref = React.createRef<HTMLDivElement | null>();
    const updateCursorPosition = useUpdateCursorPosition();

    const handleBlockContentChange = React.useCallback((content: MarkdownStr) => {
        blockContentChanger(id, content);
    }, [id, blockContentChanger]);

    React.useEffect(() => {
        const focusBlock = () => {
            const active = blocksTreeStore.active;
            if (ref.current) {
                if (active && active.id === id) {
                    updateCursorPosition(ref.current, active)
                } else {
                    ContentEditables.insertEmptySpacer(ref.current);
                }
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

    const handleMouseDown = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(({target}) => {
        if (target instanceof HTMLAnchorElement) {
            blocksTreeStore.saveActiveBlockForNote(root);
        }
    }, [root, blocksTreeStore]);

    if (! block) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    if (block.content.type === "markdown"
        || block.content.type === "date"
        || block.content.type === "name") {

        const data = BlockTextContentUtils.getTextContentMarkdown(block.content);

        return (
            <BlockContentEditable id={id}
                                  parent={parent}
                                  style={style}
                                  className={className}
                                  content={data || ''}
                                  onMouseDown={handleMouseDown}
                                  canHaveLinks={BlockPredicates.canHaveLinks(block)}
                                  innerRef={ref}
                                  onKeyDown={onKeyDown}
                                  onChange={handleBlockContentChange}
                                  readonly={block.readonly}
                                  onClick={onClick} />
        );
    }

    if (block.content.type === "image") {
        const { width, height, src } = block.content;
        return (
            <BlockImageContent id={id}
                               parent={parent}
                               width={width}
                               height={height}
                               style={style}
                               className={className}
                               src={src}
                               innerRef={ref}
                               onClick={onClick}
                               readonly={block.readonly}
                               onKeyDown={onKeyDown} />
        );
    }

    if (block.content.type === "document") {

        const { docInfo } = block.content;
        const tagLinks = block.content.tagLinks;

        return (
            <BlockDocumentContent
                id={id}
                tagLinks={tagLinks}
                onClick={onClick}
                parent={parent}
                className={className}
                style={style}
                docInfo={docInfo}
            />
        );

    }

    if (BlockPredicates.isAnnotationBlock(block)) {

        const content = block.content;

        return (
            <BlockAnnotationContent
                id={id}
                created={block.created}
                parent={parent}
                className={className}
                style={style}
                annotation={content}
                onClick={onClick}
                onChange={handleBlockContentChange}
                onKeyDown={onKeyDown}
                innerRef={ref}
            />
        );

    }

    return <div>Unsupported block type</div>;
};

const NoteEditorWithEditorStore = observer(function NoteEditorWithEditorStore(props: IProps) {

    // useLifecycleTracer('NoteEditorWithEditorStore', {id: props.id});
    const blocksStore = useBlocksStore();
    const block = blocksStore.getBlock(props.id);

    if (! block) {
        return null;
    }

    return (
        <NoteNavigation parent={props.parent} id={props.id}>
            <NoteEditorInner {...props} block={block} />
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

    readonly className?: string;

    readonly style?: React.CSSProperties;

}

export const BlockEditor = observer(function BlockEditor(props: IProps) {

    return (
        <NoteEditorWithEditorStore {...props}/>
    );

});


