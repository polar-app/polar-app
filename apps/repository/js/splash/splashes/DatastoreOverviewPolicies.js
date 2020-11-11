"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreOverviewPolicies = void 0;
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class DatastoreOverviewPolicies {
    static isLevel(level, datastoreOverview) {
        Preconditions_1.Preconditions.assertPresent(datastoreOverview, 'datastoreOverview');
        switch (level) {
            case 'active':
                return this.isActive(datastoreOverview);
            case 'premium':
                return this.isPremium(datastoreOverview);
            case '24h':
                return this.is24H(datastoreOverview);
        }
    }
    static is24H(datastoreOverview) {
        if (!datastoreOverview.created) {
            return false;
        }
        const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(datastoreOverview.created);
        return TimeDurations_1.TimeDurations.hasElapsed(since, '1d');
    }
    static isActive(datastoreOverview) {
        if (!datastoreOverview.created) {
            return false;
        }
        const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(datastoreOverview.created);
        return TimeDurations_1.TimeDurations.hasElapsed(since, '1w') && datastoreOverview.nrDocs > 5;
    }
    static isPremium(datastoreOverview) {
        if (!datastoreOverview.created) {
            log.debug("No created time in datastore so unable to determine premium level");
            return false;
        }
        const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(datastoreOverview.created);
        const elapsed = TimeDurations_1.TimeDurations.hasElapsed(since, '2w');
        const hasMinDocs = datastoreOverview.nrDocs > 15;
        const result = elapsed && hasMinDocs;
        log.info(`since: ${since}, expired: ${elapsed}, hasMinDocs: ${hasMinDocs}, result: ${result}`);
        return result;
    }
}
exports.DatastoreOverviewPolicies = DatastoreOverviewPolicies;
//# sourceMappingURL=DatastoreOverviewPolicies.js.map