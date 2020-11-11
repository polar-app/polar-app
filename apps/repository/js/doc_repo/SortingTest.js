"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MockRepoDocInfos_1 = require("../MockRepoDocInfos");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const Sorting_1 = require("./Sorting");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Assertions_1 = require("../../../../web/js/test/Assertions");
const now = new Date();
const today = ISODateTimeStrings_1.ISODateTimeStrings.create();
const yesterday = ISODateTimeStrings_1.ISODateTimeStrings.create(TimeDurations_1.TimeDurations.compute('-1d', now));
const toMinimalDoc = (repoDocInfo) => {
    return {
        title: repoDocInfo.title,
        tags: Object.values(repoDocInfo.tags || {})
    };
};
const tagsToString = (repoDocInfo) => {
    return Object.keys(repoDocInfo.tags || {})
        .map(current => current.toLowerCase())
        .sort()
        .join(', ');
};
describe('Sorting', function () {
    it("by tags", function () {
        const docs = [
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 0', yesterday, today, [], 50),
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 1', yesterday, today, ['alice'], 50),
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 2', yesterday, today, ['bob', 'alice'], 50),
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 3', yesterday, today, ['carol'], 50),
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 4', yesterday, today, ['dan'], 50),
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 5', yesterday, today, ['elizabeth', 'alice'], 50),
            MockRepoDocInfos_1.MockRepoDocInfos.createDoc('doc 6', yesterday, today, ['elizabeth'], 50),
        ];
        const sorted = ArrayStreams_1.arrayStream(Sorting_1.Sorting.stableSort(docs, Sorting_1.Sorting.getComparator('asc', 'tags')))
            .map(tagsToString)
            .collect();
        Assertions_1.assertJSON(sorted, [
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
//# sourceMappingURL=SortingTest.js.map