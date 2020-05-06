import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {FlashcardInput} from './flashcard_input/FlashcardInput';
import {ScrollIntoView} from '../../../ui/ScrollIntoView';
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";
import {
    IFlashcardMutation,
    useAnnotationMutationsContext
} from "../../AnnotationMutationsContext";
import {useCallback} from "react";
import {FlashcardInputFieldsType} from "./flashcard_input/FlashcardInputs";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {IDocAnnotation} from "../../DocAnnotation";

interface IProps {

    readonly id?: string;
    readonly defaultValue?: string;
    readonly parent: IDocAnnotation;

}

export const CreateFlashcard2 = (props: IProps) => {

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutations = useAnnotationMutationsContext();

    if (annotationInputContext.active !== 'flashcard') {
        return null;
    }

    const cancelButton = <CancelButton onClick={annotationInputContext.reset}/>;

    const onFlashcard = useCallback((flashcardType: FlashcardType,
                                     fields: Readonly<FlashcardInputFieldsType>) => {

        annotationInputContext.reset();

        const mutation: IFlashcardMutation = {
            type: 'create',
            flashcardType,
            fields,
            parent: props.parent
        };

        annotationMutations.onFlashcard(mutation);

    }, []);

    return (

        <ScrollIntoView>
            <FlashcardInput id={'edit-flashcard-for' + props.id}
                            onFlashcard={onFlashcard}
                            defaultValue={props.defaultValue}
                            cancelButton={cancelButton}/>
        </ScrollIntoView>

    );

};


