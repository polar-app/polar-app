

import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';

const log = Logger.create()

/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
export class TestResultsService {

    /**
     * The current result that we have. Null means that we have no result.
     * If you need to store a null result wrap it in an object with a
     * 'value'
     */
    private result: any = null;

    constructor() {

    }

    /**
     * Start the service by listening to messages posted.
     */
    start(): void {

        log.info("started");

        ipcRenderer.on('test-results', (event, data) => {

            if(data.type === "write") {

                if(! this.result) {

                    if(data.result) {

                        this.result = data.result;

                        log.info("Received test result: ", this.result);

                    } else if(data.err) {

                    } else {
                        log.error("Given neither result nor err: ", data);
                    }

                } else {
                    // TODO consider telling the sender.
                    log.error("Existing test results already defined.: ", data.value);
                }

            }

            if(data.type === "read") {

                event.sender.sendAsync()

            }

        });

    }

}
