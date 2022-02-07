import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {MigrationCollection} from "polar-firebase/src/firebase/om/MigrationCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {UserIDStr} from "polar-firestore-like/src/IFirestore";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {AmplitudeBackendAnalytics} from "polar-amplitude-backend/src/AmplitudeBackendAnalytics";
import {UserPrefCollection} from "polar-firebase/src/firebase/om/UserPrefCollection";
import {AuthChallengeFixedCollection} from "polar-firebase/src/firebase/om/AuthChallengeFixedCollection";

export namespace FirebaseUserCreator {

    export async function createMigrationForBlockAnnotations(uid: UserIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        MigrationCollection.createSnapshotByName(firestore, uid, 'block-annotations')
    }

    async function sendWelcomeEmail(email: string) {
        const message = {
            to: email,
            from: 'founders@getpolarized.io',
            subject: `Your journey with Polar is ready to begin! 🙌`,
            html: `<p>Welcome to Polar! 🎉🎉 You now have access to Polar and can log in using this email address</p>
                   <p><b><a href="https://getpolarized.io">Click here to get started</a></b></p>
                   <p>Quick note: we would love to hear from you! We are rapidly releasing multiple new features these days. If you have any feedback, send us a message! It helps us improve the tool faster 🙏</p>
                   <p>Cheers</p>
                   <p>The Polar team</p>
                   <p style="font-size: smaller; color: #c6c6c6;">Polar - Read. Learn. Never Forget.</p>`
        };

        await Sendgrid.send(message);

    }

    /**
     * Define a challenge for this user so that they are able to login with this challenge code.
     */
    export async function defineFixedChallenge(email: string, challenge: string) {
        const firestore = FirestoreAdmin.getInstance();

        await AuthChallengeFixedCollection.set(firestore, email, {
            id: email,
            email,
            challenge
        });
    }

    export async function create(email: string, password: string, referral_code?: string) {

        const auth = FirebaseAdmin.app().auth();
        const user = await auth.createUser({email, password});

        const firestore = FirestoreAdmin.getInstance();

        await UserPrefCollection.initForUser(firestore, user.uid);

        // mark ALL migrations completed so that they're never attempted again.
        await MigrationCollection.markMigrationCompleted(firestore, user.uid, 'block-annotations');
        await MigrationCollection.markMigrationCompleted(firestore, user.uid, 'block-usertagsdb');
        await MigrationCollection.markMigrationCompleted(firestore, user.uid, 'block-usertagsdb3');

        await sendWelcomeEmail(email);

        if (referral_code) {
            await AmplitudeBackendAnalytics.traits(user, {referral_code})
        }

        return user;

    }

    export async function deleteUser(uid: UserIDStr) {

        const auth = FirebaseAdmin.app().auth();
        const firestore = FirestoreAdmin.getInstance();

        await UserPrefCollection.doDelete(firestore, uid)

        await auth.deleteUser(uid);

    }

}
