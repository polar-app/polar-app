
import {TestResultReader} from '../TestResultReader';
import {Results} from 'polar-shared/src/util/Results';
import {TApplication} from '../../Spectron';
import {ResolvablePromise} from '../../../util/ResolvablePromise';

declare var window: any;

// different implementation of reading values where the polling is done local
export class WebDriverTestResultReaderLocal implements TestResultReader {

    private readonly app: TApplication;

    constructor(app: TApplication) {
        this.app = app;
    }

    public async read<T>(): Promise<T> {

        const promise = new ResolvablePromise<T>();

        const poll = async () => {

            const result = await this.app.client.executeAsync((done: (val: any) => void ) => {

                // this function is executing in the browser

                const windowResult = window.SPECTRON_TEST_RESULT;

                if (windowResult !== null && windowResult !== undefined) {
                    done(windowResult);
                    return;
                }

                done(undefined);

            });

            if (result.value !== null && result.value !== undefined) {
                promise.resolve(Results.create<T>(result).get());
            } else {
                setTimeout(poll, 150);
            }

        };

        setTimeout(poll, 0);

        return promise;

    }

}
