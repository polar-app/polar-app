import {IFirestore, IFirestoreLib, UserIDStr} from "polar-firestore-like/src/IFirestore";
import {NSpaceCollection} from "polar-firebase/src/firebase/om/NSpaceCollection";
import {Slugs} from "polar-shared/src/util/Slugs";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export namespace NSpaces {

    import INSpace = NSpaceCollection.INSpace;
    import INSpaceInit = NSpaceCollection.INSpaceInit;

    export async function create(firestore: IFirestore<unknown> & IFirestoreLib,
                                 uid: UserIDStr,
                                 init: INSpaceInit): Promise<INSpace> {

        // TODO: make sure the user doesn't already have a namespace with this name/slug

        const id = Hashcodes.createRandomID();

        const nspace: INSpace = {
            id, ...init
        };

        function validateSlug() {

            // Make sure the slug was created properly because technically it could be an invalid slug

            const correctSlug = Slugs.calculateIntl(nspace.name)
            if (nspace.slug !== correctSlug) {
                throw new Error(`Slug incorrect: ${nspace.slug} - ${correctSlug}`)
            }

        }

        // TODO: by default this user is the admin of this namespace so we also
        // have to write a block_permission record for this.

        validateSlug();

        return nspace;

    }

}
