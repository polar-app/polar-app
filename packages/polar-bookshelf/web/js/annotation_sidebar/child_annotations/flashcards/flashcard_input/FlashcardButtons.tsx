import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import Button from 'reactstrap/lib/Button';
import {Flashcard} from '../../../../metadata/Flashcard';

export class FlashcardButtons extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div>

                {this.props.cancelButton}

                <Button color="primary"
                        size="md"
                        className="ml-1"
                        onClick={() => this.props.onCreate()}>

                    {this.props.existingFlashcard ? 'Update' : 'Create'}

                </Button>

            </div>

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


