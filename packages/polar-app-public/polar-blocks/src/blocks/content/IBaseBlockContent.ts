import {DeviceIDStr} from "../../../../polar-shared/src/util/DeviceIDManager";
import {IBlockContent} from "../IBlock";

export interface IBaseBlockContent {
    update: (content: IBlockContent) => void;
    toJSON: () => any;
    setMutator: (mutator: DeviceIDStr) => void;
}
