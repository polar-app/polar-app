import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import Popover from 'reactstrap/lib/Popover';
import {Optional} from '../../util/ts/Optional';
import {Point} from '../../Point';
import {Points} from '../../Points';
import {Elements} from '../../util/Elements';

export class ControlledPopup extends React.Component<ControlledPopupProps, IState> {

    private selection?: Selection;

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onTriggerPopupEvent = this.onTriggerPopupEvent.bind(this);

        this.state = {
            active: false,
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
                         id={this.props.id + '-popover'}
                         isOpen={this.state.active}
                         target={this.props.id + '-anchor'}
                         toggle={this.toggle}
                         style={{}}>

                    {this.props.children}

                </Popover>

            </div>

        );
    }

    private toggle() {

        // TODO: activate/deactivate only when there is no selection.

        if (this.selection) {

            this.setState({
                active: ! this.selection.isCollapsed,
                initial: false
            });

        }

        //
        //
        // if (this.state.initial) {
        //    // keep the active state but set initial to false
        //
        //     this.setState({
        //         active: this.state.active,
        //         initial: false
        //     });
        //
        // } else {
        //
        //     this.setState({
        //         active: ! this.state.active,
        //         initial: false
        //     });
        //
        // }

    }

    private onTriggerPopupEvent(event: TriggerPopupEvent) {

        // we need to place the anchor element properly on the page and the
        // popup id displayed relative to the anchor.

        const pageElements = document.querySelectorAll(".page");
        const pageElement = pageElements[event.pageNum - 1];

        this.selection = event.selection;

        const origin: Point =
            Optional.of(pageElement.getBoundingClientRect())
                    .map(rect => {
                        return {'x': rect.left, 'y': rect.top};
                    })
                    .get();

        const point = event.point;

        const relativePoint: Point =
            Points.relativeTo(origin, point);

        const offset = event.offset || {x: 0, y: 0};

        const top = relativePoint.y + offset.y;
        const left = relativePoint.x + offset.x;

        const id = `${this.props.id}-anchor`;
        const cssText = `position: absolute; top: ${top}px; left: ${left}px;`;

        const anchorElement = document.getElementById(id)!;
        anchorElement.style.cssText = cssText;

        // now move the element to the proper page.

        anchorElement.parentElement!.removeChild(anchorElement);

        pageElement.insertBefore(anchorElement, pageElement.firstChild);

        this.setState({
            active: true,
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

    active: boolean;
    initial: boolean;

}


export type ControlledPopupPlacement = 'top' | 'bottom';
