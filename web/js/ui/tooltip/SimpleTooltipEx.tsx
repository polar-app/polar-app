/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';

export class SimpleTooltipEx extends React.Component<IProps, IState> {

    private timeout?: number;

    private id: string;

    constructor(props: IProps) {
        super(props);

        this.id = 'tooltip-parent-' + Math.floor(1000000 * Math.random());

        this.state = {
            open: false
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.schedule = this.schedule.bind(this);

        this.trigger = this.trigger.bind(this);


    }

    public render() {

        const placement = this.props.placement || 'bottom';

        const show = this.props.show !== undefined ? this.props.show : 500;

        return (

            <div className="d-mobile-none"
                 onMouseEnter={() => this.onMouseEnter()}
                 onMouseMove={() => this.onMouseMove()}
                 onMouseLeave={() => this.onMouseLeave()}>

                <div id={this.id}>
                    {this.props.children}
                </div>

                <Tooltip style={{
                            maxWidth: '325px',
                            textAlign: 'justify',
                            ...this.props.style || {}
                         }}
                         isOpen={this.state.open}
                         className="d-mobile-none"
                         placement={placement}
                         delay={{show, hide: 0}}
                         target={this.id}>

                    {this.props.text}

                </Tooltip>

            </div>

        );

    }

    private onMouseEnter() {
        this.schedule();
    }

    private onMouseMove() {
        this.schedule();
    }

    private onMouseLeave() {
        window.clearTimeout(this.timeout);
        this.setState({open: false});
    }

    private schedule() {

        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }

        this.timeout = window.setTimeout(() => this.trigger(), this.props.show || 1000);
    }

    private trigger() {
        this.setState({open: true});
    }

}

interface IProps {
    readonly text: string;
    readonly placement?: 'bottom' | 'top' | 'right' | 'left';
    readonly show?: number;
    readonly style?: React.CSSProperties;
}

interface IState {
    readonly open: boolean;
}



