import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, UncontrolledTooltip} from 'reactstrap';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import Dropdown, {Direction} from 'reactstrap/lib/Dropdown';
import Tooltip from 'reactstrap/lib/Tooltip';

/**
 * A dropdown that has a tooltip.
 */
export class TooltipDropdown extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.state = {
            open: false,
            tooltip: false,
            tooltipSupported: false
        };

    }

    public render() {

        const show = this.props.tooltip.show !== undefined ? this.props.tooltip.show : 500;

        return (

            <Dropdown id={this.props.id}
                      isOpen={this.state.open}
                      toggle={() => this.toggle()}
                      direction={this.props.direction}
                      onMouseEnter={() => this.onMouseEnter()}
                      onMouseLeave={() => this.onMouseLeave()}
                      size={this.props.size}>

                {this.props.children}

                <Tooltip placement={this.props.tooltip.placement}
                         style={{maxWidth: '325px',
                                textAlign: 'justify'}}
                         isOpen={this.state.tooltip}
                         target={this.props.id}
                         delay={{show, hide: 0}}
                         toggle={this.toggleTooltip}>

                    {this.props.tooltip.text}

                </Tooltip>

            </Dropdown>
        );

    }

    private onMouseEnter(): void {
        this.setState({...this.state, tooltipSupported: true});
    }

    private onMouseLeave(): void {
        this.setState({...this.state, tooltipSupported: true});
    }

    private toggle(): void {

        const open = !this.state.open;

        const tooltip: boolean =
            open ? false : !this.state.tooltip;

        this.setState({...this.state, open, tooltip});

    }

    private toggleTooltip(): void {

        const tooltip: boolean =
            this.state.open || ! this.state.tooltipSupported ? false : !this.state.tooltip;

        this.setState({...this.state, tooltip});

    }


}

interface IProps {

    readonly id: string;
    readonly direction?: Direction;
    readonly size?: string;

    readonly tooltip: TooltipProps;
}

interface TooltipProps {
    readonly text: string;
    readonly placement: 'top' | 'bottom' | 'left' | 'right';
    readonly show?: number;
}

interface IState {

    readonly open: boolean;

    /**
     * True when the tooltip is open.
     */
    readonly tooltip: boolean;

    readonly tooltipSupported: boolean;

}
