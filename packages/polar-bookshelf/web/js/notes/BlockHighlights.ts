import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocAnnotationSorter} from "../annotation_sidebar/DocAnnotationSorter";
import {AnnotationHighlightContent} from "./content/AnnotationContent";
import {Block} from "./store/Block";

export namespace BlockHighlights {

    export interface ISortableBlock<T extends AnnotationHighlightContent> extends DocAnnotationSorter.ISortable {
        block: Block<T>;
    }

    export function toSortable<T extends AnnotationHighlightContent>(block: Block<T>): ISortableBlock<T> {
        const rect = block.content.value.rects[0] || { left: 0, top: 0 };
        const position = block.content.type === AnnotationContentType.AREA_HIGHLIGHT
            ? block.content.value.position
            : undefined;

        return {
            block,
            id: block.id,
            pageNum: block.content.pageNum,
            order: block.content.value.order,
            position: position || { x: rect.left, y: rect.top },
        };
    };

    export function sortByPositionInDocument<T extends AnnotationHighlightContent>(
        docMeta: IDocMeta,
        highlightBlocks: ReadonlyArray<Block<T>>,
    ) {
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
        const sortableBlocks = highlightBlocks.map(toSortable);

        const sorted = sorter(sortableBlocks);

        return sorted.map(({ block }) => block);
    }
}
