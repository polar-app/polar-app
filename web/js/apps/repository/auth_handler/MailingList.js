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
exports.MailingList = void 0;
const Mailchimp_1 = require("../../../util/thirdparty/Mailchimp");
const LocalPrefs_1 = require("../../../util/LocalPrefs");
const Analytics_1 = require("../../../analytics/Analytics");
class MailingList {
    static subscribeWhenNecessary(authStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!authStatus.user) {
                return;
            }
            const { email, displayName } = authStatus.user;
            if (!email) {
                return;
            }
            yield LocalPrefs_1.LocalPrefs.markOnceExecuted('did-mailing-list', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    Analytics_1.Analytics.event({ category: 'mailing-list', action: 'subscribed' });
                    yield Mailchimp_1.Mailchimp.subscribe(email, displayName || "");
                }
                catch (e) {
                    Analytics_1.Analytics.event({ category: 'mailing-list', action: 'failed' });
                    throw e;
                }
            }));
        });
    }
}
exports.MailingList = MailingList;
//# sourceMappingURL=MailingList.js.map