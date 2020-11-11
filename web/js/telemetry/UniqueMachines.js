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
exports.UniqueMachines = void 0;
const Firestore_1 = require("../firebase/Firestore");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Version_1 = require("polar-shared/src/util/Version");
const MachineIDs_1 = require("polar-shared/src/util/MachineIDs");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
class UniqueMachines {
    static write() {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const id = MachineIDs_1.MachineIDs.get();
            const ref = firestore.collection("unique_machines")
                .doc(id);
            const createRecord = () => __awaiter(this, void 0, void 0, function* () {
                const doc = yield ref.get();
                const runtime = AppRuntime_1.AppRuntime.get();
                const version = Version_1.Version.get();
                if (doc.exists) {
                    const existing = doc.data();
                    const toRuntime = () => {
                        if (existing.runtime) {
                            const set = new Set(existing.runtime);
                            set.add(runtime);
                            return [...set];
                        }
                        return [runtime];
                    };
                    const record = {
                        machine: existing.machine,
                        created: existing.created,
                        updated: ISODateTimeStrings_1.ISODateTimeStrings.create(),
                        runtime: toRuntime(),
                        version
                    };
                    return record;
                }
                const now = ISODateTimeStrings_1.ISODateTimeStrings.create();
                const record = {
                    machine: id,
                    created: now,
                    updated: now,
                    runtime: [runtime],
                    version
                };
                return record;
            });
            const record = yield createRecord();
            yield ref.set(record);
        });
    }
    static trigger() {
        this.write()
            .catch(err => console.error("Unable to write unique machine record: ", err));
    }
}
exports.UniqueMachines = UniqueMachines;
//# sourceMappingURL=UniqueMachines.js.map