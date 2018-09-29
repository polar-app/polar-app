import {ISODateTimeStrings} from './ISODateTimeStrings';
import {Comment} from './Comment';
import {Hashcodes} from '../Hashcodes';
import {TextType} from './TextType';
import {Texts} from './Texts';

export class Comments {

    public static createTextComment(text: string) {

        const content = Texts.create(text, TextType.TEXT);

        const id = Hashcodes.createRandomID();
        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        return new Comment({content, id, guid: id, created, lastUpdated });

    }

}
