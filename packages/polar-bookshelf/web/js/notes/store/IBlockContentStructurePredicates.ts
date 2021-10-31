import {IBlockContentStructure, INamedContent} from "polar-blocks/src/blocks/IBlock";

export namespace IBlockContentStructurePredicates {
    export function isNamed(structure: IBlockContentStructure): structure is IBlockContentStructure<INamedContent> {
        return structure.content.type === 'date'
            || structure.content.type === 'name'
            || structure.content.type === 'document';
    }
}
