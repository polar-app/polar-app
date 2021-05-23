import React from "react";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";


export const DeleteAnnotation: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const handleDelete = annotationMutations.createDeletedCallback({selected: [annotation]});

    React.useEffect(() => {
        clear();
        handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
