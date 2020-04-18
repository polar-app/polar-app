import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Sorting} from "./Sorting";

export interface ColumnDescriptor {
    disablePadding: boolean;
    id: keyof RepoDocInfo;
    label: string;
    numeric: boolean;
    width: string;
    defaultOrder: Sorting.Order;
}

export interface ColumnDescriptorMap {
    [id: string]: ColumnDescriptor;
}

// export const COLUMNS: ReadonlyArray<ColumnDescriptor> = [
//     { id: 'title', numeric: false, disablePadding: true, label: 'Title', width: '100%' },
//     { id: 'added', numeric: false, disablePadding: true, label: 'Added', width: '8em' },
//     { id: 'lastUpdated', numeric: false, disablePadding: true, label: 'Last Updated', width: '8em' },
//     { id: 'tags', numeric: true, disablePadding: false, label: 'Tags', width: 'auto' },
//     { id: 'progress', numeric: true, disablePadding: true, label: 'Progress', width: '75px' },
// ];

export const COLUMNS: ReadonlyArray<ColumnDescriptor> = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title', width: 'auto', defaultOrder: 'asc' },
    { id: 'added', numeric: false, disablePadding: true, label: 'Added', width: '8em', defaultOrder: 'desc' },
    { id: 'lastUpdated', numeric: false, disablePadding: true, label: 'Last Updated', width: '8em', defaultOrder: 'desc' },
    { id: 'tags', numeric: true, disablePadding: true, label: 'Tags', width: '250px', defaultOrder: 'asc' },
    { id: 'progress', numeric: true, disablePadding: true, label: 'Progress', width: '75px', defaultOrder: 'desc' },
];

export const DOC_BUTTON_COLUMN_WIDTH = '135px';

export const COLUMN_MAP: ColumnDescriptorMap =
    arrayStream(COLUMNS)
       .toMap(current => current.id);

