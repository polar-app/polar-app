"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocAnnotationIndex = void 0;
const DocAnnotation_1 = require("./DocAnnotation");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Refs_1 = require("polar-shared/src/metadata/Refs");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const SetMultimap_1 = require("polar-shared/src/util/SetMultimap");
class DocAnnotationIndex {
    constructor(docAnnotationMap = {}) {
        this.lookup = {};
        this.children = new SetMultimap_1.SetMultimap((value) => value, value => value.id);
        this.parents = {};
        this.lookup = docAnnotationMap;
    }
    get(id) {
        return Optional_1.Optional.of(this.lookup[id]).getOrUndefined();
    }
    put(...docAnnotations) {
        for (const docAnnotation of docAnnotations) {
            const entry = new DocAnnotation_1.DefaultDocAnnotation(this, docAnnotation);
            if (docAnnotation.ref) {
                const parsedRef = Refs_1.Refs.parse(docAnnotation.ref);
                this._addChild(parsedRef.value, entry);
            }
            else {
                this.lookup[docAnnotation.id] = entry;
            }
        }
    }
    set(...docAnnotations) {
        const deleteAnnotations = () => {
            const existing = this.getDocAnnotations();
            const existingIDs = existing.map(current => current.id);
            const newIDs = docAnnotations.map(current => current.id);
            const deleteIDs = SetArrays_1.SetArrays.difference(existingIDs, newIDs);
            deleteIDs.forEach(deleteID => this.delete(deleteID));
        };
        const putNewAnnotations = () => {
            this.put(...docAnnotations);
        };
        deleteAnnotations();
        putNewAnnotations();
    }
    delete(id) {
        const parent = this._getParent(id);
        if (parent) {
            this._removeChild(parent.id, id);
        }
        delete this.lookup[id];
        this.children.delete(id);
    }
    getDocAnnotations() {
        return Object.values(this.lookup);
    }
    getDocAnnotationsSorted() {
        const computeScore = (item) => {
            return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;
        };
        const compareFn = (a, b) => {
            const diff = computeScore(a) - computeScore(b);
            if (diff === 0) {
                return a.id.localeCompare(b.id);
            }
            return diff;
        };
        return Object.values(this.lookup)
            .sort(compareFn);
    }
    _getParent(id) {
        const pid = this.parents[id];
        if (pid) {
            return this.lookup[pid];
        }
        return undefined;
    }
    _getChildren(id) {
        return this.children.get(id);
    }
    _setChildren(id, children) {
        this.children.putAll(id, children);
    }
    _addChild(id, docAnnotation) {
        this.children.put(id, docAnnotation);
        this.parents[docAnnotation.id] = id;
    }
    _removeChild(id, child) {
        this.children.filter(id, (value) => value.id !== child);
        delete this.parents[child];
    }
}
exports.DocAnnotationIndex = DocAnnotationIndex;
//# sourceMappingURL=DocAnnotationIndex.js.map