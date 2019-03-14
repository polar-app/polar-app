import express from 'express';
import {CaptureOpts} from '../../capture/CaptureOpts';
import {WebRequestHandler} from '../../backend/webserver/Webserver';
import {Logger} from '../../logger/Logger';
import {Capture} from '../../capture/Capture';
import {MainAppController} from './MainAppController';
import {Version} from '../../util/Version';

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

        this.webRequestHandler.options(path, (req: express.Request, res: express.Response) => {

            log.info("Handling OPTIONS request: ", req.headers);

            // TODO: this chrome extension URL will change in the future when we
            // push it to the app store I think.

            res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');

            res.status(200).send({});

        });

        this.webRequestHandler.post(path, (req: express.Request, res: express.Response) => {

            log.info("Handling POST request for capture trigger: ", req.body);

            const captureOpts = <Partial<CaptureOpts>> req.body;

            res.status(200).send({});

            this.mainAppController.cmdCaptureWebPageWithBrowser(captureOpts)
                .catch(err => log.error("Unable to capture page: ", err));

        });

    }

    /**
     * Used so that the chrome extension can ping the desktop app to see if
     * it's active to enable/disable the sharing options.  We won't show the
     * share button if the desktop app isn't active.
     */
    private startPingHandler() {

        const path = "/rest/v1/ping";

        this.webRequestHandler.get(path, (req: express.Request, res: express.Response) => {

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
