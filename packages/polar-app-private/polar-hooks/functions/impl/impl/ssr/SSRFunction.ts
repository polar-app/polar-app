import * as functions from "firebase-functions";
import express from 'express';
import {Callback} from "polar-shared/src/util/Functions";
import {Webapps} from "../../webapp/Webapps";

let app = express();

// Google-Cloud-Tasks

console.log("SSR: Running with production SSR function v7");

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

// this is a bit hacky but there's now way to force the user agent in google
// cloud tasks...
prerender.crawlerUserAgents.push("Google-Cloud-Tasks");

console.log("Running with crawler user agents: ", prerender.crawlerUserAgents);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userAgent = req.header('User-Agent');
    const method = req.method;
    console.log(`SSR: handling prerender: ${method} ${userAgent}`);
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
