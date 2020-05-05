import * as React from 'react';
import {DocAnnotation, IDocAnnotation} from '../../DocAnnotation';
import {MUIDeleteMenuItem} from "../../../mui/menu_items/MUIDeleteMenuItem";
import {MUIMenuIconButton} from "../../../mui/MUIMenuIconButton";


interface IProps {
    readonly id?: string;
    readonly disabled?: boolean;
    readonly flashcard: IDocAnnotation;
    readonly onDelete: (flashcard: IDocAnnotation) => void;
}

export const FlashcardViewDropdown  = (props: IProps) => {

    return (

        <MUIMenuIconButton id={props.id}
                           disabled={props.disabled}
                           placement="bottom-end">
            <div>
                <MUIDeleteMenuItem onAccept={() => props.onDelete(props.flashcard)}/>
            </div>
        </MUIMenuIconButton>

    );

};
