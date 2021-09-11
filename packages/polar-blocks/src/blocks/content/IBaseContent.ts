import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";

export interface IBaseContent {

    /**
     * The last device that mutated this node.
     */
    readonly mutator?: DeviceIDStr;

};
