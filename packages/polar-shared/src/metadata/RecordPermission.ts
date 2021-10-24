import {Visibility} from "src/datastore/Visibility";
import {GroupIDStr} from "polar-bookshelf/web/js/datastore/Datastore";

export interface RecordPermission {

    // the visibility of this record.
    readonly visibility: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr> | null;

}
