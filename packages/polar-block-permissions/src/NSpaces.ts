import {IFirestore, IFirestoreLib, UserIDStr} from "polar-firestore-like/src/IFirestore";
import {NSpaceCollection} from "polar-firebase/src/firebase/om/NSpaceCollection";
import {Slugs} from "polar-shared/src/util/Slugs";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockPermissionMap} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissions} from "./BlockPermissions";

export namespace NSpaces {

    import INSpace = NSpaceCollection.INSpace;
    import INSpaceInit = NSpaceCollection.INSpaceInit;
    import IBlockPermissionChange = BlockPermissions.IBlockPermissionChange;

    /**
     * Create a namespace and perform all validation on it so that we know it's valid.
     */
    export async function create(firestore: IFirestore<unknown> & IFirestoreLib,
                                 uid: UserIDStr,
                                 init: INSpaceInit): Promise<INSpace> {

        // TODO: make sure the user doesn't already have a namespace with this name/slug

        const id = Hashcodes.createRandomID();
        const slug = Slugs.calculateIntl(init.name);
        const nspace: INSpace = {
            id, slug, ...init
        };

        async function doWrite() {

            const batch = firestore.batch();

            async function doWriteNSpace() {
                await NSpaceCollection.set(firestore, nspace, batch);
            }

            async function doWritePermissions() {

                // by default this user is the admin of this namespace so we
                // also have to write a block_permission record for this which
                // is used the first time.

                const permissions: Readonly<BlockPermissionMap> = {
                    [uid]: {
                        id: uid,
                        uid,
                        access: 'owner'
                    }
                };

                const permissionChanges: ReadonlyArray<IBlockPermissionChange> = [
                    {
                        type: 'added',
                        id,
                        uid,
                        before: undefined,
                        after: 'rw'
                    }
                ];

                await BlockPermissions.applyPermissionChanges(firestore, id, 'nspace', permissions,  permissionChanges, batch);

            }

            await doWriteNSpace();
            await doWritePermissions();

            await batch.commit();

        }

        await doWrite();

        return nspace;

    }

}
