import {AmplitudeBackendAnalytics} from "./AmplitudeBackendAnalytics";

describe("AmplitudeBackendAnalytics", function() {


    it("basic", async () => {
        await AmplitudeBackendAnalytics.event2("AmplitudeBackendAnalyticsTestN");
    });

})
