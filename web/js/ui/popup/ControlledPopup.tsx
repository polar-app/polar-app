import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import Popover from 'reactstrap/lib/Popover';
import PopoverHeader from 'reactstrap/lib/PopoverHeader';
import PopoverBody from 'reactstrap/lib/PopoverBody';

export class ControlledPopup extends React.Component<IProps, any> {

    constructor(props: any) {
        super(props);

        // this.toggle = this.toggle.bind(this);
        this.onCommentEvent = this.onCommentEvent.bind(this);


        this.state = {
            popoverOpen: false
        };

        this.props.triggerPopupEventDispatcher.addEventListener(event => {
            this.onCommentEvent(event);
        });

    }

    // public toggle() {
    //
    //     if (! this.state.popoverOpen) {
    //         // this is a bit of a hack to position it exactly where we want it.
    //         document.getElementById('annotationbar-anchor')!.style.cssText
    //             = 'position: relative; top: 300px; left: 300px;';
    //     }
    //
    //     this.setState({
    //         popoverOpen: !this.state.popoverOpen
    //     });
    //
    // }

    public render() {

        return (

            <div id="comment-popup-box">

                <div id={this.props.id + '-anchor'}></div>

                {/*<Button id="comment-anchor" onClick={this.toggle}>*/}
                {/*Launch Popover*/}
                {/*</Button>*/}

                <Popover placement="bottom"
                         id={this.props.id + '-anchor'}
                         isOpen={this.state.popoverOpen}
                         target={this.props.id + '-anchor'}
                         style={{width: '650px'}}>

                    {this.props.children}

                </Popover>

            </div>

        );
    }

    private onCommentEvent(event: TriggerPopupEvent) {

        const point = event.point;

        document.getElementById(`${this.props.id}-anchor`)!.style.cssText
            = `position: absolute; top: ${point.y}px; left: ${point.x}px;`;

        this.setState({
            popoverOpen: true,
        });

    }

}

interface IProps {
    id: string;
    title: string;
    triggerPopupEventDispatcher: IEventDispatcher<TriggerPopupEvent>;
}
