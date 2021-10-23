import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {AnnotationContentType, IAnnotationHighlightContent, IAreaHighlightAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";

export namespace IBlockPredicates {

    export function isTextBlock(block: IBlock): block is IBlock<MarkdownContent | NameContent> {
        return block.content.type === 'markdown' || block.content.type === 'name';
    }

    export function isAnnotationTextHighlightBlock(block: Readonly<IBlock>): block is IBlock<ITextHighlightAnnotationContent> {
        return block.content.type === AnnotationContentType.TEXT_HIGHLIGHT;
    }

    export function isAnnotationAreaHighlightBlock(block: Readonly<IBlock>): block is IBlock<IAreaHighlightAnnotationContent> {
        return block.content.type === AnnotationContentType.AREA_HIGHLIGHT;
    }

    export function isAnnotationHighlightBlock(block: Readonly<IBlock>): block is IBlock<IAnnotationHighlightContent> {
        return [AnnotationContentType.AREA_HIGHLIGHT, AnnotationContentType.TEXT_HIGHLIGHT]
            .some(type => block.content.type === type);
    }


    export function isAnnotationBlock(block: Readonly<IBlock>): block is IBlock<IAnnotationHighlightContent> {
        return [
            AnnotationContentType.AREA_HIGHLIGHT,
            AnnotationContentType.TEXT_HIGHLIGHT,
            AnnotationContentType.FLASHCARD,
        ].some(type => block.content.type === type);
    }
}
