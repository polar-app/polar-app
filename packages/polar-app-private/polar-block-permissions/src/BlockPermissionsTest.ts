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
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";
import {UserIDStr} from "polar-firestore-like/src/IFirestore";
import {EmailStr} from "polar-shared/src/util/Strings";
import {BlockPermissionMap} from "polar-firebase/src/firebase/om/IBlockPermission";

// TODO: more tests
//
// - go from read to write
// - go from write to read
// - multiple users
// - all these for namespaces too
// - compute the effective permissions when namespaces and page permissions are set in both situations

describe("BlockPermissions", function() {

    this.timeout(10000);


    it("basic with empty permissions", async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const blockID = Hashcodes.createID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);

        await doCleanup(uid, blockID, [uid]);

        const newPermissions: Readonly<BlockPermissionMap> = {

        };

        // create a fake/empty block for this user and write it out ...

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, newPermissions);

    });

    it('basic with just one permission', async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const blockID = Hashcodes.createID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);
        const user0 = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER1);

        await doCleanup(uid, blockID, [uid, user0]);

        const newPermissions: Readonly<BlockPermissionMap> = {
            [user0]: {
                id: user0,
                uid: user0,
                access: 'read'
            }
        };


        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, newPermissions);

        const blockPermission = await BlockPermissionCollection.get(firestore, block.id)

        assertJSON(canonicalizeUpdated(blockPermission), {
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

        assertJSON(canonicalizeUpdated(blockPermissionUser), {
            "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "nspaces_ro": [],
            "nspaces_rw": [],
            "pages_ro": [
                blockID
            ],
            "pages_rw": [],
            "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "updated": "xxx"
        });


    });



    it('go from read to write', async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const blockID = Hashcodes.createID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);
        const user0 = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER1);

        await doCleanup(uid, blockID, [uid, user0]);

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, {
            [user0]: {
                id: user0,
                uid: user0,
                access: 'read'
            }
        });

        assertJSON(canonicalizeUpdated(await BlockPermissionCollection.get(firestore, block.id)), {
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

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, {
            [user0]: {
                id: user0,
                uid: user0,
                access: 'write'
            }
        });

        assertJSON(canonicalizeUpdated(await BlockPermissionCollection.get(firestore, block.id)), {
            "id": "12TthmtosP",
            "permissions": {
                "rgLitBszZKagk0Q5C5hBccYKVMd2": {
                    "access": "write",
                    "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
                    "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2"
                }
            },
            "type": "page",
            "updated": "xxx"
        });

        const blockPermissionUser = await BlockPermissionUserCollection.get(firestore, user0)

        assertJSON(canonicalizeUpdated(blockPermissionUser), {
            "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "nspaces_ro": [],
            "nspaces_rw": [],
            "pages_ro": [
            ],
            "pages_rw": [
                blockID
            ],
            "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "updated": "xxx"
        });


    });
    interface IUpdatedObj {
        readonly updated: ISODateTimeStrings;
    }

    function canonicalizeUpdated(updatedObj: IUpdatedObj | undefined) {

        if (updatedObj === undefined) {
            return undefined;
        }

        const val = updatedObj as any;

        if (typeof val.updated === 'string') {
            val.updated = 'xxx';
        }

        return updatedObj;

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
     * Cleanup data from previous tests, when necessary.
     * @param uid The user that's executing the change permission operation.
     * @param blockID The block ID that we're changing permission on
     */
    async function doCleanup(uid: UserIDStr, blockID: BlockIDStr, users: ReadonlyArray<UserIDStr>) {

        const firestore = FirestoreAdmin.getInstance();

        // wipe out BlockPermission too each time or else the changes can not be computed
        await BlockPermissionCollection.doDelete(firestore, uid);

        // wipe out all users permissions involved

        for (const userID of users) {
            await BlockPermissionUserCollection.doDelete(firestore, userID);
        }

    }

    async function getUserIDByEmail(email: EmailStr): Promise<UserIDStr> {
        const app = FirebaseAdmin.app();
        const auth = app.auth();
        const {uid} = await auth.getUserByEmail(FirebaseTestingUsers.FIREBASE_USER);
        return uid;
    }

});


