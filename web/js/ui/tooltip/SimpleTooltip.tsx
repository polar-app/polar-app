/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';

export class SimpleTooltip extends React.Component<IProps, IState> {

    private timeout?: number;

    constructor(props: IProps) {
        super(props);

        this.state = {
            open: false
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.trigger = this.trigger.bind(this);


    }

    public render() {

        const placement = this.props.placement || 'bottom';

        const show = this.props.show !== undefined ? this.props.show : 500;

        // FIXME: use mouse enter/leave on thsi element (NOT over/out) here
        // so taht we can detect when the mouse is within the element and
        // when we've hit a timeout, we should display the tooltip

        return (

            <div className="d-mobile-none"
                 onMouseEnter={() => this.onMouseEnter()}
                 onMouseLeave={() => this.onMouseLeave()}>

                <Tooltip style={{
                            maxWidth: '325px',
                            textAlign: 'justify',
                            ...this.props.style || {}
                         }}
                         className="d-mobile-none"
                         placement={placement}
                         delay={{show, hide: 0}}
                         target={this.props.target}>

                    {this.props.children}

                </Tooltip>

            </div>

        );

    }

    private onMouseEnter() {
        console.log("FIXME onMouseEnter");
        this.timeout = window.setTimeout(() => this.trigger(), this.props.show || 0);
    }

    private onMouseLeave() {
        console.log("FIXME onMouseLeave");
        window.clearTimeout(this.timeout);
        this.setState({open: false});
    }

    private trigger() {
        this.setState({open: true});
    }

}

interface IProps {
    readonly target: string;
    readonly placement?: 'bottom' | 'top' | 'right' | 'left';
    readonly show?: number;
    readonly style?: React.CSSProperties;
}

interface IState {
    readonly open: boolean;
}

