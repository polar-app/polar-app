import {HTMLStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "./HTMLToBlocks";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";

export namespace BlockContentStructureConverter {

    export function convertContentToHTML(content: IBlockContent) {
        switch (content.type) {
            case 'name':
            case 'date':
                return `<h1>${content.data}</h1>`;
            case 'image':
                return `<img src="${content.src}" />`;
            case 'markdown':
                return MarkdownContentConverter.toHTML(content.data);
        }
    }

    export function toHTML(blocks: ReadonlyArray<IBlockContentStructure>): HTMLStr {
        const html = blocks
            .map(({ content, children }) => `<li>${convertContentToHTML(content)}${toHTML(children)}</li>`)
            .join("");

        return blocks.length > 0 ? `<ul>${html}</ul>` : '';
    }
}
