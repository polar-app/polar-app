import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";

export enum BlocksExportFormat {
    MARKDOWN = 'markdown',
    JSON = 'json',
    // HTML = 'html',
}

export interface IBlocksFormatExporter {
    /**
     * Get the file extension that corresponds to this export format
     */
    getFileExtension(): string;

    /**
     * Get the data mime type for this export format
     */
    getMimeType(): string;

    /**
     * Convert an IBlockContentStructure array to a custom export format (as a blob string)
     */
    toStringData(contentStructures: ReadonlyArray<IBlockContentStructure>): string;
}
