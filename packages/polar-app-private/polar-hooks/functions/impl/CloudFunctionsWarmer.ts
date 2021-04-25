/* tslint:disable:no-console */
import * as functions from 'firebase-functions';
import {default as fetch} from 'node-fetch';

async function doWarm() {

    async function doFetch(url: string) {
        console.log("Warming cloud function: ", url);
        await fetch(url);
    }

    console.log("Warming cloud functions");

    await doFetch("https://us-central1-polar-32b0f.cloudfunctions.net/VerifyTokenAuth/");
    await doFetch("https://us-central1-polar-32b0f.cloudfunctions.net/StartTokenAuth/");

}

export const CloudFunctionsWarmer = functions.pubsub.schedule('every 5 minutes').onRun(async () => {

    try {
        await doWarm();
    } catch (err) {
        console.error("Unable to warm cloud functions: ", err);
    }

});
