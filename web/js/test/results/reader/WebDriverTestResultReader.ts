
import {TestResultReader} from '../TestResultReader';
import {Results} from '../../../util/Results';
import {TApplication} from '../../Spectron';

declare var window: any;

export class WebDriverTestResultReader implements TestResultReader {

    private readonly app: TApplication;

    constructor(app: TApplication) {
        this.app = app;
    }

    public async read<T>(): Promise<T> {

        const result = await this.app.client.executeAsync((done: (val: any) => void ) => {

            function poll() {

                if (window.SPECTRON_TEST_RESULT !== null &&
                    window.SPECTRON_TEST_RESULT !== undefined) {

                    done(window.SPECTRON_TEST_RESULT);
                    return;

                }

                setTimeout(poll, 250);
            }

            poll();

        });

        return Results.create<T>(result).get();

    }

}
