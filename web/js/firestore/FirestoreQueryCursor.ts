import {Firestore} from './Firestore';
import {Objects} from '../util/Objects';

/**
 * Build a simple query cursor for Firesotre queries.
 *
 * https://firebase.google.com/docs/firestore/query-data/query-cursors
 */
export class FirestoreQueryCursor {

    private readonly query: firebase.firestore.Query;
    private readonly options: FirestoreQueryCursorOptions;

    private querySnapshot: firebase.firestore.QuerySnapshot | undefined;

    private startAt: string | undefined;

    constructor(query: firebase.firestore.Query,
                options: FirestoreQueryCursorOptions = new DefaultFirestoreQueryCursorOptions()) {

        this.query = query;
        this.options = Objects.defaults(options, new DefaultFirestoreQueryCursorOptions());

    }

    public hasNext() {
        return this.querySnapshot === undefined || this.querySnapshot.size >= this.options.limit;
    }

    public async next(): Promise<firebase.firestore.QuerySnapshot> {

        const firestore = await Firestore.getInstance();

        this.query.orderBy(this.options.orderBy)
                  .limit(this.options.limit);

        if (this.querySnapshot !== undefined) {
            // update the query startAt position for the next page.
            this.query.startAt(this.startAt);
        }

        this.querySnapshot = await this.query.get(this.options.getOptions);

        const len = this.querySnapshot.docs.length;

        if (len > 0) {
            const lastDoc = this.querySnapshot.docs[len];
            this.startAt = lastDoc.id;
        }

        return this.querySnapshot;

    }

}

export interface FirestoreQueryCursorOptions {
    readonly limit: number;
    readonly orderBy: string;
    readonly getOptions?: firebase.firestore.GetOptions;
}

export class DefaultFirestoreQueryCursorOptions implements FirestoreQueryCursorOptions {
    public readonly limit: number = 100;
    public readonly orderBy: string = "id";
}
