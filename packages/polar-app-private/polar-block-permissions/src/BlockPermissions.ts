import {IFirestore, IFirestoreLib, UserIDStr} from "polar-firestore-like/src/IFirestore";
import {BlockIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {AccessTypes, PermissionType} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissionMap, IBlockPermissionRecord} from "polar-firebase/src/firebase/om/IBlockPermissionRecord";
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

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
                                       id: BlockIDStr,
                                       effectivePerms: Readonly<BlockPermissionMap>,
                                       newPermissions: Readonly<BlockPermissionMap>) {

        // ** verify that the user is admin
        if (effectivePerms[uid]?.access !== 'admin') {
            throw new Error("User does not have admin to change permissions on this page: " + id);
        }

        // tslint:disable-next-line:no-string-literal
        if (newPermissions['__public__']?.access === 'admin') {
            throw new Error("Not allowed to set __public__ permissions to 'admin'" + id);
        }

        // now get the current permissions...
        const oldPermissionsRecord = await BlockPermissionCollection.get(firestore, id);

        const oldPermissions = oldPermissionsRecord?.permissions || {};

        const permissionChanges = computePermissionChanges(id, oldPermissions, newPermissions);

        await applyPermissionChanges(firestore, target, permissionChanges);

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

        const pagePerms: IBlockPermissionRecord<'page'> | undefined = await BlockPermissionCollection.get(firestore, block.id);
        const nspacePerms: IBlockPermissionRecord<'nspace'> | undefined = await BlockPermissionCollection.get(firestore, block.nspace);

        const effectivePerms = computeEffectivePermissionsForPage(pagePerms, nspacePerms);

        await doUpdatePermissions(firestore, 'page', uid, id, effectivePerms, newPermissions);

    }

    export async function doUpdateNSpacePermissions(firestore: IFirestore<unknown> & IFirestoreLib,
                                                    uid: UserIDStr,
                                                    id: BlockIDStr,
                                                    newPermissions: Readonly<BlockPermissionMap>) {

        const block = await getBlock(firestore, id);

        const nspacePerms: IBlockPermissionRecord<'nspace'> | undefined = await BlockPermissionCollection.get(firestore, block.nspace);

        const effectivePerms = nspacePerms?.permissions || {};

        await doUpdatePermissions(firestore, 'nspace', uid, id, effectivePerms, newPermissions);

    }


   /**
    * Take the nspace permissions and merge them with the page permissions.
    */
    export function computeEffectivePermissionsForPage(page: IBlockPermissionRecord<'page'> | undefined,
                                                       nspace: IBlockPermissionRecord<'nspace'> | undefined): Readonly<BlockPermissionMap> {

        const result: BlockPermissionMap = {};

        Object.values(nspace?.permissions || {}).map(current => result[current.uid] = current);

        Object.values(page?.permissions || {}).map(current => result[current.uid] = current);

        return result;

    }

    /**
     * The user was added to the permissions set (they weren't present before)
     */
    export interface IPermissionChangeAdded {
        readonly id: BlockIDStr,
        readonly uid: UserIDStr;
        readonly type: 'added';
        readonly before: undefined;
        readonly after: PermissionType;
    }

    /**
     * The user was added to the permissions set (they were present before but had it revoked.)
     */
    export interface IPermissionChangeRemoved {
        readonly id: BlockIDStr,
        readonly uid: UserIDStr;
        readonly type: 'removed';
        readonly before: PermissionType;
        readonly after: undefined;
    }

    export interface IPermissionChangeModified {
        readonly id: BlockIDStr,
        readonly uid: UserIDStr;
        readonly type: 'modified';
        readonly before: PermissionType;
        readonly after: PermissionType;
    }

    export type IPermissionChange = IPermissionChangeAdded | IPermissionChangeRemoved | IPermissionChangeModified;

    /**
     * Convert the old permissions to a set of new IPermissionChange objects so
     * that we can apply the operations to the database directly.
     */
    export function computePermissionChanges(id: BlockIDStr,
                                             oldPermissions: Readonly<BlockPermissionMap>,
                                             newPermissions: Readonly<BlockPermissionMap>): ReadonlyArray<IPermissionChange> {

        // compute all the unique UIDs in both sets.  This is needed because we have to compute
        // added or removed permissions.
        const uids = arrayStream([
                ...Object.keys(oldPermissions),
                ...Object.keys(newPermissions)
            ])
            .unique()
            .collect();

        const toPermissionChange = (uid: UIDStr): IPermissionChange | undefined => {

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
                                                 target: PermissionTarget,
                                                 permissionChanges: ReadonlyArray<IPermissionChange>) {

        const collection = firestore.collection('block_permission_user');
        const batch = firestore.batch();

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

        const applyToBatch = (change: IPermissionChange) => {

            const doc = collection.doc(change.uid);

            switch (change.type) {

                case "removed":
                    // we just have to remove this from both rw and ro and we're done.
                    batch.update(doc, keyNames.ro, firestore.FieldValue.arrayRemove(change.id));
                    batch.update(doc, keyNames.rw, firestore.FieldValue.arrayRemove(change.id));
                    break;

                case "added":
                case "modified":

                    // added and modified can be implemented the same way as
                    // long as we remove/union both ways.
                    switch(change.after) {
                        case 'ro':
                            batch.update(doc, keyNames.ro, firestore.FieldValue.arrayUnion(change.id));
                            batch.update(doc, keyNames.rw, firestore.FieldValue.arrayRemove(change.id));
                            break;
                        case 'rw':
                            batch.update(doc, keyNames.ro, firestore.FieldValue.arrayRemove(change.id));
                            batch.update(doc, keyNames.rw, firestore.FieldValue.arrayUnion(change.id));
                            break;
                    }

                    break;


            }

        }

        permissionChanges.map(applyToBatch);

        await batch.commit();

    }

}

