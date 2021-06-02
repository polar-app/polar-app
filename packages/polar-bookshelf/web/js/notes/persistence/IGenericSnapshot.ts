import {IGenericSnapshotMetadata} from "./IGenericSnapshotMetadata";
import {IGenericDocumentChange} from "./IGenericDocumentChange";

export interface IGenericSnapshot<T> {
    readonly empty: boolean;
    readonly metadata: IGenericSnapshotMetadata;
    readonly docChanges: ReadonlyArray<IGenericDocumentChange<T>>;
}
