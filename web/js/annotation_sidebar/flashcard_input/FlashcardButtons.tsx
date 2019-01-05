import * as React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {FlashcardType} from '../../metadata/FlashcardType';
import Input from 'reactstrap/lib/Input';
import {FlashcardFields} from './FlashcardFields';

const log = Logger.create();

class Styles {

}

export class FlashcardButtons extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div>

                <Button color="secondary" size="sm" className="" onClick={() => this.props.onCancel()}>
                    Cancel
                </Button>

                <Button color="primary" size="sm" className="ml-1" onClick={() => this.props.onCreate()}>
                    Create
                </Button>

            </div>

        );

    }

}

export interface IProps {
    readonly onCancel: () => void;
    readonly onCreate: () => void;
}

export interface IState {
}


