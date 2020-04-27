import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocInfos} from '../RepoDocInfos';
import {FilteredTags} from '../FilteredTags';
import {Provider} from 'polar-shared/src/util/Providers';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag} from 'polar-shared/src/tags/Tags';
import {TagMatcherFactory} from '../../../../web/js/tags/TagMatcher';
import {Strings} from "polar-shared/src/util/Strings";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {Preconditions} from "polar-shared/src/Preconditions";


/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export namespace DocRepoFilters2 {

    export interface Filters {

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
                            filters: Filters): ReadonlyArray<RepoDocInfo> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoDocInfos = doFilterValid(repoDocInfos, filters);
        repoDocInfos = doFilterByTitle(repoDocInfos, filters);
        repoDocInfos = doFilterFlagged(repoDocInfos, filters);
        repoDocInfos = doFilterArchived(repoDocInfos, filters);
        repoDocInfos = doFilterByTags(repoDocInfos, filters);

        return repoDocInfos;

    }

    function doFilterValid(repoDocs: ReadonlyArray<RepoDocInfo>, filters: Filters): ReadonlyArray<RepoDocInfo> {
        return repoDocs.filter(current => RepoDocInfos.isValid(current));
    }

    function doFilterByTitle(repoDocs: ReadonlyArray<RepoDocInfo>, filters: Filters): ReadonlyArray<RepoDocInfo> {

        if (! Strings.empty(filters.title)) {

            // the string we are searching for
            const toSTR = (value: string | undefined): string => {

                return Optional.of(value)
                    .getOrElse("")
                    .toLowerCase();

            };

            const searchString = toSTR(filters.title);

            return repoDocs.filter(current => {

                const title = toSTR(current.title);
                const filename = toSTR(current.filename);

                return title.includes(searchString) || filename.includes(searchString);

            });

        }

        return repoDocs;

    }

    function doFilterFlagged(repoDocs: ReadonlyArray<RepoDocInfo>, filters: Filters): ReadonlyArray<RepoDocInfo> {

        if (filters.flagged) {
            return repoDocs.filter(current => current.flagged);
        }

        return repoDocs;

    }

    function doFilterArchived(repoDocs: ReadonlyArray<RepoDocInfo>, filters: Filters): ReadonlyArray<RepoDocInfo> {

        if (! filters.archived) {
            return repoDocs.filter(current => !current.archived);
        }

        return repoDocs;

    }

    function doFilterByTags(repoDocs: ReadonlyArray<RepoDocInfo>, filters: Filters): ReadonlyArray<RepoDocInfo>  {

        if (! filters.tags) {
            return repoDocs;
        }

        const tags = filters.tags.filter(current => current.id !== '/');

        const tagMatcherFactory = new TagMatcherFactory(tags);

        if (tags.length === 0) {
            // we're done as there are no tags.
            return repoDocs;
        }

        return tagMatcherFactory.filter(repoDocs,
                                        current => Object.values(current.docInfo.tags || {}));

    }

}
