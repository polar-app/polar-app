import * as React from 'react';
import {useCallback, useState} from 'react';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FlashcardInputFieldsType} from './FlashcardInputs';
import {FlashcardInputForCloze} from './FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from './FlashcardInputForFrontAndBack';
import {Flashcard} from '../../../../metadata/Flashcard';
import isEqual from "react-fast-compare";
import {
    IFlashcardUpdate,
    useAnnotationMutationsContext
} from "../../../AnnotationMutationsContext";
import {useAnnotationActiveInputContext} from "../../../AnnotationActiveInputContext";
import {IDocAnnotationRef} from "../../../DocAnnotation";

export interface IProps {

    readonly id: string;

    readonly flashcard: IDocAnnotationRef;

    /**
     * The default value to show in the flashcard
     */
    readonly defaultValue?: string;

    readonly flashcardType?: FlashcardType;

    readonly onCancel: () => void;

    readonly existingFlashcard?: Flashcard;

}

export interface IState {
    readonly iter: number;
    readonly flashcardType: FlashcardType;
}

function defaultFlashcardType() {

    // TODO migrate AWAY fro musing localStorage direcltly
    const defaultFlashcardType = window.localStorage.getItem('default-flashcard-type');

    switch (defaultFlashcardType) {

        case FlashcardType.BASIC_FRONT_BACK:
            return FlashcardType.BASIC_FRONT_BACK;

        case FlashcardType.CLOZE:
            return FlashcardType.CLOZE;

        default:
            return FlashcardType.BASIC_FRONT_BACK;
    }

}

function setDefaultFlashcardType(flashcardType: FlashcardType) {
    localStorage.setItem('default-flashcard-type', flashcardType);
}

export const FlashcardInput2 = React.memo((props: IProps) => {

    const [flashcardType, setFlashcardType] = useState(props.flashcardType || defaultFlashcardType())
    const annotationInputContext = useAnnotationActiveInputContext();

    const annotationMutations = useAnnotationMutationsContext();
    const flashcardCallback = annotationMutations.createFlashcardCallback(props.flashcard);

    const onFlashcardChangeType = useCallback((flashcardType: FlashcardType) => {

        setFlashcardType(flashcardType);
        setDefaultFlashcardType(flashcardType);

    }, []);


    const onFlashcard = useCallback((flashcardType: FlashcardType,
                                     fields: Readonly<FlashcardInputFieldsType>) => {

        annotationInputContext.reset();

        const mutation: IFlashcardUpdate = {
            type: 'update',
            parent: props.flashcard.parent!,
            flashcardType,
            fields,
            existing: props.flashcard
        };

        flashcardCallback(mutation);

    }, [annotationInputContext, flashcardCallback, props]);

    if (flashcardType === FlashcardType.BASIC_FRONT_BACK) {

        return ( <FlashcardInputForFrontAndBack id={props.id}
                                                onCancel={props.onCancel}
                                                existingFlashcard={props.existingFlashcard}
                                                defaultValue={props.defaultValue}
                                                onFlashcard={onFlashcard}
                                                onFlashcardChangeType={onFlashcardChangeType}/> );

    } else {

        return ( <FlashcardInputForCloze id={props.id}
                                         onCancel={props.onCancel}
                                         existingFlashcard={props.existingFlashcard}
                                         defaultValue={props.defaultValue}
                                         onFlashcard={onFlashcard}
                                         onFlashcardChangeType={onFlashcardChangeType}/> );

    }

}, isEqual);

export type FlashcardCallback = (flashcardType: FlashcardType,
                                 fields: Readonly<FlashcardInputFieldsType>,
                                 existingFlashcard?: Flashcard) => void;
