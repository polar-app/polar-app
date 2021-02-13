import React from 'react';
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import {useIntercomClient, useIntercomData} from "../../apps/repository/IntercomHooks";

export function useIntercomAnalytics(): IAnalytics {

    const intercomClient = useIntercomClient();
    const intercomData = useIntercomData();

    const event = React.useCallback((event: IEventArgs): void => {
        // noop
    }, []);

    const event2 = React.useCallback((eventName: string, data?: any): void => {
        // noop
    }, []);

    const identify = React.useCallback((userId: string): void => {
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

        intercomClient.update({...intercomData, ...traits});

    }, [intercomClient, intercomData]);

    const version = React.useCallback((version: string) => {
        // noop
    }, []);

    const heartbeat = React.useCallback((): void => {
        // noop
    }, []);

    return {event, event2, identify, page, traits, version, heartbeat};

}
