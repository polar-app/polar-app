import {DocMeta} from "./DocMeta";
import {AnnotationHolder} from "./AnnotationHolder";
import {AreaHighlight} from './AreaHighlight';
import {PageInfo} from './PageInfo';
import {DocInfo} from './DocInfo';
import {AnnotationType} from './AnnotationType';
import {TextHighlight} from './TextHighlight';
import {Comment} from './Comment';
import {Flashcard} from './Flashcard';

export class AnnotationHolders {

    public static fromDocMeta(docMeta: DocMeta): ReadonlyArray<AnnotationHolder> {

        const result: AnnotationHolder[] = [];

        for (const pageMeta of Object.values(docMeta.pageMetas || {})) {

            const pageInfo = pageMeta.pageInfo;
            const docInfo = docMeta.docInfo;

            result.push(...Object.values(pageMeta.areaHighlights || {})
                .map(current => this.fromAreaHighlight(current, pageInfo, docInfo)));

            result.push(...Object.values(pageMeta.textHighlights || {})
                .map(current => this.fromTextHighlight(current, pageInfo, docInfo)));

            result.push(...Object.values(pageMeta.comments || {})
                .map(current => this.fromComment(current, pageInfo, docInfo)));

            result.push(...Object.values(pageMeta.flashcards || {})
                .map(current => this.fromFlashcard(current, pageInfo, docInfo)));

        }

        return result;

    }

    public static fromAreaHighlight(value: AreaHighlight, pageInfo?: PageInfo, docInfo?: DocInfo): AnnotationHolder {
        return {type: AnnotationType.AREA_HIGHLIGHT, annotation: value, docInfo, pageInfo};
    }


    public static fromTextHighlight(value: TextHighlight, pageInfo?: PageInfo, docInfo?: DocInfo): AnnotationHolder {
        return {type: AnnotationType.TEXT_HIGHLIGHT, annotation: value, docInfo, pageInfo};
    }

    public static fromComment(value: Comment, pageInfo?: PageInfo, docInfo?: DocInfo): AnnotationHolder {
        return {type: AnnotationType.COMMENT, annotation: value, docInfo, pageInfo};
    }

    public static fromFlashcard(value: Flashcard, pageInfo?: PageInfo, docInfo?: DocInfo): AnnotationHolder {
        return {type: AnnotationType.FLASHCARD, annotation: value, docInfo, pageInfo};
    }

}
