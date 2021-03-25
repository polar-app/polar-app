import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {AnalyticsURLCanonicalizer} from "./AnalyticsURLCanonicalizer";
import {Analytics} from "./Analytics";

export const AnalyticsLocationListener = React.memo(function AnalyticsLocationListener() {

    const loc = useLocation();

    try {

        const location = loc.pathname + loc.search + (loc.hash || "");
        const locationCanonicalized = AnalyticsURLCanonicalizer.canonicalize(location);

        const hostname = window.location.hostname;
        const title = document.title;

        console.log(`Location change: `, {
            location,
            locationCanonicalized,
            hostname,
            title
        });

        Analytics.page({location, locationCanonicalized});

    } catch (e) {
        console.error("Unable to handle nav change", e);
    }

    return null;

});
