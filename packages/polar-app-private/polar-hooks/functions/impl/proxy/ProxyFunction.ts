import * as functions from "firebase-functions";
import {Fetches} from "polar-shared/src/util/Fetch";
import {PassThrough, Writable} from 'stream';



/**
 * Perform an HTTP request on behalf of the user.  For the web application we
 * have to proxy requests to download objects or else they they don't
 *
 * TODO:
 *   - I think I worked on this before and couldn't get it to work. I think I
 *     remember that firebase doesn't support streaming. I think I did this
 *     with cloud storage and couldn't get it to work. I think it buffers the
 *     entire response in memory and THEN sends it... I think I had to use a
 *     signed URL for this or something.
 */
export const ProxyFunction = functions.https.onRequest(async (req, res) => {

    // FIXME: make sure to verify idUser so that people can't use this as an open proxy.

    // use a stream to send back the response...
    //
    // https://github.com/firebase/firebase-functions/issues/401

    // try with this approach...

    const response = await Fetches.fetch('http://www.example.com');

    // copy all header values...
    for (const header of response.headers) {
        const [key, value] = header;
        res.setHeader(key, value);
    }

    // TODO: now add the proper CORS allow origin and expose-headers ...

    const targetStream = new PassThrough();

    let error: Error | undefined;

    targetStream.once('error', err => {
        error = err;
    });

    targetStream.once('end', () => {

        if (error) {
            res.statusMessage = error.message;
            res.sendStatus(500);
        }

        res.statusMessage = response.statusText;
        res.sendStatus(response.status)

    });

    targetStream.pipe(res);

    // TODO what about the HTTP status?
    response.body.pipe(res);

});

