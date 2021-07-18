import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {FirebaseTestingUsers} from "polar-firebase-test/src/firebase/FirebaseTestingUsers";
import {getUserIDByEmail} from "./BlockPermissionsTest";
import {NSpaces} from "./NSpaces";
import {NSpaceCollection} from "polar-firebase/src/firebase/om/NSpaceCollection";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";

describe("NSpaces", function() {

    this.timeout(10000);

    it("basic with default permissions", async function() {

        const firestore = FirestoreAdmin.getInstance();
        const uid = await getUserIDByEmail(FirebaseTestingUsers.FIREBASE_USER);

        const nspace = await NSpaces.create(firestore, uid, {
            name: 'Egypt',
            description: "All my Egypt stuff",
            lang: undefined,
            langs: undefined
        });

        assertJSON(await NSpaceCollection.get(firestore, nspace.id), nspace);

    });

});
