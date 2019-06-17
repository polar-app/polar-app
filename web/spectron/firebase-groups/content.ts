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

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(120000);

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

const FIREBASE_USER1 = process.env.FIREBASE_USER1!;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1!;

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

    // TODO: what is doc_file_meta ???

    // TODO: create TWO groups and make sure that the user has admin on those
    // groups and that the records are setup properly.

    // TODO: make sure profile values are updated to the correct values properly.

    // TODO: make sure a 3rd party can't read the private groups

    // Future work:
    //
    //   - TODO: test public groups and protected groups

    describe("firebase-groups", async function() {

        it("group provision", async function() {

            const app = Firebase.init();

            async function doGroupProvision() {

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

                const request: GroupProvisionRequest = {
                    docs: [],
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

                // now switch to the user that was invited and join that group.

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

                const groupMemberInvitations = await GroupMemberInvitations.list();

                // it's important that the user can see their own invitations.
                assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1);

                const profileUpdateRequest: ProfileUpdateRequest = {
                    name: "Bob Johnson",
                    bio: "An example user from Mars",
                    location: "Capitol City, Mars",
                    links: ['https://www.mars.org']
                };

                await ProfileUpdates.exec(profileUpdateRequest);

                await GroupJoins.exec({groupID});

            }

            await doGroupJoin(groupID);

            async function validateGroupSettingsAfterJoin(groupID: GroupIDStr) {

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

                // now make sure there are no invitations for this group after ...
                const groupMemberInvitations = await GroupMemberInvitations.list();

                assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 0);

            }

            await validateGroupSettingsAfterJoin(groupID);

        });

        it("profile update", async function() {

            const app = Firebase.init();

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

            const request: ProfileUpdateRequest = {
                name: "Alice Smith",
                bio: "An example user from the land of Oz",
                location: "Capitol City, Oz",
                links: ['https://www.wonderland.org']
            };

            await ProfileUpdates.exec(request);

        });

    });

    mocha.run((nrFailures: number) => {

        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));

    });

});
