import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {UserIDStr} from "../groups/db/Profiles";
import {FirebaseDocMetaID} from "../groups/db/DocPermissions";

export class FirebaseDatastores {

    public static computeDocMetaID(fingerprint: string,
                                   uid: UserIDStr): FirebaseDocMetaID {

        return Hashcodes.createID(uid + ':' + fingerprint, 32);

    }

}
