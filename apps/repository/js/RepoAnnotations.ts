import {TextHighlight} from '../../../web/js/metadata/TextHighlight';
import {AreaHighlight} from '../../../web/js/metadata/AreaHighlight';
import {DocInfo} from '../../../web/js/metadata/DocInfo';
import {RepoAnnotation} from './RepoAnnotation';
import {AnnotationType} from '../../../web/js/metadata/AnnotationType';
import {DocMeta} from '../../../web/js/metadata/DocMeta';

export class RepoAnnotations {

    public static convert(docMeta: DocMeta): RepoAnnotation[] {

        const result: RepoAnnotation[] = [];
        const docInfo = docMeta.docInfo;

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const textHighlights = Object.values(pageMeta.textHighlights) || {};
            const areaHighlights = Object.values(pageMeta.areaHighlights) || {};

            for (const textHighlight of textHighlights) {
                result.push(this.toRepoAnnotation(textHighlight, AnnotationType.TEXT_HIGHLIGHT, docInfo));
            }

            for (const areaHighlight of areaHighlights) {
                result.push(this.toRepoAnnotation(areaHighlight, AnnotationType.AREA_HIGHLIGHT, docInfo));
            }

        }

        return result;

    }

    public static toRepoAnnotation(from: TextHighlight | AreaHighlight,
                                   type: AnnotationType,
                                   docInfo: DocInfo): RepoAnnotation {

        return {
            fingerprint: docInfo.fingerprint,
            text: "This is an example",
            type,
            created: from.created,
            tags: docInfo.tags || {},
            docInfo
        };

    }

}
