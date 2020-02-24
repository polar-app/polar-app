import * as functions from 'firebase-functions';
import {Webapps} from "./Webapps";

export const Webapp = functions.https.onRequest(Webapps.createWebapp());
