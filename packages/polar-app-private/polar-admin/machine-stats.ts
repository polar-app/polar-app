import * as admin from 'firebase-admin';
import {TimeDurations} from "../../polar-app-public/polar-shared/src/util/TimeDurations";

const serviceAccount: admin.ServiceAccount = {
    projectId: "polar-32b0f",
    clientEmail: "firebase-adminsdk-e5gdw@polar-32b0f.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDAFgh2xuFqCZzq\nNTTOJ61FI6YWFyniCYDmyxA7uVwy8TPI9LCQBlwAFsPTjQVwi/5lcEd+9C/S9qAj\n2j4jzWis0Joeaqqrm0R5YyiwWmVHxGAAsHeD9YYzLW3UI0jxzzycUQp5SlQIp6qh\ncaAGuwWFg9Etz3TjgtVyFpe6r3wqqdUFI4Q98yAsDfcCYjBiOND3q/ya2sr8Ukso\nfvnVWPUqU+zZbhAwZ3zUV2POTTSp0NZwvjDnOrvq2OfLzMwoRNm0tzYrNtv/DMHT\ne2q+ivKaa6CSG9RfO3yBZAp4rEIqgJS8x7AUKnSskJUiuhedUlMc0ZwEvd/qeb7E\nwNBPWpa5AgMBAAECggEAJLjRm2uAEpaN4hST6MmbDXm4Ocbp4eWxN+4gR1qzbqXA\nIa3tx0r/8aBohZwTKyYIV3o0oOer8OfnS5Ngh9WwKkGjBSedQztmxtIXKEfPzv2S\n4O7bmmWo50XLFmA8hMX6r2Oq3e9Ay3rKWxzu2/qLHrBJoDll/ky345zAGxeLZFhI\nf9XPunT9z71rmnPOwpB0YInAuVGY/NpnmR5f3neCs9JG5nduRXPF2jmxURFG1uaK\nIaPf5Wudu/aXxOInCJboDRZGgLDzhglwVpsgde9p4VYoPbbc0kparcXqWV0kUjGP\njSWr5nfBtW65yR58uSLm6mgJxqDONnBMeNH0p3i+NQKBgQDtGvthdhUxs35fnVQQ\nR8fXxeDHp/UmFCbpYxdKRhMYnO0DsJ6ZYlofZrQ5u2HTJmxbAIrBfUnBfyvc5Djk\nS5edJtungCYAvf/aWhDZ6FNbjV70+HSkALPwl7N0DpnBz6IJtsRVxWWd03uL0VR1\nfwzQVuhdPFurTNWJ+Z12uN/3xwKBgQDPZKTTEVPsnfffUfE6uCf4DOkIdzEIwHX+\nFxhYpIPZvw26ajVYq1DeNwfDbOm1FDYEjsnUHr0ocYNTH8TdKR3EJR0NWduAp/2X\nrx/Cu18MlZmKkDYK7wE5KIIE6HqM9HvmUoIYXm1iVmLrxo1L0ZNBfBGTUbg64jPp\nFpt74qn9fwKBgQDW9sR8GwuiEOL9Gu1xCTMU3FErkon+6PxSUkV2UEvV38g+tS1F\nUNb2ay3wvYM2ZTqN0tL6E3YAGSUSUlOGH0ao8uboWJWbzKafN1LZzPluIqC5plxR\nqFV7Rn4rNWWPQojdF7evL5UuXuM+4x0YnYRnirOGfEd76eAcBJQPZBOiVwKBgQDO\n0tKg/x3P0bWZSzGj2nVZpR5cZ+lJjg3diJCqDd7Drwl0x2hN9gMeqIigdqQXBoHc\nR721QbZod9N8eSktWUyrCEwRvXPuuRloRKgK3isq9KH7kleizblNlD0dwe49Va+e\nANhmjvzM3dOmyAqu+uC8pIsufIeaiW01XWtPv7rA5wKBgQCYuWUUiAg3OGyEwfY0\nrw9UjDWPz8sBusoral6Ixbx84h/E/fyGgRiS3tirJ6v6mvv20gMt5oEH0Pm8TWrs\nAlpx4zGvZ0+72ABBwf21jmdz0+yRFdHPQjYjG3302xXRvO5qAU2LV7xYiy45Y4t/\nG0E1LtcBAyes8LfL1tE9FmDw6w==\n-----END PRIVATE KEY-----\n",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://polar-32b0f.firebaseio.com"
});

const firestore = admin.firestore();

function recent(machineDatastores: MachineDatastore[]) {

    const now = Date.now();

    return machineDatastores.filter(current => {
        const written = new Date(current.written);
        return now - written.getTime() > 2 * 7 * 24 * 60 * 60 * 1000;
    });
}

async function computeUniqueMachinesPerMonth() {

    console.log("Computing unique machines per month...");

    const snapshot = await firestore.collection("machine_datastore").get();

    const interval = '30d';

    const cutoff = new Date().getTime() - TimeDurations.toMillis(interval);

    let count = 0;

    for( const doc of snapshot.docs) {

        const machineDatastore: MachineDatastore = <any> doc.data();

        const writtenDate = new Date(machineDatastore.written);

        if (writtenDate.getTime() < cutoff) {
            // console.log("x");
            continue;
        }

        // console.log("h");

        ++count;

    }

    console.log(`Count for interval ${interval}: ${count}`);


}

async function computeStats() {

    // TODO get most recent copy of the data...

    const snapshot = await firestore.collection("machine_datastore").get();

    const total = snapshot.docs.length;

    const data: {[key: string]: MachineDatastore} = {};

    for( const doc of snapshot.docs) {

        const machineDatastore: MachineDatastore = <any> doc.data();

        if (! data[machineDatastore.machine]) {
            data[machineDatastore.machine] = machineDatastore;
            continue;
        }

        console.log(".");
        const existing = data[machineDatastore.machine];

        if (Date.parse(existing.written) < Date.parse(machineDatastore.written)) {
            data[machineDatastore.machine] = machineDatastore;
            console.log("updated");
        }

    }

    const machineDatastores = recent(Object.values(data));

    let nrBronze = 0;
    let nrSilver = 0;
    let nrGold = 0;
    let nrCloud = 0;

    const _350MB = 350000000;
    const   _2GB = 2000000000;
    const   _5GB = 5000000000;
    const _12GB  = 12000000000;

    for (const machineDatastore of machineDatastores) {

        if (machineDatastore.persistenceLayerType !== 'cloud' && machineDatastore.persistenceLayerType !== 'web') {
            continue;
        }

        if (machineDatastore.storageInBytes >= _350MB && machineDatastore.storageInBytes < _2GB) {
            ++nrBronze;
        }

        if (machineDatastore.storageInBytes >= _2GB && machineDatastore.storageInBytes < _5GB) {
            ++nrSilver;
        }

        if (machineDatastore.storageInBytes >= _5GB ) {
            ++nrGold;
        }

        if (machineDatastore.nrCaptures > 100 && machineDatastore.nrCaptures < 500) {
            ++nrBronze;
        }

        if (machineDatastore.nrCaptures > 500) {
            ++nrSilver;
        }

        if (machineDatastore.persistenceLayerType === 'cloud') {
            ++nrCloud;
        }

    }
    console.log("Total unique: " + machineDatastores.length);

    console.log("NR bronze: " + nrBronze);
    console.log("NR silver: " + nrSilver);
    console.log("NR gold: " + nrGold);

    const estimatedRevenue = Math.floor(nrBronze * 4.99 + nrSilver * 9.99 + nrGold * 14.99);

    console.log("NR cloud: " + nrCloud);
    console.log(`Estimated revenue (USD) ${estimatedRevenue}`);

    console.log(`Found total docs ${total}`);

}

async function handle() {
    // await computeUniqueMachinesPerMonth();
    await computeStats();
}

handle()
    .catch(err => console.error(err));

interface MachineDatastore {
    readonly machine: string;
    readonly nrCaptures: number;
    readonly nrDocs: number;
    readonly storageInBytes: number;
    readonly written: string;
    readonly persistenceLayerType: string;

}
