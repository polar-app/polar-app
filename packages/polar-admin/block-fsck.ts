import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {Lazy} from "polar-shared/src/util/Lazy";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {BlockFSCK} from "polar-blocks/src/blocks/BlockFSCK";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {Arrays} from "polar-shared/src/util/Arrays";

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

function getEmailFromCommandLine() {
    // gets the first command line argument
    const email = process.argv.slice(2)[0];

    if (! email) {
        throw new Error("This command requires an email as argument to generate a valid token");
    }

    return email;

}

async function getUID(email: string) {

    const firebase = firebaseProvider();

    const auth = firebase.auth();

    const user = await auth.getUserByEmail(email);

    return user.uid;

}

interface IArgs {
    readonly repair?: boolean;
}

function parseArgs(): IArgs {
    if (Arrays.last(process.argv) === '--repair') {
        return {repair: true}
    }

    return {};
}

async function exec() {

    const args = parseArgs();

    const email = getEmailFromCommandLine();

    const uid = await getUID(email);

    const firestore = FirestoreAdmin.getInstance();

    const blocks = await BlockCollection.list(firestore, uid)

    console.log("Found N block records: " + blocks.length);

    const corruptions = BlockFSCK.exec(blocks)

    console.log("Found N corruptions: " + corruptions.length);

    console.log(JSON.stringify(corruptions, null, '  '));

    const repairs = await BlockFSCK.repair(corruptions);

    if (args.repair) {

        console.log("Going to repair N corruptions: " + corruptions.length);

        for (const repair of repairs) {
            console.log("Repairing block: " + repair.id);
            await BlockCollection.set(firestore, repair)
        }

    }

}

exec().catch(err => console.error(err));
