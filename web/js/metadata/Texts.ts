import {Text} from './Text';
import {TextType} from './TextType';

export class Texts {

    static create(body: string, type: TextType): Text {

        // TODO: if this is markdown, and we don't have the HTML version,
        // we need to add the HTML version by converting the markdown to HTML.

        let text = new Text();
        text[type] = body;
        return Object.freeze(text);

    }

}
