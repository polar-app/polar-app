import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {Texts} from "polar-shared/src/metadata/Texts";
import {DocIDStr} from "polar-shared/src/util/Strings";
import {MAIN_HIGHLIGHT_COLORS} from "../../../web/js/ui/ColorMenu";
import {AreaHighlightAnnotationContent, FlashcardAnnotationContent, TextHighlightAnnotationContent} from "../../../web/js/notes/content/AnnotationContent";
import {MarkdownContentConverter} from "../../../web/js/notes/MarkdownContentConverter";
import {Text} from "polar-shared/src/metadata/Text";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export namespace AnnotationBlockMigrator {
    export const textToMarkdown = (text: Text | string) =>
        Texts.isText(text) ? MarkdownContentConverter.toMarkdown(Texts.toHTML(text) || '') : text;

    export function migrateTextHighlight(textHighlight: ITextHighlight, pageNum: number, docID: DocIDStr) {
        return new TextHighlightAnnotationContent({
            type: AnnotationContentType.TEXT_HIGHLIGHT,
            pageNum,
            docID,
            value: {
                order: textHighlight.order,
                rects: textHighlight.rects,
                color: textHighlight.color || MAIN_HIGHLIGHT_COLORS[0],
                text: textToMarkdown(textHighlight.text),
                revisedText: textHighlight.revisedText
                    ? textToMarkdown(textHighlight.revisedText)
                    : undefined,
            },
        });
    }

    export function migrateAreaHighlight(areaHighlight: IAreaHighlight, pageNum: number, docID: DocIDStr) {
        if (! areaHighlight.image) {
            return null;
        }

        return new AreaHighlightAnnotationContent({
            type: AnnotationContentType.AREA_HIGHLIGHT,
            pageNum,
            docID,
            value: {
                color: areaHighlight.color || MAIN_HIGHLIGHT_COLORS[0],
                rects: areaHighlight.rects,
                image: areaHighlight.image,
                order: areaHighlight.order,
                position: areaHighlight.position,
            },
        });
    }

    export function migrateFlashcard(flashcard: IFlashcard, pageNum: number, docID: DocIDStr) {
        const getFlashcard = () => {
            if (flashcard.type === FlashcardType.CLOZE) {
                return {
                    type: flashcard.type,
                    fields: { text: AnnotationBlockMigrator.textToMarkdown(flashcard.fields.text) },
                };
            } else {
                return {
                    type: flashcard.type,
                    fields: {
                        front: AnnotationBlockMigrator.textToMarkdown(flashcard.fields.front),
                        back: AnnotationBlockMigrator.textToMarkdown(flashcard.fields.back)
                    },
                };
            }
        };

        return new FlashcardAnnotationContent({
            docID,
            pageNum,
            type: AnnotationContentType.FLASHCARD,
            value: { ...getFlashcard(), archetype: flashcard.archetype },
        });
    }
}

