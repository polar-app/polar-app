import {DocMeta, IDocMeta} from './DocMeta';
import {forDict} from '../util/Functions';

export class DocMetaDescriber {

    public static describe(docMeta: IDocMeta) {

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

        return `Doc stats - pages: ${docMeta.docInfo.nrPages}, text highlights: ${nrTextHighlights}, pagemarks: ${nrPagemarks}`;

    }

}
