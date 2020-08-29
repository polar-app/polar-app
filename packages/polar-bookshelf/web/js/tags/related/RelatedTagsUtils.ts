import {DocTagsIndex, TagDocsIndex} from "./RelatedTagsManager";

export namespace RelatedTagsUtils {

    // FIXME: don't we need the type (documents or annotations)
    export interface RelatedTagsData {
        readonly tagDocsIndex: TagDocsIndex;
        readonly docTagsIndex: DocTagsIndex;
    }

    export function writer(data: RelatedTagsData) {
        localStorage.setItem('related-tags', JSON.stringify(data));
    }

    export function reader(): RelatedTagsData | undefined {
        const data = localStorage.getItem('related-tags');

        if (! data) {
            return undefined;
        }

        return JSON.parse(data);
    }

}
