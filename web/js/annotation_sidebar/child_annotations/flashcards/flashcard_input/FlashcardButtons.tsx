import * as React from 'react';
import {Flashcard} from '../../../../metadata/Flashcard';
import Button from "@material-ui/core/Button";
import {MUIButtonBar} from "../../../../mui/MUIButtonBar";
import {CancelButton} from "../../CancelButton";

export interface IProps {

    readonly onCreate: () => void;

    readonly onCancel: () => void;

    readonly existingFlashcard?: Flashcard;

}

export const FlashcardButtons = (props: IProps) => {

    return (

        <MUIButtonBar>

            <CancelButton onClick={props.onCancel}/>

            <Button color="primary"
                    variant="contained"
                    onClick={() => props.onCreate()}>

                {props.existingFlashcard ? 'Update' : 'Create'}

            </Button>

        </MUIButtonBar>

    );

}


