import * as React from 'react';
import {Flashcard} from '../../../../metadata/Flashcard';
import Button from "@material-ui/core/Button";
import {MUIButtonBar} from "../../../../../spectron0/material-ui/MUIButtonBar";

export class FlashcardButtons extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <MUIButtonBar>

                {this.props.cancelButton}

                <Button color="primary"
                        variant="contained"
                        onClick={() => this.props.onCreate()}>

                    {this.props.existingFlashcard ? 'Update' : 'Create'}

                </Button>

            </MUIButtonBar>

        );

    }

}

export interface IProps {

    readonly onCreate: () => void;

    readonly cancelButton: JSX.Element;

    readonly existingFlashcard?: Flashcard;

}

export interface IState {
}


