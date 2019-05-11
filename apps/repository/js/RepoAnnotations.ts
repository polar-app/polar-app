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
import {Images} from '../../../web/js/metadata/Images';
import {Img} from '../../../web/js/metadata/Img';
import {PersistenceLayerProvider} from '../../../web/js/datastore/PersistenceLayer';

export class RepoAnnotations {

    public static convert(persistenceLayerProvider: PersistenceLayerProvider,
                          docMeta: DocMeta): RepoAnnotation[] {

        const result: RepoAnnotation[] = [];
        const docInfo = docMeta.docInfo;

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const textHighlights = Object.values(pageMeta.textHighlights || {});
            const areaHighlights = Object.values(pageMeta.areaHighlights || {});
            const comments = Object.values(pageMeta.comments || {});
            const flashcards = Object.values(pageMeta.flashcards || {}) ;

            for (const textHighlight of textHighlights) {
                result.push(this.toRepoAnnotation(persistenceLayerProvider, textHighlight, AnnotationType.TEXT_HIGHLIGHT, docInfo));
            }

            for (const areaHighlight of areaHighlights) {
                result.push(this.toRepoAnnotation(persistenceLayerProvider, areaHighlight, AnnotationType.AREA_HIGHLIGHT, docInfo));
            }

            for (const comment of comments) {
                result.push(this.toRepoAnnotation(persistenceLayerProvider, comment, AnnotationType.COMMENT, docInfo));
            }

            for (const flashcard of flashcards) {
                result.push(this.toRepoAnnotation(persistenceLayerProvider, flashcard, AnnotationType.FLASHCARD, docInfo));
            }

        }

        return result;

    }

    public static toRepoAnnotation(persistenceLayerProvider: PersistenceLayerProvider,
                                   sourceAnnotation: TextHighlight | AreaHighlight | Comment | Flashcard,
                                   type: AnnotationType,
                                   docInfo: DocInfo): RepoAnnotation {

        // code shared with DocAnnotations and we should refactor to
        // standardize.

        let text: string | undefined;

        if ((<any> sourceAnnotation).text) {
            const sourceText: Text = (<any> sourceAnnotation).text;
            text = Texts.toPlainText(sourceText);
        }

        if ((<any> sourceAnnotation).content) {
            const sourceText: Text = (<any> sourceAnnotation).content;
            text = Texts.toPlainText(sourceText);
        }

        if (type === AnnotationType.FLASHCARD) {
            const flashcard = <Flashcard> sourceAnnotation;
            const textFields = Object.values(flashcard.fields);

            if (textFields.length > 0) {
                text = Texts.toPlainText(textFields[0]);
            }

        }

        let meta: RepoHighlightInfo | undefined;

        if (type === AnnotationType.TEXT_HIGHLIGHT) {
            meta = {color: (<TextHighlight> sourceAnnotation).color};
        }

        let img: Img | undefined;

        if (type === AnnotationType.AREA_HIGHLIGHT) {

            const areaHighlight = <AreaHighlight> sourceAnnotation;
            meta = {color: areaHighlight.color};

            img = Images.toImg(persistenceLayerProvider, areaHighlight.image);

        }

        return {
            id: sourceAnnotation.id,
            fingerprint: docInfo.fingerprint,
            text,
            type,
            created: sourceAnnotation.created,
            tags: docInfo.tags || {},
            meta,
            docInfo,
            img
        };

    }

    public static isValid(repoAnnotation: RepoAnnotation) {
        return true;
    }

}
