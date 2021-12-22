import {IBlockFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {FlashcardAnnotationContent, TextHighlightAnnotationContent} from "./content/AnnotationContent";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";
import {EditableContent} from "./store/BlockPredicates";
import {MarkdownContent} from "./content/MarkdownContent";
import {DateContent} from "./content/DateContent";
import {NameContent} from "./content/NameContent";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {INamedContent, ITextContent} from "polar-blocks/src/blocks/IBlock";
import {DocInfos} from "polar-shared/src/metadata/DocInfos";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export namespace BlockTextContentUtils {

    /**
     * Update the markdown content of a flashcard given the field.
     *
     * @param content FlashcardAnnotationContent instance
     * @param field The flashcard field to be updated
     * @param markdown The new markdown content
     */
    export function updateFlashcardContentMarkdown<T extends IBlockFlashcard>(
        content: FlashcardAnnotationContent<T>,
        field: keyof T['fields'],
        markdown: MarkdownStr,
    ): FlashcardAnnotationContent {
        const flashcardContent = content.toJSON();

        return new FlashcardAnnotationContent({
            ...flashcardContent,
            value: BlockFlashcards.updateField(flashcardContent.value, field, markdown),
        });
    }

    /**
     * Update the markdown content of an editable text block.
     *
     * @param content An instance of the block's content instance
     * @param markdown The new markdown content
     */
    export function updateTextContentMarkdown(
        content: Exclude<EditableContent, FlashcardAnnotationContent>,
        markdown: MarkdownStr
    ): EditableContent {

        switch (content.type) {
            case "markdown":
                return new MarkdownContent({...content.toJSON(), data: markdown});
            case "date":
                return new DateContent({...content.toJSON(), data: markdown});
            case "name":
                return new NameContent({...content.toJSON(), data: markdown});
            case AnnotationContentType.TEXT_HIGHLIGHT:
                const textHighlightContent = content.toJSON();
                return new TextHighlightAnnotationContent({
                    ...textHighlightContent,
                    value: {
                        ...textHighlightContent.value,
                        revisedText: markdown,
                    }
                });
        }
    }

    export function computeNameFromContent(content: INamedContent) {

        switch (content.type) {
            case 'date':
            case 'name':
                return content.data;
            case 'document':
                return DocInfos.bestTitle(content.docInfo);
        }

    }

    /**
     * Get the markdown text of an editable text block
     *
     * @param content An editable text content instance @see TextContent
     */
    export function getTextContentMarkdown(content: ITextContent): string {
        switch (content.type) {
            case 'date':
            case 'name':
            case 'markdown':
                return content.data;
            case 'document':
                return DocInfos.bestTitle(content.docInfo);
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return BlockTextHighlights.toText(content.value);
            case AnnotationContentType.FLASHCARD:
                return content.value.type === FlashcardType.CLOZE
                    ? content.value.fields.text
                    : content.value.fields.front;
        }
    }
}
