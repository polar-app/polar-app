// @NotStale
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {ProfileIDStr} from "polar-firebase/src/firebase/om/Profiles";

export interface ProfileDocAnnotation extends BaseDocAnnotation {
    readonly profileID: ProfileIDStr;
}
