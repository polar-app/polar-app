import * as React from 'react';
import {DropdownItem} from 'reactstrap';

export class AnnotationTypeDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }


    public render() {

        return (
            <DropdownItem onClick={() => this.props.onClick()}
                          className={this.props.selected ? 'font-weight-bold' : undefined}>
                {this.props.children}
            </DropdownItem>
        );

    }

}

interface IProps {

    readonly selected: boolean;
    readonly onClick: () => void;

}

interface IState {
}
