import * as React from 'react';
import {EditComment} from "./EditComment";
import {CancelButton} from "../CancelButton";
import {useAnnotationMutationContext} from "../../AnnotationMutationContext";
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";

export const CreateComment2 = React.memo(() => {

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutationContext = useAnnotationMutationContext();

    const cancelButton = <CancelButton onClick={() => annotationInputContext.setActive('none')}/>;
    // FIXME try to use MUI Fade here I think.

    if (annotationInputContext.active !== 'comment') {
        return null;
    }

    return (
        <EditComment onComment={annotationMutationContext.onCommentCreated}
                     cancelButton={cancelButton}/>
    );

});
