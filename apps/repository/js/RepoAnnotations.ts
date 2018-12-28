import {TextHighlight} from '../../../web/js/metadata/TextHighlight';
import {AreaHighlight} from '../../../web/js/metadata/AreaHighlight';
import {Comment} from '../../../web/js/metadata/Comment';
import {DocInfo} from '../../../web/js/metadata/DocInfo';
import {RepoAnnotation, RepoHighlightInfo} from './RepoAnnotation';
import {AnnotationType} from '../../../web/js/metadata/AnnotationType';
import {DocMeta} from '../../../web/js/metadata/DocMeta';
import {Flashcard} from '../../../web/js/metadata/Flashcard';
import {Text} from '../../../web/js/metadata/Text';
import {Texts} from '../../../web/js/metadata/Texts';

export class RepoAnnotations {

    public static convert(docMeta: DocMeta): RepoAnnotation[] {

        const result: RepoAnnotation[] = [];
        const docInfo = docMeta.docInfo;

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const textHighlights = Object.values(pageMeta.textHighlights || {});
            const areaHighlights = Object.values(pageMeta.areaHighlights || {});
            const comments = Object.values(pageMeta.comments || {});
            const flashcards = Object.values(pageMeta.flashcards || {}) ;

            for (const textHighlight of textHighlights) {
                result.push(this.toRepoAnnotation(textHighlight, AnnotationType.TEXT_HIGHLIGHT, docInfo));
            }

            for (const areaHighlight of areaHighlights) {
                result.push(this.toRepoAnnotation(areaHighlight, AnnotationType.AREA_HIGHLIGHT, docInfo));
            }

            for (const comment of comments) {
                result.push(this.toRepoAnnotation(comment, AnnotationType.COMMENT, docInfo));
            }

            for (const flashcard of flashcards) {
                result.push(this.toRepoAnnotation(flashcard, AnnotationType.FLASHCARD, docInfo));
            }

        }

        return result;

    }

    public static toRepoAnnotation(sourceAnnotation: TextHighlight | AreaHighlight | Comment | Flashcard,
                                   type: AnnotationType,
                                   docInfo: DocInfo): RepoAnnotation {

        // code shared with DocAnnotations and we should refactor to
        // standardize.

        let text: string | undefined;

        if ((<any> sourceAnnotation).text) {
            const sourceText: Text = (<any> sourceAnnotation).text;
            text = Texts.toText(sourceText);
        }

        if ((<any> sourceAnnotation).content) {
            const sourceText: Text = (<any> sourceAnnotation).content;
            text = Texts.toText(sourceText);
        }

        let meta: RepoHighlightInfo | undefined;

        if (type === AnnotationType.TEXT_HIGHLIGHT) {
            meta = {color: (<TextHighlight> sourceAnnotation).color};
        }

        if (type === AnnotationType.AREA_HIGHLIGHT) {
            meta = {color: (<AreaHighlight> sourceAnnotation).color};
        }

        return {
            id: sourceAnnotation.id,
            fingerprint: docInfo.fingerprint,
            text,
            type,
            created: sourceAnnotation.created,
            tags: docInfo.tags || {},
            meta,
            docInfo
        };

    }

}
