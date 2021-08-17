import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {observer} from "mobx-react-lite"
import {BlockContentEditable, DOMBlocks, useUpdateCursorPosition} from "./contenteditable/BlockContentEditable";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContent} from "./content/MarkdownContent";
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
import {Block} from "./store/Block";
import {useLinkNavigationClickHandler} from "./NoteUtils";

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
        const doRename = (data: MarkdownStr) => {
            const exists = blocksTreeStore.getBlockByName(data);
            const block = blocksTreeStore.getBlock(id) as Block<NameContent>;

            if (! exists || block.content.data.toLowerCase() === data.toLowerCase()) {
                blocksTreeStore.renameBlock(id, data);
            } else {
                dialogs.snackbar({ type: 'error', message: `Another note with the name "${data}" already exists.` });

                // Reset to old name
                const blockElem = DOMBlocks.getBlockElement(id)!;
                blockElem.innerHTML = MarkdownContentConverter.toHTML(block.content.data);
            }
        };

        return debounce(1500, doRename);
    }, [blocksTreeStore, dialogs, id]);

    return React.useCallback((data: MarkdownStr) => {
        const block = blocksTreeStore.getBlock(id);

        if (! block) {
            return;
        }

        switch (block.content.type) {
            case 'markdown':
                blocksTreeStore.setBlockContent(id, new MarkdownContent({
                    type: 'markdown',
                    links: block.content.links,
                    data,
                }));
                break;
            case 'name':
                handleRename(data);
                break;
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
    const data = blocksTreeStore.getBlockContentData(id);

    React.useEffect(() => {
        const focusBlock = () => {
            const active = blocksTreeStore.active;
            if (ref.current) {
                if (active && active.id === id) {
                    if (active.pos !== undefined) {
                        updateCursorPosition(ref.current, active)
                    }
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

    if (~["markdown", "date", "name"].indexOf(block.content.type)) {
        return (
            <BlockContentEditable id={id}
                                  parent={parent}
                                  innerRef={ref}
                                  style={style}
                                  className={className}
                                  content={data || ''}
                                  onMouseDown={handleMouseDown}
                                  onKeyDown={onKeyDown}
                                  onChange={handleBlockContentChange}
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
                               style={style}
                               className={className}
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

    readonly className?: string;

    readonly style?: React.CSSProperties;
}

export const BlockEditor = observer(function BlockEditor(props: IProps) {

    return (
        <NoteEditorWithEditorStore {...props}/>
    );

});


