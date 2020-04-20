import * as React from 'react';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';

export class AddContentDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <SimpleTooltipEx text={this.props.tooltip}
                             show={0}
                             placement="right">

                <DropdownItem id={this.props.id}
                              hidden={this.props.hidden}
                              size="sm"
                              onClick={() => this.props.onClick()}>

                    {this.props.children}

                </DropdownItem>


            </SimpleTooltipEx>

        );

    }

}

interface IProps {
    readonly id: string;
    readonly tooltip: string;
    readonly hidden: boolean;
    readonly onClick: () => void;
}

interface IState {
}
