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
exports.MachineDatastores = void 0;
const Firestore_1 = require("../firebase/Firestore");
const Logger_1 = require("polar-shared/src/logger/Logger");
const MachineIDs_1 = require("polar-shared/src/util/MachineIDs");
const log = Logger_1.Logger.create();
class MachineDatastores {
    static ref() {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const id = MachineIDs_1.MachineIDs.get();
            const ref = firestore
                .collection(this.COLLECTION_NAME)
                .doc(id);
            return ref;
        });
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = yield this.ref();
            const snapshot = yield ref.get();
            return this.toDoc(snapshot);
        });
    }
    static toDoc(snapshot) {
        if (!snapshot.exists) {
            return;
        }
        return snapshot.data();
    }
    static onSnapshot(onNext) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = yield this.ref();
            return ref.onSnapshot(snapshot => {
                const doc = this.toDoc(snapshot);
                if (!doc) {
                    return;
                }
                onNext(doc);
            }, ERR_HANDLER);
        });
    }
}
exports.MachineDatastores = MachineDatastores;
MachineDatastores.COLLECTION_NAME = "machine_datastore";
const ERR_HANDLER = (err) => console.error("Could not create snapshot for account: ", err);
//# sourceMappingURL=MachineDatastores.js.map