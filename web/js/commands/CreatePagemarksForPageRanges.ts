import {DocMeta} from '../metadata/DocMeta';
import {Pagemarks} from '../metadata/Pagemarks';

export class CreatePagemarksForPageRanges {

    private readonly docMeta: DocMeta;

    constructor(docMeta: IDocMeta) {
        this.docMeta = docMeta;
    }

    public execute(options: any) {

        if (! options) {
            options = {};
        }

        for (let pageNum = options.range.start; pageNum < options.range.end; pageNum++) {

            console.log("Creating pagemark for page: " + pageNum);

            const pageMeta = this.docMeta.getPageMeta(pageNum);

            const pagemark = Pagemarks.create();

            Pagemarks.updatePagemark(this.docMeta, pageNum, pagemark);

        }

    }

}
