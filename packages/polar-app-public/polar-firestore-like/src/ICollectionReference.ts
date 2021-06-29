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

export interface ICollectionReference<DS extends IDocumentSnapshot = IDocumentSnapshot> {

    /** The collection's identifier. */
    readonly id: string;

    readonly doc: (documentPath?: string) => IDocumentReference<DS>;

    readonly where: (fieldPath: string, opStr: TWhereFilterOp, value: any) => IQuery;

    // readonly get(options?: IGetOptions) => Promise<QuerySnapshot<T>>;

    // FIXME doc
    // FIXME onSnapshot

}
