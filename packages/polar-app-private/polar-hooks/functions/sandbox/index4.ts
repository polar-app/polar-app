
// FIXME: we need to include the firebase-admin code and then lookup the token
// and the final URL and send access denied if the token does not exist.

import * as functions from 'firebase-functions';
import express from 'express';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import {default as fetch} from 'node-fetch';
import * as https from 'https';
import {Response, NextFunction} from 'express';

const app = express();

const rawServiceAccount = {
    "type": "service_account",
    "project_id": "polar-32b0f",
    "private_key_id": "133e7ab5f937696d8d325f6c099e2b6c121899bb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy5vx5W2fHwRAP\nnOl6rTBMEnlMx/q8Mdp8NPaARjeVWxvUmGi4HeQgyjkBqygLGUPm2qziG/Bx1LvO\nCgYlkRDK1ygY3VFCWqf2b8eAlQXigBRI64J04eLhGBNL8UsjP2XM9apBZGkSxXwE\ne8is1U2pzSRY8nzLN1KaI3WyefBuvOL0iggCzUI4pkK3qCUV6l3EM2tppWhszGZQ\nkqqvT+WLlgKBXZRgjPvpoPw/Nw6QhWdJc95OEKLb0jRttJetdO46RkYKq5iD1JJt\nMs9qdQXcxYIbpb58XADXgWeugW9DnGhQlxLeP/cjiKgNsOkW5N824oKP1AoAdQOm\n7wrwaRp3AgMBAAECggEADQNONAmZB+ecInaYaQr162KgnhwhudSqfsRfdb8lxeBl\nqtYXL+VEtbnf4aYweHYzATTAxIWhvLXrnzYNcmgV35s82GoowfnUI9HHoiu0zN/i\nGde/mn7fwN2+cZSwkXTIE9t+sdj655mjxrO2ShQN3R8F2M5yk1mH0ZxosD28ZmGJ\ni8xFGDoqY5PHcubDYkXqL912RJe6e8edHN2BdMNSUYlzva8QtRgGVfBGPeDnrQN0\nQxjXE617rEjEwUNmp340zATRUiT5tKwqDkaA+muN+thajLLN2oCSkrKhsq++VcV4\nh1num+diGJzWSwEMwdQAZnIbgJoyG87SMTS5MjcdeQKBgQDwmYiZUNFZDk+R3p6o\n5ipdqYrzyIO5o8k0q0FSyoKYb14ujE/8zJ2w5Kv2PLQb8CEd7lgJN4gtwH7aheRo\nqu7rZOfD6Fk+kgy5Sh6acRldNg5Gg3yKlqFYi0Zz8C8fV2Zb6x6OKODyRQaZWi+c\nmNP2pmMNgC6kpNbMOkc3KIpLGwKBgQC+Wnp7019+9KCHyFL9EhcUyps/1F0uWurD\n2iC5q/Fii45GLNxFrEbAXINhFMMzLm2P8fQjCUrJwSKkESfiYcydRRdVkCChfsG9\nniKV6UW6B4YFIx/Gb2ZJZBAvA5L4CaaKBCMUbN+HeVYGwwG24jv3M4LzYpQ6BQ2m\nNhkr9q6n1QKBgQCzjhEoQe0KJijxto73g1XIsneVeWX8y6Oj386PR7xwoGRMHsCu\n69EfK3i9+g178Bf262Hd9wh1BHxm/pc4GaDWIWbpiGPZ00sVmKAAKDmCm43Jx+TQ\n1JsypjX83hl8rVAhdvVFqHI/u42yMmDn4BIHt6Kid6/XhYEbxr5RBrs2UwKBgCRe\n0UxbhMGTKCEJi6HDFRnp5GP7xZoX0Qd+5AXV7pcvpw2NgMDnO9WBV7Dy8KEU2+ZH\nCqivG9UUy/OhO4ervBbInr7AfRueRpJeZqlSGvqCeX79yRJ3MooPTnBNNIWkAmgY\nhkNe0g7mhiNgmzFAZMjE1N6AFWZIlOUPLRwTVCfJAoGBAL4+RdyFzLJ+ncAAVZwG\nkQ6Jxmk7D5+d/tenlmW/7E+lJAdcCiQp/g0IUo/Kk3Rs8gEFDGXTZKga/+LXLFsE\nSfwtAYpFBwWWhOSM4VYE1W0GrKj6zEBv/SynOTuD9asJZeIHZd7Tp3ijQoKOMFVa\nKrnmKsC3F33ibbp2nL+eZ6x5\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-e5gdw@polar-32b0f.iam.gserviceaccount.com",
    "client_id": "113273583866110264922",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e5gdw%40polar-32b0f.iam.gserviceaccount.com"
};

const serviceAccount: admin.ServiceAccount = {
    projectId: rawServiceAccount.project_id,
    clientEmail: rawServiceAccount.client_email,
    privateKey: rawServiceAccount.private_key
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://polar-32b0f.firebaseio.com"
});

// FIXME: next steps we have to see if we're getting data from Polar...

// FIXME: include CORS headers we need ...
// FIXME: compute the proper target URL ...

// FIXME: I think the target is not sending the query data...

// FIXME: corect.. we are NOT sending the query data... I need a way to just do
// a simple URL forward.
// const handler = proxy({
//     // target: 'https://firebasestorage.googleapis.com/v0/b/polar-32b0f.appspot.com/o/stash%2F12RMNjmX1PLwqN5fRXzh89Yi7tbL24e5VfCNs4Nq.pdf?alt=media&token=0a2708be-ef63-4791-a338-a3c887b73b19',
//     target: 'https://firebasestorage.googleapis.com',
//     changeOrigin: true,
//     logLevel: 'debug'
// });

// app.use(cors({
//     origin: true,
//     allowedHeaders: [
//         "Range"
//     ],
//     exposedHeaders: [
//         "Accept-Ranges",
//         "Content-Encoding",
//         "Content-Length",
//         "Content-Range",
//         "Content-Type",
//         "Date",
//         "Range",
//         "Server",
//         "Transfer-Encoding",
//         "X-Google-Trace",
//         "X-GUploader-UploadID",
//     ]
// }));

// app.use(handler);

// https://github.com/villadora/express-http-proxy

function testWithHTTPS(res: functions.Response, next?: NextFunction) {

    // we can change the request URL so that it's handled by the proper target.
    const url = 'https://firebasestorage.googleapis.com/v0/b/polar-32b0f.appspot.com/o/stash%2F12RMNjmX1PLwqN5fRXzh89Yi7tbL24e5VfCNs4Nq.pdf?alt=media&token=0a2708be-ef63-4791-a338-a3c887b73b19';

    // TODO:  this URL works just fine...
    // const url = "https://bitcoin.org/bitcoin.pdf";

    // FIXME: this wouldn't work with range queries!!!!!

    console.log("FIXME here at least");

    const started = Date.now();
    let idx: number = 0;

    https.get(url, (dataResponse) => {

        console.log("FIXME: writing head");

        console.log("FIXME: writing status: " + dataResponse.statusCode!);
        console.log("FIXME: writing headers: " + JSON.stringify(dataResponse.headers));

        res.writeHead(dataResponse.statusCode!,
                      dataResponse.statusMessage,
                      dataResponse.headers);

        res.flushHeaders();

        // TODO we have to use pipe otherwise we're going to have problems with
        // overrruns
        dataResponse.pipe(res);

        // dataResponse.on("data", data => {
        //
        //     const duration = Date.now() - started;
        //     // console.log(`FIXME: got data(${data.length}) duration: ${duration}: ` + idx++);
        //     res.write(data);
        //
        //
        // });
        //

        dataResponse.on("end", () => {
            console.log("FIXME: got end");
            res.end();

            if (next) {
                next();
            }

        });

        dataResponse.on("error", (err) => {
            console.log("FIXME: got error", err);
            // TODO can not send the status here...
            res.end();
            if (next) {
                next();
            }
        });

    });
}


function testWithHTTPSAndSimpleURL(res: Response, next: NextFunction) {

    // we can change the request URL so that it's handled by the proper target.
    const url = 'https://www.example.com';

    // FIXME: this wouldn't work with range queries!!!!!

    https.get(url, (dataResponse) => {

        dataResponse.on("data", data => {
            res.write(data);
        });

        dataResponse.on("end", () => {
            res.end();
            next();
        });

        dataResponse.on("error", (err) => {
            res.status(500);
            res.end();
            next();
        });

    });
}

// FIXME: this won't work..
app.use((req, res, next) => {

    try { // FIXME: this works local but within the google cloud it doesn't seem to
        // be able to fetch this URL.  It might be with the NodeJS version.
        //
        //

        // FIXME: I still think 'fetch' would do this perfectly if we preserve the
        // headers...

        testWithHTTPS(res, next);

        // testWithHTTPSAndSimpleURL(res, next);

        // fetch(url)
        //     .then(r => {
        //
        //         r.body.on('data', chunk => {
        //             console.log("GOT CHUNK: is null: " + chunk != null);
        //             res.write(chunk);
        //         });
        //
        //         r.body.on('end', () => {
        //             console.log("GOT END xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        //             res.end(null);
        //             next();
        //         });
        //
        //     }).catch(err => {
        //         console.error(err);
        //     });

    } catch (e) {
        console.error(e);
    }

});

// FIXME: this needs a trailing slash for the request or it won't work!

// TODO: I think technically we can do export const fetch

const doListen : boolean = false;

if (doListen) {
    app.listen(3000);
} else {


    // fetch a document from the polar backend.
    // exports.fetch = functions.https.onRequest(app);
    exports.fetch = functions.https.onRequest((req, res) => {

        testWithHTTPS(res);
    });

}
