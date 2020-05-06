import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {useAnnotationMutationsContext} from "../../AnnotationMutationsContext";
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";
import {EditComment2} from './EditComment2';

export const CreateComment2 = React.memo(() => {

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutationsContext = useAnnotationMutationsContext();

    const cancelButton = <CancelButton onClick={() => annotationInputContext.setActive('none')}/>;
    // FIXME try to use MUI Fade here I think.

    if (annotationInputContext.active !== 'comment') {
        return null;
    }

    return (
        <EditComment2 cancelButton={cancelButton}/>
    );

});
