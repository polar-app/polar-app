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
import {NameContent} from "./content/NameContent";
import {debounce} from "throttle-debounce";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {useLinkNavigationClickHandler} from "./NoteLinksHooks";
import {BlockDocumentContent} from "./blocks/BlockDocumentContent";
import {BlockAnnotationContent} from "./blocks/BlockAnnotationContent/BlockAnnotationContent";
import {BlockPredicates} from "./store/BlockPredicates";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {DOMBlocks} from "./contenteditable/DOMBlocks";
import {BlockTextContentUtils} from "./NoteUtils";

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

type IUseBlockContentUpdaterOpts = {
    id: BlockIDStr;
}

const useBlockContentUpdater = ({ id }: IUseBlockContentUpdaterOpts) => {
    const blocksTreeStore = useBlocksTreeStore();
    const dialogs = useDialogManager();

    const handleRename = React.useMemo(() => {
        const doRename = (content: NameContent, data: MarkdownStr) => {
            const exists = blocksTreeStore.getBlockByName(data);

            if (! exists || content.data.toLowerCase() === data.toLowerCase()) {
                blocksTreeStore.renameBlock(id, data);
            } else {
                dialogs.snackbar({ type: 'error', message: `Another note with the name "${data}" already exists.` });

                // Reset to old name
                const blockElem = DOMBlocks.getBlockElement(id);
                if (blockElem) {
                    blockElem.innerHTML = MarkdownContentConverter.toHTML(content.data);
                }
            }
        };

        return debounce(1500, doRename);
    }, [blocksTreeStore, dialogs, id]);

    return React.useCallback((data: MarkdownStr) => {
        const block = blocksTreeStore.getBlock(id);

        if (! block || ! BlockPredicates.isEditableBlock(block)) {
            return;
        }

        const content = block.content;

        if (content.type === 'name') {
            handleRename(content, data);
        } else if (! block.readonly && content.type !== AnnotationContentType.FLASHCARD) {
            const newContent = BlockTextContentUtils.updateTextContentMarkdown(content, data);
            blocksTreeStore.setBlockContent(block.id, newContent);
        }
    }, [id, handleRename, blocksTreeStore]);
};

const NoteEditorInner = observer(function BlockEditorInner(props: IProps) {

    const {id, parent, style = {}, className = ""} = props;
    const {root} = useBlocksTreeStore();
    const blocksTreeStore = useBlocksTreeStore()
    const linkNavigationClickHandler = useLinkNavigationClickHandler({ id });
    const handleBlockContentChange = useBlockContentUpdater({ id });
    const ref = React.createRef<HTMLDivElement | null>();
    const updateCursorPosition = useUpdateCursorPosition();
    

    const block = blocksTreeStore.getBlock(id);

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

    readonly className?: string;

    readonly style?: React.CSSProperties;
}

export const BlockEditor = observer(function BlockEditor(props: IProps) {

    return (
        <NoteEditorWithEditorStore {...props}/>
    );

});


