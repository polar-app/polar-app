import {FirebaseConfig} from 'polar-firebase-admin/src/FirebaseConfig';
import {Storage} from '@google-cloud/storage';
import {ServiceAccounts} from 'polar-firebase-admin/src/FirebaseAdmin';
import {trace} from '../trace';
import {DocPermission, DocPermissions} from '../groups/db/DocPermissions';
import {UserGroups} from '../groups/db/UserGroups';
import {IDUser} from '../util/IDUsers';
import {DocIDStr} from 'polar-shared/src/groups/DocRef';
import {GroupIDStr} from '../groups/db/Groups';
import {Arrays, ToArrayLike} from "polar-shared/src/util/Arrays";
import IFirebaseConfig = FirebaseConfig.IFirebaseConfig;

/**
 * Code for working with datastores.
 */
export class Datastores {

    public static createStorage(): StorageConfig {

        const config = FirebaseConfig.create();

        if (! config) {
            throw new Error("No config");
        }

        console.log("Creating storage config for project: " + config.project);

        const storage = new Storage(ServiceAccounts.toStorageOptions(config.serviceAccount));

        return {config, storage};

    }

    public static async verifyAccess(idUser: IDUser, docID: DocIDStr): Promise<DocPermission> {

        const {uid} = idUser;

        trace("Retrieving doc_permission");
        const docPermission = await DocPermissions.get(docID);

        if (! docPermission) {
            console.error("No doc permission for " + docID);
            throw new Error("Failed to fetch");
        }

        if (['protected', 'public'].includes(docPermission.visibility)) {
            return docPermission;
        }

        const userGroups = await UserGroups.get(uid);

        function hasGroupMembership(permittedGroups?: ToArrayLike<GroupIDStr>,
                                    membership?: ToArrayLike<GroupIDStr>) {

            return Arrays.hasAny(Arrays.toArray(permittedGroups), Arrays.toArray(membership));

        }

        if (userGroups) {

            if (hasGroupMembership(docPermission.groups, userGroups.groups) ||
                hasGroupMembership(docPermission.groups, userGroups.invitations)) {

                return docPermission;

            }

        }

        throw new Error("Invalid permissions to access document");

    }

}

export interface StorageConfig {
    readonly config: IFirebaseConfig;
    readonly storage: Storage;
}
