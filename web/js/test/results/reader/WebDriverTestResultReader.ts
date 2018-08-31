import {Application} from 'spectron';

import {TestResultReader} from '../TestResultReader';
import {Result} from '../../../util/Result';
import {Results} from '../../../util/Results';

declare var window: any;

export class WebDriverTestResultReader extends TestResultReader {

    private readonly app: Application;

    constructor(app: any) {
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
