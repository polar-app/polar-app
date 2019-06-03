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
                private onUpdated: UpdatedCallback) {

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
        const repoAnnotations = this.repoAnnotationsProvider();
        this.onUpdated(this.filter(repoAnnotations));
    }

    private filter(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoAnnotations = this.doFilterValid(repoAnnotations);
        repoAnnotations = this.doFilterByText(repoAnnotations);
        // repoAnnotations = this.doFilterFlagged(repoAnnotations);
        // repoAnnotations = this.doFilterArchived(repoAnnotations);
        repoAnnotations = this.doFilterByTags(repoAnnotations);

        return repoAnnotations;

    }

    private doFilterValid(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {
        return repoAnnotations.filter(current => RepoAnnotations.isValid(current));
    }

    private doFilterByText(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (! Strings.empty(this.filters.text)) {

            RendererAnalytics.event({category: 'annotation-view', action: 'filter-by-text'});

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

        // FIXME: it would be better if this was a dual pass system where we
        // first found all the annotations under a folder, then all the tags
        // that ALSO matched.

        const tagIDs = Tags.toIDs(Tags.onlyTags(this.filters.filteredTags.get()));

        const folderIDs = Tags.toIDs(Tags.onlyFolders(this.filters.filteredTags.get()))
                            .filter(current => current !== '/');

        if (tagIDs.length > 0) {
            RendererAnalytics.event({category: 'annotation-view', action: 'filter-by-tags'});
        }

        if (tagIDs.length === 0) {
            // we're done as there are no tags.
            return repoAnnotations;
        }

        // FIXME: the logic here needs to be improved for folders.  Any folder
        // tag can now work with suffixes... so /CompSci will match
        //
        // /CompSci/Google
        //

        // Tags.

        return repoAnnotations.filter(current => {

            const docTags = Object.values(current.docInfo.tags || {});

            if (docTags.length === 0) {
                // the document we're searching over has no tags.
                return false;
            }

            const intersection =
                Sets.intersection(tagIDs, Tags.toIDs(docTags));

            return intersection.length === tagIDs.length;

        });

    }

}

export type UpdatedCallback = (repoAnnotations: ReadonlyArray<RepoAnnotation>) => void;

