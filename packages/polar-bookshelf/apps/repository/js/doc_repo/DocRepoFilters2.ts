import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocInfos} from '../RepoDocInfos';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag} from 'polar-shared/src/tags/Tags';
import {Strings} from "polar-shared/src/util/Strings";
import {TagMatcher2} from "../../../../web/js/tags/TagMatcher2";


/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export namespace DocRepoFilters2 {

    export interface Filter {

        /**
         * When true, only show flagged documents.
         */
        readonly flagged?: boolean;

        /**
         *  When true, show both archived and non-archived documents.
         */
        readonly archived?: boolean;

        readonly title?: string;

        readonly tags?: ReadonlyArray<Tag>;

    }

    export function execute(repoDocInfos: ReadonlyArray<RepoDocInfo>,
                            filter: Filter): ReadonlyArray<RepoDocInfo> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoDocInfos = doFilterValid(repoDocInfos, filter);
        repoDocInfos = doFilterByTitle(repoDocInfos, filter);
        repoDocInfos = doFilterFlagged(repoDocInfos, filter);
        repoDocInfos = doFilterArchived(repoDocInfos, filter);
        repoDocInfos = doFilterByTags(repoDocInfos, filter);

        return repoDocInfos;

    }

    function doFilterValid(repoDocs: ReadonlyArray<RepoDocInfo>, filter: Filter): ReadonlyArray<RepoDocInfo> {
        return repoDocs.filter(current => RepoDocInfos.isValid(current));
    }

    function doFilterByTitle(repoDocs: ReadonlyArray<RepoDocInfo>, filter: Filter): ReadonlyArray<RepoDocInfo> {

        if (! Strings.empty(filter.title)) {

            // the string we are searching for
            const toSTR = (value: string | undefined): string => {

                return Optional.of(value)
                    .getOrElse("")
                    .toLowerCase();

            };

            const searchString = toSTR(filter.title);

            return repoDocs.filter(current => {

                const title = toSTR(current.title);
                const filename = toSTR(current.filename);

                return title.includes(searchString) || filename.includes(searchString);

            });

        }

        return repoDocs;

    }

    function doFilterFlagged(repoDocs: ReadonlyArray<RepoDocInfo>, filter: Filter): ReadonlyArray<RepoDocInfo> {

        if (filter.flagged) {
            return repoDocs.filter(current => current.flagged);
        }

        return repoDocs;

    }

    function doFilterArchived(repoDocs: ReadonlyArray<RepoDocInfo>, filter: Filter): ReadonlyArray<RepoDocInfo> {

        if (! filter.archived) {
            return repoDocs.filter(current => !current.archived);
        }

        return repoDocs;

    }

    function doFilterByTags(repoDocs: ReadonlyArray<RepoDocInfo>, filter: Filter): ReadonlyArray<RepoDocInfo>  {

        if (! filter.tags || filter.tags.length === 0) {
            return repoDocs;
        }

        if (filter.tags && filter.tags.length === 1 && filter.tags[0].id === '/') {
            // if the user is selecting the / folder then show all files.
            return repoDocs;
        }

        const tags = filter.tags.filter(current => current.id !== '/');

        return TagMatcher2.filter(repoDocs, tags);

    }

}
