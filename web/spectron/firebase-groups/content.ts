import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from '../../js/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {GroupProvisionRequest} from '../../js/datastore/sharing/GroupProvisions';
import {GroupProvisions} from '../../js/datastore/sharing/GroupProvisions';
import {ProfileUpdateRequest} from '../../js/datastore/sharing/ProfileUpdates';
import {ProfileUpdates} from '../../js/datastore/sharing/ProfileUpdates';
import {GroupJoins} from '../../js/datastore/sharing/GroupJoins';

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

    // TODO: create TWO groups and make sure that the user has admin on those
    // groups and that the records are setup properly.

    // TODO: make sure nrMembers counts on the groups are setup properly.

    // TODO: make sure profile values are updated to the correct values properly.

    describe("firebase-groups", async function() {

        it("group provision", async function() {

            const app = Firebase.init();

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

            const groupID = response.id;

            // now switch to the user that was invited and join that group.

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

            const profileUpdateRequest: ProfileUpdateRequest = {
                name: "Bob Johnson",
                bio: "An example user from Mars",
                location: "Capitol City, Mars",
                links: ['https://www.mars.org']
            };

            await ProfileUpdates.exec(profileUpdateRequest);

            await GroupJoins.exec({groupID});

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
