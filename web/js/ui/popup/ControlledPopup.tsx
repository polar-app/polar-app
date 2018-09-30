import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import Popover from 'reactstrap/lib/Popover';
import {CommentInputEvent} from '../../comments/react/CommentInputEvent';

export class ControlledPopup extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onTriggerPopupEvent = this.onTriggerPopupEvent.bind(this);

        this.state = {
            open: false,
            initial: false
        };

        this.props.triggerPopupEventDispatcher.addEventListener(event => {
            this.onTriggerPopupEvent(event);
        });

    }

    public render() {

        return (

            <div id="comment-popup-box">

                <div id={this.props.id + '-anchor'}/>

                <Popover placement={this.props.placement}
                         id={this.props.id + '-anchor'}
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

interface IProps {
    id: string;
    title: string;
    placement: ControlledPopupPlacement;
    triggerPopupEventDispatcher: IEventDispatcher<TriggerPopupEvent>;
}

interface IState {

    open: boolean;
    initial: boolean;
}


export type ControlledPopupPlacement = 'top' | 'bottom';
