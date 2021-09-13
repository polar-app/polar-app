import { UserIDStr } from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseDocMetaID} from "../groups/db/DocPermissions";

export class FirebaseDatastores {

    public static computeDocMetaID(fingerprint: string,
                                   uid: UserIDStr): FirebaseDocMetaID {

        return Hashcodes.createID(uid + ':' + fingerprint, 32);

    }

}
