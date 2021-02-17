import React from 'react';
import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import {ICannyUserData, useCannyClient} from "../../apps/repository/integrations/CannyHooks";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import onlyDefinedProperties = Dictionaries.onlyDefinedProperties;

export function useCannyAnalytics(): IAnalytics {

    const cannyClient = useCannyClient();

    const identificationRef = React.useRef<ICannyUserData | undefined>(undefined);

    const event = React.useCallback((event: IEventArgs): void => {
        // noop
    }, []);

    const event2 = React.useCallback((eventName: string, data?: any): void => {
        // noop
    }, []);

    // identify: https://developers.canny.io/install
    const identify = React.useCallback((user: IAnalyticsUser): void => {

        if (! cannyClient) {
            console.warn("No Canny client");
            return;
        }

        identificationRef.current = onlyDefinedProperties({
            email: user.email,
            name: user.displayName,
            id: user.uid,
            avatarURL: user.photoURL,
            created: user.created,
            customFields: {}
        });

        cannyClient.identify(identificationRef.current!);

    }, [cannyClient]);

    const page = React.useCallback((event: IPageEvent): void => {
        // noop
    }, []);

    const traits = React.useCallback((traits: TraitsMap): void => {

        if (! cannyClient) {
            console.warn("No Canny client");
            return;
        }

        if (identificationRef.current) {

            const newIdentification: ICannyUserData = {
                ...identificationRef.current,
                customFields: {
                    ...identificationRef.current.customFields,
                    ...traits
                }
            }

            identificationRef.current = newIdentification;
            cannyClient.identify(identificationRef.current);

        }


    }, [cannyClient]);

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
