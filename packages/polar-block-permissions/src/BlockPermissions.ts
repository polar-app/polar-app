import {IFirestore, IFirestoreLib, UserIDStr} from "polar-firestore-like/src/IFirestore";
import {BlockIDStr, IBlock, NamespaceIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {BlockPermissionMap, IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IBlockPermissionUser} from "polar-firebase/src/firebase/om/IBlockPermissionUser";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {AccessTypes, PermissionType} from "polar-firebase/src/firebase/om/IBlockPermissionEntry";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";

export namespace BlockPermissions {

    export type PermissionTarget = 'page' | 'nspace';

    /**
     * Update permissions directly in Firestore.
     *
     * @param firestore  The Firestore instance to use
     * @param target: where to apply the permissions.
     * @param uid The user making the permission changes.
     * @param id The ID of the page which needs permissions mutated.
     * @param effectivePerms The current effective permissions.
     * @param newPermissions The array of permissions to apply.
     */
    async function doUpdatePermissions(firestore: IFirestore<unknown> & IFirestoreLib,
                                       target: PermissionTarget,
                                       uid: UserIDStr,
                                       id: BlockIDStr | NamespaceIDStr,
                                       effectivePerms: Readonly<BlockPermissionMap>,
                                       newPermissions: Readonly<BlockPermissionMap>) {

        function verifyPermissionToUpdate() {

            if (target === 'nspace') {

                if (uid === id) {
                    // this is the users default namespace so by definition, they have permission.
                    return true;
                }

            }

            // ** verify that the user is admin
            if (effectivePerms[uid]?.access !== 'admin') {
                throw new Error(`User does not have admin to change permissions on this ${target}: ${id} with uid=${uid}`);
            }

            // tslint:disable-next-line:no-string-literal
            if (newPermissions['__public__']?.access === 'admin') {
                throw new Error("Not allowed to set __public__ permissions to 'admin'" + id);
            }

            return true;

        }

        verifyPermissionToUpdate();

        // now get the current permissions...
        const oldPermissionsRecord = await BlockPermissionCollection.get(firestore, id);

        const oldPermissions = oldPermissionsRecord?.permissions || {};

        const permissionChanges = computePermissionChanges(id, oldPermissions, newPermissions);

        console.log("Going to apply permissionChanges: ", permissionChanges);

        await applyPermissionChanges(firestore, id, target, newPermissions, permissionChanges);

    }

    async function getBlock(firestore: IFirestore<unknown>, id: BlockIDStr) {

        const block = await BlockCollection.get(firestore, id);

        if (! block) {
            throw new Error("No block for id: " + id);
        }

        if (block.parent !== undefined) {
            throw new Error("Not root block");
        }

        return block;

    }

    export async function doUpdatePagePermissions(firestore: IFirestore<unknown> & IFirestoreLib,
                                                  uid: UserIDStr,
                                                  id: BlockIDStr,
                                                  newPermissions: Readonly<BlockPermissionMap>) {

        const block = await getBlock(firestore, id);

        const pagePerms: IBlockPermission<'page'> | undefined = await BlockPermissionCollection.get(firestore, block.id);
        const nspacePerms: IBlockPermission<'nspace'> | undefined = await BlockPermissionCollection.get(firestore, block.nspace);

        const effectivePerms = computeEffectivePermissionsForPage(uid, block, pagePerms, nspacePerms);

        await doUpdatePermissions(firestore, 'page', uid, id, effectivePerms, newPermissions);

    }

    export async function doUpdateNSpacePermissions(firestore: IFirestore<unknown> & IFirestoreLib,
                                                    uid: UserIDStr,
                                                    id: NamespaceIDStr,
                                                    newPermissions: Readonly<BlockPermissionMap>) {

        const nspacePerms: IBlockPermission<'nspace'> | undefined = await BlockPermissionCollection.get(firestore, id);

        const effectivePerms = nspacePerms?.permissions || {
            [uid]: {
                id: uid,
                uid,
                access: 'admin'
            }
        };

        await doUpdatePermissions(firestore, 'nspace', uid, id, effectivePerms, newPermissions);

    }


   /**
    * Take the nspace permissions and merge them with the page permissions.
    */
    export function computeEffectivePermissionsForPage(uid: UserIDStr,
                                                       block: IBlock,
                                                       page: IBlockPermission<'page'> | undefined,
                                                       nspace: IBlockPermission<'nspace'> | undefined): Readonly<BlockPermissionMap> {

        const result: BlockPermissionMap = {};

        Object.values(nspace?.permissions || {}).map(current => result[current.uid] = current);

        Object.values(page?.permissions || {}).map(current => result[current.uid] = current);

        if (block.nspace === uid) {
            // this is a users default namespace so by definition they have 'admin' permission
            result[uid] = {
                id: uid,
                uid,
                access: 'admin'
            }
        }

        return result;

    }

    /**
     * The user was added to the permissions set (they weren't present before)
     */
    export interface IBlockPermissionChangeAdded {
        readonly id: BlockIDStr | NamespaceIDStr,
        readonly uid: UserIDStr;
        readonly type: 'added';
        readonly before: undefined;
        readonly after: PermissionType;
    }

    /**
     * The user was added to the permissions set (they were present before but had it revoked.)
     */
    export interface IBlockPermissionChangeRemoved {
        readonly id: BlockIDStr | NamespaceIDStr,
        readonly uid: UserIDStr;
        readonly type: 'removed';
        readonly before: PermissionType;
        readonly after: undefined;
    }

    export interface IBlockPermissionChangeModified {
        readonly id: BlockIDStr | NamespaceIDStr,
        readonly uid: UserIDStr;
        readonly type: 'modified';
        readonly before: PermissionType;
        readonly after: PermissionType;
    }

    export type IBlockPermissionChange = IBlockPermissionChangeAdded | IBlockPermissionChangeRemoved | IBlockPermissionChangeModified;

    /**
     * Convert the old permissions to a set of new IPermissionChange objects so
     * that we can apply the operations to the database directly.
     */
    export function computePermissionChanges(id: BlockIDStr,
                                             oldPermissions: Readonly<BlockPermissionMap>,
                                             newPermissions: Readonly<BlockPermissionMap>): ReadonlyArray<IBlockPermissionChange> {

        console.log("Computing permission changes: ", oldPermissions, newPermissions);

        // compute all the unique UIDs in both sets.  This is needed because we have to compute
        // added or removed permissions.
        const uids = arrayStream([
                ...Object.keys(oldPermissions),
                ...Object.keys(newPermissions)
            ])
            .unique()
            .collect();

        const toPermissionChange = (uid: UIDStr): IBlockPermissionChange | undefined => {

            const oldPerm = oldPermissions[uid];
            const newPerm = newPermissions[uid];

            if (oldPerm && ! newPerm) {
                return {
                    id,
                    uid,
                    type: 'removed',
                    before:AccessTypes.convertToPermissionType(oldPerm.access),
                    after: undefined
                };
            }

            if (! oldPerm && newPerm) {
                return {
                    id,
                    uid,
                    type: 'added',
                    before: undefined,
                    after: AccessTypes.convertToPermissionType(newPerm.access)
                };
            }

            if (oldPerm && newPerm) {

                if (oldPerm.access !== newPerm.access) {

                    return {
                        id,
                        uid,
                        type: 'modified',
                        before: AccessTypes.convertToPermissionType(oldPerm.access),
                        after: AccessTypes.convertToPermissionType(newPerm.access)
                    };

                } else {
                    // we don't need to do anything here as this user permissions did not change.
                    console.warn("Permission did not change: ", oldPerm, newPerm);
                }

            }

            return undefined;

        }

        return arrayStream(uids)
                .map(current => toPermissionChange(current))
                .filterPresent()
                .collect();

    }

    export async function applyPermissionChanges(firestore: IFirestore<unknown> & IFirestoreLib,
                                                 id: BlockIDStr | NamespaceIDStr,
                                                 target: PermissionTarget,
                                                 permissions: Readonly<BlockPermissionMap>,
                                                 permissionChanges: ReadonlyArray<IBlockPermissionChange>,
                                                 batch?: IWriteBatch<unknown>) {

        const b = batch || firestore.batch();

        async function doBlockPermission() {

            const collection = firestore.collection('block_permission');

            const now = ISODateTimeStrings.create();

            const blockPermission: IBlockPermission<any> = {
                id,
                type: target,
                updated: now,
                permissions,
            }

            b.set(collection.doc(id), blockPermission);

        }

        async function doBlockPermissionUser() {

            const collection = firestore.collection('block_permission_user');

            interface IPermKeyNames {
                readonly ro: 'pages_ro' | 'nspaces_ro';
                readonly rw: 'pages_rw' | 'nspaces_rw';
            }

            function computePermKeyNames(): IPermKeyNames {

                switch (target) {

                    case "page":
                        return {
                            ro: 'pages_ro',
                            rw: 'pages_rw',
                        };

                    case "nspace":
                        return {
                            ro: 'nspaces_ro',
                            rw: 'nspaces_rw',
                        }

                }

            };

            const keyNames = computePermKeyNames();

            const applyToBatch = (permissionChange: IBlockPermissionChange) => {

                const doc = collection.doc(permissionChange.uid);

                switch (permissionChange.type) {

                    case "removed":
                        // we just have to remove this from both rw and ro and we're done.
                        b.update(doc, keyNames.ro, firestore.FieldValue.arrayRemove(permissionChange.id));
                        b.update(doc, keyNames.rw, firestore.FieldValue.arrayRemove(permissionChange.id));
                        break;

                    case "added":
                    case "modified":

                        // added and modified can be implemented the same way as
                        // long as we remove/union both ways.
                        switch(permissionChange.after) {
                            case 'ro':
                                b.update(doc, keyNames.ro, firestore.FieldValue.arrayUnion(permissionChange.id));
                                b.update(doc, keyNames.rw, firestore.FieldValue.arrayRemove(permissionChange.id));
                                break;
                            case 'rw':
                                b.update(doc, keyNames.ro, firestore.FieldValue.arrayRemove(permissionChange.id));
                                b.update(doc, keyNames.rw, firestore.FieldValue.arrayUnion(permissionChange.id));
                                break;
                        }

                        break;


                }

            }

            permissionChanges.map(applyToBatch);

            /**
             * There's no way to do a conditional operation in Firestore so we just
             * let this one error. If the document is already created then nothing
             * happens.
             */
            async function createInitialBlockPermissionUserRecords() {

                const userIDs = arrayStream(permissionChanges).map(current => current.uid).unique().collect();

                const now = ISODateTimeStrings.create();

                for (const userID of userIDs) {

                    const empty: IBlockPermissionUser = {
                        id: userID,
                        uid: userID,
                        updated: now,
                        pages_ro: [],
                        pages_rw: [],
                        nspaces_ro: [],
                        nspaces_rw: []
                    };

                    try {
                        await collection.doc(userID).create(empty);
                    } catch(err) {
                        // noop
                    }

                }

            }

            await createInitialBlockPermissionUserRecords();
        }

        await doBlockPermission();
        await doBlockPermissionUser();
        await b.commit();

    }

}

