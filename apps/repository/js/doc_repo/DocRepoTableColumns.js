"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoTableColumns = void 0;
class DocRepoTableColumns {
    constructor() {
        this.title = {
            id: "title",
            label: "Title",
            selected: true,
            title: "The main title the document."
        };
        this.lastUpdated = {
            id: "lastUpdated",
            label: "Updated",
            selected: true,
            title: "The last time the documented was updated (tagged, annotated, etc)."
        };
        this.added = {
            id: "added",
            label: "Added",
            selected: true
        };
        this.progress = {
            id: "progress",
            label: "Progress",
            selected: true
        };
        this.tags = {
            id: "tags",
            label: "Tags",
            selected: true,
        };
        this.folders = {
            id: "folders",
            label: "Folders",
            selected: false,
        };
        this.nrAnnotations = {
            id: "nrAnnotations",
            label: "Annotations",
            selected: false,
            title: "The number of annotations in the document (comments, highlights, etc)."
        };
        this.flagged = {
            id: "flagged",
            label: "Flagged",
            selected: true
        };
        this.archived = {
            id: "archived",
            label: "Archived",
            selected: true
        };
        this.site = {
            id: "site",
            label: "Site",
            selected: false
        };
    }
}
exports.DocRepoTableColumns = DocRepoTableColumns;
//# sourceMappingURL=DocRepoTableColumns.js.map