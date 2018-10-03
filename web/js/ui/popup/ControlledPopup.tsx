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

        // FIXME: create a fake element and position it to see if my new algorithm works...

        const origin: Point =
            Optional.of(pageElement.getBoundingClientRect())
                    .map(rect => {
                        return {'x': rect.left, 'y': rect.top};
                    })
                    .get();


        const offsetPoint: Point =
            Points.relativeTo(origin, event.point);

        console.log("FIXME origin: ", origin);
        console.log("FIXME event.point: ", event.point);
        console.log("FIXME offsetPoint: ", offsetPoint);

        const testElement = Elements.createElementHTML(`<div style='position: absolute; left: ${offsetPoint.x}px; top: ${offsetPoint.y}px; background-color: red; padding: 10px; z-index: 1000;'>hello world</div>`)

        pageElement.insertBefore(testElement, pageElement.firstChild);

        // FIXME END ******************

        // TODO: We have to compute this properly by placing our element with the
        // pageElement parent and computing the position by comparing its
        // boundingClientRect with the point on the screen.

        // the point is relative to the viewport as it's based on
        // boundingClientRect.
        const point = event.point;

        const offset = event.offset || {x: 0, y: 0};

        const top = point.y + offset.y;
        const left = point.x + offset.x;

        const id = `${this.props.id}-anchor`;
        const cssText = `position: fixed; top: ${top}px; left: ${left}px;`;

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
