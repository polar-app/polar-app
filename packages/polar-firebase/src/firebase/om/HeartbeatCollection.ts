import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Version, VersionStr} from "polar-shared/src/util/Version";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {CollectionNameStr, IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {Platforms, PlatformStr} from "polar-shared/src/util/Platforms";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {DeviceIDManager, DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {Devices, DeviceStr} from "polar-shared/src/util/Devices";

export namespace HeartbeatCollection {

    export const COLLECTION_NAME: CollectionNameStr = "heartbeat";

    export async function write<SM>(firestore: IFirestore<SM>, uid: UserIDStr) {

        const heartbeat = create(uid);

        const doc = firestore.collection(COLLECTION_NAME)
                             .doc(heartbeat.id);

        await doc.set(Dictionaries.onlyDefinedProperties(heartbeat));

    }

    export function create(uid: UserIDStr): IHeartbeat {

        const device_id = DeviceIDManager.DEVICE_ID;
        const id = Hashcodes.create({uid, device_id});
        const device = Devices.get();
        const created = ISODateTimeStrings.create();

        const platform = Platforms.toSymbol(Platforms.get());
        const version = Version.get();
        const userAgent = navigator.userAgent;
        const ver = 'v2';

        return {
            id, created, uid, platform, version, device_id, ver, userAgent, updated: created, device
        };

    }
}

export type UserAgentStr = string;

export interface IHeartbeat {

    /**
     * The UD created which is just a random / unique ID
     */
    readonly id: IDStr;

    /**
     * When this heartbeat was created and written to the database.
     */
    readonly created: ISODateTimeString;

    /**
     * The last time this record was updated.
     */
    readonly updated: ISODateTimeString;

    /**
     * The user ID that generated this heartbeat.
     */
    readonly uid: UserIDStr;

    /**
     * The user's platform.
     */
    readonly platform: PlatformStr;

    readonly version: VersionStr;

    readonly ver: 'v2';

    readonly userAgent: UserAgentStr;

    /**
     * The device type they are using.
     */
    readonly device: DeviceStr;

    /**
     * The specific, unique device ID they are using./
     */
    readonly device_id: DeviceIDStr;

}
