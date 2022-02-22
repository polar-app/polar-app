import {FirebaseUserCreator} from "./FirebaseUserCreator";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

describe('FirebaseUserCreator', function() {

    const email = 'alice-test-user@getpolarized.io';

    beforeEach(async () => {
        const auth = FirebaseAdmin.app().auth();

        try {
            const user = await auth.getUserByEmail(email);
            console.log("Deleting user...")
            await FirebaseUserCreator.deleteUser(user.uid)
            console.log("Deleting user...done")
        } catch (e) {
            // noop
        }

    });

    it("basic", async function() {
        console.log("Creating user...")
        await FirebaseUserCreator.create(email);
    });


});

