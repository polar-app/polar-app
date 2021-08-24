import React from "react";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextConverters} from "../../../annotation_sidebar/DocAnnotations";
import {ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockAnnotationContentWrapper} from "../../BlockAnnotationContentWrapper";
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


interface IProps {
    textHighlight: ITextHighlightAnnotationContent;
    id: BlockIDStr;
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
    const { textHighlight: annotation, id } = props;
    const blocksTreeStore = useBlocksTreeStore();
    const {update} = useAnnotationBlockManager();
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
        update(id, {
            ...annotation,
            value: {
                ...annotation.value,
                color,
            },
        });
    }, [update, id, annotation]);

    const actions = React.useMemo(() => [
        <BlockAnnotationAction key="delete" icon={<DeleteIcon />} onClick={handleDelete} />,
        <BlockAnnotationAction key="open" icon={<OpenInNewIcon />} onClick={handleOpen} />,
        <BlockAnnotationColorPickerAction key="color" color={highlight.color} onChange={handleColorChange} />
    ], [handleDelete]);

    return (
        <BlockAnnotationActionsWrapper actions={actions}>
            <BlockAnnotationContentWrapper color={highlight.color}>
                <div dangerouslySetInnerHTML={{ __html: text || 'no text' }} />
                <DocAnnotationMoment created={highlight.created} />
            </BlockAnnotationContentWrapper>
        </BlockAnnotationActionsWrapper>
    );
};
