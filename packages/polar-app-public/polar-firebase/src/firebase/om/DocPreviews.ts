import {
    CollectionNameStr,
    Collections,
    FirestoreProvider
} from "../Collections";

import {IDocDetail} from "polar-shared/src/metadata/IDocDetail";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";

export interface BaseDocPreview extends IDocDetail {

    /**
     * The hashcode for the doc.
     */
    readonly hashcode: IDStr;

    /**
     * The category for this doc.  Used to help SEO purposes
     */
    readonly category?: string;

}

export interface DocPreviewCached extends BaseDocPreview {
    /**
     * The URL for the doc cloud storage.
     */
    readonly datastoreURL: URLStr;

    readonly cached: true;

}

export interface DocPreviewUncached extends BaseDocPreview {

    readonly cached: false;

}

export type DocPreview = DocPreviewCached | DocPreviewUncached;

export class DocPreviews {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "doc_preview";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async set(doc: DocPreview) {
        // only callable via firebase admin...
        await this.collections().set(doc.hashcode, doc);
    }

    public static async get(id: IDStr): Promise<DocPreview | undefined> {
        return this.collections().get(id);
    }

}
