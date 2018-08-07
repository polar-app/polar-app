import {TestResultReader} from '../TestResultReader';
import {Result} from '../../../util/Result';

declare var window: any;

export class WebDriverTestResultReader extends TestResultReader {

    private readonly app: any;

    constructor(app: any) {
        super();
        this.app = app;
    }

    async read(): Promise<Result<any>> {

        let result = await this.app.client.executeAsync((done: Function) => {

            function poll() {

                if (window.TEST_RESULT != null) {
                    done(window.TEST_RESULT);
                    return;
                }

                setTimeout(poll, 250);
            }

            setTimeout(poll, 0);

        });

        return result.value;


    }

}
