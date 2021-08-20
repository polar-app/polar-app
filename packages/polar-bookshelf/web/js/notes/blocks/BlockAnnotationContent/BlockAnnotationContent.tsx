import React from "react";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {BlockTextHighlightAnnotationContent} from "./BlockTextHighlightAnnotationContent";
import {BlockAreaHighlightAnnotationContent} from "./BlockAreaHighlightAnnotationContent";
import {AnnotationContent} from "../../content/AnnotationContent";
import {HTMLStr} from "polar-shared/src/util/Strings";

interface IProps extends BlockEditorGenericProps {
    readonly annotation: AnnotationContent;
    readonly onChange: (content: HTMLStr) => void;
}

export const BlockAnnotationContent: React.FC<IProps> = (props) => {
    const { annotation, className, style } = props;

    const Annotation: ReturnType<React.FC> = React.useMemo(() => {
        switch (annotation.type) {
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return <BlockTextHighlightAnnotationContent {...props} annotation={annotation} />;
            case AnnotationContentType.AREA_HIGHLIGHT:
                return <BlockAreaHighlightAnnotationContent {...props} annotation={annotation} />;
        }
        return null;
    }, [annotation]);

    return (
        <div className={className} style={style}>{Annotation}</div>
    );
};

