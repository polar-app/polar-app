/* tslint:disable:no-console */
import * as functions from 'firebase-functions';
import { Fetches } from 'polar-shared/src/util/Fetch';

export const CloudFunctionsWarmer = functions.pubsub.schedule('every 5 minutes').onRun((context) => {

    async function doFetch(url: string) {
        console.log("Warming cloud function: ", url);
        await Fetches.fetch(url);
    }

    async function doAsync() {
        await doFetch("https://us-central1-polar-cors.cloudfunctions.net/VerifyTokenAuth/");
        await doFetch("https://us-central1-polar-cors.cloudfunctions.net/StartTokenAuth/");
    }

    console.log("Warming cloud functions")

    doAsync()
        .catch(err => console.error("Unable to warm cloud functions: ", err));

});
