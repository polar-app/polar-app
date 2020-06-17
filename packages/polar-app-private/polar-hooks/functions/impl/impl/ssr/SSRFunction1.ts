import * as functions from "firebase-functions";
import express from 'express';

const app = express();

console.log("SSR: Running with minimal SSR function");

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("SSR: : handling basic request");
    res.status(200).send('Hello World\n');
    next();
});

// https://expressjs.com/en/guide/error-handling.html
// add a better error handler as it might be that Google isn't logging
// everything

app.use(function(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {

    console.error("Could not handle SSR: \n" + err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send('Internal Server Error');

});

export const SSRFunction = functions.https.onRequest(app);
