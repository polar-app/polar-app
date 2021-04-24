import {Tag} from 'polar-shared/src/tags/Tags';
import {Strings} from "polar-shared/src/util/Strings";
import {isPresent} from "polar-shared/src/Preconditions";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {
    IDocAnnotation,
    IDocAnnotationRef
} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {RepoDocAnnotations} from "../RepoDocAnnotations";
import {TagMatcher2} from "../../../../web/js/tags/TagMatcher2";


/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export namespace AnnotationRepoFilters2 {

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

        readonly text: string;

        readonly tags?: ReadonlyArray<Tag>;

        readonly annotationTypes?: ReadonlyArray<AnnotationType>;

    }

    export function execute<D extends IDocAnnotationRef>(docAnnotations: ReadonlyArray<D>,
                                                         filter: Filter): ReadonlyArray<D> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        docAnnotations = doFilterValid(docAnnotations, filter);
        docAnnotations = doFilterByText(docAnnotations, filter);
        // repoAnnotations = doFilterFlagged(repoAnnotations);
        // repoAnnotations = doFilterArchived(repoAnnotations);
        docAnnotations = doFilterByTags(docAnnotations, filter);
        docAnnotations = doFilterByColor(docAnnotations, filter);
        docAnnotations = doFilterByAnnotationTypes(docAnnotations, filter);

        return docAnnotations;

    }

    function doFilterByColor<D extends IDocAnnotationRef>(docAnnotations: ReadonlyArray<D>,
                                                          filter: Filter): ReadonlyArray<D> {

        const {colors} = filter;

        if (colors && colors.length > 0) {
            return docAnnotations.filter(current => {
                const color = HighlightColors.withDefaultColor(current.color);
                return colors.includes(color);
            });
        }

        return docAnnotations;

    }

    function doFilterByAnnotationTypes<D extends IDocAnnotationRef>(docAnnotations: ReadonlyArray<D>,
                                                                    filter: Filter): ReadonlyArray<D> {

        const {annotationTypes} = filter;

        if (annotationTypes && annotationTypes.length > 0) {
            return docAnnotations.filter(current => annotationTypes.includes(current.annotationType));
        }

        return docAnnotations;

    }

    function doFilterValid<D extends IDocAnnotationRef>(docAnnotations: ReadonlyArray<D>,
                                                        filter: Filter): ReadonlyArray<D> {
        return docAnnotations.filter(current => RepoDocAnnotations.isValid(current));
    }

    function doFilterByText<D extends IDocAnnotationRef>(docAnnotations: ReadonlyArray<D>,
                                                         filter: Filter): ReadonlyArray<D> {

        if (! Strings.empty(filter.text)) {

            // Analytics.event({category: 'annotation-view', action: 'filter-by-text'});

            return docAnnotations
                .filter(current => isPresent(current.text))
                .filter(current => current.text!.toLowerCase().indexOf(filter.text.toLowerCase()) >= 0);

        }

        return docAnnotations;

    }

    function doFilterFlagged<D extends IDocAnnotation>(docAnnotations: ReadonlyArray<IDocAnnotation>,
                                                       filter: Filter): ReadonlyArray<IDocAnnotation> {

        if (filter.flagged) {
            return docAnnotations.filter(current => current.docInfo?.flagged);
        }

        return docAnnotations;

    }

    function doFilterArchived<D extends IDocAnnotation>(docAnnotations: ReadonlyArray<IDocAnnotation>, filter: Filter): ReadonlyArray<IDocAnnotation> {

        if (! filter.archived) {
            return docAnnotations.filter(current => !current.docInfo?.archived);
        }

        return docAnnotations;

    }

    function doFilterByTags<D extends IDocAnnotationRef>(docAnnotations: ReadonlyArray<D>, filter: Filter): ReadonlyArray<D> {

        if (! filter.tags) {
            return docAnnotations;
        }

        const tags = filter.tags.filter(current => current.id !== '/');

        if (tags.length === 0) {
            return docAnnotations;
        }

        return TagMatcher2.filter(docAnnotations, tags);
    }


}
