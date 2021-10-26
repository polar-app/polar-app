import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Tag, TagStr} from "polar-shared/src/tags/Tags";
import {IAnnotation} from "polar-shared/src/metadata/IAnnotation";

export class DocMetaTags {

    public static toTags(docMeta: IDocMeta): ReadonlyArray<TagStr> {

        class TagIndex {

            private tags: {readonly [id: string]: TagStr} = {};

            public registerTags(tags: {readonly [id: string]: Tag} | undefined) {

                if (! tags) {
                    return;
                }

                for (const tag of Object.values(tags || {})) {
                    this.tags[tag.label] = tag.label;
                }

            }

            public registerAnnotations(annotations: {readonly [id: string]: IAnnotation}) {

                for (const annotation of Object.values(annotations || {})) {
                    index.registerTags(annotation.tags);
                }

            }

            public toTags(): ReadonlyArray<TagStr> {
                return Object.values(this.tags);
            }

        }

        const index = new TagIndex();

        index.registerTags(docMeta.docInfo.tags);

        for (const pageInfo of Object.values(docMeta.pageMetas || {})) {
            index.registerAnnotations(pageInfo.textHighlights);
            index.registerAnnotations(pageInfo.areaHighlights);
            index.registerAnnotations(pageInfo.flashcards);
        }

        return index.toTags();

    }

}
