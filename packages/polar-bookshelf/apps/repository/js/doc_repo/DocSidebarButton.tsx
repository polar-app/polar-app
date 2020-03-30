import * as React from 'react';
import {Button} from "reactstrap";

/**
 * Button to enable the right sidebar
 */
export class DocSidebarButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: false,
        };

    }

    public render() {

        const color = this.props.selected ? 'primary' : 'secondary';

        return (

            <Button size="sm"
                    color={color}
                    onClick={() => this.props.onChange(! this.props.selected)}>

                <i className="fas fa-info-circle"/>

            </Button>

        );

    }

}

interface IProps {

    readonly selected: boolean;
    readonly onChange: (selected: boolean) => void;

}

interface IState {

}
