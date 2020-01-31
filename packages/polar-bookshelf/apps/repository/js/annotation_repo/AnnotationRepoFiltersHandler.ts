import {FilteredTags} from '../FilteredTags';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {SetArrays} from "polar-shared/src/util/SetArrays";

/**
 * Keeps track of the filters so that we can just call a function updating
 * us with all the filters at once.
 */
export class AnnotationRepoFiltersHandler {

    public readonly filters: MutableAnnotationRepoFilters;

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

    /**
     * Update the filters with a given set of partial filters and dispatch
     * when necessary.
     *
     * @param filters
     */
    public update(filters: PartialAnnotationRepoFilters) {

        let modified = false;

        if (filters.flagged !== undefined) {
            this.filters.flagged = filters.flagged;
            modified = true;
        }

        if (filters.archived !== undefined) {
            this.filters.archived = filters.archived;
            modified = true;
        }

        if (filters.text !== undefined) {
            this.filters.text = filters.text;
            modified = true;
        }

        if (filters.filteredTags !== undefined) {
            this.filters.filteredTags = filters.filteredTags;
            modified = true;
        }

        if (filters.colors !== undefined &&
            ! SetArrays.equal(this.filters.colors, filters.colors)) {
            this.filters.colors = filters.colors;
            modified = true;
        }

        if (filters.annotationTypes !== undefined &&
            ! SetArrays.equal(this.filters.annotationTypes, filters.annotationTypes)) {

            this.filters.annotationTypes = filters.annotationTypes;
            modified = true;

        }

        if (modified) {
            this.dispatch();
        }

    }

    private dispatch() {
        this.onFiltered(this.filters);
    }

}

/**
 * The currently applied annotation filters.
 */
export interface MutableAnnotationRepoFilters {

    /**
     * When true, only show flagged documents.
     */
    flagged?: boolean;

    /**
     *  When true, show both archived and non-archived documents.
     */
    archived?: boolean;

    colors: ReadonlyArray<HighlightColor>;

    text: string;

    filteredTags: FilteredTags;

    annotationTypes: ReadonlyArray<AnnotationType>;

}

export interface AnnotationRepoFilters extends Readonly<MutableAnnotationRepoFilters> {

}

export interface PartialAnnotationRepoFilters extends Partial<Readonly<MutableAnnotationRepoFilters>> {

}

export class DefaultAnnotationRepoFilters implements MutableAnnotationRepoFilters {

    public readonly archived: boolean = true;

    public readonly filteredTags: FilteredTags = new FilteredTags();

    public readonly flagged: boolean = false;

    public readonly text: string = "";

    public readonly annotationTypes: ReadonlyArray<AnnotationType> = [];

    public readonly colors: ReadonlyArray<AnnotationType> = [];

}

export type FilteredCallback = (filters: AnnotationRepoFilters) => void;

export type UpdateFiltersCallback = (filters: PartialAnnotationRepoFilters) => void;
