import React from 'react';
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import {IntercomData, useIntercomClient, useIntercomData} from "../../apps/repository/integrations/IntercomHooks";
import {StandardEventProperties} from "../StandardEventProperties";

const standardEventProperties = StandardEventProperties.create();

export function useIntercomAnalytics(): IAnalytics {

    const intercomClient = useIntercomClient();
    const intercomData = useIntercomData();

    const event = React.useCallback((event: IEventArgs): void => {
        // noop
    }, []);

    const event2 = React.useCallback((eventName: string, data?: any): void => {
        // noop
    }, []);

    const identify = React.useCallback((user: IAnalyticsUser): void => {
        // noop
    }, []);

    const page = React.useCallback((event: IPageEvent): void => {
        // noop
    }, []);

    const traits = React.useCallback((traits: TraitsMap): void => {

        if (! intercomClient) {
            console.warn("No intercom client");
            return;
        }

        if (! intercomData) {
            console.warn("No intercom data");
            return;
        }

        const data: IntercomData = {
            ...intercomData,
            ...traits,
            ...standardEventProperties
        };

        intercomClient.update(data);

    }, [intercomClient, intercomData]);

    const version = React.useCallback((version: string) => {
        // noop
    }, []);

    const heartbeat = React.useCallback((): void => {
        // noop
    }, []);


    const logout = React.useCallback((): void => {
        // noop
    }, []);

    return {event, event2, identify, page, traits, version, heartbeat, logout};

}
