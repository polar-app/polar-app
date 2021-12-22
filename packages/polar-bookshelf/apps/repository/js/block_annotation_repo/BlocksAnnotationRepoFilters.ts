import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IBlock, IBlockLink} from 'polar-blocks/src/blocks/IBlock';
import {IRepoAnnotationContent, IRepoAnnotationTextContent} from './BlocksAnnotationRepoStore';
import {IBlockPredicates} from '../../../../web/js/notes/store/IBlockPredicates';
import {AnnotationContentType} from 'polar-blocks/src/blocks/content/IAnnotationContent';
import {BlockLinksMatcher} from '../../../../web/js/notes/NoteUtils';
import {Tag} from "polar-shared/src/tags/Tags";
import {ReverseIndex} from "../../../../web/js/notes/store/ReverseIndex";
import {BlockTextContentUtils} from "../../../../web/js/notes/BlockTextContentUtils";


/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export namespace BlocksAnnotationRepoFilters {

    export interface Filter {


        /**
         * When true, only show flagged documents.
         */
        readonly flagged?: boolean;

        /**
         *  When true, show both archived and non-archived documents.
         */
        readonly archived?: boolean;

        readonly colors?: ReadonlyArray<HighlightColor>;

        readonly text?: string;

        readonly tags?: ReadonlyArray<Tag>;

        readonly annotationTypes?: ReadonlyArray<AnnotationContentType | 'markdown'>;

    }

    export function execute(tagIndex: ReverseIndex,
                            blockAnnotations: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                            filter: Filter): ReadonlyArray<IBlock<IRepoAnnotationContent>> {

        blockAnnotations = doFilterByText(blockAnnotations, filter);
        blockAnnotations = doFilterByTags(tagIndex, blockAnnotations, filter);
        blockAnnotations = doFilterByColor(blockAnnotations, filter);
        blockAnnotations = doFilterByAnnotationTypes(blockAnnotations, filter);

        return blockAnnotations;

    }

    function doFilterByColor(blockAnnotations: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                             filter: Filter): ReadonlyArray<IBlock<IRepoAnnotationContent>> {

        const {colors} = filter;

        if (colors && colors.length > 0) {
            return blockAnnotations.filter(current => {
                const getColor = () =>
                    IBlockPredicates.isAnnotationBlock(current)
                        ? current.content.value.color
                        : null;

                const color = HighlightColors.withDefaultColor(getColor());

                return colors.includes(color);
            });
        }

        return blockAnnotations;

    }

    function doFilterByAnnotationTypes(blockAnnotations: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                                       filter: Filter): ReadonlyArray<IBlock<IRepoAnnotationContent>> {

        const {annotationTypes} = filter;

        if (annotationTypes && annotationTypes.length > 0) {
            return blockAnnotations.filter(current => annotationTypes.includes(current.content.type));
        }

        return blockAnnotations;

    }

    function doFilterByText(blockAnnotations: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                            filter: Filter): ReadonlyArray<IBlock<IRepoAnnotationContent>> {

        if (filter.text && filter.text.length > 0) {
            const normalizedFilterText = filter.text.toLowerCase();

            const hasText = (block: IBlock<IRepoAnnotationContent>): block is IBlock<IRepoAnnotationTextContent> => {
                return block.content.type !== AnnotationContentType.AREA_HIGHLIGHT;
            };

            const matchesFilter = (block: IBlock<IRepoAnnotationTextContent>): boolean => {
                const normalizedAnnotationText = BlockTextContentUtils
                    .getTextContentMarkdown(block.content)
                    .toLowerCase();
                return normalizedAnnotationText.indexOf(normalizedFilterText) >= 0;
            };

            return blockAnnotations
                .filter(hasText)
                .filter(matchesFilter);

        }

        return blockAnnotations;

    }

    function doFilterByTags(tagIndex: ReverseIndex,
                            blockAnnotations: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                            filter: Filter): ReadonlyArray<IBlock<IRepoAnnotationContent>> {

        if (! filter.tags || filter.tags.length === 0) {
            return blockAnnotations;
        }

        const links: ReadonlyArray<IBlockLink> = filter.tags.map(({ id, label }) => ({ id, text: label }));

        return BlockLinksMatcher.filter(tagIndex, blockAnnotations, links);
    }

}
