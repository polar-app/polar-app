import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {BlockPermissions} from "./BlockPermissions";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockIDStr, IBlock, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {BlockPermissionUserCollection} from "polar-firebase/src/firebase/om/BlockPermissionUserCollection";
import {assertJSON} from "polar-test/src/test/Assertions";
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";
import {IFirestoreClient, UserIDStr} from "polar-firestore-like/src/IFirestore";
import {EmailStr} from "polar-shared/src/util/Strings";
import {BlockPermissionMap} from "polar-firebase/src/firebase/om/IBlockPermission";
import {FirebaseBrowserTesting} from "polar-firebase-browser/src/firebase/FirebaseBrowserTesting";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {assert} from 'chai';

// TODO: more tests
//
// - multiple users
// - compute the effective permissions when namespaces and page permissions are set in both situations

describe("BlockPermissions", function() {

    this.timeout(60000);

    interface CreateBlockIDOpts {
        readonly key: string;
        readonly uid: string;
    }

    async function createBlockID(opts: CreateBlockIDOpts) {
        const r = Math.random() * 10000;
        return Hashcodes.createID({uid: opts.uid, key: opts.key, r});
    }

    it("basic with empty permissions", async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const blockID = await createBlockID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);

        await doCleanup(uid, blockID, undefined, [uid]);

        const newPermissions: Readonly<BlockPermissionMap> = {

        };

        // create a fake/empty block for this user and write it out ...

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, newPermissions);

    });

    it('basic with just one permission', async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const blockID = await createBlockID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);
        const user0 = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER1);

        await doCleanup(uid, blockID, undefined, [uid, user0]);

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
            "id": blockID,
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
        const blockID = await createBlockID({uid, key: '0x0001'});
        const block = createFakePageBlock(blockID, uid);
        const user0 = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER1);

        await doCleanup(uid, blockID, undefined, [uid, user0]);

        await BlockCollection.set(firestore, block);

        await BlockPermissions.doUpdatePagePermissions(firestore, uid, blockID, {
            [user0]: {
                id: user0,
                uid: user0,
                access: 'read'
            }
        });

        assertJSON(canonicalizeUpdated(await BlockPermissionCollection.get(firestore, block.id)), {
            "id": blockID,
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
            "id": blockID,
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

    it('change permissions on a namespace, not a page', async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);
        const nspaceID = uid;
        const user0 = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER1);

        await doCleanup(uid, undefined, nspaceID, [uid, user0]);

        const newPermissions: Readonly<BlockPermissionMap> = {
            [user0]: {
                id: user0,
                uid: user0,
                access: 'read'
            }
        };

        await BlockPermissions.doUpdateNSpacePermissions(firestore, uid, nspaceID, newPermissions);

        const blockPermission = await BlockPermissionCollection.get(firestore, nspaceID)

        assertJSON(canonicalizeUpdated(blockPermission), {
            "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "permissions": {
                "rgLitBszZKagk0Q5C5hBccYKVMd2": {
                    "access": "read",
                    "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
                    "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2"
                }
            },
            "type": "nspace",
            "updated": "xxx"
        });

        const blockPermissionUser = await BlockPermissionUserCollection.get(firestore, user0)

        assertJSON(canonicalizeUpdated(blockPermissionUser), {
            "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "nspaces_ro": [
                "rgLitBszZKagk0Q5C5hBccYKVMd2"
            ],
            "nspaces_rw": [],
            "pages_ro": [
            ],
            "pages_rw": [],
            "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2",
            "updated": "xxx"
        });

    });

    it("Create block for userA, give permission to userB, verify userB can access that block and that revoke also works", async function() {

        // TODO: try to read a block by page where we have permissions

        // *** create a new block as userA

        interface InitMeta {
            readonly uidA: string;
            readonly uidB: string;
            readonly blockID: string;
        }

        interface IUser {
            readonly uid: string;
        }

        async function getFirestoreBrowserClient(role: 'userA' | 'userB'): Promise<readonly [IUser, IFirestoreClient]> {

            async function authAsUserRecord() {

                switch(role) {
                    case "userA":
                        return await FirebaseBrowserTesting.authWithUser0();
                    case "userB":
                        return await FirebaseBrowserTesting.authWithUser1();

                    default:
                        throw new Error("Unknown role: " + role);
                }

            }

            const userRecord = await authAsUserRecord();

            const firestore = await FirestoreBrowserClient.getInstance();

            return [userRecord, firestore];

        }

        async function init(): Promise<InitMeta> {

            async function getUserID(email: string) {
                const admin = FirebaseAdmin.app();
                const user = await admin.auth().getUserByEmail(email)
                return user.uid;
            }

            const uidA = await getUserID(FirebaseTestingUsers.FIREBASE_USER)
            const uidB = await getUserID(FirebaseTestingUsers.FIREBASE_USER1)

            const namespaceID = uidA;

            const blockID = await createBlockID({uid: uidA, key: '0x0001'});

            await doCleanup(uidA, blockID, namespaceID, [uidA, uidB]);

            return {uidA, uidB, blockID};

        }

        const {blockID, uidA, uidB} = await init();

        const namespaceID = uidA;

        async function createBlock() {

            const [userA, firestore] = await getFirestoreBrowserClient('userA');

            const block = createFakePageBlock(blockID, userA.uid)

            await BlockCollection.set(firestore, block);

            console.log("Creating block...done");

            return block;

        }

        const block = await createBlock();

        async function verifyBlockInaccessibleToSecondUser() {

            console.log("Verifying block inaccessible to second user...");

            const [userB, firestore] = await getFirestoreBrowserClient('userB');

            await assertThrowsAsync(async () => await BlockCollection.get(firestore, blockID))

            console.log("Verifying block inaccessible to second user...done");

        }

        await verifyBlockInaccessibleToSecondUser();

        async function grantPermissions() {

            console.log("Granting permissions...");

            const newPermissions: Readonly<BlockPermissionMap> = {
                [uidB]: {
                    id: namespaceID,
                    uid: uidB,
                    access: 'read'
                }
            };

            const firestore = FirestoreAdmin.getInstance();

            await BlockPermissions.doUpdateNSpacePermissions(firestore, uidA, namespaceID, newPermissions);

            console.log("Granting permissions...done");

        }

        await grantPermissions();

        async function blockPermissionUserContainsNamespaceID(): Promise<boolean> {

            const [userB, firestore] = await getFirestoreBrowserClient('userB');

            const blockPermissionUser = await BlockPermissionUserCollection.get(firestore, uidB);

            if (! blockPermissionUser) {
                return false;
            }

            return blockPermissionUser.nspaces_ro.includes(namespaceID);

        }
        async function verifyBlockPermissionUserContainsNamespaceID() {
            assert.isTrue(await blockPermissionUserContainsNamespaceID());
        }

        await verifyBlockPermissionUserContainsNamespaceID();

        async function verifyPermissions() {

            console.log("Verifying permissions...");

            const [userA, firestore] = await getFirestoreBrowserClient('userA');

            const sharedBlock = await BlockCollection.get(firestore, blockID);

            assertJSON(block, sharedBlock);

        }

        await verifyPermissions();

        async function revokePermissions() {

            console.log("Revoking permissions...");

            const newPermissions: Readonly<BlockPermissionMap> = {
            };

            const firestore = FirestoreAdmin.getInstance();

            await BlockPermissions.doUpdateNSpacePermissions(firestore, uidA, uidA, newPermissions);

        }

        await revokePermissions();

        async function verifyBlockPermissionUserMissingNamespaceID() {
            assert.isFalse(await blockPermissionUserContainsNamespaceID());
        }

        await verifyBlockPermissionUserMissingNamespaceID();
        await verifyBlockInaccessibleToSecondUser();

    });

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
                data: 'Hello World',
                links: [],
            },
            mutation: 0
        }

        return block;

    }


    /**
     * Cleanup data from previous tests, when necessary.
     * @param uid The user that's executing the change permission operation.
     * @param blockID The block ID that we're changing permission on
     * @param nspaceID The namespace ID that we're changing permission on
     * @param users The users that have had permissions changed so we can wipe these out.
     */
    async function doCleanup(uid: UserIDStr,
                             blockID: BlockIDStr | undefined,
                             nspaceID: NamespaceIDStr | undefined,
                             users: ReadonlyArray<UserIDStr>) {

        // TODO: delete ALL blocks in this user default namespace (not just the
        // one we're creating)
        //

        const firestore = FirestoreAdmin.getInstance();

        // wipe out BlockPermission too each time or else the changes can not be computed
        if (blockID) {
            console.log("Deleting block_permission for blockID: " + blockID);
            await BlockPermissionCollection.doDelete(firestore, blockID);
        }

        if (nspaceID) {
            console.log("Deleting block_permission for nspaceID: " + nspaceID);
            await BlockPermissionCollection.doDelete(firestore, nspaceID);
        }

        // wipe out all users permissions involved

        for (const userID of users) {
            await BlockPermissionUserCollection.doDelete(firestore, userID);
        }

    }

});

async function assertThrowsAsync<T>(delegate: () => Promise<T>): Promise<void> {

    try {

        await delegate();

        assert.fail("Delegate did not throw error.");

    } catch (e) {
        // expected
    }

}

export async function getUserIDByEmail(email: EmailStr): Promise<UserIDStr> {
    const app = FirebaseAdmin.app();
    const auth = app.auth();
    const {uid} = await auth.getUserByEmail(FirebaseTestingUsers.FIREBASE_USER);
    return uid;
}


export interface IUpdatedObj {
    readonly updated: ISODateTimeStrings;
}

export function canonicalizeUpdated(updatedObj: IUpdatedObj | undefined) {

    if (updatedObj === undefined) {
        return undefined;
    }

    const val = updatedObj as any;

    if (typeof val.updated === 'string') {
        val.updated = 'xxx';
    }

    return updatedObj;

}


