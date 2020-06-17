import * as React from 'react';
import {useCallback, useState} from 'react';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FlashcardInputFieldsType} from './FlashcardInputs';
import {FlashcardInputForCloze} from './FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from './FlashcardInputForFrontAndBack';
import {Flashcard} from '../../../../metadata/Flashcard';
import isEqual from "react-fast-compare";

export interface IProps {

    readonly id: string;

    /**
     * The default value to show in the flashcard
     */
    readonly defaultValue?: string;

    readonly flashcardType?: FlashcardType;

    readonly cancelButton: JSX.Element;

    readonly existingFlashcard?: Flashcard;

}

export interface IState {
    readonly iter: number;
    readonly flashcardType: FlashcardType;
}

function defaultFlashcardType() {

    // FIXME migrate AWAY fro musing localStorage direcltly
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

    const onFlashcardChangeType = useCallback((flashcardType: FlashcardType) => {

        setFlashcardType(flashcardType);
        setDefaultFlashcardType(flashcardType);

    }, []);

    const onFlashcard =  useCallback((flashcardType: FlashcardType,
                                      fields: Readonly<FlashcardInputFieldsType>) => {

        // FIXME: this isn't wired
        /// props.onFlashcard(flashcardType, fields, this.props.existingFlashcard);

        // this.setState({
        //     iter: this.state.iter + 1
        // });

    }, []);

    if (flashcardType === FlashcardType.BASIC_FRONT_BACK) {

        return ( <FlashcardInputForFrontAndBack id={props.id}
                                                cancelButton={props.cancelButton}
                                                existingFlashcard={props.existingFlashcard}
                                                defaultValue={props.defaultValue}
                                                onFlashcard={onFlashcard}
                                                onFlashcardChangeType={onFlashcardChangeType}/> );

    } else {

        return ( <FlashcardInputForCloze id={props.id}
                                         cancelButton={props.cancelButton}
                                         existingFlashcard={props.existingFlashcard}
                                         defaultValue={props.defaultValue}
                                         onFlashcard={onFlashcard}
                                         onFlashcardChangeType={onFlashcardChangeType}/> );

    }

}, isEqual);

export type FlashcardCallback = (flashcardType: FlashcardType,
                                 fields: Readonly<FlashcardInputFieldsType>,
                                 existingFlashcard?: Flashcard) => void;
