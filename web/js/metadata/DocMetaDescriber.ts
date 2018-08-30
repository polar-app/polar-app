import {DocMeta} from './DocMeta';
import {forDict} from '../util/Functions';

export class DocMetaDescriber {

    static describe(docMeta: DocMeta) {

        let nrPagemarks = 0;
        let nrTextHighlights = 0;

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            forDict(pageMeta.pagemarks, (id, pagemark) => {
                ++nrPagemarks;
            });

            forDict(pageMeta.textHighlights, (id, textHighlight) => {
                ++nrTextHighlights;
            });

        });

        return `Doc with ${docMeta.docInfo.nrPages} pages with ${nrTextHighlights} text highlights and ${nrPagemarks} pagemarks.`;

    }

}
