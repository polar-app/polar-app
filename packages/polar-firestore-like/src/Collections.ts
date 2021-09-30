import { IFirestore, IFirestoreClient } from "./IFirestore";
import {IDocumentReference} from "./IDocumentReference";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Preconditions} from "polar-shared/src/Preconditions";
import { IQuerySnapshot } from "./IQuerySnapshot";
import {IWriteBatch} from "./IWriteBatch";
import {IDRecord} from "polar-shared/src/util/IDMaps";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IDStr} from "polar-shared/src/util/Strings";

import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {TDocumentChangeType} from "./IDocumentChange";
import {TOrderByDirection} from "./IQuery";

import {TWhereFilterOp} from "./ICollectionReference";

/**
 * Main collections interface.  The rest are deprecated and we're trying to move
 * toward this version.
 */
export namespace Collections {

    export interface DocumentChangeValue<T> {
        readonly type: TDocumentChangeType;
        readonly value: T;
    }
    export interface CollectionReferenceLike {
        doc(documentPath: string): DocumentReferenceLike;
        where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
        limit(size: number): QueryLike;
    }
    export interface QuerySnapshotLike {
        readonly docs: QueryDocumentSnapshotLike[];
    }
    export interface DocumentSnapshotLike {
        readonly exists: boolean;
        data(): DocumentDataLike | undefined;
    }
    export interface QueryDocumentSnapshotLike {
        data(): DocumentDataLike;
        get(fieldPath: string): any;
    }
    export interface SetOptionsLike {
        readonly merge?: boolean;
    }
    export type WhereFilterOpLike = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';

    export type DocumentDataLike = {[field: string]: any};

    export interface QueryLike {
        get(): Promise<QuerySnapshotLike>;
        where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
        limit(limit: number): QueryLike;
        offset(offset: number): QueryLike;
        orderBy(fieldPath: string, directionStr?: TOrderByDirection): QueryLike;
        startAt(...fieldValues: any[]): QueryLike;
        startAfter(...fieldValues: any[]): QueryLike;
        endAt(...fieldValues: any[]): QueryLike;
        endBefore(...fieldValues: any[]): QueryLike;
    }
    export interface DocumentReferenceLike {
        get(): Promise<DocumentSnapshotLike>;
        set(data: DocumentDataLike, options?: SetOptionsLike): Promise<any>;
    }
    export interface QueryOpts {

        /**
         * Limit the number of results.
         */
        readonly limit?: number;

        readonly orderBy?: ReadonlyArray<OrderByClause>;

    }

    export type Clause = [string, TWhereFilterOp, any];

    export type OrderByClause = [string, TOrderByDirection | undefined];

    export type ValueType = Record<string, unknown> | string | number;

    export type SnapshotListener<T> = (record: ReadonlyArray<T>) => void;

    export type QuerySnapshotErrorHandler = (err: Error, collection: string, clauses: ReadonlyArray<Clause>) => void;

    const DefaultQuerySnapshotErrorHandler = (err: Error, collection: string, clauses: ReadonlyArray<Clause>) => {

        console.error(`Unable to handle snapshot for collection ${collection}: `, clauses, err);

    };

    export type SnapshotErrorHandler = (err: Error, collection: string) => void;

    export const DefaultSnapshotErrorHandler = (err: Error, collection: string) => {

        console.error(`Unable to handle snapshot for collection ${collection}: `, err);

    };

    export interface IterateOpts {
        readonly limit?: number;
        readonly offset?: number;
        readonly startAfter?: any[];
        readonly startAt?: string;
        readonly endBefore?: string;
        readonly orderBy?: ReadonlyArray<OrderByClause>;
    }

    export type ListOpts = IterateOpts

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

    export async function getOrCreate<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, batch: IWriteBatch<SM>, documentReference: IDocumentReference<SM>, createRecord: () => T): Promise<GetOrCreateRecord<T>> {

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

    export async function get<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, id: string): Promise<T | undefined> {
        const ref = firestore.collection(collection).doc(id);
        const doc = await ref.get();
        return <T> doc.data();
    }

    /**
     * @deprecated use get()
     */
    export async function getByID<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, id: string): Promise<T | undefined> {

        return get(firestore, collection, id);

    }


    export async function set<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, id: string, value: T, batch?: IWriteBatch<SM>) {

        const b = batch || firestore.batch();

        value = Dictionaries.onlyDefinedProperties(value);
        const ref = firestore.collection(collection).doc(id);
        await ref.set(value);

        if (! batch) {
            await b.commit();
        }

    }

    function createQuery<SM = unknown>(firestore: IFirestore<SM>, collection: string, clauses: ReadonlyArray<Clause>, opts: ListOpts = {}) {

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
    /**
     * Query snapshot but only for changed documents.
     */
    export function onQuerySnapshot<T>(firestore: IFirestoreClient,collection: string, clauses: ReadonlyArray<Clause>, delegate: (records: ReadonlyArray<T>) => void, errHandler: QuerySnapshotErrorHandler = DefaultQuerySnapshotErrorHandler): SnapshotUnsubscriber {

        const query = createQuery(firestore, collection, clauses);

        return query.onSnapshot(snapshot => {
            delegate(snapshot.docs.map(current => <T> current.data()));
        }, err => {
            errHandler(err, collection, clauses);
        });

    }
    /**
     * Query snapshot but only for changed documents.
     */
    export function onQuerySnapshotChanges<T, SM = unknown>(firestore: IFirestore<SM>,
                                                            collection: string,
                                                            clauses: ReadonlyArray<Clause>,
                                                            delegate: (records: ReadonlyArray<DocumentChangeValue<T>>) => void,
                                                            errHandler: QuerySnapshotErrorHandler = DefaultQuerySnapshotErrorHandler): SnapshotUnsubscriber {

        const query = createQuery(firestore, collection, clauses);

        return query.onSnapshot(snapshot => {

            const changes = snapshot.docChanges().map(current => {

                const type = current.type;
                const value = <T> current.doc.data();
                return {
                    type,
                    value
                };

            });

            delegate(changes);

        }, err => {
            errHandler(err, collection, clauses);
        });


    }
    export function onDocumentSnapshot<T>(firestore: IFirestoreClient, collection: string, id: string, delegate: (record: T | undefined) => void, errHandler: SnapshotErrorHandler = DefaultSnapshotErrorHandler): SnapshotUnsubscriber {

        const ref = firestore.collection(collection).doc(id);

        return ref.onSnapshot(snapshot => {

            const toValue = () => {

                if (snapshot.exists) {
                    return <T> snapshot.data();
                }

                return undefined;

            };

            delegate(toValue());

        }, err => {
            errHandler(err, collection);
        });

    }

    function snapshotToRecords<T, SM = unknown>(snapshot: IQuerySnapshot<SM>) {
        return snapshot.docs.map(current => <T> current.data());
    }

    export function createRef<SM>(firestore: IFirestore<SM>, collection: string, id: string) {
        const ref = firestore.collection(collection).doc(id);
        return ref;
    }

    export async function list<T>(firestore: IFirestore<unknown>, collection: string, clauses: ReadonlyArray<Clause>, opts: ListOpts = {}): Promise<ReadonlyArray<T>> {

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

    export async function getByFieldValue<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, field: string, value: ValueType): Promise<T | undefined> {

        const results = await list<T>(firestore, collection, [[field, '==', value]]);
        return firstRecord<T>(collection, [field], results);

    }

    export async function doDelete<SM = unknown>(firestore: IFirestore<SM>, collection: string, id: IDStr) {

        await firestore.collection(collection).doc(id).delete();

    }

    export async function deleteByID<SM = unknown>(firestore: IFirestore<SM>, collection: string, batch: IWriteBatch<SM> | undefined, provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const records = await provider();
        const b = batch || firestore.batch();


        for (const record of records) {

            const doc = firestore.collection(collection)
                                 .doc(record.id);


            if(batch){
                batch.delete(doc);
            } else{
                await doDelete(firestore, collection, record.id);
            }

        }

    }

    export async function listByFieldValue<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, field: string, value: ValueType): Promise<ReadonlyArray<T>> {

        return list(firestore, collection, [[field, '==', value]]);

    }


    export async function getByFieldValues<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, clauses: ReadonlyArray<Clause>): Promise<T | undefined> {

        const results = await list<T>(firestore, collection, clauses);

        const fields = clauses.map(current => current[0]);

        return firstRecord(collection, fields, results);

    }

    export async function iterate<T, SM = unknown>(firestore: IFirestore<SM>, collection: string, clauses: ReadonlyArray<Clause>, opts: IterateOpts = {}): Promise<Cursor<T>> {

        const limit = opts.limit || 100;

        let startAfter: any[] | undefined;

        // we always have at least one page...
        let hasNext = true;

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

    /**
     * A cursor for easily paging through all results on the data.
     */
    export interface Cursor<T> {
        hasNext(): boolean;
        next(): Promise<ReadonlyArray<T>>;
    }
}
