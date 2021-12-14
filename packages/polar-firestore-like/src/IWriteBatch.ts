import {IDocumentReference} from "./IDocumentReference";
import {TDocumentData} from "./TDocumentData";
import {ISnapshotMetadata} from "./ISnapshotMetadata";
import {TUpdateData} from "./TUpdateData";
import {ISetOptions} from "./ISetOptions";

export type TFieldPath = any;

export interface IWriteBatch<SM> {

    /**
     * Create the document referred to by the provided `DocumentReference`. The
     * operation will fail the batch if a document exists at the specified
     * location.
     *
     * @param documentRef A reference to the document to be created.
     * @param data The object data to serialize as the document.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    create(documentRef: IDocumentReference<SM>, data: TDocumentData): IWriteBatch<SM>;

    /**
     * Deletes the document referred to by the provided `DocumentReference`.
     *
     * @param documentRef A reference to the document to be deleted.
     * @param precondition A Precondition to enforce for this delete.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    delete(documentRef: IDocumentReference<SM> /*, precondition: IPrecondition */ ): IWriteBatch<SM>;

    set(documentRef: IDocumentReference<SM>, data: TDocumentData): IWriteBatch<SM>;

    /**
     * Write to the document referred to by the provided `DocumentReference`.
     * If the document does not exist yet, it will be created. If you pass
     * `SetOptions`, the provided data can be merged into the existing document.
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
     * @param options An object to configure the set behavior.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    set<T>(
        documentRef: IDocumentReference<T>,
        data: Partial<T>,
        options: ISetOptions
    ): IWriteBatch<SM>;

    update(documentRef: IDocumentReference<any>, data: TUpdateData /*, precondition: IPrecondition */): IWriteBatch<SM>;

    update(documentRef: IDocumentReference<SM>, field: string | TFieldPath, value: any): IWriteBatch<SM>;

    // update(
    //     documentRef: DocumentReference<any>,
    //     field: string | FieldPath,
    //     value: any,
    //     ...moreFieldsAndValues: any[]
    // ): WriteBatch;

    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * @return A Promise resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit.
     */
    commit(): Promise<void>;

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWriteBatchClient extends IWriteBatch<ISnapshotMetadata> {

}



