import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {ErrorResponses} from './ErrorResponses';
import {IDUser} from './IDUsers';
import {UserRequests} from './UserRequests';
import { Rollbars } from './Rollbars';

const rollbar = Rollbars.create();

export class ExpressFunctions {

    public static createApp() {
        return express();
    }

    public static createHook(delegate: (req: express.Request, res: express.Response, next: express.NextFunction) => void) {

        const app = this.createApp();

        app.use(bodyParser.json());
        app.use(cors({ origin: true }));

        app.use(delegate);

        // using with express:
        // https://docs.rollbar.com/docs/nodejs
        app.use(rollbar.errorHandler());

        return functions.https.onRequest(app);

    }

    public static createRPCHook<R, V>(handler: (idUser: IDUser, request: R) => Promise<V>): ExpressRequestFunction {

        return (req: express.Request, res: express.Response) => {
            UserRequests.execute<R, V>(req, res, (idUser, request) => handler(idUser, request));
        };

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
        rollbar.log(msg, err);
        console.error(msg, err);
        const body = ErrorResponses.create(err.message);
        this.sendResponse(res, body, 500);
    }

}

export type ExpressRequestFunction = (req: express.Request, res: express.Response) => void;
