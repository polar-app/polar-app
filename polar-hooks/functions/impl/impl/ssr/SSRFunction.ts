import * as prerender from 'prerender-node';
import express from "express";
import * as functions from "firebase-functions";

prerender.set('prerenderToken', 'YOUR_TOKEN');
prerender.crawlerUserAgents.push('googlebot');
prerender.crawlerUserAgents.push('bingbot');
prerender.crawlerUserAgents.push('yandex');

const app = express();
app.use(prerender);

functions.https.onRequest(app);
