import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {GroupProvisionRequest} from '../../js/datastore/sharing/GroupProvisions';
import {GroupProvisions} from '../../js/datastore/sharing/GroupProvisions';
import {ProfileUpdateRequest} from '../../js/datastore/sharing/ProfileUpdates';
import {ProfileUpdates} from '../../js/datastore/sharing/ProfileUpdates';
import {GroupJoins} from '../../js/datastore/sharing/GroupJoins';
import {assert} from 'chai';
import {GroupIDStr} from '../../js/datastore/sharing/Groups';
import {Groups} from '../../js/datastore/sharing/Groups';
import {GroupMembers} from '../../js/datastore/sharing/GroupMembers';
import {GroupMemberInvitations} from '../../js/datastore/sharing/GroupMemberInvitations';
import {Profiles} from '../../js/datastore/sharing/Profiles';
import {FirebaseDatastores} from '../../js/datastore/FirebaseDatastores';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {DocRefs} from '../../js/datastore/sharing/DocRefs';
import {GroupDocs} from '../../js/datastore/sharing/GroupDocs';
import {ProfileOwners} from '../../js/datastore/sharing/ProfileOwners';
import {UserGroups} from '../../js/datastore/sharing/UserGroups';
import {Promises} from '../../js/util/Promises';
import {Contacts} from '../../js/datastore/sharing/Contacts';

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(120000);

// process.env.POLAR_TEST_PROJECT = 'polar-test2';

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

    // TODO: create a profileID for user1 and no profileID for user2 and make
    // sure the contacts are updated appropriately.

    // TODO: test with tags and tag search for groups so we can try to delete
    // them...

    // Future work:
    //
    //   - TODO: test public groups and protected groups
    //
    //   - TODO: do a full lifecycle from no user accounts , to user accounts
    //    created, to profile IDs updated.
    //
    // TODO: rework the tests so that this uses staging data.. not real
    // production data.

    describe("firebase-groups", async function() {

        it("group provision of private group", async function() {

            const app = Firebase.init();

            async function provisionAccountData() {

                console.log("provisionAccountData");

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

                const firebaseDatastore = new FirebaseDatastore();
                await firebaseDatastore.init();

                const result = await MockDocMetas.createMockDocMetaFromPDF(firebaseDatastore);

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
                assert.equal(group!.nrMembers, 1);

                const groupMembers = await GroupMembers.list(groupID);

                assert.equal(groupMembers.length, 1);

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

                const contacts = await Contacts.list();
                assert.equal(contacts.length , 1);

            }

            await validateContacts();

            async function validateGroupDocs(groupID: GroupIDStr) {

                const user = app.auth().currentUser!;

                const userGroup = await UserGroups.get(user.uid);

                assert.isTrue(userGroup.groups.includes(groupID), "We don't have the group ID in our user_group record");

                console.log("validateGroupDocs");

                console.log("FIXME: sleeping to see if that's the problem.")

                // await Promises.waitFor(5000);

                console.log(`Attempting to fetch group docs with uid=${user.uid}, groupID: ${groupID}`);
                const groupDocs = await GroupDocs.list(groupID);

                assert.equal(groupDocs.length, 1);

                const groupDoc = groupDocs[0];

                assert.equal(groupDoc.groupID, groupID);
                assert.isDefined(groupDoc.id);
                assert.isDefined(groupDoc.created);

            }

            await validateGroupDocs(groupID);

            async function validatePermissionDeniedForOthers(groupID: GroupIDStr) {

                console.log("validatePermissionDeniedForOthers");

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER2, FIREBASE_PASS2);

                await verifyFailed(async () => await Groups.get(groupID));
            }

            await validatePermissionDeniedForOthers(groupID);


        });

        it("Profile update", async function() {

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
