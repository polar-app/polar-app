// @NotStale
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {ProfileIDStr} from "packages/polar-app-public/polar-firebase/src/firebase/om/ProfileCollection";

export interface ProfileDocAnnotation extends BaseDocAnnotation {
    readonly profileID: ProfileIDStr;
}
