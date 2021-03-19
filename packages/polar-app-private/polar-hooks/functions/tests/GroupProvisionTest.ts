import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';
import {GroupProvisionRequest} from '../impl/groups/GroupProvisionFunction';
import {GroupProvisionFunctions} from '../impl/groups/GroupProvisionFunction';
import {IDUsers} from '../impl/util/IDUsers';
import {GroupJoinFunctions} from '../impl/groups/GroupJoinFunction';
import {GroupJoinRequest} from '../impl/groups/GroupJoinFunction';
import {GroupIDStr} from '../impl/groups/db/Groups';
import {UserRefs} from '../impl/groups/db/UserRefs';

const FIREBASE_USER1 = "getpolarized.test+test@gmail.com";
const FIREBASE_USER2 = "getpolarized.test+test1@gmail.com";

process.env.POLAR_TEST_PROJECT = "polar-test2";

xdescribe('GroupProvision', async function() {

    before(async function () {

        // const app = Firebase.app();
        // const auth = app.auth();
        //
        //

    });

    it("Private groups with invitations", async function() {

        const app = FirebaseAdmin.app();
        const auth = app.auth();


        async function doGroupProvision() {

            console.log("========= doGroupProvision");

            const user = await auth.getUserByEmail(FIREBASE_USER1);
            const idUser = await IDUsers.fromUser(user);

            const request: GroupProvisionRequest = {
                docs: [],
                invitations: {
                    message: "Private invite to my special group",
                    to: [
                        UserRefs.fromEmail('getpolarized.test+test1@gmail.com')
                    ]
                },
                visibility: 'private'
            };

            const response = await GroupProvisionFunctions.exec(idUser, request);
            return response.id;

        }

        async function doGroupJoin(groupID: GroupIDStr) {

            console.log("========= doGroupJoin");

            // now switch to the user that was invited and join that group.

            const user = await auth.getUserByEmail(FIREBASE_USER2);
            const idUser = await IDUsers.fromUser(user);

            const request: GroupJoinRequest = {
                groupID
            };

            await GroupJoinFunctions.exec(idUser, request);

        }

        const groupID = await doGroupProvision();

        await doGroupJoin(groupID);

        // const idToken = await auth.createCustomToken(user.uid);
        //
        // auth.verifyIdToken(idToken);
        //
        //
        // const url = "https://us-central1-polar-test2.cloudfunctions.net/groupProvision";
        //
        // const response = await fetch(url, {method: 'POST', body: JSON.stringify(body)});
        //
        // assert.equal(response.status, 200);

    });

});
