import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Comment} from './Comment';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {TextType} from 'polar-shared/src/metadata/TextType';
import {Texts} from 'polar-shared/src/metadata/Texts';
import {Ref} from 'polar-shared/src/metadata/Refs';
import {IDocMeta} from 'polar-shared/src/metadata/IDocMeta';
import {IPageMeta} from 'polar-shared/src/metadata/IPageMeta';
import {IComment} from 'polar-shared/src/metadata/IComment';

export class Comments {

    public static SEQUENCE: number = 0;

    public static createID() {

        const seq = this.SEQUENCE++;
        const now = Date.now();
        return Hashcodes.createID({seq, now}, 20);

    }

    public static createTextComment(text: string, ref: Ref) {

        const content = Texts.create(text, TextType.TEXT);

        const id = this.createID();
        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        return new Comment({content, id, guid: id, created, lastUpdated, ref });

    }

    public static createHTMLComment(text: string,
                                    ref: Ref,
                                    created?: ISODateTimeString,
                                    lastUpdated?: ISODateTimeString ) {

        const content = Texts.create(text, TextType.HTML);

        const id = this.createID();

        if (! created) {
            created = ISODateTimeStrings.create();
        }

        if (! lastUpdated) {
            lastUpdated = created;
        }

        return new Comment({content, id, guid: id, created, lastUpdated, ref });

    }

    public static update(id: string,
                         docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         updates: Partial<IComment>) {

        const existing = pageMeta.comments[id]!;

        if (!existing) {
            throw new Error("No existing for id: " + id);
        }

        const updated = new Comment({...existing, ...updates});
        pageMeta.comments[id] = updated;
    }
}
