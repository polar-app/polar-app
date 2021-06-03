import {IGenericSnapshotMetadata} from "./IGenericSnapshotMetadata";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {IDStr} from "polar-shared/src/util/Strings";

export interface IGenericSnapshot<T> {
    readonly empty: boolean;
    readonly metadata: IGenericSnapshotMetadata;
    readonly docChanges: ReadonlyArray<IGenericDocumentChange<T>>;
}

export interface IDRecord {
    readonly id: IDStr;
}

export function createMockSnapshot<T extends IDRecord>(values: ReadonlyArray<T>): IGenericSnapshot<T> {

    const convertToDocChange = (value: T): IGenericDocumentChange<T> => {

        return {
            id: value.id,
            type: 'added',
            data: value
        }
    }

    return {
        empty: values.length === 0,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: values.map(current => convertToDocChange(current))
    };

}

export function createEmptySnapshot<T>(): IGenericSnapshot<T> {

    return {
        empty: true,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: []
    }

}
