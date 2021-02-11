import {Firestore} from '../../util/Firestore';
import {DocumentReference, WhereFilterOp, WriteBatch} from '@google-cloud/firestore';
import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {Preconditions} from "polar-shared/src/Preconditions";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import OrderByDirection = FirebaseFirestore.OrderByDirection;
import {IDStr} from "polar-shared/src/util/Strings";
import {Arrays} from "polar-shared/src/util/Arrays";

/**
 * Generic functions for working with Firebase collections
 * @deprecated Use the new collections ramework...
 */
export class Collections {

    public static async getOrCreate<T>(batch: WriteBatch,
                                       documentReference: DocumentReference,
                                       createRecord: () => T): Promise<GetOrCreateRecord<T>> {

        const doc = await documentReference.get();

        if (doc.exists) {

            return {
                created: false,
                record: <T> doc.data()
            };

        }


        const createdRecord = createRecord();

        const record = Dictionaries.onlyDefinedProperties(createdRecord);
        batch.create(documentReference, record);

        return {
            created: true,
            record
        };

    }

    public static async getByID<T>(collection: string, id: string): Promise<T | undefined> {

        const app = FirebaseAdmin.app();
        const firestore = app.firestore();

        const ref = firestore.collection(collection).doc(id);
        const doc = await ref.get();
        return <T> doc.data();

    }

    public static async getByIDWithQuery<T>(collection: string, id: IDStr): Promise<T | undefined> {

        const clauses: ReadonlyArray<Clause> = [
            ['id', '==', id]
        ];

        return Arrays.first(await Collections.list<T>(collection, clauses));

    }

    public static async getByFieldValue<T>(collection: string, field: string, value: ValueType): Promise<T | undefined> {
        const results = await this.list<T>(collection, [[field, '==', value]]);
        return this.first(collection, [field], results);
    }

    public static async getByFieldValues<T>(collection: string, clauses: ReadonlyArray<Clause>): Promise<T | undefined> {
        const results = await this.list<T>(collection, clauses);

        const fields = clauses.map(current => current[0]);

        return this.first(collection, fields, results);
    }

    private static first<T>(collection: string,
                            fields: ReadonlyArray<string>,
                            results: ReadonlyArray<T>): T | undefined {

        if (results.length === 0) {
            return undefined;
        } else if (results.length === 1) {
            return results[0];
        } else {
            throw new Error(`Too many records on collection ${collection} for fields ${fields} ` + results.length);
        }

    }

    public static async listByFieldValue<T>(collection: string, field: string, value: ValueType): Promise<ReadonlyArray<T>> {
        return this.list(collection, [[field, '==', value]]);
    }

    private static createQuery(collection: string,
                               clauses: ReadonlyArray<Clause>,
                               opts: ListOpts = {}) {

        const firestore = Firestore.getInstance();

        const clause = clauses[0];
        const [field, op, value] = clause;

        Clauses.assertPresent(clause);

        let query = firestore
            .collection(collection)
            .where(field, op, value);

        for (const clause of clauses.slice(1)) {
            const [field, op, value] = clause;
            Clauses.assertPresent(clause);
            query = query.where(field, op, value);
        }

        if (opts.after) {
            query.startAfter(opts.after);
        }

        if (opts.limit !== undefined) {
            query = query.limit(opts.limit);
        }

        return query;

    }

    private static snapshotToRecords<T>(snapshot: FirebaseFirestore.QuerySnapshot) {
        return snapshot.docs.map(current => <T> current.data());
    }

    public static async list<T>(collection: string,
                                clauses: ReadonlyArray<Clause>,
                                opts: ListOpts = {}): Promise<ReadonlyArray<T>> {

        const query = this.createQuery(collection, clauses, opts);

        const snapshot = await query.get();

        return this.snapshotToRecords(snapshot);

    }

    public static async deleteByID(batch: WriteBatch,
                                   collection: string,
                                   provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const firestore = Firestore.getInstance();

        const records = await provider();

        for (const record of records) {

            const doc = firestore.collection(collection)
                                 .doc(record.id);
            batch.delete(doc);

        }

    }

}

/**
 * A cursor for easily paging through all results on the data.
 */
export interface Cursor<T> {
    hasNext(): boolean;
    next(): Promise<ReadonlyArray<T>>;
}

export interface IterateOpts {
    readonly limit?: number;
}

export type OrderByClause = [string, OrderByDirection | undefined];

export interface ListOpts {
    readonly limit?: number;
    readonly after?: any[];
    readonly orderBy?: ReadonlyArray<OrderByClause>;

}

export type ValueType = object | string | number;

export type Clause = [string, WhereFilterOp, ValueType];

export class Clauses {

    public static assertPresent(clause: Clause) {
        const [field, op, value] = clause;
        Preconditions.assertPresent(value, 'value missing for field ' + field);
    }

    public static fields(clauses: ReadonlyArray<Clause>) {
        return clauses.map(current => current[0]);
    }

    public static values(clauses: ReadonlyArray<Clause>) {
        return clauses.map(current => current[2]);
    }

}

export interface IDRecord {
    readonly id: string;
}

export interface GetOrCreateRecord<T> {
    readonly created: boolean;
    readonly record: T;
}
