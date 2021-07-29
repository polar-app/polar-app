import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseBrowser, UserIDStr} from "polar-firebase-browser/src/firebase/Firebase";

import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export class Events {

    public static async write(name: string, data?: any) {

        const firestore = await FirestoreBrowserClient.getInstance();
        const uid = await FirebaseBrowser.currentUserID();

        const id = Hashcodes.createRandomID();
        const created = ISODateTimeStrings.create();

        const ref = firestore.collection('event').doc(id);

        const event: IEvent = Dictionaries.onlyDefinedProperties({
            id, created, uid, data, name
        });

        await ref.set(event)

    }

}

export interface IEvent {

    /**
     * The UD created which is just a random / unique ID
     */
    readonly id: IDStr;

    /**
     * When this heartbeat was created and written to the database.
     */
    readonly created: ISODateTimeString;

    /**
     * The user ID that generated this heartbeat or undefined
     */
    readonly uid: UserIDStr | undefined;

    /**
     * The name of the event.
     */
    readonly name: string;

    /**
     * The data for the event.
     */
    readonly data?: any;

}

