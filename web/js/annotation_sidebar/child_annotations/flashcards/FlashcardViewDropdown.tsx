import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {MUIDeleteMenuItem} from "../../../mui/menu_items/MUIDeleteMenuItem";
import {MUIMenuIconButton} from "../../../mui/MUIMenuIconButton";


interface IProps {
    readonly id?: string;
    readonly disabled?: boolean;
    readonly flashcard: DocAnnotation;
    readonly onDelete: (flashcard: DocAnnotation) => void;
}

export const FlashcardViewDropdown  = (props: IProps) => {

    return (

        <MUIMenuIconButton id={props.id}
                           disabled={props.disabled}>
            <div>
                <MUIDeleteMenuItem onAccept={() => props.onDelete(props.flashcard)}/>
            </div>
        </MUIMenuIconButton>

    );

};
