import React from "react";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextConverters} from "../../../annotation_sidebar/DocAnnotations";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockHighlightContentWrapper} from "./BlockHighlightContentWrapper";
import {createStyles, makeStyles} from "@material-ui/core";
import {BlockAnnotationActionsWrapper, useSharedAnnotationBlockActions} from "./BlockAnnotationActions";
import {TextHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockContentEditable} from "../../contenteditable/BlockContentEditable";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {HTMLStr} from "polar-shared/src/util/Strings";


interface IProps extends BlockEditorGenericProps {
    readonly annotation: TextHighlightAnnotationContent;
    readonly onChange: (content: HTMLStr) => void;
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
        readonly,
    } = props;

    const highlight = annotation.value;

    const { text } = React.useMemo(() => {
        return ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, highlight);
    }, [highlight]);

    const actions = useSharedAnnotationBlockActions({ id, annotation });

    return (
        <BlockAnnotationActionsWrapper actions={actions}>
            <BlockHighlightContentWrapper color={highlight.color}>
                <BlockContentEditable id={id}
                                      parent={parent}
                                      innerRef={innerRef}
                                      style={style}
                                      canHaveLinks
                                      className={className}
                                      content={text || ''}
                                      onKeyDown={onKeyDown}
                                      onChange={onChange}
                                      readonly={readonly}
                                      onClick={onClick} />
                <DocAnnotationMoment created={highlight.created} />
            </BlockHighlightContentWrapper>
        </BlockAnnotationActionsWrapper>
    );
};
