import React from 'react';
import {useLocation, useHistory} from "react-router-dom";
import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";
import {AuthRequired} from "../../../../../apps/repository/js/AuthRequired";
import {WebExtensionPresenceClient} from "polar-web-extension-api/src/WebExtensionPresenceClient";
import { ChromeStoreURLs } from 'polar-web-extension-api/src/ChromeStoreURLs';

export const PHZMigrationScreen = () => (
    <AuthRequired>
        <PHZMigrationTrigger/>
    </AuthRequired>
);

export const PHZMigrationTrigger = () => {
    const location = useLocation();
    const history = useHistory();

    const parsedURL = new URL(location.toString());

    const docID = parsedURL.searchParams.get('docID')!;
    const url = parsedURL.searchParams.get('url')!;

    if (docID && url) {

        async function doAsync() {

            const presence = await WebExtensionPresenceClient.exec();

            if (! presence) {
                // they don't have the chrome store URL so we have to redirect
                // them to install it.
                const chromeStoreURL = ChromeStoreURLs.create();
                history.push(chromeStoreURL);
                return;
            }

            await PHZMigrationClient.exec({docID, url});

        }

        doAsync().catch(err => console.error(err));

        return null;

    } else {
        console.warn("No docID or URL: ", {docID, url});
        return null;
    }

}
