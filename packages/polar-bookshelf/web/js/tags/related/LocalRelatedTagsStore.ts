import {IRelatedTagsData} from "./RelatedTagsManager";

export namespace LocalRelatedTagsStore {

    export function write(data: IRelatedTagsData) {

        if (typeof localStorage === "undefined") {
            return;
        }

        localStorage.setItem('related-tags', JSON.stringify(data));
    }

    export function read(): IRelatedTagsData | undefined {

        if (typeof localStorage === "undefined") {
            return undefined;
        }

        const data = localStorage.getItem('related-tags');

        if (! data) {
            return undefined;
        }

        return JSON.parse(data);

    }

}
