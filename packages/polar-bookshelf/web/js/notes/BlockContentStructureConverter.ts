import {HTMLStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "./HTMLToBlocks";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {AnnotationContentType} from "../../../../polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockTextContentUtils} from "./NoteUtils";

export namespace BlockContentStructureConverter {

    export function convertContentToHTML(content: IBlockContent): HTMLStr {
        switch (content.type) {
            case 'name':
            case 'date':
                return `<h1>${content.data}</h1>`;
            case 'image':
                return `<img src="${content.src}" />`;
            case 'markdown':
            case 'document':
            case AnnotationContentType.FLASHCARD:
            case AnnotationContentType.TEXT_HIGHLIGHT:
                const data = BlockTextContentUtils.getTextContentMarkdown(content);
                return MarkdownContentConverter.toHTML(data);
                
        }
        // TODO: handle area highlights

        return '';
    }

    export function toHTML(blocks: ReadonlyArray<IBlockContentStructure>): HTMLStr {
        const html = blocks
            .map(({ content, children }) => `<li>${convertContentToHTML(content)}${toHTML(children)}</li>`)
            .join("");

        return blocks.length > 0 ? `<ul>${html}</ul>` : '';
    }
}
