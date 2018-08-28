import {DocMeta} from '../metadata/DocMeta';
import {Pagemarks} from '../metadata/Pagemarks';

export class CreatePagemarksForPageRanges {

    private readonly docMeta: DocMeta;

    constructor(docMeta: DocMeta) {
        this.docMeta = docMeta;
    }

    execute(options: any) {

        if(! options) {
            options = {};
        }

        for (let pageNum = options.range.start; pageNum < options.range.end; pageNum++) {

            console.log("Creating pagemark for page: " + pageNum);

            let pageMeta = this.docMeta.getPageMeta(pageNum);

            let pagemark = Pagemarks.create();

            Pagemarks.updatePagemark(this.docMeta, pageNum, pagemark);

        }

    }

}
