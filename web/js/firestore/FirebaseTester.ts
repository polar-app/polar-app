import {SpectronRendererState} from '../test/SpectronRenderer';
import * as firebase from './lib/firebase';
import {Logger} from '../logger/Logger';
import {Firebase} from './Firebase';
import {FirebaseUIAuth} from './FirebaseUIAuth';
import {ASYNC_NULL_FUNCTION} from '../util/Functions';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class FirebaseTester {

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
            this.state.testResultWriter.write(false);

        }

    }

    public onAuthError(err: firebase.auth.Error) {
        this.state.testResultWriter.write(false);
    }

}
