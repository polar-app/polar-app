import React from 'react';
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent} from "../IAnalytics";
import {useCannyClient} from "../../apps/repository/integrations/CannyHooks";

export function useCannyAnalytics(): IAnalytics {

    const cannyClient = useCannyClient();

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

        if (! cannyClient) {
            console.warn("No Canny client");
            return;
        }

        cannyClient.update(traits);

    }, [cannyClient]);

    const version = React.useCallback((version: string) => {
        // noop
    }, []);

    const heartbeat = React.useCallback((): void => {
        // noop
    }, []);

    return {event, event2, identify, page, traits, version, heartbeat};

}
