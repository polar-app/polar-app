import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Popper, {ReferenceObject} from 'popper.js';
import $ from '../../js/ui/JQuery';
import {TextNodes} from '../../js/highlights/text/selection/TextNodes';
import {Point} from '../../js/Point';


export class TextNodeReferenceObject implements Popper.ReferenceObject {

    public readonly clientHeight: number;
    public readonly clientWidth: number;
    private textNode: Node;

    constructor(textNode: Node) {
        this.textNode = textNode;

        const boundingClientRect = TextNodes.getRange(this.textNode).getBoundingClientRect();

        this.clientHeight = boundingClientRect.height;
        this.clientWidth = boundingClientRect.width;
    }

    public getBoundingClientRect(): ClientRect {
        return TextNodes.getRange(this.textNode).getBoundingClientRect();
    }

}

export class RangeReferenceObject implements Popper.ReferenceObject {

    public readonly clientHeight: number;
    public readonly clientWidth: number;
    private readonly range: Range;

    constructor(range: Range) {
        this.range = range;

        const boundingClientRect = range.getBoundingClientRect();

        this.clientHeight = boundingClientRect.height;
        this.clientWidth = boundingClientRect.width;
    }

    public getBoundingClientRect(): ClientRect {
        return this.range.getBoundingClientRect();
    }

}

export class MouseEventReferenceObject  implements Popper.ReferenceObject {

    public readonly clientHeight: number;
    public readonly clientWidth: number;
    public readonly boundingClientRect: ClientRect;

    constructor(mouseEvent: MouseEvent, range: Range, mouseDirection: Direction) {
        this.clientHeight = 0;
        this.clientWidth = 0;

        const boundingClientRect = range.getBoundingClientRect();

        let y: number = 0;

        // the x coord should always be from the mouse.
        const x = mouseEvent.x;

        const buffer = 5;

        switch (mouseDirection) {
            case 'up':
                y = boundingClientRect.top;
                y -= buffer;
                break;

            case 'down':
                y = boundingClientRect.bottom;
                y += buffer;
                break;

        }

        this.boundingClientRect = {
            width: 0,
            height: 0,
            top: y,
            bottom: y,
            left: x,
            right: x,
        };

    }

    public getBoundingClientRect(): ClientRect {
        return this.boundingClientRect;
    }

}


SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    const ref = $('#button-a');

    // FIXME: needs
    //
    //     clientHeight: number;
    //     clientWidth: number;
    //
    //     getBoundingClientRect(): ClientRect;

    const target = document.querySelector("#para")!.firstChild!;

    const popup = $('#popup');
    popup.hide();

    ref.click(function() {
        popup.show();
    });

    // TODO: add TWO events.. one mouse down, and one mouse up.. then keep track
    // of the delta between mouse up and mouse down to see where we should place
    // the popper.

    let originPoint: Point | undefined;

    document.addEventListener('mousedown', (event: MouseEvent) => {

        originPoint = {
            x: event.x,
            y: event.y
        };

    });

    document.addEventListener('mouseup', (event: MouseEvent) => {

        // compute the direction...

        if (! window.getSelection().isCollapsed) {

            console.log("FIXME: originPoint: " , originPoint);

            // compute if the mouse is moving down or up to figure out the best
            // place to put the mouse
            const mouseDirection: Direction = event.y - originPoint!.y < 0 ? 'up' : 'down';

            const placement = mouseDirection === 'down' ? 'bottom' : 'top';

            console.log("mouseDirection: " + mouseDirection)
            console.log("placement: " + placement)

            console.log("selection active");

            // const referenceObject = new RangeReferenceObject();

            const range = window.getSelection().getRangeAt(0);
            const referenceObject = new MouseEventReferenceObject(event, range, mouseDirection);
            const popper = new Popper(referenceObject, popup , {

                placement,
                onCreate: (data) => {
                    popup.show();
                    // TODO: automatically hide the popper if they click outside of the UI.
                },
                modifiers: {
                    // flip: {
                    //     behavior: ['left', 'right', 'top', 'bottom']
                    // },
                    // offset: {
                    //     enabled: true,
                    //     offset: '10,0'
                    // }
                    // arrow: {
                    //     enabled: true
                    // }
                }

            });


        }

    });


});

export type Direction = 'up' | 'down';
