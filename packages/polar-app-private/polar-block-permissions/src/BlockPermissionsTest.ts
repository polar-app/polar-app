import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {BlockPermissions} from "./BlockPermissions";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {BlockPermissionMap} from "polar-firebase/src/firebase/om/IBlockPermissionRecord";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";

describe("BlockPermissions", function() {

    it("basic", async function() {

        const firestore = FirestoreAdmin.getInstance();
        const app = FirebaseAdmin.app();
        const auth = app.auth();
        const {uid} = await auth.getUserByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const block = '0x001';

        const newPermissions: Readonly<BlockPermissionMap> = {

        };

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, block, newPermissions);

        // now just make sure we have EMPTY secondary tables...

    });

});
