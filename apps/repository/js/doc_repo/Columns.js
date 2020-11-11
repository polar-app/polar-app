"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLUMN_MAP = exports.DOC_BUTTON_COLUMN_WIDTH = exports.COLUMNS = void 0;
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
exports.COLUMNS = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title', width: 'auto', defaultOrder: 'asc' },
    { id: 'added', numeric: false, disablePadding: true, label: 'Added', width: '7em', defaultOrder: 'desc' },
    { id: 'lastUpdated', numeric: false, disablePadding: true, label: 'Updated', width: '7em', defaultOrder: 'desc' },
    { id: 'month', numeric: false, disablePadding: true, label: 'Month', width: '7em', defaultOrder: 'asc' },
    { id: 'year', numeric: false, disablePadding: true, label: 'Year', width: '7em', defaultOrder: 'asc' },
    { id: 'volume', numeric: false, disablePadding: true, label: 'Volume', width: '15em', defaultOrder: 'asc' },
    { id: 'edition', numeric: false, disablePadding: true, label: 'Edition', width: '15em', defaultOrder: 'asc' },
    { id: 'journal', numeric: false, disablePadding: true, label: 'Journal', width: '15em', defaultOrder: 'asc' },
    { id: 'publisher', numeric: false, disablePadding: true, label: 'Publisher', width: '15em', defaultOrder: 'asc' },
    { id: 'issn', numeric: false, disablePadding: true, label: 'ISSN', width: '15em', defaultOrder: 'asc' },
    { id: 'isbn', numeric: false, disablePadding: true, label: 'ISBN', width: '15em', defaultOrder: 'asc' },
    { id: 'doi', numeric: false, disablePadding: true, label: 'DOI', width: '15em', defaultOrder: 'asc' },
    { id: 'pmid', numeric: false, disablePadding: true, label: 'PMID', width: '15em', defaultOrder: 'asc' },
    { id: 'tags', numeric: false, disablePadding: true, label: 'Tags', width: '250px', defaultOrder: 'asc' },
    { id: 'keywords', numeric: false, disablePadding: true, label: 'Keywords', width: '250px', defaultOrder: 'asc' },
    { id: 'authors', numeric: true, disablePadding: true, label: 'Authors', width: '250px', defaultOrder: 'asc' },
    { id: 'editor', numeric: true, disablePadding: true, label: 'Editors', width: '250px', defaultOrder: 'asc' },
    { id: 'progress', numeric: true, disablePadding: true, label: 'Progress', width: '75px', defaultOrder: 'desc' },
];
exports.DOC_BUTTON_COLUMN_WIDTH = '130px';
exports.COLUMN_MAP = ArrayStreams_1.arrayStream(exports.COLUMNS)
    .toMap(current => current.id);
//# sourceMappingURL=Columns.js.map