import {Firestore} from "../util/Firestore";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {URLStr} from "polar-shared/src/util/Strings";
import {ImportedDoc} from "./DatastoreFetchImports";

export class DocCaches {

    private static createRef(docURL: URLStr) {
        const firestore = Firestore.getInstance();
        const id = Hashcodes.create(docURL);
        return firestore.collection('doc_cache').doc(id);
    }

    public static async getCached(docURL: URLStr): Promise<DocCacheEntry | undefined> {

        const ref = this.createRef(docURL);

        const doc = await ref.get();

        if (doc.exists) {
            return <DocCacheEntry> doc.data();
        }

        return undefined;

    }

    public static async markCached(docURL: URLStr, importedDoc: ImportedDoc) {

        const ref = this.createRef(docURL);

        const entry: DocCacheEntry = {
            created: ISODateTimeStrings.create(),
            ...importedDoc
        };

        await ref.set(entry);
    }

}

interface DocCacheEntry extends ImportedDoc {
    readonly created: ISODateTimeString;
}
