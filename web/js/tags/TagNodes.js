"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagNodeIndex = exports.TagNodes = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const TagPaths_1 = require("./TagPaths");
const Tags_1 = require("polar-shared/src/tags/Tags");
const Sets_1 = require("polar-shared/src/util/Sets");
class TagNodes {
    static createTagsRoot(tags) {
        const comparator = (a, b) => {
            const diff = b.count - a.count;
            if (diff !== 0) {
                return diff;
            }
            return a.label.localeCompare(b.label);
        };
        const children = [...tags]
            .sort(comparator)
            .filter(tagDescriptor => !tagDescriptor.label.startsWith('/'))
            .map(tagDescriptor => {
            return {
                id: tagDescriptor.id,
                name: tagDescriptor.label,
                path: tagDescriptor.id,
                children: [],
                count: tagDescriptor.count,
                value: tagDescriptor,
            };
        });
        const tagMembership = this.computeTagMembership(tags);
        const name = 'Tags';
        const root = Object.assign(Object.assign({ id: '/#tags', name, path: '/', children }, tagMembership), { title: name, value: Object.assign({ id: '/', label: name }, tagMembership) });
        return root;
    }
    static computeTagMembership(tags) {
        const set = new Set();
        const filtered = tags.filter(current => current.label !== '/');
        for (const tag of filtered) {
            for (const member of tag.members) {
                set.add(member);
            }
        }
        const count = set.size;
        const members = Sets_1.Sets.toArray(set);
        return { count, members };
    }
    static createFoldersRoot(opts) {
        const { tags } = opts;
        const tagIndex = {};
        for (const tag of tags) {
            if (!tag.label.startsWith("/")) {
                continue;
            }
            tagIndex[tag.label] = tag;
        }
        const tagNodeIndex = new TagNodeIndex();
        const tagMembership = this.computeTagMembership(tags);
        const root = tagNodeIndex.register('/', '/', Object.assign({ id: '/', label: '/' }, tagMembership));
        const sortedTagIndexKeys = Object.keys(tagIndex).sort();
        for (const tagLabel of sortedTagIndexKeys) {
            let pathEntries = TagPaths_1.TagPaths.createPathEntries(tagLabel);
            for (const pathEntry of pathEntries) {
                if (pathEntry.parent) {
                    const parent = tagNodeIndex.get(pathEntry.parent.path);
                    if (!tagNodeIndex.contains(pathEntry.path)) {
                        const computeVirtualTagFromPathEntry = () => {
                            if (tagIndex[pathEntry.path]) {
                                return tagIndex[pathEntry.path];
                            }
                            const virtualTag = Tags_1.Tags.create(pathEntry.path);
                            return Object.assign(Object.assign({}, virtualTag), { members: [], count: 0 });
                        };
                        const virtualTag = computeVirtualTagFromPathEntry();
                        const newNode = tagNodeIndex.register(pathEntry.path, pathEntry.basename, virtualTag);
                        parent.children.push(newNode);
                    }
                }
            }
        }
        return root;
    }
    static decorate(node, decorator) {
        const value = decorator(node.value);
        const children = node.children.map(child => this.decorate(child, decorator));
        return {
            id: node.id,
            name: node.name,
            path: node.path,
            count: node.count,
            children,
            value
        };
    }
}
exports.TagNodes = TagNodes;
class TagNodeIndex {
    constructor() {
        this.index = {};
    }
    register(path, name, value) {
        if (!this.index[path]) {
            this.index[path] = {
                id: value.id,
                name,
                path,
                children: [],
                count: value.count,
                value
            };
        }
        return this.index[path];
    }
    contains(path) {
        return Preconditions_1.isPresent(this.index[path]);
    }
    get(path) {
        return this.index[path];
    }
}
exports.TagNodeIndex = TagNodeIndex;
//# sourceMappingURL=TagNodes.js.map