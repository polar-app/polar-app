import * as Amplitude from '@amplitude/node';

export namespace AmplitudeUtils {

    const client = Amplitude.init('c1374bb8854a0e847c0d85957461b9f0');

    export function getAmplitude() {
        return client;
    }

}