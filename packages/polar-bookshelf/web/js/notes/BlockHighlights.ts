import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {DocAnnotationSorter} from "../annotation_sidebar/DocAnnotationSorter";
import {AnnotationHighlightContent} from "./content/AnnotationContent";
import {INewChildPosition} from "./store/BlocksStore";

export namespace BlockHighlights {

    export interface ISortableBlock<T extends AnnotationHighlightContent> extends DocAnnotationSorter.ISortable {
        content: T
    }

    export interface IdentifiableBlockContent<T extends AnnotationHighlightContent> {
        id: BlockIDStr;
        content: T;
    }

    export function toSortable<T extends AnnotationHighlightContent>({ id, content }: IdentifiableBlockContent<T>): ISortableBlock<T> {
        const rect = content.value.rects[0] || { left: 0, top: 0 };

        const position = content.type === AnnotationContentType.AREA_HIGHLIGHT
            ? content.value.position
            : undefined;

        return {
            content,
            id: id,
            pageNum: content.pageNum,
            order: content.value.order,
            position: position || { x: rect.left, y: rect.top },
        };
    };

    export function sortByPositionInDocument<
        T extends AnnotationHighlightContent,
        U extends IdentifiableBlockContent<T>,
    >(
        docMeta: IDocMeta,
        highlightContents: ReadonlyArray<U>,
    ): ReadonlyArray<U> {
        const columnLayout = docMeta.docInfo.columnLayout || 0;

        function createPageMetaIndex() {
            const result: DocAnnotationSorter.PageInfoIndex = {};

            for (const pageMeta of Object.values(docMeta.pageMetas || {})) {
                result[pageMeta.pageInfo.num] = pageMeta.pageInfo;
            }

            return result;

        }

        const pageMetaIndex = createPageMetaIndex();
        const sorter = DocAnnotationSorter.create<ISortableBlock<T>>(pageMetaIndex, columnLayout);
        const sortableBlocks = highlightContents.map(toSortable);

        const map = new Map<BlockIDStr, U>();
        highlightContents.forEach((data) => map.set(data.id, data));

        const sorted = sorter(sortableBlocks);

        return arrayStream(sorted)
            .map(({ id }) => map.get(id))
            .filterPresent()
            .collect();
    }

    export const calculateHighlightBlockPosition = (
        blocks: ReadonlyArray<IdentifiableBlockContent<AnnotationHighlightContent>>,
        block: IdentifiableBlockContent<AnnotationHighlightContent>,
        docMeta: IDocMeta
    ): INewChildPosition | 'unshift' => {

        if (blocks.length === 0) {
            return 'unshift';
        }

        const sorted = BlockHighlights.sortByPositionInDocument(docMeta, [...blocks, block]);

        const idx = sorted.indexOf(block)!;

        if (idx === 0) {
            return 'unshift';
        } else {
            return { pos: 'after', ref: sorted[idx - 1].id };
        }

    };

}
