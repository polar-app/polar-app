import { IDocumentReference } from "./IDocumentReference";
import { IQuery } from "./IQuery";
import {IDocumentSnapshot} from "./IDocumentSnapshot";

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

export interface ICollectionReference<SM> {

    /** The collection's identifier. */
    readonly id: string;

    readonly doc: (documentPath?: string) => IDocumentReference<SM>;

    readonly where: (fieldPath: string, opStr: TWhereFilterOp, value: any) => IQuery<SM>;

    // readonly get(options?: IGetOptions) => Promise<QuerySnapshot<T>>;

    // FIXME doc
    // FIXME onSnapshot

}
