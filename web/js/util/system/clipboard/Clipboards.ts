import {HTMLStr} from "polar-shared/src/util/Strings";

const copy = require('copy-html-to-clipboard');

export class Clipboards {

    public static writeText(text: string) {
        copy(text);
    }

    public static writeHTML(html: HTMLStr) {
        copy(html, {
            asHtml: true,
        });
    }

}

