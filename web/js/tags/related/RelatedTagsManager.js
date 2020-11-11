"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatedTagsManager = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const Tags_1 = require("polar-shared/src/tags/Tags");
const LocalRelatedTagsStore_1 = require("./LocalRelatedTagsStore");
const Functions_1 = require("polar-shared/src/util/Functions");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const TagFilters_1 = require("polar-shared/src/tags/TagFilters");
class RelatedTagsManager {
    constructor(data) {
        this.tagDocsIndex = {};
        this.docTagsIndex = {};
        this.tagsIndex = {};
        this.persister = Functions_1.NULL_FUNCTION;
        if (data) {
            this.tagDocsIndex = data.tagDocsIndex;
            this.docTagsIndex = data.docTagsIndex;
            this.tagsIndex = data.tagsIndex;
        }
        else {
            this.persister = Debouncers_1.Debouncers.create(() => this.persist(), { interval: 5000 });
        }
    }
    tags() {
        return Object.values(this.tagsIndex);
    }
    update(docID, mutationType, tags) {
        const updateTagsIndex = () => {
            for (const tag of tags) {
                this.tagsIndex[tag.id] = tag;
            }
        };
        updateTagsIndex();
        const tagLabels = tags.map(current => current.label);
        for (const tagLabel of tagLabels) {
            const tagDocs = Dictionaries_1.Dictionaries.computeIfAbsent(this.tagDocsIndex, tagLabel, () => {
                return { tag: tagLabel, docs: {} };
            });
            switch (mutationType) {
                case 'set':
                    tagDocs.docs[docID] = true;
                    break;
                case 'delete':
                    delete tagDocs.docs[docID];
                    break;
            }
            const docMeta = Dictionaries_1.Dictionaries.computeIfAbsent(this.docTagsIndex, docID, () => {
                return { tags: [] };
            });
            docMeta.tags.push(tagLabel);
        }
        this.persister();
    }
    compute(tags, limit = 5) {
        const tagHits = {};
        const updateHits = (tag) => {
            const indexedTagMeta = this.tagDocsIndex[tag];
            if (!indexedTagMeta) {
                return;
            }
            const relatedDocIDs = indexedTagMeta.docs;
            for (const relatedDocID of Object.keys(relatedDocIDs)) {
                const indexedDocMeta = this.docTagsIndex[relatedDocID];
                const relatedTags = indexedDocMeta.tags;
                for (const relatedTag of relatedTags) {
                    const tagHitMeta = Dictionaries_1.Dictionaries.computeIfAbsent(tagHits, relatedTag, () => {
                        return { tag: relatedTag, hits: 0 };
                    });
                    ++tagHitMeta.hits;
                }
            }
        };
        tags = tags.filter(tag => !tag.startsWith('/'));
        for (const tag of tags) {
            updateHits(tag);
        }
        const tagHitsDesc = Object.values(tagHits)
            .filter(current => !tags.includes(current.tag))
            .filter(current => current.hits > 1)
            .sort((hit0, hit1) => hit1.hits - hit0.hits);
        return Arrays_1.Arrays.head(tagHitsDesc, limit);
    }
    toRelatedOptionsCalculator() {
        return (options) => {
            function toAutocompleteOption(tag) {
                return {
                    id: tag.id,
                    label: tag.label,
                    value: tag
                };
            }
            const tags = options.map(current => current.label);
            return this.compute(tags)
                .map(current => current.tag)
                .map(Tags_1.Tags.create)
                .filter(TagFilters_1.TagFilters.onlyRegular)
                .map(toAutocompleteOption);
        };
    }
    toExternal() {
        return {
            tagDocsIndex: this.tagDocsIndex,
            docTagsIndex: this.docTagsIndex,
            tagsIndex: this.tagsIndex
        };
    }
    persist() {
        LocalRelatedTagsStore_1.LocalRelatedTagsStore.write(this.toExternal());
    }
}
exports.RelatedTagsManager = RelatedTagsManager;
//# sourceMappingURL=RelatedTagsManager.js.map