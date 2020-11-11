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
exports.GroupDatastores = void 0;
const DocMetas_1 = require("../../metadata/DocMetas");
const DatastoreImportFiles_1 = require("./rpc/DatastoreImportFiles");
const GroupProvisions_1 = require("./rpc/GroupProvisions");
const Firestore_1 = require("../../firebase/Firestore");
const FirebaseDatastore_1 = require("../FirebaseDatastore");
const BackendFileRefs_1 = require("../BackendFileRefs");
const Either_1 = require("../../util/Either");
const DocRefs_1 = require("./db/DocRefs");
const FirebaseDatastores_1 = require("../FirebaseDatastores");
const GroupDocsAdd_1 = require("./rpc/GroupDocsAdd");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class GroupDatastores {
    static provision(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield GroupProvisions_1.GroupProvisions.exec(request);
        });
    }
    static importFromGroup(persistenceLayer, groupDocRef) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupID, docRef } = groupDocRef;
            const { fingerprint, docID } = docRef;
            function importBackendFileRef() {
                return __awaiter(this, void 0, void 0, function* () {
                    function getDocInfoRecord(docID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            log.info("Getting doc info record: " + docID);
                            const firestore = yield Firestore_1.Firestore.getInstance();
                            const ref = firestore
                                .collection(FirebaseDatastore_1.DatastoreCollection.DOC_INFO)
                                .doc(docID);
                            const snapshot = yield ref.get();
                            return snapshot.data();
                        });
                    }
                    function getDocInfo(docID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const docInfoRecord = yield getDocInfoRecord(docID);
                            if (!docInfoRecord) {
                                throw new Error("Unable to import. No docInfo");
                            }
                            return docInfoRecord.value;
                        });
                    }
                    const docInfo = yield getDocInfo(docID);
                    const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(Either_1.Either.ofRight(docInfo));
                    if (!backendFileRef) {
                        throw new Error("No backend file ref");
                    }
                    yield DatastoreImportFiles_1.DatastoreImportFiles.exec({
                        docID,
                        backend: backendFileRef.backend,
                        fileRef: backendFileRef
                    });
                    return backendFileRef;
                });
            }
            function importDocMeta(backendFileRef) {
                return __awaiter(this, void 0, void 0, function* () {
                    function createDocMeta(backendFileRef) {
                        const docMeta = DocMetas_1.DocMetas.create(fingerprint, docRef.nrPages);
                        DocRefs_1.DocRefs.copyToDocInfo(docRef, docMeta.docInfo);
                        docMeta.docInfo.filename = backendFileRef.name;
                        docMeta.docInfo.backend = backendFileRef.backend;
                        docMeta.docInfo.hashcode = backendFileRef.hashcode;
                        return docMeta;
                    }
                    const docMeta = createDocMeta(backendFileRef);
                    function writeDocMeta() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const docInfo = docMeta.docInfo;
                            yield persistenceLayer.write(fingerprint, docMeta);
                            return docInfo;
                        });
                    }
                    yield writeDocMeta();
                    const docID = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(fingerprint);
                    return Object.assign(Object.assign({}, docRef), { docID });
                });
            }
            function doImport() {
                return __awaiter(this, void 0, void 0, function* () {
                    const docMeta = yield persistenceLayer.getDocMeta(fingerprint);
                    if (!docMeta) {
                        const backendFileRef = yield importBackendFileRef();
                        return yield importDocMeta(backendFileRef);
                    }
                    else {
                        const docID = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(fingerprint);
                        return DocRefs_1.DocRefs.fromDocMeta(docID, docMeta);
                    }
                });
            }
            const myDocRef = yield doImport();
            yield GroupDocsAdd_1.GroupDocsAdd.exec({ groupID, docs: [myDocRef] });
        });
    }
}
exports.GroupDatastores = GroupDatastores;
//# sourceMappingURL=GroupDatastores.js.map