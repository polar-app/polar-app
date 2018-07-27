

import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {TestResult} from './renderer/TestResult';

const log = Logger.create()


/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
export class TestResultService {

    constructor() {

    }

    /**
     * Start the service by listening to messages posted.
     */
    start(): void {

        log.info("started");

        ipcRenderer.on('test-results', (event: any, data: any) => {

            if(data.type === "write") {

                if(TestResult.get() === null) {

                    if(data.result !== null && data.result !== undefined) {

                        // TODO: TestResult should be a Result and we should
                        // enforce it by type.  Otherwise we don't support err
                        // values.

                        TestResult.set(data.result);

                        log.info("Received test result: ", TestResult.get());

                    } else if(data.err) {

                        // TODO: right now we do not set the err...

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

}
