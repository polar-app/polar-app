import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {BlockPermissions} from "./BlockPermissions";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {BlockPermissionUserCollection} from "polar-firebase/src/firebase/om/BlockPermissionUserCollection";
import {assertJSON} from "polar-test/src/test/Assertions";
import { BlockPermissionCollection } from "polar-firebase/src/firebase/om/BlockPermissionCollection";
import { UserIDStr } from "polar-firestore-like/src/IFirestore";
import {EmailStr} from "polar-shared/src/util/Strings";
import {BlockPermissionMap, IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";

describe("BlockPermissions", function() {

    this.timeout(10000);

    function canonicalizeBlockPermission(blockPermission: IBlockPermission<any> | undefined) {

        if (blockPermission === undefined) {
            return undefined;
        }

        (blockPermission as any).updated = 'xxx';
        return blockPermission;

    }

    function createFakePageBlock(id: BlockIDStr,
                                 uid: UserIDStr): IBlock {

        const now = ISODateTimeStrings.create()

        const block: IBlock = {
            id,
            nspace: uid,
            uid,
            root: id,
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

        return block;

    }


    /**
     * cleanup data from previous tests, when necessary.
     */
    async function doCleanup() {

        const firestore = FirestoreAdmin.getInstance();
        const app = FirebaseAdmin.app();
        const auth = app.auth();

        const {uid} = await auth.getUserByEmail(FirebaseTestingUsers.FIREBASE_USER);

        await BlockPermissionUserCollection.doDelete(firestore, uid);
    }

    async function getUserIDByEmail(email: EmailStr): Promise<UserIDStr> {
        const app = FirebaseAdmin.app();
        const auth = app.auth();
        const {uid} = await auth.getUserByEmail(FirebaseTestingUsers.FIREBASE_USER);
        return uid;
    }

    it("basic with empty permissions", async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);

        await doCleanup();

        const newPermissions: Readonly<BlockPermissionMap> = {

        };

        const blockID = Hashcodes.createID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);

        // create a fake/empty block for this user and write it out ...

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, newPermissions);

    });

    it('basic with just one permission', async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);

        await doCleanup();

        const user0 = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER1);

        const newPermissions: Readonly<BlockPermissionMap> = {
            [user0]: {
                id: user0,
                uid: user0,
                access: 'read'
            }
        };

        const blockID = Hashcodes.createID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, newPermissions);

        const blockPermission = await BlockPermissionCollection.get(firestore, block.id)

        assertJSON(canonicalizeBlockPermission(blockPermission), {
            "id": "12TthmtosP",
            "permissions": {
                "rgLitBszZKagk0Q5C5hBccYKVMd2": {
                    "access": "read",
                    "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
                    "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2"
                }
            },
            "type": "page",
            "updated": "xxx"
        });

        const blockPermissionUser = await BlockPermissionUserCollection.get(firestore, user0)

        // assertJSON(blockPermissionUser, {});


    });

    //
    // const blockPermissionUser = await BlockPermissionUserCollection.get(firestore, uid)
    //
    // // assertJSON(blockPermissionUser, {});
    //
    // // now just make sure we have EMPTY secondary tables...
    //
    // //


});


