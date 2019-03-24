import {Strings} from '../../../../web/js/util/Strings';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {Tags} from '../../../../web/js/tags/Tags';
import {isPresent} from '../../../../web/js/Preconditions';
import {Sets} from '../../../../web/js/util/Sets';
import {FilteredTags} from '../FilteredTags';
import {Provider} from '../../../../web/js/util/Providers';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotations} from '../RepoAnnotations';

/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export class AnnotationRepoFilters {

    public readonly filters: CurrentAnnotationFilters;

    constructor(private onRefreshed: RefreshedCallback,
                private repoAnnotationsProvider: Provider<RepoAnnotation[]>) {

        this.filters = {
            flagged: false,
            archived: false,
            text: "",
            filteredTags: new FilteredTags()
        };

    }

    public onToggleFlaggedOnly(value: boolean) {
        this.filters.flagged = value;
        this.refresh();
    }

    public onToggleFilterArchived(value: boolean) {
        this.filters.archived = value;
        this.refresh();
    }

    public onFilterByText(text: string) {
        this.filters.text = text;
        this.refresh();
    }


    public refresh() {
        this.onRefreshed(this.filter(this.repoAnnotationsProvider()));
    }

    private filter(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoAnnotations = this.doFilterValid(repoAnnotations);
        repoAnnotations = this.doFilterByTitle(repoAnnotations);
        repoAnnotations = this.doFilterFlagged(repoAnnotations);
        repoAnnotations = this.doFilterArchived(repoAnnotations);
        repoAnnotations = this.doFilterByTags(repoAnnotations);

        return repoAnnotations;

    }

    private doFilterValid(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {
        return repoAnnotations.filter(current => RepoAnnotations.isValid(current));
    }

    private doFilterByTitle(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        if (! Strings.empty(this.filters.text)) {

            return repoAnnotations
                .filter(current => isPresent(current.text))
                .filter(current => current.text!.toLowerCase().indexOf(this.filters.text.toLowerCase()) >= 0);

        }

        return repoAnnotations;

    }

    private doFilterFlagged(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        if (this.filters.flagged) {
            return repoAnnotations.filter(current => current.docInfo.flagged);
        }

        return repoAnnotations;

    }

    private doFilterArchived(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

        if (! this.filters.archived) {
            return repoAnnotations.filter(current => !current.docInfo.archived);
        }

        return repoAnnotations;

    }

    private doFilterByTags(repoAnnotations: RepoAnnotation[]): RepoAnnotation[] {

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

/**
 * The currently applied annotation filters.
 */
interface CurrentAnnotationFilters {

    /**
     * When true, only show flagged documents.
     */
    flagged: boolean;

    /**
     *  When true, show both archived and non-archived documents.
     */
    archived: boolean;

    text: string;

    filteredTags: FilteredTags;

}

export type RefreshedCallback = (repoAnnotations: ReadonlyArray<RepoAnnotation>) => void;

