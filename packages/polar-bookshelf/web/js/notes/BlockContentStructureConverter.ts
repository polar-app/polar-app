import {HTMLStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockTextContentUtils} from "./NoteUtils";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export namespace BlockContentStructureConverter {

    export function convertContentToHTML(content: IBlockContent): HTMLStr {
        switch (content.type) {
            case 'name':
            case 'date':
                return `<h1>${content.data}</h1>`;

            case 'image':
                return `<div><img src="${content.src}" /></div>`;

            case 'markdown':
                const markdown = BlockTextContentUtils.getTextContentMarkdown(content);
                return `<div>${MarkdownContentConverter.toHTML(markdown)}</div>`;

            case 'document':
                const documentTitle = BlockTextContentUtils.getTextContentMarkdown(content);
                return `<div><b>Document:</b> ${MarkdownContentConverter.toHTML(documentTitle)}</div>`;

            case AnnotationContentType.FLASHCARD:
                if (content.value.type === FlashcardType.CLOZE) {
                    const { text } = content.value.fields;
                    return `<div><b>FLASHCARD:</b> ${text}</div>`;
                } else {
                    const { front, back } = content.value.fields;
                    return `<div><b>FLASHCARD:</b> ${front} ➔ ${back}</div>`;
                }
            case AnnotationContentType.TEXT_HIGHLIGHT:
                const textHighlightMarkdown = BlockTextContentUtils.getTextContentMarkdown(content);
                return `<div><b style="color: ${content.value.color}">■</b><b>Text Highlight:</b> ${textHighlightMarkdown}</div>`;

            case AnnotationContentType.AREA_HIGHLIGHT:
                // TODO: get the url of the image somehow
                return `<div><b style="color: ${content.value.color}">■</b><b>Area Highlight:</b> <img src="https://i.giphy.com/media/2UCt7zbmsLoCXybx6t/giphy.webp" /></div>`;

            default:
                const _: never = content;
                throw new Error('BlockContentStructureConverter.convertContentToHTML: Unhandled block content type');

        }
    }

    export function convertContentToMarkdown(content: IBlockContent): MarkdownStr {

        switch (content.type) {
            case 'date':
            case 'name':
                const titleMarkdown = BlockTextContentUtils.getTextContentMarkdown(content)
                return `# ${titleMarkdown}`;

            case 'document':
                const documentTitle = BlockTextContentUtils.getTextContentMarkdown(content)
                return `# *Document*: ${documentTitle}`;

            case 'markdown':
                const markdown = BlockTextContentUtils.getTextContentMarkdown(content)
                return `${markdown}`;

            case 'image':
                const src = content.src;
                return `![](${src})`;

            case AnnotationContentType.AREA_HIGHLIGHT:
                const { image } = content.value;
                
                if (! image) {
                    return `<b>AREA HIGHLIGHT</b>: Missing image`;
                }

                // TODO: find a way to convert image.src to a URL without the extra deps
                return `<b style="color: ${content.value.color}">■</b> <b>AREA HIGHLIGHT</b>:  \n![](https://i.giphy.com/media/2UCt7zbmsLoCXybx6t/giphy.webp) `;

            case AnnotationContentType.TEXT_HIGHLIGHT:
                const textHighlightMarkdown = BlockTextContentUtils.getTextContentMarkdown(content);
                return `<b style="color: ${content.value.color}">■</b> <b>TEXT HIGHLIGHT</b>: ${textHighlightMarkdown}`;

            case AnnotationContentType.FLASHCARD:
                if (content.value.type === FlashcardType.CLOZE) {
                    const { text } = content.value.fields;
                    return `**FLASHCARD**: ${text}`;
                } else {
                    const { front, back } = content.value.fields;
                    return `**FLASHCARD**: ${front} ➔ ${back}`;
                }

            default:
                const _: never = content;
                throw new Error('BlockContentStructureConverter.convertContentToMarkdown: Unhandled block content');

        }

    }

    export function toHTML(blocks: ReadonlyArray<IBlockContentStructure>): HTMLStr {
        const html = blocks
            .map(({ content, children }) => `<li>${convertContentToHTML(content)}${toHTML(children)}</li>`)
            .join("");

        return blocks.length > 0 ? `<ul>${html}</ul>` : '';
    }
}
