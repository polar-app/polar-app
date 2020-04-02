import * as admin from 'firebase-admin';

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

// TODO: compute the following stats:

// per week, per month,
//
// with ignored zeros...
//

async function fetchData(): Promise<UserFeedback[]> {

    const snapshot = await firestore.collection("user_feedback").get();

    return snapshot.docs.map(doc => <UserFeedback> doc.data());

}

function partitionByWeek(userFeedbacks: UserFeedback[]) {

}

async function computeStats() {

    // TODO get most recent copy of the data...

    const snapshot = await firestore.collection("user_feedback").get();

    const total = snapshot.docs.length;

    const data: {[key: string]: UserFeedback} = {};

    for( const doc of snapshot.docs) {

        const userFeedback: UserFeedback = <any> doc.data();

        if (! data[userFeedback.machine]) {
            data[userFeedback.machine] = userFeedback;
            continue;
        }

        console.log(".");
        const existing = data[userFeedback.machine];

        if (Date.parse(existing.created) < Date.parse(userFeedback.created)) {
            data[userFeedback.machine] = userFeedback;
            console.log("updated");
        }

    }

    const userFeedbacks = Object.values(data);

    let nrDetractors = 0;
    let nrPassives = 0;
    let nrPromoters = 0;

    const hist = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
    };

    for (const userFeedback of userFeedbacks) {

        if (userFeedback.netPromoterScore === null) {
            continue;
        }


        if (userFeedback.netPromoterScore === 0) {
            continue;
        }

        if (userFeedback.netPromoterScore < 0 || userFeedback.netPromoterScore > 10 ) {
            // console.warn("Invalid userFeedback: ", userFeedback);
            continue;
        }

        ++hist[userFeedback.netPromoterScore];

        if (userFeedback.netPromoterScore <= 6) {
            ++nrDetractors;
            continue;
        }

        if (userFeedback.netPromoterScore <= 8) {
            ++nrPassives;
            continue;
        }

        ++nrPromoters;

    }

    // The Net Promoter Score is calculated by subtracting the percentage of
    // customers who are Detractors from the percentage of customers who are
    // Promoters. For purposes of calculating a Net Promoter Score, Passives
    // count toward the total number of respondents, thus decreasing the
    // percentage of detractors and promoters and pushing the net score toward 0

    console.log({nrDetractors, nrPassives, nrPromoters});

    const nrVotes = nrDetractors + nrPromoters + nrPromoters;

    const nps = 100 *((nrPromoters / nrVotes) - (nrDetractors / nrVotes))

    console.log({hist});

    console.log({nps, nrVotes});

}

computeStats()
    .catch(err => console.error(err));

interface UserFeedback {

    /**
     * The score they gave us.
     */
    readonly netPromoterScore: NetPromoterScore | null;

    /**
     * Their actual text that they provided.
     */
    readonly text: string | null;

    readonly created: string;

    readonly machine: string;

    // TODO: more fields including a unique/blinded ID for the user, the date
    // their account was created (so I can do cohorts for this)

}

type NetPromoterScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
