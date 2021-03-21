import {MockRepoDocInfos} from "../MockRepoDocInfos";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";
import { Sorting } from "./Sorting";
import {Tag} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {RepoDocInfo} from "../RepoDocInfo";
import {assertJSON} from "../../../../web/js/test/Assertions";
import TypeConverter = Sorting.TypeConverter;
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

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

const converter: TypeConverter<RepoDocInfo, IDocInfo> = (from) => from.docInfo;

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

        const toColumnString = (repoDocInfo: RepoDocInfo): string => {

            return Object.keys(repoDocInfo.tags || [])
                .map(current => current.toLowerCase())
                .sort()
                .join(', ');

        };

        const sorted =
            arrayStream(Sorting.stableSort(docs, Sorting.createComparator('asc', 'tags', converter)))
                .map(toColumnString)
                .collect()

        assertJSON(sorted, [
            "alice",
            "alice, bob",
            "alice, elizabeth",
            "carol",
            "dan",
            "elizabeth",
            "",
        ]);

    });

    //
    // it("by authors", function() {
    //
    //
    //     function createDoc0() {
    //         const doc = MockRepoDocInfos.createDoc('doc 0', yesterday, today, [], 50);
    //         doc.docInfo.authors = ['alice'];
    //         return doc;
    //     }
    //
    //     function createDoc1() {
    //         const doc = MockRepoDocInfos.createDoc('doc 0', yesterday, today, [], 50);
    //         doc.docInfo.authors = ['bob'];
    //         return doc;
    //     }
    //
    //     function createDoc2() {
    //         const doc = MockRepoDocInfos.createDoc('doc 0', yesterday, today, [], 50);
    //         return doc;
    //     }
    //
    //     const docs = [
    //         createDoc0(),
    //         createDoc1(),
    //         createDoc2(),
    //     ];
    //
    //     const sorted =
    //         arrayStream(Sorting.stableSort(docs, Sorting.getComparator('asc', 'authors')))
    //             .map(tagsToString)
    //             .collect()
    //
    //     assertJSON(sorted, [
    //         "",
    //         "alice",
    //         "alice, bob",
    //         "alice, elizabeth",
    //         "carol",
    //         "dan",
    //         "elizabeth"
    //     ]);
    //
    // });


});
