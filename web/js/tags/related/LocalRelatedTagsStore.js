"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalRelatedTagsStore = void 0;
var LocalRelatedTagsStore;
(function (LocalRelatedTagsStore) {
    function write(data) {
        localStorage.setItem('related-tags', JSON.stringify(data));
    }
    LocalRelatedTagsStore.write = write;
    function read() {
        const data = localStorage.getItem('related-tags');
        if (!data) {
            return undefined;
        }
        return JSON.parse(data);
    }
    LocalRelatedTagsStore.read = read;
})(LocalRelatedTagsStore = exports.LocalRelatedTagsStore || (exports.LocalRelatedTagsStore = {}));
//# sourceMappingURL=LocalRelatedTagsStore.js.map