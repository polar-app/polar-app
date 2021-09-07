import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {canonicalizeUpdated, getUserIDByEmail} from "./BlockPermissionsTestK";
import {NSpaces} from "./NSpaces";
import {NSpaceCollection} from "polar-firebase/src/firebase/om/NSpaceCollection";
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";
import {assertJSON} from "polar-test/src/test/Assertions";

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
        });

        // assertJSON(canonicalizeUpdated(await BlockPermissionUserCollection.get(firestore, uid)), {
        //     "id": "rgLitBszZKagk0Q5C5hBccYKVMd2",
        //     "nspaces_ro": [
        //         "rgLitBszZKagk0Q5C5hBccYKVMd2"
        //     ],
        //     "nspaces_rw": [
        //         "12eCykomUT",
        //         "13apGG8bj6",
        //         "1Q8SP9VB2E",
        //         "1iNPUcMJFq",
        //         "12acFhWWQF",
        //         "15156HH6Uo"
        //     ],
        //     "pages_ro": [],
        //     "pages_rw": [],
        //     "uid": "rgLitBszZKagk0Q5C5hBccYKVMd2",
        //     "updated": "xxx"
        // });

    });

});
