import React from "react";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {IDocMetaAnnotationProps} from "../IDocMetaAnnotationProps";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";

export const EditTags: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();

    const DocMetaEditTags: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const taggedCallback = annotationMutations.createTaggedCallback({ selected: [annotation] });

        React.useEffect(() => {
            clear();
            taggedCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div />;
    };

    return annotation.type === 'docMeta'
        ? <DocMetaEditTags annotation={annotation.annotation} />
        : null;
};
