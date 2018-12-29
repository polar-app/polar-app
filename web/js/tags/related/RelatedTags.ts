import {Dictionaries} from "../../util/Dictionaries";
import {Arrays} from "../../util/Arrays";

/**
 * Related tag index for in memory related tags computation.  This does not
 * actually implement any form of compressed data structure but instead stores
 * the values directly.  A users personal document tag index won't require
 * much in-memory storage.  Maybe 100k MAX even for massive document
 * collections.
 */
export class RelatedTags {

    private tagMetaIndex: {[tag: string]: TagMeta} = {};

    private docMetaIndex: {[docID: string]: DocMeta} = {};

    public update(docID: DocID, mutationType: MutationType, ...tags: TagLiteral[]) {

        for (const tag of tags) {

            const tagMeta = Dictionaries.computeIfAbsent(this.tagMetaIndex, tag, () => {
                return {tag, docs: new Set<DocID>()};
            });

            switch (mutationType) {

                case 'set':
                    tagMeta.docs.add(docID);
                    break;

                case 'delete':
                    tagMeta.docs.delete(docID);
                    break;

            }

            const docMeta = Dictionaries.computeIfAbsent(this.docMetaIndex, docID, () => {
                return {doc: docID, tags: []};
            });

            docMeta.tags.push(tag);

        }

    }

    /**
     * Compute related tags for the given tags...
     * @param tags
     */
    public compute(tags: TagLiteral[], limit: number = 3): TagHit[] {

        // keep a running index of the hits when computing the related tags.
        const tagHits: {[tag: string]: TagHit} = {};

        const updateHits = (tag: TagLiteral) => {

            // get all the documents that mention this tag

            const indexedTagMeta = this.tagMetaIndex[tag];

            const relatedDocs = indexedTagMeta.docs;

            for (const relatedDoc of relatedDocs) {

                const indexedDocMeta = this.docMetaIndex[relatedDoc];

                const relatedTags = indexedDocMeta.tags;

                for (const relatedTag of relatedTags) {

                    const tagHitMeta = Dictionaries.computeIfAbsent(tagHits, relatedTag, () => {
                        return {tag: relatedTag, hits: 0};
                    });

                    ++tagHitMeta.hits;

                }

            }

        };

        for (const tag of tags) {
            updateHits(tag);
        }

        // we now have all the tags with hits.. so score them and then compute
        // the top N for now.

        const tagHitsDesc = Object.values(tagHits)
            // remove the input tags from the results...
            .filter(current => ! tags.includes(current.tag))
            // sort the results descending.
            .sort((hit0, hit1) => hit1.hits - hit0.hits);


        return Arrays.head(tagHitsDesc, limit);

    }

}

export interface TagMeta {
    readonly tag: TagLiteral;
    readonly docs: Set<DocID>;
}

export interface DocMeta {
    tags: string[];
}

export interface TagHit {

    readonly tag: TagLiteral;
    hits: number;

}

export type DocID = string;

/**
 * A literal tag value as a string.
 */
export type TagLiteral = string;

export type MutationType = 'set' | 'delete';
