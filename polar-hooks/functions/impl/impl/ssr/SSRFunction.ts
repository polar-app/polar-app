import * as functions from "firebase-functions";
import express from 'express';
import {Callback} from "polar-shared/src/util/Functions";
import {Webapps} from "../../webapp/Webapps";

let app = express();

console.log("SSR: Running with production SSR function v5");

const prerender =
    require('prerender-node')
        .set('prerenderToken', 'nHFtg5f01o0FJZXDtAlR')
        // .set('prerenderServiceUrl', 'https://app.getpolarized.io/prerender')
        .set('beforeRender', function(req: express.Request, done: Callback) {
            console.log("SSR: beforeRender");

            if (done) {
                done();
            }

        });
        // .set('afterRender', function(err: Error | undefined, req: express.Request, done: Callback) {
        //
        //     if (err) {
        //         console.log("SSR: afterRender: FAIL: ", err);
        //     } else {
        //         console.log("SSR: afterRender: SUCCESS");
        //     }
        //
        //     if (done) {
        //         done();
        //     }
        // });

console.log("Running with crawler user agents: ", prerender.crawlerUserAgents);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("SSR: handling prerender");
    prerender(req, res, next);
});

app = Webapps.createWebapp(app);

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
