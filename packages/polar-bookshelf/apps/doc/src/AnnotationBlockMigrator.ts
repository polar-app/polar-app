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
import {IBlocksStore} from "../../../web/js/notes/store/IBlocksStore";
import {IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {NameContent} from "../../../web/js/notes/content/NameContent";
import {InheritedTag} from "polar-shared/src/tags/InheritedTags";
import {Tag} from "polar-shared/src/tags/Tags";

export namespace AnnotationBlockMigrator {
    export const textToMarkdown = (text: Text | string) =>
        Texts.isText(text) ? MarkdownContentConverter.toMarkdown(Texts.toHTML(text) || '') : text;

    export function tagsToLinks(blocksStore: IBlocksStore, tags?: Record<string, InheritedTag>): ReadonlyArray<IBlockLink> {
        
        if (! tags) {
            return [];
        }

        const toBlockLink = (tag: Tag): IBlockLink => {
            const block = blocksStore.getBlockByName(tag.label);
            
            if (block) {
                return { text: `#${tag.label}`, id: block.id };
            } else {
                const content = new NameContent({ type: 'name', data: tag.label, links: [] });
                const id = blocksStore.createNewNamedBlock({ content });

                return { text: `#${tag.label}`, id };
            }
        };

        return Object
            .values(tags)
            .filter(({ source }) => source === 'self')
            .map(toBlockLink);
    }

    export function linksToMarkdown(links: ReadonlyArray<IBlockLink>): string {
        return links.map(link => `[[${link.text}]]`).join(' ');
    }

    export function migrateTextHighlight(
        textHighlight: ITextHighlight,
        pageNum: number,
        docID: DocIDStr,
        links: ReadonlyArray<IBlockLink>,
    ) {
        const revisedText = textHighlight.revisedText
                    ? textToMarkdown(textHighlight.revisedText)
                    : textToMarkdown(textHighlight.text);

        const wikiLinks = linksToMarkdown(links);

        return new TextHighlightAnnotationContent({
            type: AnnotationContentType.TEXT_HIGHLIGHT,
            pageNum,
            docID,
            links,
            value: {
                order: textHighlight.order,
                rects: textHighlight.rects,
                color: textHighlight.color || MAIN_HIGHLIGHT_COLORS[0],
                text: textToMarkdown(textHighlight.text),
                revisedText: `${revisedText} ${wikiLinks}`,
            },
        });
    }

    export function migrateAreaHighlight(
        areaHighlight: IAreaHighlight,
        pageNum: number,
        docID: DocIDStr,
        links: ReadonlyArray<IBlockLink>,
    ) {
        if (! areaHighlight.image) {
            return null;
        }

        return new AreaHighlightAnnotationContent({
            type: AnnotationContentType.AREA_HIGHLIGHT,
            pageNum,
            links,
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

    export function migrateFlashcard(flashcard: IFlashcard,
        pageNum: number,
        docID: DocIDStr,
        links: ReadonlyArray<IBlockLink>,
    ) {
        const getFlashcard = () => {
            const wikiLinks = linksToMarkdown(links);

            if (flashcard.type === FlashcardType.CLOZE) {
                return {
                    type: flashcard.type,
                    fields: { text: `${AnnotationBlockMigrator.textToMarkdown(flashcard.fields.text)} ${wikiLinks}` },
                };
            } else {
                return {
                    type: flashcard.type,
                    fields: {
                        front: AnnotationBlockMigrator.textToMarkdown(flashcard.fields.front),
                        back: `${AnnotationBlockMigrator.textToMarkdown(flashcard.fields.back)} ${wikiLinks}`,
                    },
                };
            }
        };

        return new FlashcardAnnotationContent({
            docID,
            pageNum,
            links,
            type: AnnotationContentType.FLASHCARD,
            value: { ...getFlashcard(), archetype: flashcard.archetype },
        });
    }
}

