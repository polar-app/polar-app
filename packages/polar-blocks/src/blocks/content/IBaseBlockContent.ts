import {DeviceIDStr} from "../../../../polar-shared/src/util/DeviceIDManager";
import {IBlockContent} from "../IBlock";

export interface IBaseBlockContent {
    readonly update: (content: IBlockContent) => void;
    readonly toJSON: () => any;
    readonly setMutator: (mutator: DeviceIDStr) => void;
}
