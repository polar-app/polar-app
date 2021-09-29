import {IDocumentReference} from "./IDocumentReference";
import {TDocumentData} from "./TDocumentData";
import {ISnapshotMetadata} from "./ISnapshotMetadata";
import { TUpdateData } from "./TUpdateData";
import {ISetOptions} from "./ISetOptions";

export type TFieldPath = any;

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWriteBatchClient extends IWriteBatch<ISnapshotMetadata> {

}



