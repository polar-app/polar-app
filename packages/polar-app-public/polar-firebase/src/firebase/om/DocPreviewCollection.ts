import {Collections} from "polar-firestore-like/src/Collections";
import {IDocDetail} from "polar-shared/src/metadata/IDocDetail";
import {IDStr, URLStr, CollectionNameStr} from "polar-shared/src/util/Strings";
import {SlugStr} from "polar-shared/src/util/Slugs";

import OrderByClause = Collections.OrderByClause;
import Clause = Collections.Clause;
import {DocumentReferenceLike, QueryLike, WhereFilterOpLike} from "../Collections";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

export interface CollectionReferenceLike {
    doc(documentPath: string): DocumentReferenceLike;
    where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
    limit(size: number): QueryLike;
}

export interface FirestoreLike {
    collection(collectionPath: string): CollectionReferenceLike;
}
export interface BaseDocPreview extends IDocDetail {

    readonly id: IDStr;

    /**
     * The hashcode for the URL which we can lookup easily.
     */
    readonly urlHash: IDStr;

    /**
     * The original URL for this doc (PDF, EPUB, etc)
     */
    readonly url: URLStr;

    /**
     * The category for this doc.  Used to help SEO purposes
     */
    readonly category?: string;

}

export interface DocPreviewCached extends BaseDocPreview {

    /**
     * The hashcode for the doc.
     */
    readonly docHash: IDStr;

    /**
     * The URL for the doc cloud storage.
     */
    readonly datastoreURL: URLStr;

    readonly cached: true;

    /**
     * The slug of the document that's computed from the title.  We use this
     * to compute the full URL
     */
    readonly slug: SlugStr | undefined;

}

export interface DocPreviewUncached extends BaseDocPreview {

    readonly cached: false;

}

export type DocPreview = DocPreviewCached | DocPreviewUncached;

export interface Range {
    readonly start: IDStr;
    readonly end: IDStr;
}

export interface ListOpts {
    readonly size: number;
    readonly range?: Range;
    readonly startAt?: string;
    readonly endBefore?: string;
    readonly orderBy?: ReadonlyArray<OrderByClause>;
}

export class DocPreviewCollection {

    private static COLLECTION: CollectionNameStr = "doc_preview";

    public static async set<SM = unknown>(firestore: IFirestore<SM>, doc: DocPreview): Promise<DocPreview> {
        await Collections.set(firestore, this.COLLECTION, doc.id, doc);
        return doc;
    }

    public static async list<SM = unknown>(firestore: IFirestore<SM>, opts: ListOpts): Promise<ReadonlyArray<DocPreview>> {

        const clauses: ReadonlyArray<Clause> = [];
        const limit = opts && opts.size;

        if (opts && opts.range) {
            console.log("Using range query for: ", opts.range);

            const startAt = opts && opts.range && opts.range.start;
            const endBefore = opts && opts.range && opts.range.end;
            const orderBy: ReadonlyArray<OrderByClause> = [
                ['urlHash', 'asc']
            ];
            return await Collections.list(firestore, this.COLLECTION, clauses, {limit, orderBy, startAt, endBefore});

        }
        return await Collections.list(firestore, this.COLLECTION, clauses,{limit});

    }

    public static async get<SM = unknown>(firestore: IFirestore<SM>, id: IDStr): Promise<DocPreview | undefined> {
        return Collections.get(firestore, this.COLLECTION, id);
    }

}
