import {DeviceIDStr} from "../../../../polar-shared/src/util/DeviceIDManager";
import {IBlockContent} from "../IBlock";

export interface IBlockMeta {
    readonly type: string;
}

export interface IBaseBlockContent {

    readonly update: (content: IBlockContent) => void;

    readonly toJSON: () => any;

    readonly setMutator: (mutator: DeviceIDStr) => void;

    /**
     * Create a snapshot of metadata about this block without converting object
     * to observable.  Faster than toJSON.
     */
    // readonly meta: () => IBlockMeta;

}
