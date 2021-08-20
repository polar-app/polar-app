import React from "react";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextConverters} from "../../../annotation_sidebar/DocAnnotations";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockAnnotationContentWrapper} from "./BlockAnnotationContentWrapper";
import {createStyles, makeStyles} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {useBlocksTreeStore} from "../../BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockAnnotationAction, BlockAnnotationActionsWrapper, BlockAnnotationColorPickerAction} from "./BlockAnnotationActions";
import {AnnotationPtrs} from "../../../annotation_sidebar/AnnotationPtrs";
import {AnnotationLinks} from "../../../annotation_sidebar/AnnotationLinks";
import {useHistory} from "react-router";
import {useAnnotationBlockManager} from "../../NoteUtils";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";
import {TextHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockContentEditable} from "../../contenteditable/BlockContentEditable";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";


interface IProps extends BlockEditorGenericProps {
    readonly annotation: TextHighlightAnnotationContent;
    readonly onChange: (content: HTMLStr) => void;
    readonly id: BlockIDStr;
}

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            position: 'relative',
            paddingRight: 30,
        },
        actionsOuter: {
            position: 'absolute',
            top: 0,
            right: 0,
            '& > div + div': {
                marginTop: 4,
            },
        },
    }),
);

export const BlockTextHighlightAnnotationContent: React.FC<IProps> = (props) => {
    const {
        annotation,
        parent,
        innerRef,
        className,
        style,
        id,
        onKeyDown,
        onClick,
        onChange,
        readonly
    } = props;

    const blocksTreeStore = useBlocksTreeStore();
    const { update, getBlock } = useAnnotationBlockManager();
    const history = useHistory();

    const highlight = annotation.value;

    const { text } = React.useMemo(() => {
        return ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, highlight);
    }, [highlight.text]);

    const handleDelete = React.useCallback(() => {
        blocksTreeStore.deleteBlocks([id]);
    }, [blocksTreeStore, id]);
    
    const handleOpen = React.useCallback(() => {
        const ptr = AnnotationPtrs.create({
            target: annotation.value.id,
            pageNum: annotation.pageNum,
            docID: annotation.docID,
        });
        history.push(AnnotationLinks.createRelativeURL(ptr));
    }, [annotation]);

    const handleColorChange = React.useCallback((color: ColorStr) => {
        const block = getBlock(id, AnnotationContentType.TEXT_HIGHLIGHT);
        if (block) {
            const content = block.content.toJSON();
            content.value.color = color;
            update(id, content);
        }
    }, [update, id, annotation, getBlock]);

    const actions = React.useMemo(() => [
        <BlockAnnotationAction key="delete" icon={<DeleteIcon />} onClick={handleDelete} />,
        <BlockAnnotationAction key="open" icon={<OpenInNewIcon />} onClick={handleOpen} />,
        <BlockAnnotationColorPickerAction key="color" color={highlight.color} onChange={handleColorChange} />
    ], [handleDelete, highlight]);

    return (
        <BlockAnnotationActionsWrapper actions={actions}>
            <BlockAnnotationContentWrapper color={highlight.color}>
                <BlockContentEditable id={id}
                                      parent={parent}
                                      innerRef={innerRef}
                                      style={style}
                                      className={className}
                                      content={text || ''}
                                      onKeyDown={onKeyDown}
                                      onChange={onChange}
                                      readonly={readonly}
                                      onClick={onClick} />
                <DocAnnotationMoment created={highlight.created} />
            </BlockAnnotationContentWrapper>
        </BlockAnnotationActionsWrapper>
    );
};
