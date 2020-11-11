"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataObjectIndex = void 0;
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const ForwardTagToDocIDIndex_1 = require("./ForwardTagToDocIDIndex");
const ReverseDocIDToTagIndex_1 = require("./ReverseDocIDToTagIndex");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class TagIndex {
    constructor() {
        this.forward = new ForwardTagToDocIDIndex_1.ForwardTagToDocIDIndex();
        this.reverse = new ReverseDocIDToTagIndex_1.ReverseDocIDToTagIndex();
    }
    prune() {
        this.forward.purge(value => value.count() === 0);
    }
    tagged(tag) {
        return this.forward.get(tag).toArray();
    }
    set(docID, tags) {
        const existingTags = this.reverse.get(docID).toArray();
        for (const tag of tags) {
            this.forward.get(tag).add(docID);
        }
        this.reverse.get(docID).set(tags.map(tag => tag.id));
        const removeTags = SetArrays_1.SetArrays.difference(existingTags, tags.map(tag => tag.id));
        for (const removeTag of removeTags) {
            const existingTagMembers = this.forward.getWithKey(removeTag);
            if (existingTagMembers) {
                existingTagMembers.delete(docID);
            }
        }
    }
    delete(docID, tags) {
        for (const tag of tags) {
            const set = this.forward.get(tag);
            set.delete(docID);
            if (set.count() === 0) {
                this.forward.delete(tag.id);
            }
        }
    }
    toTagDescriptors() {
        return this.forward.values().map(current => {
            return Object.assign(Object.assign({}, current.key), { count: current.count(), members: current.toArray() });
        });
    }
}
class DataObjectIndex {
    constructor(toTags) {
        this.toTags = toTags;
        this.index = {};
        this.tagIndex = new TagIndex();
    }
    prune() {
        this.tagIndex.prune();
    }
    tagged(tag) {
        return this.tagIndex.tagged(tag);
    }
    contains(key) {
        return Preconditions_1.isPresent(this.index[key]);
    }
    get(key) {
        const value = this.index[key];
        if (value) {
            return value;
        }
        return undefined;
    }
    put(key, data) {
        this.index[key] = data;
        const tags = this.toTags(data);
        this.tagIndex.set(key, tags);
    }
    delete(key) {
        const value = this.index[key];
        delete this.index[key];
        this.tagIndex.delete(key, this.toTags(value));
    }
    values() {
        return Object.values(this.index);
    }
    size() {
        return Object.keys(this.index).length;
    }
    toTagDescriptors() {
        return this.tagIndex.toTagDescriptors();
    }
}
exports.DataObjectIndex = DataObjectIndex;
//# sourceMappingURL=DataObjectIndex.js.map