import * as React from 'react';
import {Button} from "reactstrap";

export class ActionButton extends React.Component<IProps> {
    public render() {

        return (
            <Button color="primary"
                    style={{outline: 'none', boxShadow: 'none'}}
                    onClick={() => this.props.onClick()}
                    className="btn-circle btn-xl shadow-mg">

                <i className="fas fa-graduation-cap"/>

            </Button>
        );

    }

}

export interface IProps {
    readonly onClick: () => void;
}
