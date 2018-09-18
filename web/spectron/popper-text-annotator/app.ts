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

    document.addEventListener('mouseup', (event) => {

        if (! window.getSelection().isCollapsed) {

            console.log("selection active");

            const popper = new Popper(new RangeReferenceObject(window.getSelection().getRangeAt(0)), popup , {

                placement: 'bottom-end',
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


