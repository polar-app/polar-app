import React from "react";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";

export const EditTags: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const taggedCallback = annotationMutations.createTaggedCallback({selected: [annotation]});
    React.useEffect(() => {
        clear();
        taggedCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return <div />;
};
