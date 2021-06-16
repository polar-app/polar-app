import {HTMLStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "./HTMLToBlocks";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {IBlockContent} from "./store/BlocksStore";

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
        if (blocks.length === 0) {
            return '';
        }

        const html = blocks.reduce((output, { content, children }) => {
            const htmlChildren = toHTML(children);
            return `${output}<li>${convertContentToHTML(content)}${htmlChildren}</li>`;
        }, "");

        return `<ul>${html}</ul>`;
    }
}
