import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import Popover from 'reactstrap/lib/Popover';

export class ControlledPopup extends React.Component<ControlledPopupProps, IState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onTriggerPopupEvent = this.onTriggerPopupEvent.bind(this);

        this.state = {
            open: false,
            initial: false
        };

        this.props.triggerPopupEventDispatcher.addEventListener(event => {
            console.log("FIXME2 triggered")

            this.onTriggerPopupEvent(event);
        });

    }

    public render() {

        return (

            <div id="comment-popup-box">

                <div id={this.props.id + '-anchor'}/>

                <Popover placement={this.props.placement}
                         id={this.props.id + '-popover'}
                         isOpen={this.state.open}
                         target={this.props.id + '-anchor'}
                         toggle={this.toggle}
                         style={{}}>

                    {this.props.children}

                </Popover>

            </div>

        );
    }

    private toggle() {

        if (this.state.initial) {
           // keep the open state but set initial to false

            this.setState({
                open: this.state.open,
                initial: false
            });

        } else {

            this.setState({
                open: ! this.state.open,
                initial: false
            });

        }

    }

    private onTriggerPopupEvent(event: TriggerPopupEvent) {

        const point = event.point;

        const top = point.y - 10;

        document.getElementById(`${this.props.id}-anchor`)!.style.cssText
            = `position: absolute; top: ${top}px; left: ${point.x}px;`;

        this.setState({
            open: true,
            initial: true
        });

    }

}

export interface ControlledPopupProps {
    readonly id: string;
    readonly placement: ControlledPopupPlacement;
    readonly triggerPopupEventDispatcher: IEventDispatcher<TriggerPopupEvent>;
}

interface IState {

    open: boolean;
    initial: boolean;
}


export type ControlledPopupPlacement = 'top' | 'bottom';
