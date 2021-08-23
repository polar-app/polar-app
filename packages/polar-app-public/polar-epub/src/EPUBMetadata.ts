import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import {EPUBDocs} from "./EPUBDocs";

export class EPUBMetadata {

    public static async getMetadata(docPathOrURL: PathOrURLStr): Promise<IParsedDocMeta> {

        console.log("FIXME: getDocument... ");

        const book = await EPUBDocs.getDocument({url: docPathOrURL});

        console.log("FIXME: getDocument... done");

        console.log("FIXME 0");

        await book.opened;

        await book.ready;

        console.log("FIXME 1");
        const metadata = await book.loaded.metadata;
        console.log("FIXME 2");
        const spine = await book.loaded.spine;
        console.log("FIXME 3");

        if (! spine) {
            throw new Error("EPUB has no spine");
        }

        const id = `${metadata.identifier}#${metadata.pubdate}`;
        const fingerprint = Hashcodes.create(id);
        const title = metadata.title;
        const description = metadata.description;
        const creator = metadata.creator;

        function computePages() {
            // epub.js has horrible types...
            const spineItems: ReadonlyArray<ISpineItem> = (<any> spine).spineItems;
            return spineItems.filter(current => current.linear);
        }

        const pages = computePages();

        const nrPages = pages.length;

        return {
            fingerprint,
            title,
            description,
            creator,
            nrPages,
            props: {}
        };

    }
}

interface ISpineItem {
    readonly idref: string;
    readonly linear: 'yes' | 'no';
}
