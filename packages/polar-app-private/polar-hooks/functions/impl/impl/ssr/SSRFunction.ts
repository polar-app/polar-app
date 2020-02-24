import {createWebapp} from "../../webapp/Webapp";
import * as functions from "firebase-functions";

const prerender = require('prerender-node');

prerender.set('prerenderToken', 'nHFtg5f01o0FJZXDtAlR');
prerender.crawlerUserAgents.push('googlebot');
prerender.crawlerUserAgents.push('bingbot');
prerender.crawlerUserAgents.push('yandex');
prerender.crawlerUserAgents.push('twitterbot');

const app = createWebapp();
app.use(prerender);

export const SSRFunction = functions.https.onRequest(app);
