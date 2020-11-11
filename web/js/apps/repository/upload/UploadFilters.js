"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFilters = void 0;
var UploadFilters;
(function (UploadFilters) {
    function filterByDocumentName(value) {
        const name = value.name.toLowerCase();
        return name.endsWith(".pdf") || name.endsWith(".epub");
    }
    UploadFilters.filterByDocumentName = filterByDocumentName;
    function filterByDocumentType(value) {
        const types = ['application/pdf', 'application/epub+zip'];
        return value.type !== undefined &&
            types.includes(value.type.toLowerCase());
    }
    UploadFilters.filterByDocumentType = filterByDocumentType;
})(UploadFilters = exports.UploadFilters || (exports.UploadFilters = {}));
//# sourceMappingURL=UploadFilters.js.map