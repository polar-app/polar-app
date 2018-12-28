import {Text} from './Text';
import {TextType} from './TextType';

export class Texts {

    public static create(body: string, type: TextType): Text {

        // TODO: if this is markdown, and we don't have the HTML version,
        // we need to add the HTML version by converting the markdown to HTML.

        const text = new Text();
        text[type] = body;
        return Object.freeze(text);

    }

    /**
     * This is somewhat confusing but take a Text object and convert it to a text
     * string.
     */
    public static toText(text?: Text): string | undefined {

        if (text) {

            if (text.TEXT) {
                return text.TEXT;
            }

            if (text.HTML) {
                const div = document.createElement('div');
                div.innerHTML = text.HTML;
                return div.innerText;
            }

        }

        return undefined;

    }


}

