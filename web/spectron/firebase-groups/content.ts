import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {GroupProvisionRequest} from '../../js/datastore/sharing/rpc/GroupProvisions';
import {GroupProvisions} from '../../js/datastore/sharing/rpc/GroupProvisions';
import {ProfileUpdateRequest} from '../../js/datastore/sharing/db/ProfileUpdates';
import {ProfileUpdates} from '../../js/datastore/sharing/db/ProfileUpdates';
import {GroupJoins} from '../../js/datastore/sharing/rpc/GroupJoins';
import {assert} from 'chai';
import {GroupIDStr} from '../../js/datastore/sharing/db/Groups';
import {Groups} from '../../js/datastore/sharing/db/Groups';
import {GroupMembers} from '../../js/datastore/sharing/db/GroupMembers';
import {GroupMemberInvitations} from '../../js/datastore/sharing/db/GroupMemberInvitations';
import {Profiles} from '../../js/datastore/sharing/db/Profiles';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {DocRefs} from '../../js/datastore/sharing/db/DocRefs';
import {GroupDocs} from '../../js/datastore/sharing/db/GroupDocs';
import {ProfileOwners} from '../../js/datastore/sharing/db/ProfileOwners';
import {UserGroups} from '../../js/datastore/sharing/db/UserGroups';
import {Contacts} from '../../js/datastore/sharing/db/Contacts';
import {Sets} from '../../js/util/Sets';
import {GroupDeletes} from '../../js/datastore/sharing/rpc/GroupDeletes';
import {DatastoreCollection} from '../../js/datastore/FirebaseDatastore';
import {Promises} from '../../js/util/Promises';
import {RecordHolder} from '../../js/datastore/FirebaseDatastore';
import {DocMeta} from '../../js/metadata/DocMeta';
import {GroupDocIDStr} from '../../js/datastore/sharing/db/GroupDocs';
import {BackendFileRefs} from '../../js/datastore/BackendFileRefs';
import {Either} from '../../js/util/Either';
import {DocMetas} from '../../js/metadata/DocMetas';
import {FirebaseDatastores} from '../../js/datastore/FirebaseDatastores';

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(120000);

process.env.POLAR_TEST_PROJECT = 'polar-test2';

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

const FIREBASE_USER1 = process.env.FIREBASE_USER1!;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1!;

const FIREBASE_USER2 = process.env.FIREBASE_USER2!;
const FIREBASE_PASS2 = process.env.FIREBASE_PASS2!;

async function verifyFailed(delegate: () => Promise<any>) {

    let failed: boolean;

    try {

        await delegate();
        failed = false;

    } catch (e) {
        failed = true;
    }

    if (! failed) {
        throw new Error("Did not fail as expected");
    }

}

SpectronRenderer.run(async (state) => {

    // TODO: delete the profiles after each run and then update them so that
    // we can verify everything during the lifecycle of the user from new signup
    // to sharing with an existing user who has a profile.  Verify that the
    // profileID is updated when they first login.

    // TODO: build a new Datastore impl that is a 'view' on the main one derived
    // from the docID such that we can call all the main operations...

    // ## PUBLIC GROUPS

    // TODO: test with tags and tag search for groups so we can try to delete
    // them

    // Future work:
    //
    //   - TODO: test public groups and protected groups
    //
    //   - TODO: do a full lifecycle from no user accounts , to user accounts
    //    created, to profile IDs updated.
    //

    describe("firebase-groups", async function() {

        async function purgeGroups() {

            const app = Firebase.init();

            async function purgeGroupsForUser(username: string, password: string) {

                await app.auth().signInWithEmailAndPassword(username, password);

                const user = app.auth().currentUser!;
                const {uid} = user;

                const userGroup = await UserGroups.get(uid);

                if (! userGroup) {
                    return;
                }

                const groups = Sets.union(userGroup.admin || []);

                for (const group of groups) {
                    await GroupDeletes.exec({groupID: group});
                }

            }

            await purgeGroupsForUser(FIREBASE_USER, FIREBASE_PASS);
            await purgeGroupsForUser(FIREBASE_USER1, FIREBASE_PASS1);
            await purgeGroupsForUser(FIREBASE_USER2, FIREBASE_PASS2);
        }

        beforeEach(async function() {
            await purgeGroups();
        });
        //
        // afterEach(async function() {
        //     await purgeGroups();
        // });

        it("group provision of private group", async function() {

            const app = Firebase.init();

            const GROUP_DELAY: number = 10000;

            async function waitForGroupDelay() {

                console.log(`Waiting for group delay of ${GROUP_DELAY}ms... `);
                await Promises.waitFor(GROUP_DELAY);
                console.log(`Waiting for group delay of ${GROUP_DELAY}ms... done`);

            }

            async function provisionAccountData() {

                console.log("provisionAccountData");

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

                const firebaseDatastore = new FirebaseDatastore();
                await firebaseDatastore.init();

                console.log("Writing docMeta and PDF...");
                const result = await MockDocMetas.createMockDocMetaFromPDF(firebaseDatastore);
                console.log("Writing docMeta and PDF...done");

                await firebaseDatastore.stop();

                return result;

            }

            const mockDock = await provisionAccountData();

            async function doGroupProvision() {

                console.log("doGroupProvision");

                const {docMeta} = mockDock;
                const docID = FirebaseDatastore.computeDocMetaID(docMeta.docInfo.fingerprint);

                const docRef = DocRefs.fromDocMeta(docID, docMeta);

                const request: GroupProvisionRequest = {
                    docs: [
                        docRef
                    ],
                    invitations: {
                        message: "Private invite to my special group",
                        to: [
                            'getpolarized.test+test1@gmail.com'
                        ]
                    },
                    visibility: 'private'
                };

                const response = await GroupProvisions.exec(request);
                return response.id;

            }

            const groupID = await doGroupProvision();

            async function validateGroupsOnDocMetaAndDocPermissions(groupID: GroupIDStr) {

                console.log("validateGroupsOnDocMetaAndDocPermissions");

                const groupDocs = await GroupDocs.list(groupID);

                assert.equal(groupDocs.length, 1, "No group docs found.");

                const groupDoc = groupDocs[0];

                assert.equal(groupDoc.groupID, groupID);
                assert.isDefined(groupDoc.id);
                assert.isDefined(groupDoc.created);

                const firestore = app.firestore();

                const ref = firestore
                    .collection(DatastoreCollection.DOC_META)
                    .doc(groupDoc.docID);

                const doc = await ref.get();
                const recordHolder = <RecordHolder<DocMeta> | undefined> doc.data();

                assert.isDefined(recordHolder);
                assert.isDefined(recordHolder!.groups);

                assert.isTrue(recordHolder!.groups!.includes(groupID), "Does not include group ID");

                console.log("SUCCESS... groups properly has the right groupID");

            }

            await validateGroupsOnDocMetaAndDocPermissions(groupID);

            async function doGroupJoin(groupID: GroupIDStr) {

                console.log("doGroupJoin");

                // now switch to the user that was invited and join that group.

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

                console.log("Listing group invitations...");

                const groupMemberInvitations = await GroupMemberInvitations.list();

                console.log("Listing group invitations...done");

                // it's important that the user can see their own invitations.
                assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1);

                const profileUpdateRequest: ProfileUpdateRequest = {
                    name: "Bob Johnson",
                    bio: "An example user from Mars",
                    location: "Capitol City, Mars",
                    links: ['https://www.mars.org']
                };

                console.log("Updating profile...");
                await ProfileUpdates.exec(profileUpdateRequest);
                console.log("Updating profile...done");

                console.log("Joining group...");
                await GroupJoins.exec({groupID});
                console.log("Joining group...done");

            }

            await doGroupJoin(groupID);

            async function validateGroupSettingsAfterJoin(groupID: GroupIDStr) {

                console.log("validateGroupSettingsAfterJoin");

                const user = app.auth().currentUser!;
                assert.equal(user.email, FIREBASE_USER1);

                console.log("Testing permissions for user: " + user.uid);
                console.log("Testing permissions for group: " + groupID);

                const group = await Groups.get(groupID);

                assert.isDefined(group);

                // make sure nrMembers counts on the groups are setup properly.
                assert.equal(group!.nrMembers, 1, "nrMembers in group is wrong.");

                const groupMembers = await GroupMembers.list(groupID);

                assert.equal(groupMembers.length, 1, "Wrong number of groups members");

                const groupMember = groupMembers[0];

                console.log("Fetching profile owner to validate group member profileID");
                const profileOwner = await ProfileOwners.get(user.uid);

                assert.isDefined(profileOwner);

                assert.equal(groupMember.profileID, profileOwner!.profileID);

                // now make sure there are no invitations for this group after ...
                const groupMemberInvitations = await GroupMemberInvitations.list();

                assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 0);

            }

            await validateGroupSettingsAfterJoin(groupID);

            async function validateContacts() {
                const user = app.auth().currentUser!;

                const contacts = await Contacts.list();
                assert.equal(contacts.length , 1, "No contacts found for user: " + user.uid);

            }

            await validateContacts();

            async function validateGroupDocs(groupID: GroupIDStr) {

                console.log("== validateGroupDocs");

                const user = app.auth().currentUser!;

                assert.equal(user.email, FIREBASE_USER1);

                const userGroup = await UserGroups.get(user.uid);

                if (! userGroup) {
                    throw new Error("No user group");
                }

                assert.isTrue(userGroup.groups.includes(groupID), "We don't have the group ID in our user_group record");

                console.log(`Attempting to fetch group docs with uid=${user.uid}, groupID: ${groupID}`);

                await waitForGroupDelay();

                // FIXME: this is failing for the user...
                const groupDocs = await GroupDocs.list(groupID);

                assert.equal(groupDocs.length, 1, "No group docs found.");

                const groupDoc = groupDocs[0];

                assert.equal(groupDoc.groupID, groupID);
                assert.isDefined(groupDoc.id);
                assert.isDefined(groupDoc.created);

            }

            await validateGroupDocs(groupID);

            async function validatePermissionDeniedForOthers(groupID: GroupIDStr) {

                console.log("== validatePermissionDeniedForOthers");

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER2, FIREBASE_PASS2);

                await verifyFailed(async () => await Groups.get(groupID));
            }

            await validatePermissionDeniedForOthers(groupID);

            async function validatePermissionsForDocMeta(groupID: GroupIDStr) {

                console.log("validatePermissionsForDocMeta");

                const auth = app.auth();
                await auth.signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                const user = auth.currentUser!;

                const firebaseDatastore = new FirebaseDatastore();

                try {

                    await firebaseDatastore.init();

                    const groupDocs = await GroupDocs.list(groupID);

                    console.log(`Attempting to read documents to validate permissions: uid: ${user.uid}...`);
                    const firestore = app.firestore();

                    for (const groupDoc of groupDocs) {

                        console.log(`Validating docID: ${groupDoc.docID}`);

                        console.log("Reading it directly from the firebase API...");

                        const ref = firestore
                            .collection(DatastoreCollection.DOC_META)
                            .doc(groupDoc.docID);

                        await ref.get();

                        console.log("Reading it directly from the firebase API...done");

                        await firebaseDatastore.getDocMetaDirectly(groupDoc.docID);
                    }

                } finally {
                    await firebaseDatastore.stop();
                }

            }

            await validatePermissionsForDocMeta(groupID);

            async function validateGetFile(groupID: GroupDocIDStr) {
                console.log("validateGetFile");

                const auth = app.auth();
                const user = auth.currentUser!;

                const idToken = await user.getIdToken();

                // verify that I can actually fetch the data associated with the
                // file...

                const groupDocs = await GroupDocs.list(groupID);

                const firebaseDatastore = new FirebaseDatastore();

                try {

                    await firebaseDatastore.init();

                    for (const groupDoc of groupDocs) {

                        console.log("Validating we can fetch doc: ", groupDoc);

                        const data = await firebaseDatastore.getDocMetaDirectly(groupDoc.docID);
                        const docMeta = DocMetas.deserialize(data!, groupDoc.fingerprint);

                        const backendFileRefs = BackendFileRefs.toBackendFileRefs(Either.ofLeft(docMeta));

                        assert.equal(backendFileRefs.length, 1);

                        for (const backendFileRef of backendFileRefs) {

                            console.log("Validating we can fetch backend file ref: ", backendFileRef);

                            const url = FirebaseDatastores.computeDatastoreGetFileURL({
                                docID: groupDoc.docID,
                                idToken,
                                backend: backendFileRef.backend,
                                fileRef: backendFileRef,
                            });

                            const response = await fetch(url);

                            assert.equal(response.status, 200);
                            assert.equal(response.type, '');
                            const arrayBuffer = await response.arrayBuffer();

                            assert.equal(arrayBuffer.byteLength, 666);

                        }

                    }

                } finally {
                    await firebaseDatastore.stop();
                }

            }

            await validateGetFile(groupID);

        });

        xit("Profile update", async function() {

            const app = Firebase.init();

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

            const request: ProfileUpdateRequest = {
                name: "Alice Smith",
                bio: "An example user from the land of Oz",
                location: "Capitol City, Oz",
                links: ['https://www.wonderland.org']
            };

            await ProfileUpdates.exec(request);

            const profile = await Profiles.currentUserProfile();

            assert.isDefined(profile);

            assert.equal(profile!.name, request.name);
            assert.equal(profile!.bio, request.bio);
            assert.equal(profile!.location, request.location);

        });

    });

    mocha.run((nrFailures: number) => {

        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));

    });

});
