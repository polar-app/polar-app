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

    public static toRepoAnnotation(sourceAnnotation: TextHighlight | AreaHighlight,
                                   type: AnnotationType,
                                   docInfo: DocInfo): RepoAnnotation {

        // code shared with DocAnnotations and we should refactor to
        // standardize.

        let text: string | undefined;

        if ((<any> sourceAnnotation).text) {

            console.log("FIXME1: ");

            const sourceText: any = (<any> sourceAnnotation).text;

            if (sourceText.TEXT) {
                console.log("FIXME2: ");
                text = sourceText.TEXT;
            }

            if (sourceText.HTML) {
                console.log("FIXME3: ");
                text = sourceText.HTML;
            }

        } else {
            console.log("FIXME4: ");

        }

        return {
            id: sourceAnnotation.id,
            fingerprint: docInfo.fingerprint,
            text,
            type,
            created: sourceAnnotation.created,
            tags: docInfo.tags || {},
            docInfo
        };

    }

}
