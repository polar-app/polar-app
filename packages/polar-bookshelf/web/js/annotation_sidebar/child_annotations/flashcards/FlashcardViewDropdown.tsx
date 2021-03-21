import * as React from 'react';
import {IDocAnnotationRef} from '../../DocAnnotation';
import {MUIDeleteMenuItem} from "../../../mui/menu_items/MUIDeleteMenuItem";
import {MUIMenuIconButton} from "../../../mui/MUIMenuIconButton";


interface IProps {
    readonly id?: string;
    readonly disabled?: boolean;
    readonly flashcard: IDocAnnotationRef;
    readonly onDelete: (flashcard: IDocAnnotationRef) => void;
}

export const FlashcardViewDropdown  = (props: IProps) => {

    return (

        <MUIMenuIconButton id={props.id}
                           disabled={props.disabled}
                           placement="bottom-end">
            <div>
                <MUIDeleteMenuItem onClick={() => props.onDelete(props.flashcard)}/>
            </div>
        </MUIMenuIconButton>

    );

};
