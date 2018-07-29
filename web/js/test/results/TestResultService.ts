

import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {TestResult} from './renderer/TestResult';
import {IPCMessage} from '../../util/IPCMessage';

const log = Logger.create();


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

        ipcRenderer.on('test-result', (event: Electron.Event, data: any) => {

            if(data.type === "write") {
                this.onWrite(data);
            }

            if(data.type === "ping") {
                this.onPing(event, data);
            }


        });

        // tell everyone we've started now
        ipcRenderer.send("test-result", { type: "started" });

    }

    onPing(event: Electron.Event, data: any) {

        let pingMessage = <IPCMessage>data;

        let pongMessage = new IPCMessage("pong", true, pingMessage.nonce);

        event.sender.send('test-result', pongMessage);

    }

    onWrite(data: any) {

        // TODO: migrate to optional for this...
        if(TestResult.get() === null || TestResult.get() == undefined) {

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
            log.error("Existing test results already defined.: " + data.value);
        }

    }


}
