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
exports.FirestoreAnalytics = void 0;
const Heartbeats_1 = require("polar-firebase/src/firebase/om/Heartbeats");
const Firebase_1 = require("../../firebase/Firebase");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class FirestoreAnalytics {
    event(event) {
    }
    event2(event, data) {
    }
    identify(userId) {
    }
    page(name) {
    }
    traits(traits) {
    }
    version(version) {
    }
    heartbeat() {
        const doWrite = () => __awaiter(this, void 0, void 0, function* () {
            const uid = yield Firebase_1.Firebase.currentUserID();
            yield Heartbeats_1.Heartbeats.write(uid);
        });
        doWrite()
            .catch(err => log.error(err));
    }
}
exports.FirestoreAnalytics = FirestoreAnalytics;
//# sourceMappingURL=FirestoreAnalytics.js.map