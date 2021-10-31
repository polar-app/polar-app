import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {IBlocksFormatExporter} from "./IBlocksFormatExporter";

type IBlocksJSONExport = {
    version: number;
    items: ReadonlyArray<IBlockContentStructure>;
};

export class BlocksJSONExporter implements IBlocksFormatExporter {

    public getFileExtension(): string {
        return 'json';
    }

    public getMimeType(): string {
        return 'application/json;charset=utf-8';
    }

    public toStringData(contentStructures: ReadonlyArray<IBlockContentStructure>): string {
        const jsonData = this.toJSON(contentStructures);
        
        return JSON.stringify(jsonData, null, 4);
    }

    private toJSON(contentStructures: ReadonlyArray<IBlockContentStructure>): IBlocksJSONExport {

        return {
            version: 3,
            items: contentStructures,
        };
    }

}
