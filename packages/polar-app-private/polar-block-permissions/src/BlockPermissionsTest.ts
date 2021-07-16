import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {BlockPermissions} from "./BlockPermissions";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {BlockPermissionMap} from "polar-firebase/src/firebase/om/IBlockPermissionRecord";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {BlockPermissionUserCollection} from "polar-firebase/src/firebase/om/BlockPermissionUserCollection";
import {assertJSON} from "polar-test/src/test/Assertions";
import { BlockPermissionCollection } from "polar-firebase/src/firebase/om/BlockPermissionCollection";

describe("BlockPermissions", function() {

    this.timeout(10000);

    it("basic with empty permissions", async function() {

        const firestore = FirestoreAdmin.getInstance();
        const app = FirebaseAdmin.app();
        const auth = app.auth();
        const {uid} = await auth.getUserByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const blockID = Hashcodes.createID({uid, key: '0x0001'});

        /**
         * cleanup data from previous tests, when necessary.
         */
        async function doCleanup() {
            await BlockPermissionUserCollection.doDelete(firestore, uid);
        }

        await doCleanup();

        const newPermissions: Readonly<BlockPermissionMap> = {

        };

        const now = ISODateTimeStrings.create()

        const block: IBlock = {
            id: blockID,
            nspace: uid,
            uid,
            root: blockID,
            parent: undefined,
            parents: [],
            items: {},
            created: now,
            updated: now,
            content: {
                type: 'name',
                data: 'Hello World'
            },
            mutation: 0
        }
        // create a fake/empty block for this user and write it out ...

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, newPermissions);

    });

});
