import * as functions from "firebase-functions";
import express from 'express';

const app = express();

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Hello World: : handling basic request");
    res.status(200).send('Hello World\n');
    next();
});

export const HelloWorldFunction = functions.https.onRequest(app);
