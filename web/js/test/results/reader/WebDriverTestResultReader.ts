//import {Application} from 'spectron';

import {TestResultReader} from '../TestResultReader';
import {Results} from '../../../util/Results';
import {TApplication} from '../../Spectron';

declare var window: any;

export class WebDriverTestResultReader implements TestResultReader {

    private readonly app: TApplication;

    constructor(app: TApplication) {
        this.app = app;
    }

    async read<T>(): Promise<T> {

        // TODO: maybe just write these to ALL windows... that's probably the
        // easiest and most expedient way to move forward.

        let result = await this.app.client.executeAsync((done: (val: any) => void ) => {

            function poll() {

                if (window.SPECTRON_TEST_RESULT !== null &&
                    window.SPECTRON_TEST_RESULT !== undefined) {

                    done(window.SPECTRON_TEST_RESULT);

                }

                setTimeout(poll, 250);
            }

            poll();

        });

        return Results.create<T>(result).get();

    }

}
