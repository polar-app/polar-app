"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalPrioritizedComponentRef = void 0;
const ConditionalSetting_1 = require("../../../../../web/js/ui/util/ConditionalSetting");
const DatastoreOverviewPolicies_1 = require("./DatastoreOverviewPolicies");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class ConditionalPrioritizedComponentRef {
    constructor(settingKey, defaultPriority, userLevel) {
        this.settingKey = settingKey;
        this.defaultPriority = defaultPriority;
        this.userLevel = userLevel;
    }
    priority(datastoreOverview) {
        const conditionalSetting = new ConditionalSetting_1.ConditionalSetting(this.settingKey);
        if (this.userLevel && !DatastoreOverviewPolicies_1.DatastoreOverviewPolicies.isLevel(this.userLevel, datastoreOverview)) {
            log.info("User is not at user level: " + this.userLevel);
            return undefined;
        }
        if (conditionalSetting.get().getOrElse('') === 'do-not-show-again') {
            return undefined;
        }
        if (conditionalSetting.get().getOrElse('') !== '') {
            const val = conditionalSetting.get().getOrElse('');
            if (val.match(/[0-9]+/)) {
                if (Date.now() > parseInt(val)) {
                    return this.defaultPriority;
                }
                else {
                    return undefined;
                }
            }
        }
        return this.defaultPriority;
    }
}
exports.ConditionalPrioritizedComponentRef = ConditionalPrioritizedComponentRef;
//# sourceMappingURL=ConditionalPrioritizedComponentRef.js.map