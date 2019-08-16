import {DocMeta} from "./DocMeta";
import {AnnotationHolder} from "./AnnotationHolder";
import {AreaHighlight, IAreaHighlight} from './AreaHighlight';
import {PageInfo} from './PageInfo';
import {DocInfo} from './DocInfo';
import {AnnotationType} from './AnnotationType';
import {ITextHighlight, TextHighlight} from './TextHighlight';
import {Comment, IComment} from './Comment';
import {Flashcard, IFlashcard} from './Flashcard';
import {IDocInfo} from "./IDocInfo";
import {IDocMeta} from "./IDocMeta";
import {IPageInfo} from "./IPageInfo";

export class AnnotationHolders {

    public static fromDocMeta(docMeta: IDocMeta): ReadonlyArray<AnnotationHolder> {

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

    public static fromAreaHighlight(value: IAreaHighlight, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {type: AnnotationType.AREA_HIGHLIGHT, annotation: value, docInfo, pageInfo};
    }


    public static fromTextHighlight(value: ITextHighlight, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {type: AnnotationType.TEXT_HIGHLIGHT, annotation: value, docInfo, pageInfo};
    }

    public static fromComment(value: IComment, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {type: AnnotationType.COMMENT, annotation: value, docInfo, pageInfo};
    }

    public static fromFlashcard(value: IFlashcard, pageInfo?: IPageInfo, docInfo?: IDocInfo): AnnotationHolder {
        return {type: AnnotationType.FLASHCARD, annotation: value, docInfo, pageInfo};
    }

}
