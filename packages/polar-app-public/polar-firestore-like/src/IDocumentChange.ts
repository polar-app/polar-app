import {IQueryDocumentSnapshot} from "./IQueryDocumentSnapshot";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

export type TDocumentChangeType = 'added' | 'modified' | 'removed';

export interface IDocumentChange<SM> {

    /**
     * The ID of the document.
     */
    readonly id: string;

    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: TDocumentChangeType;

    /** The document affected by this change. */
    readonly doc: IQueryDocumentSnapshot<SM>;

}

export interface IDocumentChangeClient extends IDocumentChange<ISnapshotMetadata> {

}
