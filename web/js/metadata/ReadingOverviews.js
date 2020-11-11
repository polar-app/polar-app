"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingOverviews = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const HitMap_1 = require("polar-shared/src/util/HitMap");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const PagemarkMode_1 = require("polar-shared/src/metadata/PagemarkMode");
const Reducers_1 = require("polar-shared/src/util/Reducers");
const Tuples_1 = require("polar-shared/src/util/Tuples");
const Multimap_1 = require("polar-shared/src/util/Multimap");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const PRE_EXISTING_DAY = '!preexisting';
class ReadingOverviews {
    static toDatePercs(records) {
        const mapping = new Multimap_1.ArrayListMultimap();
        for (const record of records) {
            const date = record.preExisting ? PRE_EXISTING_DAY : ISODateTimeStrings_1.ISODateTimeStrings.toISODate(record.created);
            const created = record.created;
            mapping.put(date, {
                created,
                perc: record.progressByMode[PagemarkMode_1.PagemarkMode.READ] || 0
            });
        }
        const dates = [...mapping.keys()].sort();
        const result = [];
        for (const date of dates) {
            const perc = mapping.get(date)
                .sort(((a, b) => a.created.localeCompare(b.created)))
                .reduce(Reducers_1.Reducers.LAST)
                .perc;
            result.push({ date, perc });
        }
        return result;
    }
    static toDatePercDeltas(readingEntries) {
        const tuples = Tuples_1.Tuples.createSiblings(readingEntries);
        const result = [];
        for (const tuple of tuples) {
            if (!tuple.prev) {
                result.push(tuple.curr);
            }
            else {
                const perc = Math.abs(tuple.curr.perc - tuple.prev.perc);
                result.push({ date: tuple.curr.date, perc });
            }
        }
        return result;
    }
    static toLogicalPages(pageMeta) {
        const dimensions = pageMeta.pageInfo.dimensions;
        if (dimensions && Preconditions_1.isPresent(dimensions.height)) {
            return dimensions.height / 1100;
        }
        return 1;
    }
    static toFixedFloat(value) {
        return Numbers_1.Numbers.toFixedFloat(value, 2);
    }
    static compute(pageMetas) {
        const hitMap = new HitMap_1.HitMap();
        for (const pageMeta of pageMetas) {
            const logicalPages = this.toLogicalPages(pageMeta);
            const datePercs = this.toDatePercs(Object.values(pageMeta.readingProgress));
            const datePercDeltas = this.toDatePercDeltas(datePercs);
            for (const datePercDelta of datePercDeltas) {
                const date = datePercDelta.date;
                const perc = datePercDelta.perc;
                const nrPages = this.toFixedFloat((perc / 100) * logicalPages);
                hitMap.registerHit(date, nrPages);
            }
        }
        const result = hitMap.toLiteralMap();
        delete result[PRE_EXISTING_DAY];
        return result;
    }
}
exports.ReadingOverviews = ReadingOverviews;
//# sourceMappingURL=ReadingOverviews.js.map