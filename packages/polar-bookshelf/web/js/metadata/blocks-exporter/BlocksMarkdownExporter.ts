import {IBlockContentStructure, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {BlockContentStructureConverter} from "../../notes/BlockContentStructureConverter";
import {IBlockContentStructurePredicates} from "../../notes/store/IBlockContentStructurePredicates";
import {IBlocksFormatExporter} from "./IBlocksFormatExporter";

const INDENT_SPACE_COUNT = 4;

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

        const namedMarkdownContent = arrayStream(named)
            .map(this.namedStructureToMarkdown.bind(this))
            .filterPresent()
            .collect();

        const othersMarkdownContent = arrayStream(others)
            .map(this.convert.bind(this, 0))
            .filterPresent()
            .collect();


        let markdownItems: MarkdownStr[] = [];

        if (namedMarkdownContent.length > 0) {
            markdownItems.push(namedMarkdownContent.join('\n\n\n'));
        }

        if (othersMarkdownContent.length > 0) {
            markdownItems.push(`# Custom Blocks\n${othersMarkdownContent.join('\n')}`);
        }

        return markdownItems.join('\n\n');
    }

    /**
     * Generate a markdown representation of a named block content structure @see IBlockContentStructure
     *
     * This is the same as @see convert but this one treats named contents (e.g. document, name & date block contents)
     * as headings when generating the markdown.
     *
     * @param level The starting markdown indentation level
     * @param structure Block content structure object
     */
    private namedStructureToMarkdown(structure: IBlockContentStructure<INamedContent>): string {
        const namedContentMarkdown = BlockContentStructureConverter.convertContentToMarkdown(structure.content);
        const childrenMarkdown = arrayStream(structure.children)
            .map(this.convert.bind(this, 0))
            .filterPresent()
            .collect()
            .join('\n');

        return `${namedContentMarkdown}\n${childrenMarkdown}`;
    }

    /**
     * Generate the markdown representation of a block content structure @see IBlockContentStructure
     *
     * @param level The starting markdown indentation level
     * @param structure Block content structure object
     */
    private convert(level: number, structure: IBlockContentStructure): string | undefined {
        const markdown = BlockContentStructureConverter.convertContentToMarkdown(structure.content);

        const hasContent = markdown.length > 0;

        const current = `${this.getIndentSpaces(level)}- ${markdown}`;

        // If the current block is empty just skip it and add its children on the same level
        const newLevel = ! hasContent ? level : level + 1;

        const children = arrayStream(structure.children)
            .map(this.convert.bind(this, newLevel))
            .filterPresent()
            .collect();

        const hasChildren = structure.children.length > 0;


        if (! hasChildren) {
            if (hasContent) {
                return current;
            } else {
                return undefined;
            }
        }

        if (! hasContent) {
            if (hasChildren) {
                return `${children.join('\n')}`;
            } else {
                return undefined;
            }
        }

        return `${current}\n${children.join('\n')}`;
    };

    /**
     * Generate spaces based on the given indentation level
     *
     * This is useful for creating sub bullet points when generating markdown.
     *
     * @param level The wanted indentation level
     */
    private getIndentSpaces(level: number): string {
        return ' '.repeat(level * INDENT_SPACE_COUNT);
    }
}
