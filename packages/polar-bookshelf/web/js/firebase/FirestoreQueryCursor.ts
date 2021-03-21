import {Firestore} from './Firestore';
import {Objects} from "polar-shared/src/util/Objects";
import firebase from 'firebase/app'
import { IQuery } from 'polar-snapshot-cache/src/store/IQuery';
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";

/**
 * Build a simple query cursor for Firestore queries.
 *
 * https://firebase.google.com/docs/firestore/query-data/query-cursors
 */
export class FirestoreQueryCursor {

    private readonly collection: string;
    private readonly whereClause: WhereClause;
    private readonly options: FirestoreQueryCursorOptions;

    private querySnapshot: IQuerySnapshot | undefined;

    private startAfter: string | undefined;

    constructor(collection: string,
                whereClause: WhereClause,
                options: Partial<FirestoreQueryCursorOptions> = new DefaultFirestoreQueryCursorOptions()) {

        this.collection = collection;
        this.whereClause = whereClause;
        this.options = Objects.defaults(options, new DefaultFirestoreQueryCursorOptions());

    }

    public hasNext() {
        return this.querySnapshot === undefined || this.querySnapshot.size >= this.options.limit;
    }

    public async next(): Promise<IQuerySnapshot> {

        console.log("=========================");

        const firestore = await Firestore.getInstance();

        let query: IQuery;

        if (this.querySnapshot === undefined) {

            query = firestore
                .collection(this.collection)
                .where(this.whereClause.fieldPath, this.whereClause.opStr, this.whereClause.value)
                .orderBy(this.options.orderBy)
                .limit(this.options.limit);

        } else {

            query = firestore
                .collection(this.collection)
                .where(this.whereClause.fieldPath, this.whereClause.opStr, this.whereClause.value)
                .orderBy(this.options.orderBy)
                .startAfter(this.startAfter)
                .limit(this.options.limit);

        }

        this.querySnapshot = await query.get(this.options.getOptions);

        const len = this.querySnapshot.docs.length;

        if (len > 0) {
            const lastDoc = this.querySnapshot.docs[len - 1];
            this.startAfter = lastDoc.id;
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

export interface WhereClause {
    readonly fieldPath: string;
    readonly opStr: firebase.firestore.WhereFilterOp;
    readonly value: any;
}
