"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsInitializer = void 0;
const Analytics_1 = require("./Analytics");
const Version_1 = require("polar-shared/src/util/Version");
const Firebase_1 = require("../firebase/Firebase");
const Emails_1 = require("polar-shared/src/util/Emails");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const FirestoreCollections_1 = require("../../../apps/repository/js/reviewer/FirestoreCollections");
var AnalyticsInitializer;
(function (AnalyticsInitializer) {
    function doInit() {
        init()
            .catch(err => console.error("Could not init analytics: ", err));
    }
    AnalyticsInitializer.doInit = doInit;
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield FirestoreCollections_1.FirestoreCollections.configure();
            initVersion();
            initAccount();
            initHeartbeat();
        });
    }
    AnalyticsInitializer.init = init;
    function initVersion() {
        Analytics_1.Analytics.version(Version_1.Version.get());
    }
    function initHeartbeat() {
        Analytics_1.Analytics.heartbeat();
    }
    function initAccount() {
        const doUserCreated = (user) => {
            const doUserEmailDomain = () => {
                const user_email_domain = Emails_1.Emails.toDomain(user.email) || "";
                Analytics_1.Analytics.traits({
                    user_email_domain,
                });
            };
            const doUserCreated = () => {
                if (user.metadata.creationTime) {
                    const user_created_week = ISODateTimeStrings_1.ISODateTimeStrings.toPartialWeek(user.metadata.creationTime);
                    const user_created_month = ISODateTimeStrings_1.ISODateTimeStrings.toPartialMonth(user.metadata.creationTime);
                    const user_created_day = ISODateTimeStrings_1.ISODateTimeStrings.toPartialDay(user.metadata.creationTime);
                    Analytics_1.Analytics.traits({
                        user_created_week,
                        user_created_month,
                        user_created_day
                    });
                }
            };
            doUserEmailDomain();
            doUserCreated();
        };
        const user = Firebase_1.Firebase.currentUser();
        if (user) {
            Analytics_1.Analytics.identify(user.uid);
            doUserCreated(user);
        }
    }
})(AnalyticsInitializer = exports.AnalyticsInitializer || (exports.AnalyticsInitializer = {}));
//# sourceMappingURL=AnalyticsInitializer.js.map