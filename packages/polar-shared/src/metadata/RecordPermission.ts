import {Visibility} from "../datastore/Visibility";
import {GroupIDStr} from "../util/Strings";

export interface RecordPermission {

    // the visibility of this record.
    readonly visibility: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr> | null;

}
