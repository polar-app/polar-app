import {Strings} from '../../../../web/js/util/Strings';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {Tags} from '../../../../web/js/tags/Tags';
import {isPresent} from '../../../../web/js/Preconditions';
import {Sets} from '../../../../web/js/util/Sets';
import {FilteredTags} from '../FilteredTags';
import {Provider} from '../../../../web/js/util/Providers';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotations} from '../RepoAnnotations';
import {FilteredCallback} from './AnnotationRepoFiltersHandler';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';

/**
 * The actual engine that applies the filters once they are updated.
 */
export class AnnotationRepoFilterEngine {

    constructor(private repoAnnotationsProvider: Provider<RepoAnnotation[]>) {

    }

    public onFiltered(filters: AnnotationRepoFilters) {
        return this.filter(filters, this.repoAnnotationsProvider());
    }

    private filter(filters: AnnotationRepoFilters, repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoAnnotations = this.doFilterValid(repoAnnotations);
        repoAnnotations = this.doFilterByTitle(filters, repoAnnotations);
        repoAnnotations = this.doFilterFlagged(filters, repoAnnotations);
        repoAnnotations = this.doFilterArchived(filters, repoAnnotations);
        repoAnnotations = this.doFilterByTags(filters, repoAnnotations);

        return repoAnnotations;

    }

    private doFilterValid(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {
        return repoAnnotations.filter(current => RepoAnnotations.isValid(current));
    }

    private doFilterByTitle(filters: AnnotationRepoFilters, repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        if (! Strings.empty(filters.text)) {

            return repoAnnotations
                .filter(current => isPresent(current.text))
                .filter(current => current.text!.toLowerCase().indexOf(filters.text.toLowerCase()) >= 0);

        }

        return repoAnnotations;

    }

    private doFilterFlagged(filters: AnnotationRepoFilters,
                            repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        if (filters.flagged) {
            return repoAnnotations.filter(current => current.docInfo.flagged);
        }

        return repoAnnotations;

    }

    private doFilterArchived(filters: AnnotationRepoFilters,
                             repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        if (! filters.archived) {
            return repoAnnotations.filter(current => !current.docInfo.archived);
        }

        return repoAnnotations;

    }

    private doFilterByTags(filters: AnnotationRepoFilters,
                           repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        RendererAnalytics.event({category: 'user', action: 'filter-by-tags'});

        const tags = Tags.toIDs(filters.filteredTags.get());

        return repoAnnotations.filter(current => {

            if (tags.length === 0) {
                // there is no filter in place...
                return true;
            }

            if (! isPresent(current.docInfo.tags)) {
                // the document we're searching over has not tags.
                return false;
            }

            const intersection =
                Sets.intersection(tags, Tags.toIDs(Object.values(current.docInfo.tags!)));

            return intersection.length === tags.length;


        });

    }

}
