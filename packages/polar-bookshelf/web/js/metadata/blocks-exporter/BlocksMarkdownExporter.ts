import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {BlockContentStructureMarkdownConverter} from "../../notes/BlockContentStructureMarkdownConverter";
import {IBlockContentStructurePredicates} from "../../notes/store/IBlockContentStructurePredicates";
import {IBlocksFormatExporter} from "./IBlocksFormatExporter";

export class BlocksMarkdownExporter implements IBlocksFormatExporter {

    public getFileExtension(): string {
        return 'md';
    }

    public getMimeType(): string {
        return 'text/markdown;charset=utf-8';
    }

    public toStringData(structures: ReadonlyArray<IBlockContentStructure>): string {
        return this.generateMarkdown(structures);
    }

    /**
     * Generate a markdown reprensentation of an array of block content structures
     *
     * @param structures Block content structures array
     */
    private generateMarkdown(structures: ReadonlyArray<IBlockContentStructure>): string {
        const named = structures.filter(IBlockContentStructurePredicates.isNamed);
        const others = structures.filter(structure => ! IBlockContentStructurePredicates.isNamed(structure));

        const namedMarkdownContent = named
            .map(structure => BlockContentStructureMarkdownConverter.toMarkdown([structure]));

        const othersMarkdownStr = BlockContentStructureMarkdownConverter.toMarkdown(others);

        let markdownItems: MarkdownStr[] = [];

        if (namedMarkdownContent.length > 0) {
            markdownItems.push(namedMarkdownContent.join('\n\n\n'));
        }

        if (othersMarkdownStr.length > 0) {
            markdownItems.push(`# Custom Blocks\n${othersMarkdownStr}`);
        }

        return markdownItems.join('\n\n');
    }

}
