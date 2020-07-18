import {Logger} from 'polar-shared/src/logger/Logger';
import {MainAppController} from './MainAppController';
import {Version} from 'polar-shared/src/util/Version';
import {WebRequestHandler} from "polar-shared-webserver/src/webserver/Webserver";

const log = Logger.create();

const ALLOWED_ORIGIN = ['chrome-extension://nplbojledjdlbankapinifindadkdpnj',
                        'chrome-extension://jkfdkjomocoaljglgddnmhcbolldcafd' ]
                       .join(', ');

export class MainAPI {

    private readonly mainAppController: MainAppController;

    private readonly webRequestHandler: WebRequestHandler;

    constructor(mainAppController: MainAppController, webRequestHandler: WebRequestHandler) {
        this.mainAppController = mainAppController;
        this.webRequestHandler = webRequestHandler;
    }

    public start(): void {
        this.startCaptureTriggerHandler();
        this.startPingHandler();
    }

    private startCaptureTriggerHandler() {

        const path = "/rest/v1/capture/trigger";

        this.webRequestHandler.options(path, (req, res) => {

            log.info("Handling OPTIONS request: ", req.headers);

            // TODO: this chrome extension URL will change in the future when we
            // push it to the app store I think.

            res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');

            res.status(200).send({});

        });

        this.webRequestHandler.post(path, (req, res) => {

            log.info("Handling POST request for capture trigger: ", req.body);

            // TODO: I think tis is obsolete now and we can remove this handler
            // this used to be for content capture but it's not valid in 2.0
            res.status(200).send({});

        });

    }

    /**
     * Used so that the chrome extension can ping the desktop app to see if
     * it's active to enable/disable the sharing options.  We won't show the
     * share button if the desktop app isn't active.
     */
    private startPingHandler() {

        const path = "/rest/v1/ping";

        this.webRequestHandler.post(path, (req, res) => {

            res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);

            const timestamp = Date.now();
            const version = Version.get();

            const data = {
                timestamp,
                version
            };

            res.status(200).send(data);

        });

    }


}
