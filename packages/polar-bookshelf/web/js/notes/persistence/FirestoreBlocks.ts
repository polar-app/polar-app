import {IBlock} from "../store/IBlock";

export namespace FirestoreBlocks {

    export function toFirestoreBlock(block: IBlock) {

        const result: any = {...block};

        if (result.parent === undefined) {
            result.parent = null;
        }

        return result

    }

    export function fromFirestoreBlock(block: any): IBlock {

        const result: any = {...block};

        if (result.parent === null) {
            result.parent = undefined;
        }

        return result;

    }

}
