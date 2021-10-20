// @NotStale
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {ProfileIDStr} from 'polar-shared/src/util/Strings';

export interface ProfileDocAnnotation extends BaseDocAnnotation {
    readonly profileID: ProfileIDStr;
}
