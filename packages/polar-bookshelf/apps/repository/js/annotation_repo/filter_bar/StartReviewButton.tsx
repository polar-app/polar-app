import * as React from 'react';
import {Button} from "reactstrap";

export class StartReviewButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button color="success"
                    size="sm"
                    className="font-weight-bold"
                    style={{whiteSpace: 'nowrap'}}
                    onClick={() => this.props.onClick()}>

                    <i className="fas fa-graduation-cap mr-1"/> Start Review

            </Button>

        );

    }


}

export interface IProps {

    readonly onClick: () => void;

}

interface IState {

}
