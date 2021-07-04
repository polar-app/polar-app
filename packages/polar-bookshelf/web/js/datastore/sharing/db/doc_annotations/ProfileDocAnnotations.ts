// @NotStale
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {ProfileIDStr} from "polar-firebase/src/firebase/om/ProfileCollection";

export interface ProfileDocAnnotation extends BaseDocAnnotation {
    readonly profileID: ProfileIDStr;
}
