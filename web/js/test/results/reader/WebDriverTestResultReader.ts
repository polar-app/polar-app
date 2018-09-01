//import {Application} from 'spectron';

import {TestResultReader} from '../TestResultReader';
import {Results} from '../../../util/Results';
import {TApplication} from '../../Spectron';

declare var window: any;

export class WebDriverTestResultReader extends TestResultReader {

    private readonly app: TApplication;

    constructor(app: TApplication) {
        super();
        this.app = app;
    }

    async read<T>(): Promise<T> {

        let result = await this.app.client.executeAsync((done: (val: any) => void ) => {

            function poll() {

                if (window.TEST_RESULT != null) {
                    done(window.TEST_RESULT);
                }

                setTimeout(poll, 250);
            }

            poll();

        });

        return Results.create<T>(result).get();

    }

}
