import {SpectronRendererState} from '../test/SpectronRenderer';
import * as firebase from './lib/firebase';
import {Logger} from '../logger/Logger';
import {Firebase} from './Firebase';
import {FirebaseUIAuth} from './FirebaseUIAuth';
import {ASYNC_NULL_FUNCTION} from '../util/Functions';
import {isPresent} from '../Preconditions';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class FirebaseRunner {

    private readonly state: SpectronRendererState;

    private currentUser: firebase.User | null = null;

    // noinspection TsLint
    private testingFunction: () => Promise<void> = ASYNC_NULL_FUNCTION;

    constructor(state: SpectronRendererState) {
        this.state = state;
    }

    public async run(testingFunction: () => Promise<void>) {

        this.testingFunction = testingFunction;

        window.addEventListener('load', async () => {

            Firebase.init();

            if (firebase.auth().currentUser === null) {

                // bring up the UI so that we can login.
                FirebaseUIAuth.login();

            }

            this.init()
                .catch(err => log.error("Caught error on init", err));

        });

    }

    public async init() {

        firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public async onAuth(user: firebase.User | null) {

        this.currentUser = user!;

        if (user) {

            log.notice("Working with user: ", user);

            const accountDetailsElement = document.getElementById("account-details");

            if (isPresent(accountDetailsElement)) {
                accountDetailsElement!.innerText = JSON.stringify(firebase.auth().currentUser, null, "  ");
            }

            await this.testingFunction();

            mocha.run((nrFailures: number) => {

                this.state.testResultWriter.write(nrFailures === 0)
                    .catch(err => console.error("Unable to write results: ", err));

            });

        } else {

            log.error("No user");

            // in automated testing we have to fail here because no cookies are
            // present to run this test and someone needs to run the test
            // manually to login to store data
            await this.state.testResultWriter.write(false);

        }

    }

    public onAuthError(firebaseError: firebase.auth.Error) {

        log.error("Firebase error: ", firebaseError);

        this.state.testResultWriter.write(false)
            .catch(err => log.error("Could not send result: ", err));
    }

}
