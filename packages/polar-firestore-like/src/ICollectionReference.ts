import { IDocumentReference } from "./IDocumentReference";
import { IQuery } from "./IQuery";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

export type TWhereFilterOp =
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
    | 'not-in';

export type TWhereValue = number | string;

export interface IWhereClause {
    readonly fieldPath: string,
    readonly opStr: TWhereFilterOp;
    readonly value: TWhereValue;
}

export interface ICollectionReference<SM> extends IQuery<SM> {

    /** The collection's identifier. */
    readonly id: string;

    // FIXME admin SDK has get vs doc?
    readonly doc: (documentPath?: string) => IDocumentReference<SM>;

    readonly where: (fieldPath: string, opStr: TWhereFilterOp, value: any) => IQuery<SM>;

    // readonly get(options?: IGetOptions) => Promise<QuerySnapshot<T>>;

    // FIXME doc
    // FIXME onSnapshot

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICollectionReferenceClient extends ICollectionReference<ISnapshotMetadata> {

}
