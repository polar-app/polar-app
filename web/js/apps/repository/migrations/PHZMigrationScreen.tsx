import React from 'react';
import {useLocation} from "react-router-dom";
import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";
import {AuthRequired} from "../../../../../apps/repository/js/AuthRequired";

export const PHZMigrationScreen = () => (
    <AuthRequired>
        <PHZMigrationTrigger/>
    </AuthRequired>
);

export const PHZMigrationTrigger = () => {
    const location = useLocation();

    const parsedURL = new URL(location.toString());

    const docID = parsedURL.searchParams.get('docID')!;
    const url = parsedURL.searchParams.get('url')!;

    if (docID && url) {

        async function doAsync() {
            await PHZMigrationClient.exec({docID, url});
        }

        doAsync().catch(err => console.error(err));

        return null;

    } else {
        console.warn("No docID or URL: ", {docID, url});
        return null;
    }

}
