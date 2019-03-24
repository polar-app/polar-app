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
 * Keeps track of the filters so that we can just call a function updating
 * us with all the filters at once.
 */
export class AnnotationRepoFiltersHandler {

    public readonly filters: AnnotationRepoFilters;

    constructor(private onFiltered: FilteredCallback) {
        this.filters = new DefaultAnnotationRepoFilters();
    }

    public onToggleFlaggedOnly(value: boolean) {
        this.filters.flagged = value;
        this.dispatch();
    }

    public onToggleFilterArchived(value: boolean) {
        this.filters.archived = value;
        this.dispatch();
    }

    public onFilterByText(text: string) {
        this.filters.text = text;
        this.dispatch();
    }

    public onFilterByTags(filteredTags: FilteredTags) {
        this.filters.filteredTags = filteredTags;
        this.dispatch();
    }

    private dispatch() {
        this.onFiltered(this.filters);
    }

}

/**
 * The currently applied annotation filters.
 */
export interface AnnotationRepoFilters {

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

export class DefaultAnnotationRepoFilters implements AnnotationRepoFilters {

    public readonly archived: boolean = false;

    public readonly filteredTags: FilteredTags = new FilteredTags();

    public readonly flagged: boolean = false;

    public readonly text: string = "";

}

export type FilteredCallback = (filters: AnnotationRepoFilters) => void;

