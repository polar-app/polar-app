/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UncontrolledTooltip} from 'reactstrap';

export class Tooltip extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {

        const placement = this.props.placement || 'bottom';

        return (
            <UncontrolledTooltip style={{maxWidth: '1000px'}}
                                 placement={placement}
                                 delay={{show: 500, hide: 0}}
                                 target={this.props.target}>

                {this.props.children}

            </UncontrolledTooltip>

        );
    }

}

interface IProps {
    readonly target: string;
    readonly placement?: 'bottom' | 'top';
}

interface IState {
}

