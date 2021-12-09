import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {ErrorResponses} from './ErrorResponses';
import {IDUser} from './IDUsers';
import {UserRequests} from './UserRequests';
import {SentryReporters} from "../reporters/SentryReporter";

const CORS_OPTIONS: cors.CorsOptions = {
    origin: [
        "https://getpolarized.io",
        "https://app.getpolarized.io",
        "http://localhost:8050",
        "https://localhost:8050",
        "http://127.0.0.1:8050",
        "https://127.0.0.1:8050",
        "http://192.168.1.50:8050",
    ],
    credentials: true,
    methods: [
        'GET', 'PUT', 'POST'
    ]
}

export class ExpressFunctions {

    public static createApp() {
        return express();
    }

    public static createHookAsync(functionName: string, delegate: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) {

        const app = this.createApp();

        // https://expressjs.com/en/resources/middleware/cors.html#configuring-cors
        app.use(bodyParser.json());
        app.use(cors(CORS_OPTIONS));

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        app.use(cors(CORS_OPTIONS), async (req, res, next) => {

            try {
                await delegate(req, res, next);
            } catch (err) {
                this.handleError(functionName, req, res, err);
            }

        });

        return functions.https.onRequest(app);

    }

    public static createHook(functionName: string,
                             delegate: (req: express.Request, res: express.Response, next: express.NextFunction) => void) {

        const app = this.createApp();

        app.use(bodyParser.json());
        app.use(cors(CORS_OPTIONS));

        app.use(cors(CORS_OPTIONS), (req, res, next) => {

            try {
                delegate(req, res, next);
            } catch (err) {
                this.handleError(functionName, req, res, err);
            }
        });

        return functions.https.onRequest(app);

    }

    private static handleError(functionName: string,
                               req: express.Request,
                               res: express.Response,
                               err: unknown) {

        function createMessage() {
            if (req.body) {
                return `Could not handle HTTP ${req.method} request at: ${req.url} with body: ` + JSON.stringify(req.body, null, "  ");
            } else {
                return `Could not handle HTTP ${req.method} request at: ${req.url}`;
            }
        }

        const msg = createMessage();

        console.error("Handling error and sending to sentry: ", err);
        SentryReporters.reportError(msg, err, {functionName});

        ExpressFunctions.sendResponse(res, msg, 500, 'text/plain');

        // errorHandler(err, req, res, next)

    }

    public static createRPCHook<R, V>(functionName: string, handler: (idUser: IDUser, request: R) => Promise<V>): ExpressRequestFunction {

        return this.createHookAsync(functionName, async (req: express.Request, res: express.Response) => {
            await UserRequests.executeAsync<R, V>(req, res, async (idUser, request) => await handler(idUser, request))
        });

    }

    // this should be something like JSONResponses
    public static sendResponse(res: express.Response,
                               body: any,
                               status: number = 200,
                               contentType: string = 'application/json') {

        res.setHeader('Content-Type', contentType);
        res.status(status).end(JSON.stringify(body || {}, null,  "  "));

    }

    public static sendError(res: express.Response, err: Error) {

        const msg = "Unable to handle request: ";
        console.error(msg, err);
        const body = ErrorResponses.create(err.message);

        SentryReporters.reportError(msg, err);

        this.sendResponse(res, body, 500);

    }

}

export type ExpressRequestFunction = (req: express.Request, res: express.Response) => void;
