import {MockRepoDocInfos} from "../MockRepoDocInfos";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";
import { Sorting } from "./Sorting";
import {Tag} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {assertJSON} from "../../../js/test/Assertions";

const now = new Date();
const today = ISODateTimeStrings.create();
const yesterday = ISODateTimeStrings.create(TimeDurations.compute('-1d', now));

interface MinimalDoc {
    readonly title: string;
    readonly tags: ReadonlyArray<Tag>;
}

const toMinimalDoc = (repoDocInfo: RepoDocInfo): MinimalDoc => {

    return {
        title: repoDocInfo.title,
        tags: Object.values(repoDocInfo.tags || {})
    };

};

const tagsToString = (repoDocInfo: RepoDocInfo) => {

    return Object.keys(repoDocInfo.tags || {})
        .map(current => current.toLowerCase())
        .sort()
        .join(', ');

};

describe('Sorting', function() {

    it("by tags", function() {

        const docs = [
            MockRepoDocInfos.createDoc('doc 0', yesterday, today, [], 50),
            MockRepoDocInfos.createDoc('doc 1', yesterday, today, ['alice'], 50),
            MockRepoDocInfos.createDoc('doc 2', yesterday, today, ['bob', 'alice'], 50),
            MockRepoDocInfos.createDoc('doc 3', yesterday, today, ['carol'], 50),
            MockRepoDocInfos.createDoc('doc 4', yesterday, today, ['dan'], 50),
            MockRepoDocInfos.createDoc('doc 5', yesterday, today, ['elizabeth', 'alice'], 50),
            MockRepoDocInfos.createDoc('doc 6', yesterday, today, ['elizabeth'], 50),
        ];

        const sorted =
            arrayStream(Sorting.stableSort(docs, Sorting.getComparator('asc', 'tags')))
                .map(tagsToString)
                .collect()

        assertJSON(sorted, [
            "",
            "alice",
            "alice, bob",
            "alice, elizabeth",
            "carol",
            "dan",
            "elizabeth"
        ]);

    });

});
