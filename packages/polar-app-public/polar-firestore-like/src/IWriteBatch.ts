import {IDocumentReference} from "./IDocumentReference";
import {TDocumentData} from "./TDocumentData";
import {ISnapshotMetadata} from "./ISnapshotMetadata";
import { TUpdateData } from "./TUpdateData";

export type TFieldPath = any;

export interface ISetOptions {
    /**
     * Changes the behavior of a set() call to only replace the values specified
     * in its data argument. Fields omitted from the set() call remain
     * untouched.
     */
    readonly merge?: boolean;

    /**
     * Changes the behavior of set() calls to only replace the specified field
     * paths. Any field path that is not specified is ignored and remains
     * untouched.
     */
    readonly mergeFields?: (string /* | FieldPath */)[];
}

export interface IWriteBatch<SM> {

    create(documentRef: IDocumentReference<SM>, data: TDocumentData): IWriteBatch<SM>;

    /**
     * The implementation needs to delete this from the cache.
     */
    delete(documentRef: IDocumentReference<SM>): IWriteBatch<SM>;

    set(documentRef: IDocumentReference<SM>, data: TDocumentData): IWriteBatch<SM>;

    set<T>(
        documentRef: IDocumentReference<T>,
        data: Partial<T>,
        options: ISetOptions
    ): IWriteBatch<SM>;

    update(documentRef: IDocumentReference<any>, data: TUpdateData): IWriteBatch<SM>;

    update(documentRef: IDocumentReference<SM>, field: string | TFieldPath, value: any): IWriteBatch<SM>;

    // update(
    //     documentRef: DocumentReference<any>,
    //     field: string | FieldPath,
    //     value: any,
    //     ...moreFieldsAndValues: any[]
    // ): WriteBatch;

    commit(): Promise<void>;

}

export interface IWriteBatchClient extends IWriteBatch<ISnapshotMetadata> {

}



