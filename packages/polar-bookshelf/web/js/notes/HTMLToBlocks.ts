import {TextHighlightMerger} from "../../../apps/doc/src/text_highlighter/TextHighlightMerger";
import {Images} from "polar-shared/src/util/Images";
import {IImageContent} from "./content/IImageContent";
import {IMarkdownContent} from "./content/IMarkdownContent";
import {IBlockContent} from "./store/BlocksStore";
import {Elements} from "../util/Elements";

export type IBlockContentStructure<T = IBlockContent> = {
    content: T;
    children: ReadonlyArray<IBlockContentStructure>;
};

type IBlockContentMergableStructure<T = IBlockContent> = IBlockContentStructure<T> & {
    mergable: boolean;
    children: ReadonlyArray<IBlockContentMergableStructure>;
};

export namespace HTMLToBlocks {

    async function createImageContent(dataurl: string): Promise<IImageContent> {
        const {width, height} = await Images.getDimensions(dataurl);
        return {
            type: 'image',
            src: dataurl,
            width,
            height,
            naturalWidth: width,
            naturalHeight: height,
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

    function mergeBlockStructures(blocks: ReadonlyArray<IBlockContentMergableStructure>, isParentMergable: boolean) {
        const mergeBlockContentStructures = (
            a: IBlockContentStructure<IMarkdownContent>,
            b: IBlockContentStructure<IMarkdownContent>
        ): IBlockContentMergableStructure<IMarkdownContent> => {
            return {
                content: mergeMarkdownContent(a.content, b.content),
                children: [],
                mergable: isParentMergable,
            };
        };

        const isMergable = (a: IBlockContentMergableStructure, b: IBlockContentMergableStructure) =>
            a.mergable && b.mergable && a.content.type === "markdown" && b.content.type === "markdown";

        return TextHighlightMerger
            .groupAdjacent(blocks, isMergable)
            .map(group =>
                (group as ReadonlyArray<IBlockContentMergableStructure<IMarkdownContent>>)
                    .reduce((a, b) => mergeBlockContentStructures(a, b))
            ).map(child => ({...child, mergable: child.mergable ? isParentMergable : false }));
    }

    export async function HTMLToBlockStructure(
        nodes: ReadonlyArray<Node>,
        initialCurrent = ""
    ): Promise<ReadonlyArray<IBlockContentMergableStructure>> {
        let blocks: IBlockContentMergableStructure[] = [];
        let current: string = initialCurrent;

        const flush = (mergable: boolean) => {
            const trimmed = current.replace(/\s\s+/g, ' ');
            if (trimmed.length > 0) {
                blocks.push({
                    content: createMarkdownContent(trimmed),
                    children: [],
                    mergable,
                });
                current = "";
            }
        };

        const getChildrenBlocks = async (
            elem: HTMLElement,
            mergable: boolean = true,
            parent: IBlockContentMergableStructure | undefined = undefined
        ) => {
            const children = (await HTMLToBlockStructure(Array.prototype.slice.call(elem.childNodes), current));
            current = "";

            if (parent) {
                const newChildren = [...parent.children, ...children];
                const mergedChildren = mergeBlockStructures(newChildren, mergable);
                parent.children = mergedChildren;
            } else {
                const newChildren = [...blocks, ...children];
                const mergedChildren = mergeBlockStructures(newChildren, mergable);
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
                                content: await createImageContent(src),
                                children: [],
                                mergable: false,
                            });
                        } else if (/^https?/.test(src)) {
                            blocks.push({
                                content: createMarkdownContent(`![](${src})`),
                                children: [],
                                mergable: true,
                            });
                        }
                        break;
                    case 'A':
                        flush(true);
                        const anchor = elem as HTMLAnchorElement;
                        blocks.push({
                            // TODO: Sanitize anchor.href to prevent XSS
                            content: createMarkdownContent(`[${elem.textContent || anchor}](${anchor.href})`),
                            children: [],
                            mergable: true,
                        });
                        break;
                    case 'PRE':
                        flush(true);
                        blocks.push({
                            content: createMarkdownContent(`\`\`\`\n${elem.textContent}\n\`\`\``),
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
                        const trimmed = current.replace(/\s\s+/g, ' ');
                        if (trimmed.length) {
                            const newBlock: IBlockContentMergableStructure = {
                                content: createMarkdownContent(trimmed),
                                children: [],
                                mergable: false,
                            };
                            current = '';
                            blocks.push(newBlock);
                            await getChildrenBlocks(elem, false, newBlock);
                        } else if (i > 0) {
                            // TODO There's a bug here with nested lists that are coming from google docs
                            await getChildrenBlocks(elem, false, blocks[blocks.length - 1]);
                        } else {
                            await getChildrenBlocks(elem);
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
        return blocks;
    };

    export async function parse(html: string): Promise<ReadonlyArray<IBlockContentStructure>>  {
        const nodes = Elements.createWrapperElementHTML(html).childNodes;
        const blocks = await HTMLToBlockStructure(Array.prototype.slice.call(nodes));
        const normalize = (blocks: ReadonlyArray<IBlockContentMergableStructure>): ReadonlyArray<IBlockContentStructure> => {
            return blocks
                .map(({ content, children }) => ({ content, children }))
                .map(block => ({ ...block, children: normalize(block.children) }));
        };
        return normalize(blocks);
    }
}
