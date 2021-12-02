import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockHighlightContentWrapper} from "./BlockHighlightContentWrapper";
import {createStyles, makeStyles} from "@material-ui/core";
import {TextHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockContentEditable} from "../../contenteditable/BlockContentEditable";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {ISODateString} from "polar-shared/src/metadata/ISODateTimeStrings";


interface IProps extends BlockEditorGenericProps {
    readonly annotation: TextHighlightAnnotationContent;

    readonly onChange: (content: HTMLStr) => void;

    readonly created: ISODateString;
}

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            position: 'relative',
            paddingRight: 30,
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

    const text = React.useMemo(() => {
        return BlockTextHighlights.toText(highlight);
    }, [highlight]);

    return (
        <BlockHighlightContentWrapper color={highlight.color}>
            <BlockContentEditable id={id}
                                  parent={parent}
                                  innerRef={innerRef}
                                  style={style}
                                  className={className}
                                  content={text}
                                  onKeyDown={onKeyDown}
                                  onChange={onChange}
                                  readonly={readonly}
                                  onClick={onClick} />
            <DocAnnotationMoment created={props.created} />
        </BlockHighlightContentWrapper>
    );
};
