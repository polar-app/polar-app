import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {canonicalizeUpdated, getUserIDByEmail} from "./BlockPermissionsTest";
import {NSpaces} from "./NSpaces";
import {NSpaceCollection} from "polar-firebase/src/firebase/om/NSpaceCollection";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";

describe("NSpaces", function() {

    this.timeout(10000);

    // FIXME: make sure the same user can't create two namespaces with the same name.

    it("basic with default permissions", async function() {

        // FIXME: cleanup...
        //
        // - delete all namespaces for this user
        // - delete all the block permissions for this user too
        // -

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);

        const nspace = await NSpaces.create(firestore, uid, {
            name: 'Egypt',
            description: "All my Egypt stuff",
            lang: undefined,
            langs: undefined
        });

        assertJSON(await NSpaceCollection.get(firestore, nspace.id), nspace);

        assertJSON(canonicalizeUpdated(await BlockPermissionCollection.get(firestore, nspace.id)), {
            "id": nspace.id,
            "permissions": {
                "rgLitBszZKagk0Q5C5hBccYKVMd2": {
                    "access": "owner",
                    "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
                    "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2"
                }
            },
            "type": "nspace",
            "updated": "xxx"
        })

    });

});
