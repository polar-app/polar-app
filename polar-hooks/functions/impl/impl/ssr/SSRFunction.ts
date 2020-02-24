import {createWebapp} from "../../webapp/Webapp";
import * as functions from "firebase-functions";

const app = createWebapp();
app.use(require('prerender-node').set('prerenderToken', 'nHFtg5f01o0FJZXDtAlR'));

export const SSRFunction = functions.https.onRequest(app);
