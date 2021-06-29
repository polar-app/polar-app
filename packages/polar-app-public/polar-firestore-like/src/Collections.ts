import {WriteBatchLike} from "../../polar-firebase/src/firebase/Collections";
import { IFirestore } from "./IFirestore";
import {IDocumentReference} from "./IDocumentReference";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export namespace Collections {

    export interface GetOrCreateRecord<T> {
        readonly created: boolean;
        readonly record: T;
    }

    export async function getOrCreate<T>(firestore: IFirestore,
                                         collection: string,
                                         batch: WriteBatchLike,
                                         documentReference: IDocumentReference,
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

    export async function get<T>(firestore: IFirestore,
                                 collection: string,
                                 id: string): Promise<T | undefined> {
        const ref = firestore.collection(collection).doc(id);
        const doc = await ref.get();
        return <T> doc.data();
    }

    export async function getByID<T>(firestore: IFirestore,
                                     collection: string,
                                     id: string): Promise<T | undefined> {

        return get(firestore, collection, id);

    }

    //
    // public async set<T>(id: string, value: T) {
    //     value = Dictionaries.onlyDefinedProperties(value);
    //     const ref = this.firestore.collection(this.name).doc(id);
    //     await ref.set(value);
    // }
    //
    //
    //
    // public async getByFieldValue<T>(field: string, value: ValueType): Promise<T | undefined> {
    //     const results = await this.list<T>([[field, '==', value]]);
    //     return this.first([field], results);
    // }
    //
    // public async getByFieldValues<T>(clauses: ReadonlyArray<Clause>): Promise<T | undefined> {
    //     const results = await this.list<T>(clauses);
    //
    //     const fields = clauses.map(current => current[0]);
    //
    //     return this.first(fields, results);
    // }
    //
    // private first<T>(fields: ReadonlyArray<string>,
    //                  results: ReadonlyArray<T>): T | undefined {
    //
    //     if (results.length === 0) {
    //         return undefined;
    //     } else if (results.length === 1) {
    //         return results[0];
    //     } else {
    //         throw new Error(`Too many records on collection ${this.name} for fields ${fields} ` + results.length);
    //     }
    //
    // }
    //
    // public async listByFieldValue<T>(field: string, value: ValueType): Promise<ReadonlyArray<T>> {
    //     return this.list([[field, '==', value]]);
    // }
    //
    // private createQuery(clauses: ReadonlyArray<Clause>, opts: ListOpts = {}) {
    //
    //     // TODO: should work without any clauses and just list all the records
    //     // which is fine for small collections
    //
    //     const clause = clauses[0];
    //     const [field, op, value] = clause;
    //
    //     Clauses.assertPresent(clause);
    //
    //     let query = this.firestore
    //         .collection(this.name)
    //         .where(field, op, value);
    //
    //     for (const clause of clauses.slice(1)) {
    //         const [field, op, value] = clause;
    //         Clauses.assertPresent(clause);
    //         query = query.where(field, op, value);
    //     }
    //
    //     for (const orderBy of opts.orderBy || []) {
    //         query = query.orderBy(orderBy[0], orderBy[1]);
    //     }
    //
    //     if (opts.startAfter) {
    //         query = query.startAfter(...opts.startAfter);
    //     }
    //
    //     if (opts.startAt) {
    //         query = query.startAt(...opts.startAt);
    //     }
    //
    //     if (opts.limit !== undefined) {
    //         query = query.limit(opts.limit);
    //     }
    //
    //     if (opts.offset !== undefined) {
    //         query = query.offset(opts.offset);
    //     }
    //
    //     return query;
    //
    // }
    //
    // private snapshotToRecords<T>(snapshot: QuerySnapshotLike) {
    //     return snapshot.docs.map(current => <T> current.data());
    // }
    //
    // public collection() {
    //     return this.firestore.collection(this.name);
    // }
    //
    // public async list<T>(clauses: ReadonlyArray<Clause>,
    //                      opts: ListOpts = {}): Promise<ReadonlyArray<T>> {
    //
    //     const query = this.createQuery(clauses, opts);
    //
    //     const snapshot = await query.get();
    //
    //     return this.snapshotToRecords(snapshot);
    //
    // }
    //
    // public async iterate<T>(clauses: ReadonlyArray<Clause>,
    //                         opts: IterateOpts = {}): Promise<Cursor<T>> {
    //
    //     const limit = opts.limit || 100;
    //
    //     let startAfter: any[] | undefined;
    //
    //     // we always have at least one page...
    //     let hasNext: boolean = true;
    //
    //     const next = async (): Promise<ReadonlyArray<T>> => {
    //
    //         const query = this.createQuery(clauses, {...opts, startAfter});
    //         const snapshot = await query.get();
    //
    //         hasNext = snapshot.docs.length === limit;
    //
    //         if (hasNext) {
    //
    //             const last = Arrays.last(snapshot.docs)!;
    //
    //             const computeStartAfter = () => {
    //
    //                 const result: any[] = [];
    //
    //                 for (const orderByClause of opts.orderBy || []) {
    //                     result.push(last.get(orderByClause[0]));
    //                 }
    //
    //                 return result;
    //
    //             };
    //
    //             startAfter = computeStartAfter();
    //
    //         }
    //
    //         return this.snapshotToRecords(snapshot);
    //
    //     };
    //
    //     return {
    //         next,
    //         hasNext(): boolean {
    //             return hasNext;
    //         }
    //     };
    //
    // }
    //
    // public async deleteByID(batch: WriteBatchLike,
    //                         provider: () => Promise<ReadonlyArray<IDRecord>>) {
    //
    //     const records = await provider();
    //
    //     for (const record of records) {
    //
    //         const doc = this.firestore.collection(this.name)
    //             .doc(record.id);
    //
    //         batch.delete(doc);
    //
    //     }
    //
    // }

}
