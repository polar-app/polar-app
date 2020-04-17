import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export interface ColumnDescriptor {
    disablePadding: boolean;
    id: keyof RepoDocInfo;
    label: string;
    numeric: boolean;
    width?: number;
}

export interface ColumnDescriptorMap {
    [id: string]: ColumnDescriptor;
}

export const COLUMNS: ReadonlyArray<ColumnDescriptor> = [
    { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
    { id: 'added', numeric: false, disablePadding: false, label: 'Added', width: 75 },
    { id: 'lastUpdated', numeric: false, disablePadding: true, label: 'Last Updated' },
    { id: 'tags', numeric: true, disablePadding: false, label: 'Tags' },
    { id: 'progress', numeric: true, disablePadding: true, label: 'Progress' },
]

export const COLUMN_MAP: ColumnDescriptorMap =
    arrayStream(COLUMNS)
       .toMap(current => current.id);

