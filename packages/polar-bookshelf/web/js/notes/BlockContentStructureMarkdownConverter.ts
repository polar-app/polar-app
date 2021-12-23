import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBlockContent, IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructurePredicates} from "./store/IBlockContentStructurePredicates";
import {BlockTextContentUtils} from "./BlockTextContentUtils";

const INDENT_SPACE_COUNT = 4;

export namespace BlockContentStructureMarkdownConverter {

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

    export function toMarkdown(blocks: ReadonlyArray<IBlockContentStructure>): MarkdownStr {
        return arrayStream(blocks)
            .map(convert.bind(null, 0))
            .filterPresent()
            .collect()
            .join('\n');
    }

    /**
     * Generate the markdown representation of a block content structure @see IBlockContentStructure
     *
     * @param level The starting markdown indentation level
     * @param structure Block content structure object
     */
    function convert(level: number, structure: IBlockContentStructure): string | undefined  {

        const markdown = convertContentToMarkdown(structure.content);

        const hasContent = markdown.length > 0;

        const current = `${getIndentSpaces(level)}- ${markdown}`;

        const getNewLevel = () => {
            // If the current block is empty just skip it and add its children on the same level
            if (! hasContent) {
                return level;
            }

            // If the current block is a named block and we're at level 0 then we don't need to indent the children
            if (level === 0 && IBlockContentStructurePredicates.isNamed(structure)) {
                return level;
            }

            return level + 1;
        };

        const newLevel = getNewLevel();

        const children = arrayStream(structure.children)
            .map(convert.bind(null, newLevel))
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
    }

    /**
     * Generate spaces based on the given indentation level
     *
     * This is useful for creating sub bullet points when generating markdown.
     *
     * @param level The wanted indentation level
     */
    function getIndentSpaces(level: number): string {
        return ' '.repeat(level * INDENT_SPACE_COUNT);
    }
}
