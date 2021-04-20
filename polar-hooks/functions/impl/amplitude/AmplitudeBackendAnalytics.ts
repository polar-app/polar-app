import * as Amplitude from '@amplitude/node';
import {Version} from "polar-shared/src/util/Version";

export namespace AmplitudeBackendAnalytics {

    const client = Amplitude.init('c1374bb8854a0e847c0d85957461b9f0');

    export interface IUser {
        readonly uid?: string;
    }

    export function getAmplitude() {
        return client;
    }

    export function event2(event: string, data?: any, user?: IUser): void {
        const standardEventProperties = createStandardEventsProperties();
        client.logEvent({
            event_type: event,
            user_id: user?.uid,
            event_properties: {
                ...data,
                ...standardEventProperties
            }
        });
    }

    function createStandardEventsProperties(): any {

        const version = Version.tokenized();

        return {...version};

    }

}
