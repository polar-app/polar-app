import {IBlock, IBlockContent, IBlockContentStructure, IBlockLink, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {AnnotationContentType, IAnnotationHighlightContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {Tag} from "polar-shared/src/tags/Tags";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {BlockHighlights} from "polar-blocks/src/annotations/BlockHighlights";
import {BlockContentAnnotationTree} from "./BlockContentAnnotationTree";


/**
 * The purpose of this class is to keep track of all the tags of annotations when performing the migration to blocks
 * so we can prevent duplicates & also use existing blocks instead of creating new ones
 *
 * Example:
 * Bob has 3 `name` blocks in his blocks system: 'Tree', 'Forest' & 'Sun'
 * Bob has a document with 2 tags: 'Tree', 'Potato'
 * Bob tries to migrate his documents into the new blocks system.
 *
 * This is where this class comes into play. An important thing to note is that when performing the migration
 * document & annotation tags are converted into `name` blocks
 * So in this case bob already has 3 `name` blocks, but one of them conflicts with one of the tags that are about to migrated,
 * and that's why at first we index all of the existing 'name' blocks & keep track of their ads, this way we can keep track of
 * 1. documents using the same tag
 * 2. documents using a tag with a label that already exists in the blocks system as a `name` block
 *
 */
class BlockTagLinkTracker {
    existingIndex = new Map<string, IBlockLink>();
    index = new Map<string, IBlockLink>();

    constructor(existingBlocks: ReadonlyArray<IBlock<INamedContent>>) {
        existingBlocks.forEach(block => {
            const tag = block.content.type === 'document'
                ? `#${block.content.docInfo.title || block.content.docInfo.filename}`
                : `#${block.content.data}`;

            const link: IBlockLink = { id: block.id, text: tag };
            const normalized = this.normalizeLabel(tag);

            this.existingIndex.set(normalized, link);
        });
    }

    get(text: string): IBlockLink | undefined {
        const normalizedText = this.normalizeLabel(text);
        return this.existingIndex.get(normalizedText) || this.index.get(normalizedText);
    }

    put(text: string): IBlockLink {
        if (! text.startsWith('#')) {
            throw new Error('Only tags links are allowed');
        }

        const existing = this.get(text);

        if (existing) {
            return existing;
        }

        const link: IBlockLink = { text, id: Hashcodes.createRandomID() };

        const normalized = this.normalizeLabel(text);
        this.index.set(normalized, link);

        return link;
    }

    private normalizeLabel(text: string): string {
        return text.toLowerCase();
    }

    getTagLinks(): ReadonlyArray<IBlockLink> {
        return Array.from(this.index.values());
    }
}

export namespace DocMetaBlockContents {
    import IAnnotation = BlockContentAnnotationTree.IAnnotation;
    
    type IDocMetaBlockContents = {
        tagContentsStructure: ReadonlyArray<IBlockContentStructure<INameContent>>;
        docContentStructure: IBlockContentStructure<IDocumentContent>;
    };

    /**
     * Convert block tag links into name blocks
     *
     * @param tagLinks tag wiki links objects
     */
    export function getFromDocMeta(docMeta: IDocMeta,
                                   existingNamedBlocks: ReadonlyArray<IBlock<INamedContent>>): IDocMetaBlockContents {

        const linkTracker = new BlockTagLinkTracker(existingNamedBlocks);

        const documentContent = getDocumentBlockContent(linkTracker, docMeta.docInfo);
        const annotationContentStructure = getAnnotationsContentStructure(linkTracker, docMeta)
            .map(data => ({ ...data, id: Hashcodes.createRandomID() }));

        const sortedAnnotationContentStructure = BlockHighlights
            .sortByPositionInDocument(docMeta, annotationContentStructure);


        return {
            docContentStructure: {
                id: Hashcodes.createRandomID(),
                content: documentContent,
                children: sortedAnnotationContentStructure,
            },
            tagContentsStructure: tagLinksToIdentifiableContentStructure(linkTracker.getTagLinks()),
        };

    }

    /**
     * Convert block tag links into name blocks
     *
     * @param tagLinks tag wiki links objects
     */
    export function tagLinksToIdentifiableContentStructure(tagLinks: ReadonlyArray<IBlockLink>): ReadonlyArray<IBlockContentStructure<INameContent>> {
        const toNameContent = ({ id, text }: IBlockLink): IBlockContentStructure<INameContent> => ({
            content: {
                links: [],
                type: 'name',
                data: text.slice(1), // Remove the pound sign
            },
            id: id,
            children: [],
        });

        return tagLinks.map(toNameContent);
    }
    
    /**
     * Convert a docMeta document info object to a document block content
     *
     * @param linkTracker BlockTagLinkTracker instance @see BlockTagLinkTracker
     * @param annotation docInfo object
     */
    export function getDocumentBlockContent(linkTracker: BlockTagLinkTracker,
                                            docInfo: IDocInfo): IDocumentContent {

        return {
            docInfo,
            type: 'document',
            links: tagsToBlockLinks(linkTracker, Object.values(docInfo.tags || {})),
        };
    }

    /**
     * Convert the annotations of a document into a block content structure @see IBlockContentStructure
     *
     * @param linkTracker BlockTagLinkTracker instance @see BlockTagLinkTracker
     * @param annotation docMeta object
     */
    export function getAnnotationsContentStructure(linkTracker: BlockTagLinkTracker,
                                                   docMeta: IDocMeta): ReadonlyArray<IBlockContentStructure<IAnnotationHighlightContent>> {
        
        const annotationsTree = BlockContentAnnotationTree.buildDocumentAnnotationTree(docMeta);

        const toAnnotationContentStructure = (annotation: IAnnotation): IBlockContentStructure => ({
            id: Hashcodes.createRandomID(),
            content: blockAnnotationToBlockAnnotationContent(linkTracker, annotation),
            children: annotation.children.map(toAnnotationContentStructure),
        });


        const isHighlightContent = (structure: IBlockContentStructure): structure is IBlockContentStructure<IAnnotationHighlightContent> =>
            structure.content.type === AnnotationContentType.AREA_HIGHLIGHT
            || structure.content.type === AnnotationContentType.TEXT_HIGHLIGHT;

        return annotationsTree
            .map(annotation => toAnnotationContentStructure(annotation))
            .filter(isHighlightContent);
    }

    /**
     * Convert an intermediate migration format content to a block content
     *
     * @param linkTracker BlockTagLinkTracker instance @see BlockTagLinkTracker
     * @param annotation The intermediate migration format of an annotation
     */
    export function blockAnnotationToBlockAnnotationContent(linkTracker: BlockTagLinkTracker,
                                                            annotation: IAnnotation): IBlockContent {
        switch (annotation.type) {
            case AnnotationContentType.FLASHCARD:
            case AnnotationContentType.AREA_HIGHLIGHT:
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return {
                    type: annotation.type,
                    docID: annotation.docID,
                    links: tagsToBlockLinks(linkTracker, annotation.tags),
                    pageNum: annotation.pageNum,
                    value: annotation.value,
                } as IBlockContent;
    
            case 'comment':
                return {
                    type: 'markdown',
                    links: tagsToBlockLinks(linkTracker, annotation.tags),
                    data: annotation.content,
                };
        }
    }

    /**
     * Convert tags to block links
     *
     * @param linkTracker BlockTagLinkTracker instance @see BlockTagLinkTracker
     * @param tags An array of tags
     */
    export function tagsToBlockLinks(linkTracker: BlockTagLinkTracker,
                                     tags: ReadonlyArray<Tag>): ReadonlyArray<IBlockLink> {

        const toBlockTagLink = (tag: Tag): IBlockLink => linkTracker.put(`#${tag.label}`);

        return Object
            .values(tags)
            .map(toBlockTagLink);

    }
}
