"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocInfoStatistics = void 0;
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const HitMap_1 = require("polar-shared/src/util/HitMap");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const Tags_1 = require("polar-shared/src/tags/Tags");
class DocInfoStatistics {
    static computeDocumentsAddedRate(docInfos) {
        const result = {};
        for (const docInfo of docInfos) {
            if (docInfo.added) {
                const addedDate = ISODateTimeStrings_1.ISODateTimeStrings.parse(docInfo.added);
                const key = ISODateTimeStrings_1.ISODateTimeStrings.toISODateString(addedDate);
                if (key) {
                    const entry = Dictionaries_1.Dictionaries.computeIfAbsent(result, key, () => {
                        return { date: key, value: 0 };
                    });
                    ++entry.value;
                }
            }
        }
        return Object.values(result)
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    static computeTopTags(docInfos, topN = 25) {
        const hitMap = new HitMap_1.HitMap();
        for (const docInfo of docInfos) {
            const tags = Tags_1.Tags.onlyRegular(Object.values(docInfo.tags || {}));
            for (const tag of tags) {
                hitMap.registerHit(tag.label);
            }
        }
        return Arrays_1.Arrays.head(hitMap.toRanked(), topN);
    }
}
exports.DocInfoStatistics = DocInfoStatistics;
//# sourceMappingURL=DocInfoStatistics.js.map