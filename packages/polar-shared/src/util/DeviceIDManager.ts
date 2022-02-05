import {Hashcodes} from "./Hashcodes";
import {Karma} from "./Karma";

const IS_NODE = typeof window === 'undefined' || process.env.NODE_ENV === 'test';

export type DeviceIDStr = string;

export namespace DeviceIDManager {

    const LOCAL_STORAGE_KEY = "device_id";
    export const TEST_DEVICE_ID = "test-device-id";

    export const DEVICE_ID = getDeviceID();

    function getDeviceID() {
        if (IS_NODE || Karma.isKarma()) {
            return TEST_DEVICE_ID;
        }

        return getStoredDeviceID() || writeDeviceID(generateDeviceID());
    }

    function generateDeviceID(): DeviceIDStr {
        return Hashcodes.createRandomID({len: Infinity});
    }

    function writeDeviceID(deviceID: DeviceIDStr): DeviceIDStr {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, deviceID);
        return deviceID;
    }

    function getStoredDeviceID(): DeviceIDStr | null {
        return window.localStorage.getItem(LOCAL_STORAGE_KEY);
    }
}
