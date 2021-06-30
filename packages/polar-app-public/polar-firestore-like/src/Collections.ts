import { IFirestore } from "./IFirestore";
import {IDocumentReference} from "./IDocumentReference";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Preconditions} from "polar-shared/src/Preconditions";
import { IQuerySnapshot } from "./IQuerySnapshot";
import {IWriteBatch} from "./IWriteBatch";
import {IDRecord} from "polar-shared/src/util/IDMaps";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace Collections {

    /**
     * The direction of a `Query.orderBy()` clause is specified as 'desc' or 'asc'
     * (descending or ascending).
     */
    export type OrderByDirection = 'desc' | 'asc';

    export type OrderByClause = [string, OrderByDirection | undefined];

    export type WhereFilterOp =
        | '<'
        | '<='
        | '=='
        | '!='
        | '>='
        | '>'
        | 'array-contains'
        | 'in'
        | 'not-in'
        | 'array-contains-any';

    export type ValueType = object | string | number;

    export type Clause = [string, WhereFilterOp, ValueType];


    export interface IterateOpts {
        readonly limit?: number;
        readonly offset?: number;
        readonly startAfter?: any[];
        readonly startAt?: any[];
        readonly orderBy?: ReadonlyArray<OrderByClause>;
    }

    export interface ListOpts extends IterateOpts {
    }

    export interface GetOrCreateRecord<T> {
        readonly created: boolean;
        readonly record: T;
    }

    namespace Clauses {

        export function assertPresent(clause: Clause) {
            const [field, op, value] = clause;
            Preconditions.assertPresent(value, 'value missing for field ' + field);
        }

        export function fields(clauses: ReadonlyArray<Clause>) {
            return clauses.map(current => current[0]);
        }

        export function values(clauses: ReadonlyArray<Clause>) {
            return clauses.map(current => current[2]);
        }

    }

    export async function getOrCreate<T, SM = unknown>(firestore: IFirestore<SM>,
                                                       collection: string,
                                                       batch: IWriteBatch<SM>,
                                                       documentReference: IDocumentReference<SM>,
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

    export async function get<T, SM = unknown>(firestore: IFirestore<SM>,
                                               collection: string,
                                                id: string): Promise<T | undefined> {
        const ref = firestore.collection(collection).doc(id);
        const doc = await ref.get();
        return <T> doc.data();
    }

    export async function getByID<T, SM = unknown>(firestore: IFirestore<SM>,
                                                   collection: string,
                                                   id: string): Promise<T | undefined> {

        return get(firestore, collection, id);

    }


    export async function set<T, SM = unknown>(firestore: IFirestore<SM>,
                                               collection: string,
                                               id: string,
                                               value: T) {

        value = Dictionaries.onlyDefinedProperties(value);
        const ref = firestore.collection(collection).doc(id);
        await ref.set(value);

    }

    function createQuery<SM = unknown>(firestore: IFirestore<SM>,
                                       collection: string,
                                       clauses: ReadonlyArray<Clause>, opts: ListOpts = {}) {

        // TODO: should work without any clauses and just list all the records
        // which is fine for small collections

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

        for (const orderBy of opts.orderBy || []) {
            query = query.orderBy(orderBy[0], orderBy[1]);
        }

        if (opts.startAfter) {
            query = query.startAfter(...opts.startAfter);
        }

        if (opts.startAt) {
            query = query.startAt(...opts.startAt);
        }

        if (opts.limit !== undefined) {
            query = query.limit(opts.limit);
        }

        if (opts.offset !== undefined) {
            query = query.offset(opts.offset);
        }

        return query;

    }

    function snapshotToRecords<T, SM = unknown>(snapshot: IQuerySnapshot<SM>) {
        return snapshot.docs.map(current => <T> current.data());
    }

    export async function list<T, SM = unknown>(firestore: IFirestore<SM>,
                                                collection: string,
                                                clauses: ReadonlyArray<Clause>,
                                                opts: ListOpts = {}): Promise<ReadonlyArray<T>> {

        const query = createQuery(firestore, collection, clauses, opts);

        const snapshot = await query.get();

        return snapshotToRecords(snapshot);

    }

    function firstRecord<T>(collection: string,
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

    export async function getByFieldValue<T, SM = unknown>(firestore: IFirestore<SM>,
                                                           collection: string,
                                                           field: string,
                                                           value: ValueType): Promise<T | undefined> {

        const results = await list<T, SM>(firestore, collection, [[field, '==', value]]);
        return firstRecord<T>(collection, [field], results);

    }

    export async function deleteByID<SM = unknown>(firestore: IFirestore<SM>,
                                                   collection: string,
                                                   batch: IWriteBatch<SM>,
                                                   provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const records = await provider();

        for (const record of records) {

            const doc = firestore.collection(collection)
                                 .doc(record.id);

            batch.delete(doc);

        }

    }

    export async function listByFieldValue<T, SM = unknown>(firestore: IFirestore<SM>,
                                                            collection: string,
                                                            field: string,
                                                            value: ValueType): Promise<ReadonlyArray<T>> {

        return list(firestore, collection, [[field, '==', value]]);

    }


    export async function getByFieldValues<T, SM = unknown>(firestore: IFirestore<SM>,
                                                            collection: string,
                                                            clauses: ReadonlyArray<Clause>): Promise<T | undefined> {

        const results = await list<T>(firestore, collection, clauses);

        const fields = clauses.map(current => current[0]);

        return firstRecord(collection, fields, results);

    }
    //
    //
    //
    // public collection() {
    //     return this.firestore.collection(this.name);
    // }

    export async function iterate<T, SM = unknown>(firestore: IFirestore<SM>,
                                                   collection: string,
                                                   clauses: ReadonlyArray<Clause>,
                                                   opts: IterateOpts = {}): Promise<Cursor<T>> {

        const limit = opts.limit || 100;

        let startAfter: any[] | undefined;

        // we always have at least one page...
        let hasNext: boolean = true;

        const next = async (): Promise<ReadonlyArray<T>> => {

            const query = createQuery(firestore, collection, clauses, {...opts, startAfter});
            const snapshot = await query.get();

            hasNext = snapshot.docs.length === limit;

            if (hasNext) {

                const last = Arrays.last(snapshot.docs)!;

                const computeStartAfter = () => {

                    const result: any[] = [];

                    for (const orderByClause of opts.orderBy || []) {
                        // FIXME: this isn't right?
                        result.push(last.get(orderByClause[0]));
                    }

                    return result;

                };

                startAfter = computeStartAfter();

            }

            return snapshotToRecords(snapshot);

        };

        return {
            next,
            hasNext(): boolean {
                return hasNext;
            }
        };

    }

    export interface GetOrCreateRecord<T> {
        readonly created: boolean;
        readonly record: T;
    }

    /**
     * A cursor for easily paging through all results on the data.
     */
    export interface Cursor<T> {
        hasNext(): boolean;
        next(): Promise<ReadonlyArray<T>>;
    }
}

