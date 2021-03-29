import * as functions from 'firebase-functions';
import {default as fetch} from 'node-fetch';
import {FirebaseAdmin} from 'polar-firebase-admin/src/FirebaseAdmin';

const app = FirebaseAdmin.app();

export const CrowdfundingFunction = functions.https.onRequest((req, res) => {

    const doHandle = async () => {

        // the amount raised for our crowdfunding campaign is literally
        // in the HTML of the page.

        const value = await fetchCampaignValue();

        if (value) {
            await writeData(value);
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }

    };

    doHandle().catch(err => console.error("Unable to handle request: ", err));

});

async function writeData(value: number) {

    const firestore = app.firestore();

    const ref = firestore.collection("crowdfunding").doc("2019-04");

    await ref.set({
        value,
        goal: 25000
    });

}

async function fetchCampaignValue() {

    const response = await fetch('https://opencollective.com/polar-bookshelf');
    const content = await response.text();

    const re = /Today&#x27;s Balance<\/div><div class="amount">\$([0-9]+)/g;
    const m = re.exec(content);

    if (m) {
        const match = m[1];
        return parseInt(match);
    } else {
        return undefined;
    }

}


async function test() {
    const value = await fetchCampaignValue();
    console.log(value);

    if (value) {
        await writeData(value);
    }

}

test().catch(err => console.log(err));
