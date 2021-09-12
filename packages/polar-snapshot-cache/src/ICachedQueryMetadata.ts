/**
 * The metadata for a cached query including the collection, clauses, limit, and
 * orderBy used.
 */
import {IWhereClause} from "polar-firestore-like/src/ICollectionReference";
import {IQueryOrderBy} from "polar-firestore-like/src/IQuery";

export interface ICachedQueryMetadata {

    readonly collection: string;

    readonly clauses: ReadonlyArray<IWhereClause>;

    readonly limit: number | undefined;

    readonly order: ReadonlyArray<IQueryOrderBy>;

}
