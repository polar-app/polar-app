import {TextHighlightMerger} from "../../../apps/doc/src/text_highlighter/TextHighlightMerger";
import {Images} from "polar-shared/src/util/Images";
import {Elements} from "../util/Elements";
import {IBlockContent, IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {IImageContent} from "polar-blocks/src/blocks/content/IImageContent";
import {Tuples} from "polar-shared/src/util/Tuples";
import {BlockContent} from "./store/BlocksStore";
import {BlockIDs} from "./store/BlockIDs";

export type BlockContentStructure<T = BlockContent> = {
    content: T;
    children: ReadonlyArray<BlockContentStructure>;
};

type IBlockContentMergableStructure<T = IBlockContent> = IBlockContentStructure<T> & {
    mergable: boolean;
    children: ReadonlyArray<IBlockContentMergableStructure>;
};

type ParserState = {
    withinList: boolean;
};

const INITIAL_STATE = {
    withinList: false,
};

export namespace HTMLToBlocks {

    export async function createImageContent(dataurl: string): Promise<IImageContent> {
        const {width, height} = await Images.getDimensions(dataurl);

        return {
            type: 'image',
            src: dataurl,
            width,
            height,
            naturalWidth: width,
            naturalHeight: height,
            links: [],
        };
    }

    export function createMarkdownContent(content: string): IMarkdownContent {
        return {
            type: 'markdown',
            data: content,
            links: [],
        };
    }

    function mergeMarkdownContent(content1: IMarkdownContent, content2: IMarkdownContent): IMarkdownContent {
        return createMarkdownContent(content1.data + content2.data);
    }

    function mergeBlockStructures(blocks: ReadonlyArray<IBlockContentMergableStructure>) {
        const mergeBlockContentStructures = (
            a: IBlockContentMergableStructure<IMarkdownContent>,
            b: IBlockContentMergableStructure<IMarkdownContent>
        ): IBlockContentMergableStructure<IMarkdownContent> => {
            return {
                id: BlockIDs.createRandom(),
                content: mergeMarkdownContent(a.content, b.content),
                children: [...a.children, ...b.children],
                mergable: true,
            };
        };

        const isMergable = (a: IBlockContentMergableStructure, b: IBlockContentMergableStructure): boolean =>
            (a.content.type === "markdown" && b.content.type === "markdown") && (a.mergable && b.mergable);

        return TextHighlightMerger
            .groupAdjacent(blocks, isMergable)
            .map(group =>
                (group as ReadonlyArray<IBlockContentMergableStructure<IMarkdownContent>>)
                    .reduce((a, b) => mergeBlockContentStructures(a, b)));
    }

    export async function HTMLToBlockStructure(
        nodes: ReadonlyArray<Node>,
        initialCurrent = "",
        state: ParserState = INITIAL_STATE
    ): Promise<ReadonlyArray<IBlockContentMergableStructure>> {
        const {withinList} = state;
        let blocks: IBlockContentMergableStructure[] = [];
        let current: string = initialCurrent;

        const flush = (mergable: boolean) => {
            const trimmed = current.replace(/\s\s+/g, ' ');
            if (trimmed.length > 0) {
                blocks.push({
                    id: BlockIDs.createRandom(),
                    content: createMarkdownContent(trimmed),
                    children: [],
                    mergable,
                });
                current = "";
            } else if (! mergable && blocks.length !== 0) {
                blocks[blocks.length - 1].mergable = false;
            }
        };

        const getChildrenBlocks = async (
            elem: HTMLElement,
            mergable: boolean = true,
            parent: IBlockContentMergableStructure | undefined = undefined,
            newState: ParserState = state,
        ) => {
            const children = mergeBlockStructures(await HTMLToBlockStructure(Array.from(elem.childNodes), current, newState))
                .map(child => ({ ...child, mergable: child.mergable ? mergable : false }));
            current = "";

            if (parent) {
                const newChildren = [...parent.children, ...children];
                const mergedChildren = mergeBlockStructures(newChildren);
                parent.children = mergedChildren;
            } else {
                const newChildren = [...blocks, ...children];
                const mergedChildren = mergeBlockStructures(newChildren);
                blocks = mergedChildren;
            }
        };

        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                const elem = node as HTMLElement;
                switch (elem.tagName) {
                    case 'IMG':
                        const {src} = elem as HTMLImageElement;
                        if (src.startsWith('data:image')) {
                            flush(false);
                            blocks.push({
                                id: BlockIDs.createRandom(),
                                content: await createImageContent(src),
                                children: [],
                                mergable: false,
                            });
                        } else if (/^https?/.test(src)) {
                            blocks.push({
                                id: BlockIDs.createRandom(),
                                content: createMarkdownContent(`${current}![](${src})`),
                                children: [],
                                mergable: true,
                            });
                            current = "";
                        }
                        break;
                    case 'A':
                        const anchor = elem as HTMLAnchorElement;
                        // TODO: Not sure if this is enough to prevent XSS
                        if (! anchor.href.toLowerCase().startsWith("javascript")) {
                            flush(true);
                            blocks.push({
                                id: BlockIDs.createRandom(),
                                content: createMarkdownContent(`[${elem.textContent || anchor}](${anchor.href})`),
                                children: [],
                                mergable: true,
                            });
                        }
                        break;
                    case 'PRE':
                        flush(true);
                        blocks.push({
                            id: BlockIDs.createRandom(),
                            content: createMarkdownContent(`\n\`\`\`\n${elem.textContent || ''}\n\`\`\`\n`),
                            children: [],
                            mergable: true,
                        });
                    case 'BR':
                        flush(false);
                        break;
                    // Block level elements that should be converted to separate blocks
                    case 'P':
                    case 'DIV':
                    case 'LI':
                    case 'TR':
                    case 'H1':
                    case 'H2':
                    case 'H3':
                    case 'H4':
                    case 'H5':
                    case 'H6':
                        flush(false);
                        await getChildrenBlocks(elem, false);
                        break;
                    case 'UL':
                    case 'OL':
                        let newBlock: IBlockContentMergableStructure | undefined;
                        if (current.length) {
                            const trimmed = current.replace(/\s\s+/g, ' ');
                            newBlock = {
                                id: BlockIDs.createRandom(),
                                content: createMarkdownContent(trimmed),
                                children: [],
                                mergable: false,
                            };
                            current = '';
                            blocks.push(newBlock);
                        }
                        if (withinList && i > 0) {
                            await getChildrenBlocks(elem, false, blocks[blocks.length - 1], { withinList: true });
                        } else {
                            await getChildrenBlocks(elem, false, newBlock, { withinList: true });
                        }
                        break;
                    default:
                        await getChildrenBlocks(elem);
                        break;
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                current += (node.textContent || '').replace(/\s\s+/g, ' ');
            }
        }

        flush(true);

        return mergeBlockStructures(blocks);
    };

    export async function parse(html: string): Promise<ReadonlyArray<IBlockContentStructure>>  {
        const nodes = Elements.createWrapperElementHTML(html).childNodes;
        const blocks = await HTMLToBlockStructure(Array.prototype.slice.call(nodes));

        const isEmpty = (block: IBlockContentStructure) => block.content.type === 'markdown' && block.content.data.trim().length === 0;

        const flatten = (block: IBlockContentStructure[]): ReadonlyArray<IBlockContentStructure> => {
            const siblings = Tuples.createSiblings(block);
            const result: IBlockContentStructure[] = [];

            for (let i = siblings.length - 1; i >= 0; i -= 1) {
                const sibling = siblings[i];

                if (isEmpty(sibling.curr) && sibling.prev) {
                    sibling.prev.children = [...sibling.prev.children, ...sibling.curr.children];
                } else {
                    result.unshift(sibling.curr);
                }
            }

            return result;
        }
        const trim = (block: IBlockContentStructure) => {
            if (block.content.type === 'markdown' && block.children.length === 0) {
                return {
                    ...block,
                    content: createMarkdownContent(block.content.data.trim()),
                };
            }
            return block;
        };

        const purgeEmpty = (blocks: IBlockContentStructure[]) => {
            return blocks.flatMap(block => {
                if (isEmpty(block)) {
                    return block.children;
                }
                return [block];
            });
        };

        const normalize = (blocks: ReadonlyArray<IBlockContentStructure>): ReadonlyArray<IBlockContentStructure> => {
            const normalized = blocks
                .map(({ content, children, id }) => ({ content, children, id }))
                .map(block => ({ ...block, children: normalize(block.children) }))
            const flattened = flatten(normalized)
                .map(trim);
            return purgeEmpty(flattened);
        };
        return normalize(blocks);
    }
}
