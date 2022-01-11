import * as Amplitude from '@amplitude/node';
import {Version} from "polar-shared/src/util/Version";
import {Identify} from '@amplitude/identify';

export namespace AmplitudeBackendAnalytics {

    const client = Amplitude.init('c1374bb8854a0e847c0d85957461b9f0');

    export interface TraitsMap {
        [key: string]: string;
    }

    export interface IUser {
        readonly uid?: string;
    }

    export function getAmplitude() {
        return client;
    }

    // TODO: user should be the first argument here I think.  It's required for logging user events
    // and I think everything we want to log would require a user
    export async function event2(event: string, data?: any, user?: IUser): Promise<void> {

        const standardEventProperties = createStandardEventsProperties();

        await client.logEvent({
            event_type: event,
            user_id: user?.uid,
            event_properties: {
                ...data,
                ...standardEventProperties
            }
        });

    }

    export async function traits(user: Required<IUser>, traits: TraitsMap) {

        const identify = new Identify();
        for( const key of Object.keys(traits)) {
            identify.set(key, traits[key]);
        }

        await client.identify(user.uid, null, identify);

    }

    function createStandardEventsProperties(): any {

        const version = Version.tokenized();

        return {...version};

    }

}
