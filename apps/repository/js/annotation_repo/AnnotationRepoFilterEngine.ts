import {Strings} from '../../../../web/js/util/Strings';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {Tags} from '../../../../web/js/tags/Tags';
import {isPresent} from '../../../../web/js/Preconditions';
import {Sets} from '../../../../web/js/util/Sets';
import {Provider} from '../../../../web/js/util/Providers';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotations} from '../RepoAnnotations';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';
import {DefaultAnnotationRepoFilters} from './AnnotationRepoFiltersHandler';

/**
 * The actual engine that applies the filters once they are updated.
 */
export class AnnotationRepoFilterEngine {

    private filters: AnnotationRepoFilters = new DefaultAnnotationRepoFilters();

    constructor(private repoAnnotationsProvider: Provider<ReadonlyArray<RepoAnnotation>>,
                private onRefreshed: (repoAnnotations: ReadonlyArray<RepoAnnotation>) => void) {

    }

    public onFiltered(filters: AnnotationRepoFilters) {
        this.filters = filters;
        this.doUpdate();
    }

    /**
     * Called when the data in the provider has been updated and we should
     * re-apply the filters and call onRefershed again.
     */
    public onProviderUpdated() {
        this.doUpdate();
    }

    private doUpdate() {
        this.onRefreshed(this.filter(this.repoAnnotationsProvider()));
    }

    private filter(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoAnnotations = this.doFilterValid(repoAnnotations);
        repoAnnotations = this.doFilterByTitle(repoAnnotations);
        repoAnnotations = this.doFilterFlagged(repoAnnotations);
        repoAnnotations = this.doFilterArchived(repoAnnotations);
        repoAnnotations = this.doFilterByTags(repoAnnotations);

        return repoAnnotations;

    }

    private doFilterValid(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {
        return repoAnnotations.filter(current => RepoAnnotations.isValid(current));
    }

    private doFilterByTitle(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (! Strings.empty(this.filters.text)) {

            return repoAnnotations
                .filter(current => isPresent(current.text))
                .filter(current => current.text!.toLowerCase().indexOf(this.filters.text.toLowerCase()) >= 0);

        }

        return repoAnnotations;

    }

    private doFilterFlagged(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (this.filters.flagged) {
            return repoAnnotations.filter(current => current.docInfo.flagged);
        }

        return repoAnnotations;

    }

    private doFilterArchived(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (! this.filters.archived) {
            return repoAnnotations.filter(current => !current.docInfo.archived);
        }

        return repoAnnotations;

    }

    private doFilterByTags(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        RendererAnalytics.event({category: 'user', action: 'filter-by-tags'});

        const tags = Tags.toIDs(this.filters.filteredTags.get());

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
