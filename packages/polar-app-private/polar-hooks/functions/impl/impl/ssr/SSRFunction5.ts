// import {createWebapp} from "../../webapp/Webapp";
// import {Callback} from "polar-shared/src/util/Functions";

import * as functions from "firebase-functions";
import express from 'express';

let app = express();

// TODO: other issues...
//
// - we could TRY to build our own handler for this maybe.  The problem is that
//   we will need to use our *own* CDN backend to cache our requests there but
//   we can use google cloud CDN for this.
//
//     - we would have to specify our OWN host name to go to the right
//       backend so maybe app.getpolarized-cdn.com ,
//
// TODO: remove the use() on the prerender and see if the Googlebot UA
//       still gives an error.

// TODO: add a tracing function BEFORE the pre-render and then just call the prerender function
//
// TODO: test without bingbot and JUST the X header.  Maybe google is doing
// something with user-agents .. .

// TODO: test with just a basic / fake / simple app and Googlebot UA to see
// if I get an exception.

// TODO: I could ditch this entire thing and just use a firestore cache for a
// SMALLER number of documents and use my own pupeteer code...

// TODO: try a pre-render with my own BASIC webapp without my complex one.

// TODO: note that bingbot with X-prerender does work with SSRFunction2

//
// const prerender =
//     require('prerender-node')
//         .set('prerenderToken', 'nHFtg5f01o0FJZXDtAlR')
//         .set('beforeRender', function(req: express.Request, done: Callback) {
//             console.log("SSR: beforeRender");
//             done();
//         })
//         .set('afterRender', function(err: Error | undefined, req: express.Request, done: Callback) {
//
//             if (err) {
//                 console.log("SSR: afterRender: FAIL: ", err);
//             } else {
//                 console.log("SSR: afterRender: SUCCESS");
//             }
//             done();
//         });
//
// console.log("Running with crawler user agents: ", prerender.crawlerUserAgents);
//
// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.log("SSR: handling prerender");
//     prerender(req, res, next);
// });

// app = createWebapp(app);

console.log("FIXME: running with fake webapp");

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("FIXME: handling fake request");
    res.status(200).send('Hello World');
    next();
});

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
