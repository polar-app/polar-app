import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {
    FlashcardCallback,
    FlashcardInput
} from './flashcard_input/FlashcardInput';
import {ScrollIntoView} from '../../../ui/ScrollIntoView';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";
import {useAnnotationMutationContext} from "../../AnnotationMutationContext";

interface IProps {

    readonly id?: string;

    readonly defaultValue?: string;

}

export const CreateFlashcard2 = (props: IProps) => {

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutation = useAnnotationMutationContext();

    if (annotationInputContext.active !== 'flashcard') {
        return null;
    }

    const cancelButton = <CancelButton onClick={annotationInputContext.reset}/>;

    return (

        <ScrollIntoView>
            <FlashcardInput id={'edit-flashcard-for' + props.id}
                            onFlashcard={annotationMutation.onFlashcardCreated}
                            defaultValue={props.defaultValue}
                            cancelButton={cancelButton}/>
        </ScrollIntoView>

    );

};


