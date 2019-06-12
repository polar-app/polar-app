import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocInfos} from '../RepoDocInfos';
import {Strings} from '../../../../web/js/util/Strings';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {Tags} from '../../../../web/js/tags/Tags';
import {isPresent} from '../../../../web/js/Preconditions';
import {Sets} from '../../../../web/js/util/Sets';
import {FilteredTags} from '../FilteredTags';
import {Provider} from '../../../../web/js/util/Providers';
import {Optional} from '../../../../web/js/util/ts/Optional';

/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export class DocRepoFilters {

    public readonly filters: Filters;

    constructor(private onRefreshed: RefreshedCallback,
                private repoDocInfosProvider: Provider<ReadonlyArray<RepoDocInfo>>) {

        this.filters = {
            flagged: false,
            archived: false,
            title: "",
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

    public onFilterByTitle(title: string) {
        this.filters.title = title;
        this.refresh();
    }


    public refresh() {
        this.onRefreshed(this.filter(this.repoDocInfosProvider()));
    }

    private filter(repoDocInfos: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoDocInfos = this.doFilterValid(repoDocInfos);
        repoDocInfos = this.doFilterByTitle(repoDocInfos);
        repoDocInfos = this.doFilterFlagged(repoDocInfos);
        repoDocInfos = this.doFilterArchived(repoDocInfos);
        repoDocInfos = this.doFilterByTags(repoDocInfos);

        return repoDocInfos;

    }

    private doFilterValid(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {
        return repoDocs.filter(current => RepoDocInfos.isValid(current));
    }

    private doFilterByTitle(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        if (! Strings.empty(this.filters.title)) {

            // the string we are searching for
            const toSTR = (value: string | undefined): string => {

                return Optional.of(value)
                    .getOrElse("")
                    .toLowerCase();

            };

            const searchString = toSTR(this.filters.title);

            return repoDocs.filter(current => {

                const title = toSTR(current.title);
                const filename = toSTR(current.filename);

                return title.includes(searchString) || filename.includes(searchString);

            });

        }

        return repoDocs;

    }

    private doFilterFlagged(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        if (this.filters.flagged) {
            return repoDocs.filter(current => current.flagged);
        }

        return repoDocs;

    }

    private doFilterArchived(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        if (! this.filters.archived) {
            return repoDocs.filter(current => !current.archived);
        }

        return repoDocs;

    }

    private doFilterByTags(repoDocs: ReadonlyArray<RepoDocInfo>): RepoDocInfo[] {

        RendererAnalytics.event({category: 'user', action: 'filter-by-tags'});

        const tags = Tags.toIDs(this.filters.filteredTags.get());

        return repoDocs.filter(current => {

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

interface Filters {

    /**
     * When true, only show flagged documents.
     */
    flagged: boolean;

    /**
     *  When true, show both archived and non-archived documents.
     */
    archived: boolean;

    title: string;

    filteredTags: FilteredTags;

}

export type RefreshedCallback = (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;

