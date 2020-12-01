import * as Amplitude from '@amplitude/node';
import {Version} from "polar-shared/src/util/Version";

export namespace AmplitudeUtils {

    const client = Amplitude.init('c1374bb8854a0e847c0d85957461b9f0');

    export function getAmplitude() {
        return client;
    }

    export function event2(event: string, data?: any): void {
        const standardEventProperties = createStandardEventsProperties();
        client.logEvent({
            event_type: event,
            // user_id
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