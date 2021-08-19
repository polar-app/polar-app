import React from "react";
import {IAnnotationContent, AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {BlockTextHighlightAnnotationContent} from "./BlockTextHighlightAnnotationContent";
import {BlockAreaHighlightAnnotationContent} from "./BlockAreaHighlightAnnotationContent";

interface IProps extends BlockEditorGenericProps {
    annotation: IAnnotationContent;
}

export const BlockAnnotationContent: React.FC<IProps> = (props) => {
    const { annotation, className, style, id } = props;

    const Annotation: ReturnType<React.FC> = React.useMemo(() => {
        switch (annotation.type) {
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return <BlockTextHighlightAnnotationContent id={id} textHighlight={annotation} />;
            case AnnotationContentType.AREA_HIGHLIGHT:
                return <BlockAreaHighlightAnnotationContent id={id} areaHighlight={annotation} />;
        }
        return null;
    }, [annotation]);

    return (
        <div className={className} style={style}>{Annotation}</div>
    );
};

