import {createWebapp} from "../../webapp/Webapp";
import * as functions from "firebase-functions";
import express from 'express';

const app = createWebapp();
app.use(require('prerender-node').set('prerenderToken', 'nHFtg5f01o0FJZXDtAlR'));

// https://expressjs.com/en/guide/error-handling.html
// add a better error handler
app.use(function(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {

    console.error("Could not handle SSR: \n" + err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send('Internal Server Error');

});

export const SSRFunction = functions.https.onRequest(app);
