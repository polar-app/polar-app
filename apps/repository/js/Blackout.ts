import {Elements} from '../../../web/js/util/Elements';

export class Blackout {

    public static toggle(value: boolean) {

        if (value) {
            this.enable();
        } else {
            this.disable();
        }

    }

    public static enable() {

        // always make sure the blackout element is removed so we don't double
        // enable it...
        this.disable();

        const style = 'height:100%; width:100%; position:absolute; top:0; left:0; background-color:#000000; opacity: 0.3;';

        const blackoutElement =
            Elements.createWrapperElementHTML(`<div id="blackout" style="${style}">`)
                .firstChild!;

        document.body.appendChild(blackoutElement);

    }

    public static disable() {

        const element = document.getElementById("blackout");

        if (element && element.parentElement) {
            element.parentElement.removeChild(element);
        }

    }

}
