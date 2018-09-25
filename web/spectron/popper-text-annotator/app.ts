import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Popper, {ReferenceObject} from 'popper.js';
import $ from '../../js/ui/JQuery';
import {TextNodes} from '../../js/highlights/text/selection/TextNodes';


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

    constructor(mouseEvent: MouseEvent) {
        this.clientHeight = 0;
        this.clientWidth = 0;

        this.boundingClientRect = {
            width: 0,
            height: 0,
            top: mouseEvent.y,
            bottom: mouseEvent.y,
            left: mouseEvent.x,
            right: mouseEvent.x,
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
    //    clientHeight: number;
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


    document.addEventListener('mouseup', (event: MouseEvent) => {

        if (! window.getSelection().isCollapsed) {

            console.log("selection active");

            // const referenceObject = new RangeReferenceObject(window.getSelection().getRangeAt(0));

            const referenceObject = new MouseEventReferenceObject(event);
            const popper = new Popper(referenceObject, popup , {

                placement: 'bottom',
                onCreate: (data) => {
                    popup.show();
                    // TODO: automatically hide the popper if they click outside of the UI.
                },
                modifiers: {
                    // flip: {
                    //     behavior: ['left', 'right', 'top', 'bottom']
                    // },
                    // // offset: {
                    // //     enabled: true,
                    // //     offset: '0,10'
                    // // }
                    // arrow: {
                    //     enabled: true
                    // }
                }

            });


        }

    });


});


