import {IGenericSnapshotMetadata} from "./IGenericSnapshotMetadata";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {IDStr} from "polar-shared/src/util/Strings";

export interface IGenericCollectionSnapshot<T> {
    readonly empty: boolean;
    readonly metadata: IGenericSnapshotMetadata;
    readonly docs: ReadonlyArray<T>;
    readonly docChanges: ReadonlyArray<IGenericDocumentChange<T>>;
}

export interface IDRecord {
    readonly id: IDStr;
}

export function createMockSnapshot<T extends IDRecord>(values: ReadonlyArray<T>): IGenericCollectionSnapshot<T> {

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
        docs: values,
        docChanges: values.map(current => convertToDocChange(current))
    };

}

export function createEmptySnapshot<T>(): IGenericCollectionSnapshot<T> {

    return {
        empty: true,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docs: [],
        docChanges: []
    }

}
