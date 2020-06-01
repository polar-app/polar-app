import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {
    FlashcardCallback,
    FlashcardInput
} from './flashcard_input/FlashcardInput';
import {ScrollIntoView} from '../../../ui/ScrollIntoView';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {

    readonly id: string;

    readonly onFlashcardCreated: FlashcardCallback;

    readonly onCancel?: () => void;

    readonly defaultValue?: string;

}

export const CreateFlashcard = (props: IProps) => {

    const onCancel = props.onCancel || NULL_FUNCTION;

    const cancelButton = <CancelButton onClick={() => onCancel()}/>;

    return (

        <ScrollIntoView>
            <FlashcardInput id={'edit-flashcard-for' + props.id}
                            onFlashcard={props.onFlashcardCreated}
                            defaultValue={props.defaultValue}
                            cancelButton={cancelButton}/>
        </ScrollIntoView>

    );

};


