import {ISODateTimeStrings} from './ISODateTimeStrings';
import {Comment} from './Comment';
import {Hashcodes} from '../Hashcodes';
import {TextType} from './TextType';
import {Texts} from './Texts';
import {Ref} from './Refs';

export class Comments {

    public static SEQUENCE: number = 0;

    public static createTextComment(text: string, ref: Ref) {

        const content = Texts.create(text, TextType.TEXT);

        const id = Hashcodes.createID(this.SEQUENCE++);
        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        return new Comment({content, id, guid: id, created, lastUpdated, ref });

    }

    public static createHTMLComment(text: string, ref: Ref) {

        const content = Texts.create(text, TextType.HTML);

        const id = Hashcodes.createID(this.SEQUENCE++);
        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        return new Comment({content, id, guid: id, created, lastUpdated, ref });

    }

}
