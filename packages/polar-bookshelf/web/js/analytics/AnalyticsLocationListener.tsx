import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {AnalyticsURLCanonicalizer} from "./AnalyticsURLCanonicalizer";
import {Analytics} from "./Analytics";

export const AnalyticsLocationListener = React.memo(() => {

    const location = useLocation();

    try {

        // TODO: what about query params??
        const path = AnalyticsURLCanonicalizer.canonicalize(location.pathname + location.hash || "");
        const hostname = window.location.hostname;
        const title = document.title;

        console.log(`Location change: `, { path, hostname, title });

        Analytics.page(path);

    } catch (e) {
        console.error("Unable to handle nav change", e);
    }

    return null;

});