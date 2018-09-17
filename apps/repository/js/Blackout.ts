import {Elements} from '../../../web/js/util/Elements';

export class Blackout {

    public static enable() {

        const blackoutElement =
            Elements.createElementHTML(`<div id="blackout" style="height:100%; width:100%; position:absolute; top:0; left:0; background-color:#000000; opacity: 0.2;">`)
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
