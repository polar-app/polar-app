
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Version, VersionStr} from "polar-shared/src/util/Version";
import { Hashcodes } from "polar-shared/src/util/Hashcodes";
import {IDStr, CollectionNameStr, UserIDStr} from "polar-shared/src/util/Strings";
import {MachineID, MachineIDs} from "polar-shared/src/util/MachineIDs";
import {AppRuntime, AppRuntimeID} from "polar-shared/src/util/AppRuntime";
import {PlatformStr, Platforms} from "polar-shared/src/util/Platforms";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Device, Devices} from "polar-shared/src/util/Devices";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

export class HeartbeatCollection {

    private static COLLECTION: CollectionNameStr = "heartbeat";

    public static async write<SM>(firestore: IFirestore<SM>, uid: UserIDStr) {

        const heartbeat = this.create(uid);

        const doc = firestore.collection(this.COLLECTION)
                             .doc(heartbeat.id);

        await doc.set(Dictionaries.onlyDefinedProperties(heartbeat));

    }

    public static create(uid: UserIDStr): HeartbeatsInit {

        const device = Devices.get();
        const id = Hashcodes.create({uid, device});
        const created = ISODateTimeStrings.create();
        const machine = MachineIDs.get();

        const platform = Platforms.toSymbol(Platforms.get());
        const version = Version.get();
        const runtime = AppRuntime.get();

        return {
            id, created, uid, platform, machine, version, runtime, device
        };

    }
}

export interface HeartbeatsInit {

    /**
     * The UD created which is just a random / unique ID
     */
    readonly id: IDStr;

    /**
     * When this heartbeat was created and written to the database.
     */
    readonly created: ISODateTimeString;

    /**
     * The user ID that generated this heartbeat.
     */
    readonly uid: UserIDStr; 

    /**
     * The user's platform.
     */
    readonly platform: PlatformStr;

    readonly machine: MachineID;

    readonly version: VersionStr;

    readonly runtime: AppRuntimeID;

    /**
     * phone/tablet/desktop
     */
    readonly device: Device;
}

export interface Heartbeat extends HeartbeatsInit {
}
