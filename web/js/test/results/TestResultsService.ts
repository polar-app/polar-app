

import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';

const log = Logger.create()

/**
 * The current result that we have. Null means that we have no result. If you
 * need to store a null result wrap it in an object with a 'value'.  We make this
 * a global value so that spectron can easily read it.
 */
declare var window: any;

/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
export class TestResultsService {

    constructor() {

    }

    /**
     * Start the service by listening to messages posted.
     */
    start(): void {

        log.info("started");

        ipcRenderer.on('test-results', (event: any, data: any) => {

            if(data.type === "write") {

                if(! TestResultsService.get()) {

                    if(data.result) {

                        TestResultsService.set(data.result);

                        log.info("Received test result: ", TestResultsService.get());

                    } else if(data.err) {

                    } else {
                        log.error("Given neither result nor err: ", data);
                    }

                } else {
                    // TODO consider telling the sender.
                    log.error("Existing test results already defined.: ", data.value);
                }

            }

        });

    }

    static set(value: any) {
        window.TEST_RESULT = value;
    }

    static get(): any {
        return window.TEST_RESULT;
    }

}
