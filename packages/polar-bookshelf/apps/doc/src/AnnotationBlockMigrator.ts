import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {Texts} from "polar-shared/src/metadata/Texts";
import {DocIDStr} from "polar-shared/src/util/Strings";
import {MAIN_HIGHLIGHT_COLORS} from "../../../web/js/ui/ColorMenu";
import {TextHighlightAnnotationContent} from "../../../web/js/notes/content/AnnotationContent";
import {MarkdownContentConverter} from "../../../web/js/notes/MarkdownContentConverter";
import {Text} from "polar-shared/src/metadata/Text";

export namespace AnnotationBlockMigrator {
    export const textToMarkdown = (text: Text | string) =>
        Texts.isText(text) ? MarkdownContentConverter.toMarkdown(Texts.toHTML(text) || '') : text;

    export function migrateTextHighlight(textHighlight: ITextHighlight, pageNum: number, docID: DocIDStr) {
        return new TextHighlightAnnotationContent({
            type: AnnotationContentType.TEXT_HIGHLIGHT,
            pageNum,
            docID,
            value: {
                ...textHighlight,
                color: MAIN_HIGHLIGHT_COLORS[0],
                text: textToMarkdown(textHighlight.text),
                revisedText: textHighlight.revisedText
                    ? textToMarkdown(textHighlight.revisedText)
                    : undefined,
            },
        });
    }
}

