import {IBlock} from "../store/IBlock";
import {toJS} from "mobx"

export namespace FirestoreBlocks {

    export function toFirestoreBlock(block: IBlock) {

        const result: any = {
            id: block.id,
            nspace: block.nspace,
            uid: block.uid,
            root: block.root,
            parent: block.parent === undefined ? null : block.parent,
            parents: block.parents,
            created: block.created,
            updated: block.updated,
            items: block.items,
            content: block.content,
            mutation: block.mutation,
        }

        return result

    }

    export function fromFirestoreBlock(block: any): IBlock {

        const result: any = {...toJS(block)};

        if (result.parent === null) {
            result.parent = undefined;
        }

        return result;

    }

}
