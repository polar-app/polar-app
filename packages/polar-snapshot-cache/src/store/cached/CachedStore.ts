import {CacheProvider, TCacheDocTupleWithID} from "../../CacheProvider";
import {ICacheKeyCalculator} from "../../ICacheKeyCalculator";
import {CachedQueries} from "../../CachedQueries";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ICachedDoc} from "../../ICachedDoc";
import {Preconditions} from "polar-shared/src/Preconditions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IGetOptions} from "polar-firestore-like/src/IGetOptions";
import {ISnapshotListenOptions} from "polar-firestore-like/src/ISnapshotListenOptions";
import {IFirestoreError} from "polar-firestore-like/src/IFirestoreError";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {
    IQuery,
    IQueryClient,
    IQueryOrderBy,
    IQuerySnapshotObserver,
    isQuerySnapshotObserver,
    TOrderByDirection
} from "polar-firestore-like/src/IQuery";
import {
    ICollectionReference,
    ICollectionReferenceClient,
    IWhereClause,
    TWhereFilterOp,
    TWhereValue
} from "polar-firestore-like/src/ICollectionReference";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {
    IDocumentReferenceClient,
    IDocumentSnapshotObserver,
    IDocumentSnapshotObserverClient,
    isDocumentSnapshotObserver
} from "polar-firestore-like/src/IDocumentReference";
import {IDocumentSnapshot, IDocumentSnapshotClient} from "polar-firestore-like/src/IDocumentSnapshot";
import {TDocumentData} from "polar-firestore-like/src/TDocumentData";
import {IQuerySnapshot, IQuerySnapshotClient} from "polar-firestore-like/src/IQuerySnapshot";
import {IDocumentChange} from "polar-firestore-like/src/IDocumentChange";
import {IWriteBatchClient} from "polar-firestore-like/src/IWriteBatch";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";
import {TUpdateData} from "../TUpdateData";

export namespace CachedStore {

    type GetHandler<V> = (options?: IGetOptions) => Promise<V>;

    function createGetHandler<V>(readFromCache: () => Promise<V | undefined>,
                                 writeToCache: (value: V) => Promise<void>,
                                 delegate: GetHandler<V>): GetHandler<V> {

        return async (options?: IGetOptions): Promise<V> => {

            const source = options?.source || 'default';

            async function handleSourceServer(): Promise<V> {

                const result = await delegate(options);
                await writeToCache(result);

                return result;

            }

            async function handleSourceCache(): Promise<V> {

                const snapshot = await readFromCache();

                if (snapshot) {
                    return snapshot;
                }

                const err = new Error();

                const error: IFirestoreError = {
                    code: 'not-found',
                    message: "Document not found in cache",
                    name: err.name,
                    stack: err.stack
                }

                throw error;

            }

            async function handleSourceDefault(): Promise<V> {

                try {
                    return await handleSourceServer();
                } catch (e) {
                    return await handleSourceCache();
                }

            }

            switch (source) {

                case "default":
                    return await handleSourceDefault();
                case "server":
                    return await handleSourceServer();
                case "cache":
                    return await handleSourceCache();

            }

        }

    }

    type SnapshotHandler<V> = (options: ISnapshotListenOptions,
                               onNext: (snapshot: V) => void,
                               onError?: (error: IFirestoreError) => void,
                               onCompletion?: () => void) => SnapshotUnsubscriber;

    function createSnapshotHandler<V>(readFromCache: () => Promise<V | undefined>,
                                      writeToCache: (value: V) => Promise<void>,
                                      delegate: SnapshotHandler<V>): SnapshotHandler<V> {

        return (options, onNext, onError, onCompletion): SnapshotUnsubscriber => {

            let hasServerSnapshot = false;

            function handleReadCachedSnapshot(snapshot: V | undefined) {

                if (hasServerSnapshot) {
                    // we might receive the server snapshot first so
                    // have to be careful there.
                    return;
                }

                if (snapshot) {
                    onNext(snapshot);
                }

            }

            function handleCacheError(err: Error) {

                if (onError) {

                    onError({
                        code: 'internal',
                        message: err.message,
                        name: err.name,
                        stack: err.stack
                    })

                }
            }

            readFromCache()
                .then(snapshot => handleReadCachedSnapshot(snapshot))
                .catch(handleCacheError)

            function handleNext(snapshot: V) {

                hasServerSnapshot = true;

                writeToCache(snapshot)
                    .catch(handleCacheError);

                onNext(snapshot);

            }

            return delegate(options, handleNext, onError, onCompletion);

        }

    }

    export function create(delegate: IFirestoreClient,
                           cacheProvider: CacheProvider,
                           cacheKeyCalculator: ICacheKeyCalculator): IFirestoreClient {

        Preconditions.assertPresent(cacheKeyCalculator, 'cacheKeyCalculator');

        function collection(collectionName: string): ICollectionReferenceClient {

            const _collection = delegate.collection(collectionName);

            class DocumentReference implements IDocumentReferenceClient {
                private getter: GetHandler<IDocumentSnapshotClient>;
                private snapshotter: SnapshotHandler<IDocumentSnapshotClient>;

                constructor(public readonly id: string,
                            public readonly parent: ICollectionReferenceClient,
                            private readonly doc: IDocumentReferenceClient) {

                    this.getter = createGetHandler<IDocumentSnapshotClient>(() => this.readFromCache(),
                                                                            value => this.writeToCache(value),
                                                                            (options) => this.doc.get(options));

                    this.snapshotter = createSnapshotHandler<IDocumentSnapshotClient>(() => this.readFromCache(),
                                                                                      value => this.writeToCache(value),
                                                                                      (options, onNext, onError, onCompletion) => this.doc.onSnapshot(options, onNext, onError, onCompletion));


                }

                private async readFromCache(): Promise<IDocumentSnapshotClient | undefined> {

                    const cacheKey = cacheKeyCalculator.computeForDoc(this.doc.parent.id, this.doc);

                    const cacheData = await cacheProvider.readDoc({
                        key: cacheKey,
                        collection: this.doc.parent.id
                    });

                    if (cacheData) {
                        return {
                            id: this.doc.id,
                            metadata: {
                                hasPendingWrites: false,
                                fromCache: true
                            },
                            exists: cacheData.exists,
                            data: () => cacheData.data,
                            get: () => {
                                throw new Error('not implemented')
                            }
                        }
                    }

                    return undefined;

                }

                private async writeToCache(snapshot: IDocumentSnapshotClient) {

                    const cacheKey = cacheKeyCalculator.computeForDoc(this.doc.parent.id, this.doc);

                    await cacheProvider.writeDoc({
                        key: cacheKey,
                        doc: {
                            collection: _collection.id,
                            id: snapshot.id,
                            exists: snapshot.exists,
                            data: snapshot.data()
                        }
                    });

                }

                public async create(data: TDocumentData): Promise<void> {
                    throw new Error("not implemented");
                }

                public async delete(): Promise<void> {

                    this.writeToCache({
                        exists: false,
                        id: this.doc.id,
                        metadata: {
                            hasPendingWrites: false,
                            fromCache: true,
                        },
                        data: () => undefined,
                        get: () => {
                            throw new Error("not implemented");
                        }
                    }).catch(err => console.error("Unable to update cache: ", err));

                }

                public get(options?: IGetOptions): Promise<IDocumentSnapshotClient> {
                    return this.getter(options);
                }

                public async update(data: TUpdateData): Promise<void> {
                    throw new Error("Not implemented");
                }

                public async set(data: TDocumentData): Promise<void> {

                    this.writeToCache({
                        exists: true,
                        id: this.doc.id,
                        metadata: {
                            hasPendingWrites: false,
                            fromCache: true,
                        },
                        data: () => data,
                        get: () => {
                            throw new Error("not implemented");
                        }
                    }).catch(err => console.error("Unable to update cache: ", err));

                    return this.doc.set(data);

                }

                private onSnapshotWithObserver(observer: IDocumentSnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter({}, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithOptionsAndObserver(options: ISnapshotListenOptions,
                                                         observer: IDocumentSnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter(options, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithCallbacks(onNext: (snapshot: IDocumentSnapshot<ISnapshotMetadata>) => void,
                                                onError?: (error: IFirestoreError) => void,
                                                onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter({}, onNext, onError, onCompletion);

                }

                private onSnapshotWithOptionsAndCallbacks(options: ISnapshotListenOptions,
                                                          onNext: (snapshot: IDocumentSnapshotClient) => void,
                                                          onError?: (error: IFirestoreError) => void,
                                                          onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter(options, onNext, onError, onCompletion);

                }

                public onSnapshot(observer: IDocumentSnapshotObserverClient): SnapshotUnsubscriber;
                public onSnapshot(options: ISnapshotListenOptions, observer: IDocumentSnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber;
                public onSnapshot(onNext: (snapshot: IDocumentSnapshotClient) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): SnapshotUnsubscriber;

                public onSnapshot(options: ISnapshotListenOptions,
                                  onNext: (snapshot: IDocumentSnapshot<ISnapshotMetadata>) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): SnapshotUnsubscriber;

                public onSnapshot(arg0: IDocumentSnapshotObserver<ISnapshotMetadata> | ISnapshotListenOptions | ((snapshot: IDocumentSnapshot<ISnapshotMetadata>) => void),
                                  arg1?: IDocumentSnapshotObserver<ISnapshotMetadata> | ((error: IFirestoreError) => void) | ((snapshot: IDocumentSnapshot<ISnapshotMetadata>) => void),
                                  arg2?: (() => void) | ((error: IFirestoreError) => void),
                                  arg3?: () => void): SnapshotUnsubscriber | (() => void) {

                    if (isDocumentSnapshotObserver(arg0) && arg1 === undefined && arg2 === undefined && arg3 === undefined) {
                        return this.onSnapshotWithObserver(arg0);
                    }

                    if (typeof arg0 === 'object' && isDocumentSnapshotObserver(arg1)) {
                        return this.onSnapshotWithOptionsAndObserver(arg0 as ISnapshotListenOptions, arg1);
                    }

                    if (typeof arg0 === 'function' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' )) {
                        return this.onSnapshotWithCallbacks(arg0, arg1 as any, arg2 as any);
                    }

                    if (typeof arg0 === 'object' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' ) &&
                        (typeof arg3 === 'function' || typeof arg3 === 'undefined' )) {

                        return this.onSnapshotWithOptionsAndCallbacks(arg0 as ISnapshotListenOptions, arg1 as any, arg2 as any, arg3 as any);

                    }

                    throw new Error("Invalid arguments");

                }

            }

            function doc(documentPath?: string): IDocumentReferenceClient {

                const _doc = _collection.doc(documentPath);

                return new DocumentReference(_doc.id, _collection, _doc, )

            }

            class Query implements IQueryClient {

                private readonly getter: GetHandler<IQuerySnapshotClient>;
                private readonly snapshotter: SnapshotHandler<IQuerySnapshotClient>;

                private readonly _clauses: readonly IWhereClause[] = [];

                private _startAt: readonly string[] | undefined = undefined;
                private _startAfter: readonly string[] | undefined = undefined;

                private _limit: number | undefined = undefined;

                private _offset: number | undefined = undefined;

                private _order: readonly IQueryOrderBy[] = [];

                /**
                 *
                 * @param _query The underlying query delegate.
                 * @param _collection The collection we're querying
                 */
                constructor(private readonly _query: IQuery<ISnapshotMetadata>,
                            private readonly _collection: ICollectionReference<ISnapshotMetadata>) {

                    this.getter = createGetHandler<IQuerySnapshot<ISnapshotMetadata>>(() => this.readFromCache(),
                                                                   value => this.writeToCache(value),
                                                                   (options) => this._query.get(options));

                    this.snapshotter = createSnapshotHandler<IQuerySnapshot<ISnapshotMetadata>>(() => this.readFromCache(),
                                                                             value => this.writeToCache(value),
                                                                             (options, onNext, onError, onCompletion) => this._query.onSnapshot(options, onNext, onError, onCompletion));

                }

                private computeCacheKey(): string {
                    return cacheKeyCalculator.computeForQuery({
                        collection: this._collection.id,
                        clauses: this._clauses,
                        limit: this._limit,
                        order: this._order
                    });
                }

                private async readFromCache(): Promise<IQuerySnapshot<ISnapshotMetadata> | undefined> {

                    Preconditions.assertPresent(cacheKeyCalculator, 'cacheKeyCalculator');

                    const cacheKey = this.computeCacheKey();

                    const cachedQuery = await cacheProvider.readQuery({
                        key: cacheKey,
                        collection: this._collection.id
                    });

                    if (cachedQuery) {

                        const keys = cachedQuery.docs.map(current => current.id);
                        const docs = await cacheProvider.readDocs({keys, collection: this._collection.id});

                        const index = arrayStream(docs).toMap(current => current.id);

                        return CachedQueries.fromCache(cachedQuery, index);
                    }

                    return undefined;

                }

                private async writeToCache(snapshot: IQuerySnapshot<ISnapshotMetadata>) {

                    Preconditions.assertPresent(cacheKeyCalculator, 'cacheKeyCalculator');

                    const cacheKey = this.computeCacheKey();

                    await cacheProvider.writeQuery({
                        key: cacheKey,
                        query: CachedQueries.toCache({
                                   collection: this._collection.id,
                                   clauses: [...this._clauses],
                                   limit: this._limit,
                                   order: [...this._order]
                        }, snapshot)
                    });

                    const docChanges = snapshot.docChanges();

                    function toCacheEntry(docChange: IDocumentChange<ISnapshotMetadata>): TCacheDocTupleWithID {

                        switch (docChange.type) {

                            case "added":
                            case "modified":
                                return [
                                    docChange.doc.id,
                                    {
                                        collection: _collection.id,
                                        id: docChange.doc.id,
                                        exists: true,
                                        data: docChange.doc.data()
                                    }
                                ]
                            case "removed":
                                return [
                                    docChange.doc.id,
                                    {
                                        collection: _collection.id,
                                        id: docChange.doc.id,
                                        exists: false,
                                        data: undefined
                                    }
                                ];

                        }

                    }

                    await cacheProvider.writeDocs({
                        docs: docChanges.map(toCacheEntry)
                    });

                }

                public where(fieldPath: string, opStr: TWhereFilterOp, value: TWhereValue): IQueryClient {
                    this._clauses.push({fieldPath, opStr, value});
                    this._query.where(fieldPath, opStr, value);
                    return this;
                }

                async get(options?: IGetOptions): Promise<IQuerySnapshotClient> {
                    return this.getter(options);
                }

                private onSnapshotWithObserver(observer: IQuerySnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter({}, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithOptionsAndObserver(options: ISnapshotListenOptions,
                                                         observer: IQuerySnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter(options, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithCallbacks(onNext: (snapshot: IQuerySnapshot<ISnapshotMetadata>) => void,
                                                onError?: (error: IFirestoreError) => void,
                                                onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter({}, onNext, onError, onCompletion);

                }

                private onSnapshotWithOptionsAndCallbacks(options: ISnapshotListenOptions,
                                                          onNext: (snapshot: IQuerySnapshot<ISnapshotMetadata>) => void,
                                                          onError?: (error: IFirestoreError) => void,
                                                          onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter(options, onNext, onError, onCompletion);

                }

                public onSnapshot(observer: IQuerySnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber;

                public onSnapshot(options: ISnapshotListenOptions,
                                  observer: IQuerySnapshotObserver<ISnapshotMetadata>): SnapshotUnsubscriber;

                public onSnapshot(onNext: (snapshot: IQuerySnapshot<ISnapshotMetadata>) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): () => void;

                public onSnapshot(options: ISnapshotListenOptions,
                                  onNext: (snapshot: IQuerySnapshot<ISnapshotMetadata>) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): SnapshotUnsubscriber;

                public onSnapshot(arg0: IQuerySnapshotObserver<ISnapshotMetadata> | ISnapshotListenOptions | ((snapshot: IQuerySnapshot<ISnapshotMetadata>) => void),
                                  arg1?: IQuerySnapshotObserver<ISnapshotMetadata> | ((error: IFirestoreError) => void) | ((snapshot: IQuerySnapshot<ISnapshotMetadata>) => void),
                                  arg2?: (() => void) | ((error: IFirestoreError) => void),
                                  arg3?: () => void): SnapshotUnsubscriber | (() => void) {

                    if (isQuerySnapshotObserver(arg0) && arg1 === undefined && arg2 === undefined && arg3 === undefined) {
                        return this.onSnapshotWithObserver(arg0);
                    }

                    if (typeof arg0 === 'object' && isQuerySnapshotObserver(arg1)) {
                        return this.onSnapshotWithOptionsAndObserver(arg0 as ISnapshotListenOptions, arg1);
                    }

                    if (typeof arg0 === 'function' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' )) {
                        return this.onSnapshotWithCallbacks(arg0, arg1 as any, arg2 as any);
                    }

                    if (typeof arg0 === 'object' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' ) &&
                        (typeof arg3 === 'function' || typeof arg3 === 'undefined' )) {

                        return this.onSnapshotWithOptionsAndCallbacks(arg0 as ISnapshotListenOptions, arg1 as any, arg2 as any, arg3 as any);

                    }

                    throw new Error("Invalid arguments");

                }

                public limit(count: number): IQuery<ISnapshotMetadata> {
                    this._limit = count;
                    return this;
                }


                public offset(offset: number): IQuery<ISnapshotMetadata> {
                    throw new Error("Not implemented");
                }
                public orderBy(fieldPath: string, directionStr?: TOrderByDirection): IQuery<ISnapshotMetadata> {
                    this._order.push({fieldPath, directionStr});
                    return this;
                }

                public startAt(...fieldValues: readonly string[]): IQuery<ISnapshotMetadata> {
                    throw new Error("Not implemented");
                    // this._startAt = fieldValues;
                    // return this;
                }

                public startAfter(...fieldValues: readonly string[]): IQuery<ISnapshotMetadata> {
                    this._startAfter = fieldValues;
                    return this;
                }

            }

            function where(fieldPath: string, opStr: TWhereFilterOp, value: TWhereValue): IQuery<ISnapshotMetadata> {
                const _query = _collection.where(fieldPath, opStr, value);
                const query = new Query(_query, _collection);
                return query.where(fieldPath, opStr, value);
            }

            return {
                id: _collection.id,
                doc,
                where,
                get: (options?: IGetOptions): Promise<IQuerySnapshot<ISnapshotMetadata>> => {
                    throw new Error("not implemented");
                },
                limit: (count: number): IQuery<ISnapshotMetadata> => {
                    throw new Error("not implemented");
                },
                offset: (offset: number) => {
                    throw new Error("not implemented");
                },
                onSnapshot: () => {
                    throw new Error("not implemented");
                },
                orderBy: () => {
                    throw new Error("not implemented");
                },
                startAt: () => {
                    throw new Error("not implemented");
                },
                startAfter: () => {
                    throw new Error("not implemented");
                }
            }

        }

        interface BatchDelete {
            /**
             * Document ID.
             */
            readonly id: string;

            readonly type: 'delete';

            readonly documentRef: IDocumentReferenceClient;
        }

        interface BatchSet {
            /**
             * Document ID.
             */
            readonly id: string;

            readonly type: 'set';
            readonly documentRef: IDocumentReferenceClient;
            readonly data: TDocumentData;
        }

        type BatchOp = BatchDelete | BatchSet;

        class Batch implements IWriteBatchClient {

            private _batch = delegate.batch();

            private ops: readonly BatchOp[] = [];

            create(documentRef: IDocumentReferenceClient, data: TDocumentData): IWriteBatchClient {
                throw new Error("not implemented");
            }

            delete(documentRef: IDocumentReferenceClient): IWriteBatchClient {
                this.ops.push({id: documentRef.id, type: 'delete', documentRef});
                this._batch.delete(documentRef);
                return this;
            }

            // set(documentRef: IDocumentReferenceClient, data: TDocumentData): IWriteBatchClient {
            //     this.ops.push({id: documentRef.id, type: 'set', documentRef, data});
            //     this._batch.set(documentRef, data);
            //     return this;
            // }

            // update(documentRef: IDocumentReferenceClient, path: string, value: any): IWriteBatchClient {
            //     throw new Error("Not implemented");
            //     // this._batch.update(documentRef, path, data)
            //     // return this;
            // }

            set(a: any, b: any, c?: any): IWriteBatchClient {
                throw new Error("not implemented");
            }

            update(a: any, b: any, c?: any): IWriteBatchClient {
                throw new Error("not implemented");
            }

            async commit(): Promise<void> {

                const handleCacheMutation = async () => {

                    function toDoc(op: BatchOp): ICachedDoc {

                        switch (op.type) {

                            case "delete":

                                return {
                                    collection: op.documentRef.parent.id,
                                    id: op.id,
                                    exists: false,
                                    data: undefined
                                };

                            case "set":

                                return {
                                    collection: op.documentRef.parent.id,
                                    id: op.id,
                                    exists: true,
                                    data: op.data
                                }

                        }

                    }

                    function toCacheDocTuple(op: BatchOp): TCacheDocTupleWithID {
                        const cacheKey = cacheKeyCalculator.computeForDoc(op.documentRef.parent.id, op.documentRef);
                        const doc = toDoc(op);
                        return [cacheKey, doc];
                    }

                    cacheProvider.writeDocs({
                        docs: this.ops.map(toCacheDocTuple)
                    }).catch(err => console.error("Unable to update cache: ", err));

                }

                // TODO: don't await this... do it in the background so that the
                // cache latency isn't felt by the caller.
                await handleCacheMutation();

                await this._batch.commit();

            }

        }

        function batch(): IWriteBatchClient {
            return new Batch();
        }

        async function terminate() {
            await delegate.terminate();
        }

        async function clearPersistence() {
            await delegate.clearPersistence();
        }

        return {collection, batch, terminate, clearPersistence};

    }

}
