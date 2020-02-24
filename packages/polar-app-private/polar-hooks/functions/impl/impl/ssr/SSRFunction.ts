const prerender = require('prerender-node');
import express from "express";
import * as functions from "firebase-functions";

prerender.set('prerenderToken', 'nHFtg5f01o0FJZXDtAlR');
prerender.crawlerUserAgents.push('googlebot');
prerender.crawlerUserAgents.push('bingbot');
prerender.crawlerUserAgents.push('yandex');
prerender.crawlerUserAgents.push('twitterbot');

const app = express();
app.use(prerender);

export const SSRFunction = functions.https.onRequest(app);
