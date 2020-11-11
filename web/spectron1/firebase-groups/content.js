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
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Firebase_1 = require("../../js/firebase/Firebase");
const GroupProvisions_1 = require("../../js/datastore/sharing/rpc/GroupProvisions");
const ProfileUpdates_1 = require("../../js/datastore/sharing/db/ProfileUpdates");
const GroupJoins_1 = require("../../js/datastore/sharing/rpc/GroupJoins");
const chai_1 = require("chai");
const Groups_1 = require("../../js/datastore/sharing/db/Groups");
const GroupMembers_1 = require("../../js/datastore/sharing/db/GroupMembers");
const GroupMemberInvitations_1 = require("../../js/datastore/sharing/db/GroupMemberInvitations");
const Profiles_1 = require("../../js/datastore/sharing/db/Profiles");
const FirebaseDatastore_1 = require("../../js/datastore/FirebaseDatastore");
const FirebaseDatastore_2 = require("../../js/datastore/FirebaseDatastore");
const DocMetas_1 = require("../../js/metadata/DocMetas");
const DocMetas_2 = require("../../js/metadata/DocMetas");
const DocRefs_1 = require("../../js/datastore/sharing/db/DocRefs");
const GroupDocs_1 = require("../../js/datastore/sharing/db/GroupDocs");
const ProfileOwners_1 = require("../../js/datastore/sharing/db/ProfileOwners");
const UserGroups_1 = require("../../js/datastore/sharing/db/UserGroups");
const Contacts_1 = require("../../js/datastore/sharing/db/Contacts");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const GroupDeletes_1 = require("../../js/datastore/sharing/rpc/GroupDeletes");
const Promises_1 = require("../../js/util/Promises");
const BackendFileRefs_1 = require("../../js/datastore/BackendFileRefs");
const Either_1 = require("../../js/util/Either");
const FirebaseDatastores_1 = require("../../js/datastore/FirebaseDatastores");
const GroupLeaves_1 = require("../../js/datastore/sharing/rpc/GroupLeaves");
const Assertions_1 = require("../../js/test/Assertions");
const GroupDocsAdd_1 = require("../../js/datastore/sharing/rpc/GroupDocsAdd");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const GroupDatastores_1 = require("../../js/datastore/sharing/GroupDatastores");
const DefaultPersistenceLayer_1 = require("../../js/datastore/DefaultPersistenceLayer");
const Datastores_1 = require("../../js/datastore/Datastores");
const GroupMemberDeletes_1 = require("../../js/datastore/sharing/rpc/GroupMemberDeletes");
const UserRefs_1 = require("../../js/datastore/sharing/rpc/UserRefs");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Objects_1 = require("polar-shared/src/util/Objects");
const log = Logger_1.Logger.create();
mocha.setup('bdd');
mocha.timeout(600000);
process.env.POLAR_TEST_PROJECT = 'polar-test2';
const FIREBASE_USER = process.env.FIREBASE_USER7;
const FIREBASE_PASS = process.env.FIREBASE_PASS7;
const FIREBASE_USER1 = process.env.FIREBASE_USER8;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS8;
const FIREBASE_USER2 = process.env.FIREBASE_USER9;
const FIREBASE_PASS2 = process.env.FIREBASE_PASS9;
function verifyFailed(delegate) {
    return __awaiter(this, void 0, void 0, function* () {
        let failed;
        try {
            yield delegate();
            failed = false;
        }
        catch (e) {
            failed = true;
        }
        if (!failed) {
            throw new Error("Did not fail as expected");
        }
    });
}
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    xdescribe("firebase-groups", function () {
        return __awaiter(this, void 0, void 0, function* () {
            function purgeDatastores() {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    function purgeForUser(username, password) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const auth = app.auth();
                            yield auth.signInWithEmailAndPassword(username, password);
                            const uid = auth.currentUser.uid;
                            console.log("======= purge datastore for user: " + uid);
                            const datastore = new FirebaseDatastore_1.FirebaseDatastore();
                            try {
                                yield datastore.init();
                                yield Datastores_1.Datastores.purge(datastore);
                            }
                            finally {
                                yield datastore.stop();
                            }
                        });
                    }
                    yield purgeForUser(FIREBASE_USER, FIREBASE_PASS);
                    yield purgeForUser(FIREBASE_USER1, FIREBASE_PASS1);
                    yield purgeForUser(FIREBASE_USER2, FIREBASE_PASS2);
                });
            }
            function purgeGroups() {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    function purgeForUser(username, password) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield app.auth().signInWithEmailAndPassword(username, password);
                            const user = app.auth().currentUser;
                            const { uid } = user;
                            const userGroup = yield UserGroups_1.UserGroups.get(uid);
                            if (!userGroup) {
                                return;
                            }
                            const groups = SetArrays_1.SetArrays.union(userGroup.invitations || [], userGroup.admin || []);
                            for (const group of groups) {
                                yield GroupDeletes_1.GroupDeletes.exec({ groupID: group });
                            }
                            yield Contacts_1.Contacts.purge();
                            yield GroupMemberInvitations_1.GroupMemberInvitations.purge();
                        });
                    }
                    yield purgeForUser(FIREBASE_USER, FIREBASE_PASS);
                    yield purgeForUser(FIREBASE_USER1, FIREBASE_PASS1);
                    yield purgeForUser(FIREBASE_USER2, FIREBASE_PASS2);
                });
            }
            function purge() {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("==== BEGIN purge");
                    yield purgeDatastores();
                    yield purgeGroups();
                    console.log("==== END purge");
                });
            }
            const GROUP_DELAY = 10000;
            function waitForGroupDelay() {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(`Waiting for group delay of ${GROUP_DELAY}ms... `);
                    yield Promises_1.Promises.waitFor(GROUP_DELAY);
                    console.log(`Waiting for group delay of ${GROUP_DELAY}ms... done`);
                });
            }
            function provisionAccountData(userPass) {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    console.log("provisionAccountData");
                    userPass = Optional_1.Optional.of(userPass).getOrElse({ user: FIREBASE_USER, pass: FIREBASE_PASS });
                    const auth = app.auth();
                    yield auth.signInWithEmailAndPassword(userPass.user, userPass.pass);
                    const uid = auth.currentUser.uid;
                    console.log("Writing to datastore with uid: " + uid);
                    const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                    try {
                        yield firebaseDatastore.init();
                        console.log("Writing docMeta and PDF...");
                        const result = yield DocMetas_1.MockDocMetas.createMockDocMetaFromPDF(firebaseDatastore);
                        console.log("Writing docMeta and PDF...done");
                        return result;
                    }
                    finally {
                        yield firebaseDatastore.stop();
                    }
                });
            }
            function doGroupProvision(mockDoc, email = 'getpolarized.test+test1@gmail.com', key) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("doGroupProvision");
                    const { docMeta } = mockDoc;
                    const docID = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint);
                    const docRef = DocRefs_1.DocRefs.fromDocMeta(docID, docMeta);
                    const userRef = UserRefs_1.UserRefs.fromEmail(email);
                    const request = {
                        key,
                        docs: [
                            docRef
                        ],
                        invitations: {
                            message: "Private invite to my special group",
                            to: [
                                userRef
                            ]
                        },
                        visibility: 'private'
                    };
                    const response = yield GroupProvisions_1.GroupProvisions.exec(request);
                    return { groupID: response.id, docRef };
                });
            }
            function doGroupProvisionPublic(mockDoc, template = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("doGroupProvisionPublic");
                    const { docMeta } = mockDoc;
                    const docID = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint);
                    const docRef = DocRefs_1.DocRefs.fromDocMeta(docID, docMeta);
                    const request = {
                        docs: [
                            docRef
                        ],
                        invitations: {
                            message: "Private invite to my special group",
                            to: [
                                UserRefs_1.UserRefs.fromEmail('getpolarized.test+test1@gmail.com')
                            ]
                        },
                        name: 'linux',
                        tags: ['linux', 'ubuntu', 'debian'],
                        visibility: template.visibility || 'public',
                        description: template.description,
                        links: template.links
                    };
                    const response = yield GroupProvisions_1.GroupProvisions.exec(request);
                    return response.id;
                });
            }
            function doGroupJoinForUser1(groupID) {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    console.log("doGroupJoin");
                    yield app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                    console.log("Listing group invitations...");
                    const groupMemberInvitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                    console.log("Listing group invitations...done");
                    chai_1.assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1, "groupID not in the list of groups: " + groupID);
                    const profileUpdateRequest = {
                        name: "Bob Johnson",
                        bio: "An example user from Mars",
                        location: "Capitol City, Mars",
                        links: ['https://www.mars.org']
                    };
                    console.log("Updating profile...");
                    yield ProfileUpdates_1.ProfileUpdates.exec(profileUpdateRequest);
                    console.log("Updating profile...done");
                    console.log("Joining group...");
                    yield GroupJoins_1.GroupJoins.exec({ groupID });
                    console.log("Joining group...done");
                });
            }
            function assertFetch(url, opts) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield fetch(url);
                    if (opts.status !== undefined) {
                        chai_1.assert.equal(response.status, 200);
                    }
                    if (opts.type !== undefined) {
                        chai_1.assert.equal(response.type, 'cors');
                    }
                    if (opts.contentType !== undefined) {
                        chai_1.assert.equal(response.headers.get('content-type'), 'application/pdf');
                    }
                    if (opts.byteLength !== undefined) {
                        const arrayBuffer = yield response.arrayBuffer();
                        chai_1.assert.equal(arrayBuffer.byteLength, opts.byteLength);
                    }
                });
            }
            function getGroupCanonicalized(groupID) {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    const user = app.auth().currentUser;
                    console.log("Reading with uid: " + user.uid);
                    console.log("Trying to read group " + groupID);
                    const group = yield Groups_1.Groups.get(groupID);
                    console.log("Read group properly.");
                    if (group) {
                        const obj = group;
                        delete obj.id;
                        delete obj.created;
                    }
                    return group;
                });
            }
            beforeEach(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield purge();
                });
            });
            afterEach(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield purge();
                });
            });
            it("group provision of private group", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    const mockDoc = yield provisionAccountData();
                    const { groupID } = yield doGroupProvision(mockDoc);
                    function validateUserGroupForPrimaryUser() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const userGroup = yield UserGroups_1.UserGroups.get();
                            const obj = Objects_1.canonicalize(userGroup, obj => {
                                delete obj.uid;
                            });
                            Assertions_1.assertJSON(obj, {
                                "admin": [
                                    groupID
                                ],
                                "groups": [
                                    groupID
                                ],
                                "invitations": [
                                    groupID
                                ],
                                "moderator": [],
                            });
                        });
                    }
                    yield validateUserGroupForPrimaryUser();
                    function validateGroupsOnDocMetaAndDocPermissions(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("validateGroupsOnDocMetaAndDocPermissions");
                            const groupDocs = yield GroupDocs_1.GroupDocs.list(groupID);
                            chai_1.assert.equal(groupDocs.length, 1, "No group docs found.");
                            const groupDoc = groupDocs[0];
                            chai_1.assert.equal(groupDoc.groupID, groupID, "Wrong groupID");
                            chai_1.assert.isDefined(groupDoc.id);
                            chai_1.assert.isDefined(groupDoc.created);
                            const firestore = app.firestore();
                            const ref = firestore
                                .collection(FirebaseDatastore_2.DatastoreCollection.DOC_META)
                                .doc(groupDoc.docID);
                            const doc = yield ref.get();
                            const recordHolder = doc.data();
                            chai_1.assert.isDefined(recordHolder);
                            chai_1.assert.isDefined(recordHolder.groups);
                            chai_1.assert.isTrue(recordHolder.groups.includes(groupID), "Does not include group ID");
                            console.log("SUCCESS... groups properly has the right groupID");
                        });
                    }
                    yield validateGroupsOnDocMetaAndDocPermissions(groupID);
                    yield doGroupJoinForUser1(groupID);
                    function validateGroupSettingsAfterJoin(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("validateGroupSettingsAfterJoin");
                            const user = app.auth().currentUser;
                            chai_1.assert.equal(user.email, FIREBASE_USER1);
                            console.log("Testing permissions for user: " + user.uid);
                            console.log("Testing permissions for group: " + groupID);
                            const group = yield Groups_1.Groups.get(groupID);
                            chai_1.assert.isDefined(group);
                            chai_1.assert.equal(group.nrMembers, 2, "nrMembers in group is wrong.");
                            const groupMembers = yield GroupMembers_1.GroupMembers.list(groupID);
                            console.log("groupMembers: ", groupMembers);
                            chai_1.assert.equal(groupMembers.length, 2, "Wrong number of groups members");
                            console.log("Fetching profile owner to validate group member profileID");
                            const profileOwner = yield ProfileOwners_1.ProfileOwners.get(user.uid);
                            chai_1.assert.isDefined(profileOwner);
                            const groupMemberProfileIDs = groupMembers.map(current => current.profileID);
                            chai_1.assert.isTrue(groupMemberProfileIDs.includes(profileOwner.profileID), "Profile owner is not member of group");
                            const groupMemberInvitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                            chai_1.assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 0);
                        });
                    }
                    yield validateGroupSettingsAfterJoin(groupID);
                    function validateContacts() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const user = app.auth().currentUser;
                            const contacts = yield Contacts_1.Contacts.list();
                            chai_1.assert.equal(contacts.length, 1, "No contacts found for user: " + user.uid);
                            const contact = Objects_1.canonicalize(contacts[0], obj => {
                                obj.profileID = obj.profileID ? 'xxx' : obj.profileID;
                                delete obj.id;
                                delete obj.created;
                            });
                            Assertions_1.assertJSON(contact, {
                                "profileID": "xxx",
                                "reciprocal": true,
                                "rel": [
                                    "shared"
                                ],
                                "uid": "SSVzZnZrmZbCnavWVw6LmoVVCeA3"
                            });
                        });
                    }
                    yield validateContacts();
                    function validateGroupDocs(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("== validateGroupDocs");
                            const user = app.auth().currentUser;
                            chai_1.assert.equal(user.email, FIREBASE_USER1);
                            const userGroup = yield UserGroups_1.UserGroups.get(user.uid);
                            if (!userGroup) {
                                throw new Error("No user group");
                            }
                            chai_1.assert.isTrue(userGroup.groups.includes(groupID), "We don't have the group ID in our user_group record");
                            console.log(`Attempting to fetch group docs with uid=${user.uid}, groupID: ${groupID}`);
                            yield waitForGroupDelay();
                            const groupDocs = yield GroupDocs_1.GroupDocs.list(groupID);
                            chai_1.assert.equal(groupDocs.length, 1, "No group docs found.");
                            const groupDoc = groupDocs[0];
                            chai_1.assert.equal(groupDoc.groupID, groupID);
                            chai_1.assert.isDefined(groupDoc.id);
                            chai_1.assert.isDefined(groupDoc.created);
                        });
                    }
                    yield validateGroupDocs(groupID);
                    function validatePermissionDeniedForOthers(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("== validatePermissionDeniedForOthers");
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER2, FIREBASE_PASS2);
                            yield verifyFailed(() => __awaiter(this, void 0, void 0, function* () { return yield Groups_1.Groups.get(groupID); }));
                        });
                    }
                    yield validatePermissionDeniedForOthers(groupID);
                    function validatePermissionsForDocMeta(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("validatePermissionsForDocMeta");
                            const auth = app.auth();
                            yield auth.signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                            const user = auth.currentUser;
                            const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                            try {
                                yield firebaseDatastore.init();
                                const groupDocs = yield GroupDocs_1.GroupDocs.list(groupID);
                                console.log(`Attempting to read documents to validate permissions: uid: ${user.uid}...`);
                                const firestore = app.firestore();
                                for (const groupDoc of groupDocs) {
                                    console.log(`Validating docID: ${groupDoc.docID}`);
                                    console.log("Reading it directly from the firebase API...");
                                    const ref = firestore
                                        .collection(FirebaseDatastore_2.DatastoreCollection.DOC_META)
                                        .doc(groupDoc.docID);
                                    yield ref.get();
                                    console.log("Reading it directly from the firebase API...done");
                                    yield firebaseDatastore.getDocMetaDirectly(groupDoc.docID);
                                }
                            }
                            finally {
                                yield firebaseDatastore.stop();
                            }
                        });
                    }
                    yield validatePermissionsForDocMeta(groupID);
                    function validateGetFile(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.log("validateGetFile");
                            const auth = app.auth();
                            const user = auth.currentUser;
                            const idToken = yield user.getIdToken();
                            const groupDocs = yield GroupDocs_1.GroupDocs.list(groupID);
                            const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                            try {
                                yield firebaseDatastore.init();
                                for (const groupDoc of groupDocs) {
                                    console.log("Validating we can fetch doc: ", groupDoc);
                                    const data = yield firebaseDatastore.getDocMetaDirectly(groupDoc.docID);
                                    const docMeta = DocMetas_2.DocMetas.deserialize(data, groupDoc.fingerprint);
                                    const backendFileRefs = BackendFileRefs_1.BackendFileRefs.toBackendFileRefs(Either_1.Either.ofLeft(docMeta));
                                    chai_1.assert.equal(backendFileRefs.length, 1);
                                    for (const backendFileRef of backendFileRefs) {
                                        console.log("Validating we can fetch backend file ref: ", backendFileRef);
                                        const url = FirebaseDatastores_1.FirebaseDatastores.computeDatastoreGetFileURL({
                                            docID: groupDoc.docID,
                                            idToken,
                                            backend: backendFileRef.backend,
                                            fileRef: backendFileRef,
                                        });
                                        yield assertFetch(url, {
                                            status: 200,
                                            type: 'cors',
                                            contentType: 'application/pdf',
                                            byteLength: 117687
                                        });
                                    }
                                }
                            }
                            finally {
                                yield firebaseDatastore.stop();
                            }
                        });
                    }
                    yield validateGetFile(groupID);
                });
            });
            it("group provision of private group and verify group members includes the group creator", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const { groupID } = yield doGroupProvision(mockDoc);
                    function validateGroupMembers() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const profile = yield Profiles_1.Profiles.currentProfile();
                            chai_1.assert.isTrue(Preconditions_1.isPresent(profile));
                            const groupMembers = yield GroupMembers_1.GroupMembers.list(groupID);
                            chai_1.assert.isTrue(Preconditions_1.isPresent(groupMembers));
                            chai_1.assert.equal(groupMembers.length, 1);
                            const groupMember = groupMembers[0];
                            chai_1.assert.equal(groupMember.groupID, groupID);
                            chai_1.assert.equal(groupMember.profileID, profile.id);
                            const group = yield Groups_1.Groups.get(groupID);
                            chai_1.assert.equal(group.nrMembers, 1);
                        });
                    }
                    yield validateGroupMembers();
                });
            });
            it("join and then leave group", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const { groupID } = yield doGroupProvision(mockDoc);
                    yield doGroupJoinForUser1(groupID);
                    yield waitForGroupDelay();
                    function assertGroupBefore() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const group = yield getGroupCanonicalized(groupID);
                            Assertions_1.assertJSON(group, {
                                visibility: 'private',
                                tags: [],
                                nrMembers: 2
                            });
                        });
                    }
                    yield assertGroupBefore();
                    yield GroupLeaves_1.GroupLeaves.exec({ groupID });
                    function assertGroupAfter() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const app = Firebase_1.Firebase.init();
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                            const group = yield getGroupCanonicalized(groupID);
                            Assertions_1.assertJSON(group, {
                                visibility: 'private',
                                tags: [],
                                nrMembers: 1
                            });
                        });
                    }
                    yield assertGroupAfter();
                });
            });
            it("double provision of group with key", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const email = 'getpolarized.test+test1@gmail.com';
                    const fingerprint = mockDoc.docMeta.docInfo.fingerprint;
                    const groupDocRefBefore = yield doGroupProvision(mockDoc, email, fingerprint);
                    const groupDocRefAfter = yield doGroupProvision(mockDoc, email, fingerprint);
                    chai_1.assert.equal(groupDocRefBefore.groupID, groupDocRefAfter.groupID);
                    const contacts = yield Contacts_1.Contacts.list();
                    chai_1.assert.equal(contacts.length, 1);
                    const contact = Objects_1.canonicalize(contacts[0], obj => {
                        delete obj.id;
                        delete obj.created;
                        obj.profileID = 'xxx';
                    });
                    Assertions_1.assertJSON(contact, {
                        "email": "getpolarized.test+test1@gmail.com",
                        "profileID": "xxx",
                        "reciprocal": false,
                        "rel": [
                            "shared"
                        ],
                        "uid": "GdTRyWWIjsPtAcguFfH8FOiGryf1"
                    });
                    function doTestGroupMemberInvitations() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const app = Firebase_1.Firebase.init();
                            const auth = app.auth();
                            yield auth.signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                            const invitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                            chai_1.assert.equal(invitations.length, 1);
                            const invitation = Objects_1.canonicalize(invitations[0], obj => {
                                delete obj.id;
                                delete obj.created;
                                obj.from.profileID = 'xxx';
                                obj.groupID = 'xxx';
                            });
                            Assertions_1.assertJSON(invitation, {
                                "docs": [
                                    {
                                        "docID": "121XWG5nPM492A1q6tFs1fLy5S6ndJZF",
                                        "fingerprint": "0x001",
                                        "nrPages": 4,
                                        "tags": {},
                                        "title": ""
                                    }
                                ],
                                "from": {
                                    "email": "getpolarized.test+test@gmail.com",
                                    "image": null,
                                    "name": "",
                                    "profileID": "xxx"
                                },
                                "groupID": "xxx",
                                "message": "Private invite to my special group",
                                "to": "getpolarized.test+test1@gmail.com"
                            });
                        });
                    }
                    yield doTestGroupMemberInvitations();
                });
            });
            it("join and then add my own docs", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    function doUser0() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const mockDoc = yield provisionAccountData();
                            const groupID = yield doGroupProvision(mockDoc);
                            yield waitForGroupDelay();
                            return groupID;
                        });
                    }
                    const { groupID } = yield doUser0();
                    function doGroupJoinForUser1(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const app = Firebase_1.Firebase.init();
                            console.log("doGroupJoin");
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                            yield GroupJoins_1.GroupJoins.exec({ groupID });
                        });
                    }
                    yield doGroupJoinForUser1(groupID);
                    function doGroupDocsAdd(mockDoc) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const { docMeta } = mockDoc;
                            const docID = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint);
                            const docRef = DocRefs_1.DocRefs.fromDocMeta(docID, docMeta);
                            const request = {
                                groupID,
                                docs: [
                                    docRef
                                ],
                            };
                            yield GroupDocsAdd_1.GroupDocsAdd.exec(request);
                        });
                    }
                    const mockDoc = yield provisionAccountData({ user: FIREBASE_USER1, pass: FIREBASE_PASS1 });
                    yield doGroupDocsAdd(mockDoc);
                    const groupDocs = yield GroupDocs_1.GroupDocs.list(groupID);
                    chai_1.assert.equal(groupDocs.length, 2);
                });
            });
            it("delete users from a group with just the invitation", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const alice = 'alice@example.com';
                    const mockDoc = yield provisionAccountData();
                    const fingerprint = mockDoc.docMeta.docInfo.fingerprint;
                    const { groupID } = yield doGroupProvision(mockDoc, alice, fingerprint);
                    const profile = yield Profiles_1.Profiles.currentProfile();
                    chai_1.assert.isDefined(profile);
                    const invitationBefore = yield GroupMemberInvitations_1.GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile.id);
                    chai_1.assert.equal(invitationBefore.length, 1);
                    const userRef = UserRefs_1.UserRefs.fromEmail(alice);
                    yield GroupMemberDeletes_1.GroupMemberDeletes.exec({ groupID, userRefs: [userRef] });
                    const invitationAfter = yield GroupMemberInvitations_1.GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile.id);
                    chai_1.assert.equal(invitationAfter.length, 0);
                });
            });
            it("delete users from a group after they have joined", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const fingerprint = mockDoc.docMeta.docInfo.fingerprint;
                    const { groupID } = yield doGroupProvision(mockDoc, undefined, fingerprint);
                    yield doGroupJoinForUser1(groupID);
                    const app = Firebase_1.Firebase.init();
                    yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                    const groupMembers = yield GroupMembers_1.GroupMembers.list(groupID);
                    chai_1.assert.equal(groupMembers.length, 2);
                    const groupMember = groupMembers[0];
                    const userRef = UserRefs_1.UserRefs.fromProfileID(groupMember.profileID);
                    yield GroupMemberDeletes_1.GroupMemberDeletes.exec({ groupID, userRefs: [userRef] });
                    const groupMembersAfter = yield GroupMembers_1.GroupMembers.list(groupID);
                    chai_1.assert.equal(groupMembersAfter.length, 1);
                });
            });
            it("provision a user for a group who isn't yet using polar", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    yield doGroupProvision(mockDoc, 'alice@example.com');
                    const contacts = yield Contacts_1.Contacts.list();
                    chai_1.assert.equal(contacts.length, 1);
                    const contact = Objects_1.canonicalize(contacts[0], obj => {
                        delete obj.created;
                        delete obj.id;
                    });
                    Assertions_1.assertJSON(contact, {
                        "email": "alice@example.com",
                        "reciprocal": false,
                        "rel": [
                            "shared"
                        ],
                        "uid": "GdTRyWWIjsPtAcguFfH8FOiGryf1"
                    });
                });
            });
            it("join group twice and validate metadata (private group)", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const { groupID } = yield doGroupProvision(mockDoc);
                    yield doGroupJoinForUser1(groupID);
                    yield GroupJoins_1.GroupJoins.exec({ groupID });
                    yield waitForGroupDelay();
                    function assertGroupAfter() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const group = yield getGroupCanonicalized(groupID);
                            Assertions_1.assertJSON(group, {
                                visibility: 'private',
                                tags: [],
                                nrMembers: 2
                            });
                        });
                    }
                    yield assertGroupAfter();
                    const groupMemberInvitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                    chai_1.assert.equal(groupMemberInvitations.length, 0);
                });
            });
            it("Import the doc from a private group into my datastore", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const { groupID, docRef } = yield doGroupProvision(mockDoc);
                    yield doGroupJoinForUser1(groupID);
                    yield waitForGroupDelay();
                    function withPersistenceLayer(delegate) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const datastore = new FirebaseDatastore_1.FirebaseDatastore();
                            const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
                            try {
                                yield persistenceLayer.init();
                                return yield delegate(persistenceLayer);
                            }
                            finally {
                                yield persistenceLayer.stop();
                            }
                        });
                    }
                    const docMetaFileRef = yield withPersistenceLayer((persistenceLayer) => __awaiter(this, void 0, void 0, function* () {
                        const { fingerprint } = docRef;
                        yield GroupDatastores_1.GroupDatastores.importFromGroup(persistenceLayer, { groupID, docRef });
                        const docMeta = yield persistenceLayer.getDocMeta(fingerprint);
                        chai_1.assert.isDefined(docMeta);
                        const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(Either_1.Either.ofLeft(docMeta));
                        chai_1.assert.isDefined(backendFileRef);
                        const docFileMeta = yield persistenceLayer.getFile(backendFileRef.backend, backendFileRef);
                        yield assertFetch(docFileMeta.url, {
                            status: 200,
                            type: 'cors',
                            contentType: 'application/pdf',
                            byteLength: 117687
                        });
                        const docMetaFileRef = {
                            fingerprint,
                            docFile: backendFileRef,
                            docInfo: docMeta.docInfo
                        };
                        return docMetaFileRef;
                    }));
                    function verifyUserAccessToGroupDocs(groupID, userPass) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const app = Firebase_1.Firebase.init();
                            const auth = app.auth();
                            yield auth.signInWithEmailAndPassword(userPass.user, userPass.pass);
                            const groupDocs = yield GroupDocs_1.GroupDocs.list(groupID);
                            function getDocMeta(docID) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    const firestore = app.firestore();
                                    const ref = firestore
                                        .collection(FirebaseDatastore_2.DatastoreCollection.DOC_META)
                                        .doc(docID);
                                    const snapshot = yield ref.get();
                                    return snapshot.data();
                                });
                            }
                            for (const groupDoc of groupDocs) {
                                const docMeta = yield getDocMeta(groupDoc.docID);
                                chai_1.assert.isDefined(docMeta, "Could not find doc for: " + groupDoc.docID);
                            }
                        });
                    }
                    yield verifyUserAccessToGroupDocs(groupID, { user: FIREBASE_USER, pass: FIREBASE_PASS });
                    yield verifyUserAccessToGroupDocs(groupID, { user: FIREBASE_USER1, pass: FIREBASE_PASS1 });
                    yield withPersistenceLayer((persistenceLayer) => __awaiter(this, void 0, void 0, function* () {
                        yield persistenceLayer.delete(docMetaFileRef);
                    }));
                });
            });
            it("Public group settings", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const groupID = yield doGroupProvisionPublic(mockDoc);
                    function assertGroup() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const group = yield getGroupCanonicalized(groupID);
                            Assertions_1.assertJSON(group, {
                                name: 'linux',
                                visibility: 'public',
                                nrMembers: 1,
                                tags: [
                                    'linux',
                                    'ubuntu',
                                    'debian'
                                ]
                            });
                        });
                    }
                    function assertGroupJSON(group) {
                        chai_1.assert.isDefined(group.created);
                        const groupCanonicalized = Objects_1.canonicalize(group, obj => {
                            obj.created = 'xxx';
                        });
                        Assertions_1.assertJSON(groupCanonicalized, {
                            "created": "xxx",
                            "id": "1iASZEzNPRe5xKreNty2",
                            "name": "linux",
                            "nrMembers": 1,
                            "tags": [
                                "linux",
                                "ubuntu",
                                "debian"
                            ],
                            "visibility": "public"
                        });
                    }
                    yield assertGroup();
                    function assertGroupSearch() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const hits = yield Groups_1.Groups.executeSearchWithTags(['linux']);
                            chai_1.assert.equal(hits.length, 1);
                            const first = hits[0];
                            assertGroupJSON(first);
                        });
                    }
                    yield assertGroupSearch();
                    function assertGetByName() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const group = yield Groups_1.Groups.getByName('linux');
                            chai_1.assert.isDefined(group);
                            assertGroupJSON(group);
                        });
                    }
                    yield assertGetByName();
                });
            });
            it("Public docs in public groups", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockDoc = yield provisionAccountData();
                    const groupID = yield doGroupProvisionPublic(mockDoc);
                    function doGroupJoinForUser1(groupID) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const app = Firebase_1.Firebase.init();
                            console.log("doGroupJoin");
                            yield app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                            console.log("Listing group invitations...");
                            const groupMemberInvitations = yield GroupMemberInvitations_1.GroupMemberInvitations.list();
                            console.log("Listing group invitations...done");
                            chai_1.assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1, "groupID not in the list of groups: " + groupID);
                            const profileUpdateRequest = {
                                name: "Bob Johnson",
                                bio: "An example user from Mars",
                                location: "Capitol City, Mars",
                                links: ['https://www.mars.org']
                            };
                            console.log("Updating profile...");
                            yield ProfileUpdates_1.ProfileUpdates.exec(profileUpdateRequest);
                            console.log("Updating profile...done");
                            console.log("Joining group...");
                            yield GroupJoins_1.GroupJoins.exec({ groupID });
                            console.log("Joining group...done");
                        });
                    }
                });
            });
            it("Profile update", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const app = Firebase_1.Firebase.init();
                    yield app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);
                    const request = {
                        name: "Alice Smith",
                        bio: "An example user from the land of Oz",
                        location: "Capitol City, Oz",
                        links: ['https://www.wonderland.org']
                    };
                    yield ProfileUpdates_1.ProfileUpdates.exec(request);
                    const profile = yield Profiles_1.Profiles.currentProfile();
                    chai_1.assert.isDefined(profile);
                    chai_1.assert.equal(profile.name, request.name);
                    chai_1.assert.equal(profile.bio, request.bio);
                    chai_1.assert.equal(profile.location, request.location);
                });
            });
        });
    });
    mocha.run((nrFailures) => {
        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));
    });
}));
//# sourceMappingURL=content.js.map