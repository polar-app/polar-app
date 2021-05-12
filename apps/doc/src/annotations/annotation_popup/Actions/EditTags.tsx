import React from "react";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useAnnotationPopupAction} from "../AnnotationPopupActionContext";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";

export const EditTags: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear} = useAnnotationPopupAction();
    const annotationMutations = useAnnotationMutationsContext();
    const taggedCallback = annotationMutations.createTaggedCallback({selected: [annotation]});
    React.useEffect(() => {
        clear();
        taggedCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return <div />;
};
