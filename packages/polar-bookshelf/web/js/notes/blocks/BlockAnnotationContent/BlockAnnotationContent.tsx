import React from "react";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {BlockTextHighlightAnnotationContent} from "./BlockTextHighlightAnnotationContent";
import {BlockAreaHighlightAnnotationContent} from "./BlockAreaHighlightAnnotationContent";
import {AnnotationContent} from "../../content/AnnotationContent";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {BlockFlashcardAnnotationContent} from "./BlockFlashcardAnnotationContent";
import {ISODateString} from "polar-shared/src/metadata/ISODateTimeStrings";

interface IProps extends BlockEditorGenericProps {
    readonly annotation: AnnotationContent;

    readonly onChange: (content: HTMLStr) => void;

    readonly created: ISODateString;
}

export const BlockAnnotationContent: React.FC<IProps> = (props) => {
    const { annotation, className, style } = props;

    const Annotation: React.ReactElement | null = React.useMemo(() => {
        switch (annotation.type) {
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return <BlockTextHighlightAnnotationContent {...props} annotation={annotation} />;
            case AnnotationContentType.AREA_HIGHLIGHT:
                return <BlockAreaHighlightAnnotationContent {...props} annotation={annotation} />;
            case AnnotationContentType.FLASHCARD:
                return <BlockFlashcardAnnotationContent {...props} annotation={annotation} />
        }
    }, [annotation, props]);

    return (
        <div className={className} style={style}>{Annotation}</div>
    );
};

